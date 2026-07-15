#!/usr/bin/env node
/**
 * Fails if any <Link>, <a>, or onClick handler in src/ lacks an associated
 * mixpanel.track call (inline, or in a same-file named handler).
 *
 * Prop-passed handlers (e.g. onClick={onClose}) are skipped — tracking belongs
 * at the call site. Pure stopPropagation / preventDefault handlers are skipped.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");

const LINK_TAGS = new Set(["Link", "a"]);

/** @typedef {{ file: string, line: number, detail: string }} Violation */

/** @type {Violation[]} */
const violations = [];

function walkDir(dir) {
  /** @type {string[]} */
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      files.push(...walkDir(full));
    } else if (/\.(tsx|jsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

/**
 * @param {ts.Node} node
 * @param {string} name
 * @returns {boolean}
 */
function isMixpanelTrackCall(node) {
  if (!ts.isCallExpression(node)) return false;
  const expr = node.expression;
  return (
    ts.isPropertyAccessExpression(expr) &&
    ts.isIdentifier(expr.expression) &&
    expr.expression.text === "mixpanel" &&
    expr.name.text === "track"
  );
}

/**
 * @param {ts.Node} node
 * @returns {boolean}
 */
function containsMixpanelTrack(node) {
  let found = false;
  const visit = (n) => {
    if (found) return;
    if (isMixpanelTrackCall(n)) {
      found = true;
      return;
    }
    ts.forEachChild(n, visit);
  };
  visit(node);
  return found;
}

/**
 * Only stopPropagation / preventDefault (and optional void) — not user intent.
 * @param {ts.Expression} expr
 * @returns {boolean}
 */
function isChromeOnlyHandler(expr) {
  /** @type {ts.ConciseBody | undefined} */
  let body;

  if (ts.isArrowFunction(expr) || ts.isFunctionExpression(expr)) {
    body = expr.body;
  } else {
    return false;
  }

  /** @type {ts.Statement[]} */
  let statements;
  if (ts.isBlock(body)) {
    statements = [...body.statements];
  } else {
    statements = [ts.factory.createExpressionStatement(body)];
  }

  if (statements.length === 0) return true;

  return statements.every((stmt) => {
    if (!ts.isExpressionStatement(stmt)) return false;
    const e = stmt.expression;
    if (!ts.isCallExpression(e)) return false;
    if (!ts.isPropertyAccessExpression(e.expression)) return false;
    const name = e.expression.name.text;
    return name === "stopPropagation" || name === "preventDefault";
  });
}

/**
 * Collect same-file function / const-handler definitions that contain mixpanel.track.
 * @param {ts.SourceFile} sourceFile
 * @returns {Set<string>}
 */
function findTrackedHandlerNames(sourceFile) {
  /** @type {Set<string>} */
  const tracked = new Set();

  const visit = (node) => {
    if (ts.isFunctionDeclaration(node) && node.name && node.body) {
      if (containsMixpanelTrack(node)) tracked.add(node.name.text);
    }

    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (!ts.isIdentifier(decl.name) || !decl.initializer) continue;
        const init = decl.initializer;
        if (
          (ts.isArrowFunction(init) ||
            ts.isFunctionExpression(init) ||
            ts.isCallExpression(init)) &&
          containsMixpanelTrack(init)
        ) {
          tracked.add(decl.name.text);
        }
      }
    }

    if (
      ts.isMethodDeclaration(node) &&
      node.name &&
      ts.isIdentifier(node.name) &&
      node.body &&
      containsMixpanelTrack(node)
    ) {
      tracked.add(node.name.text);
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return tracked;
}

/**
 * Collect parameter / prop names in scope of a JSX attribute (best-effort).
 * @param {ts.Node} node
 * @returns {Set<string>}
 */
function collectPropParamNames(sourceFile) {
  /** @type {Set<string>} */
  const names = new Set();

  const addBinding = (name) => {
    if (ts.isIdentifier(name)) names.add(name.text);
    else if (ts.isObjectBindingPattern(name)) {
      for (const el of name.elements) {
        if (ts.isBindingElement(el)) addBinding(el.name);
      }
    } else if (ts.isArrayBindingPattern(name)) {
      for (const el of name.elements) {
        if (ts.isBindingElement(el)) addBinding(el.name);
      }
    }
  };

  const visit = (node) => {
    if (
      ts.isFunctionDeclaration(node) ||
      ts.isFunctionExpression(node) ||
      ts.isArrowFunction(node) ||
      ts.isMethodDeclaration(node) ||
      ts.isConstructorDeclaration(node)
    ) {
      for (const param of node.parameters) {
        addBinding(param.name);
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return names;
}

/**
 * @param {ts.JsxAttribute} attr
 * @returns {ts.Expression | undefined}
 */
function getAttrExpression(attr) {
  if (!attr.initializer) return undefined;
  if (ts.isStringLiteral(attr.initializer)) return undefined;
  if (ts.isJsxExpression(attr.initializer) && attr.initializer.expression) {
    return attr.initializer.expression;
  }
  return undefined;
}

/**
 * @param {ts.JsxAttributes} attrs
 * @param {string} name
 * @returns {ts.JsxAttribute | undefined}
 */
function findAttr(attrs, name) {
  for (const attr of attrs.properties) {
    if (ts.isJsxAttribute(attr) && attr.name.getText() === name) return attr;
  }
  return undefined;
}

/**
 * @param {ts.Expression} expr
 * @param {Set<string>} trackedHandlers
 * @param {Set<string>} propParams
 * @returns {"ok" | "prop" | "chrome" | "missing"}
 */
function classifyHandler(expr, trackedHandlers, propParams) {
  if (isChromeOnlyHandler(expr)) return "chrome";
  if (containsMixpanelTrack(expr)) return "ok";

  if (ts.isIdentifier(expr)) {
    if (trackedHandlers.has(expr.text)) return "ok";
    if (propParams.has(expr.text)) return "prop";
    return "missing";
  }

  // onClick={props.onClose} / onClick={this.handleClick}
  if (ts.isPropertyAccessExpression(expr)) {
    if (ts.isIdentifier(expr.expression) && propParams.has(expr.expression.text)) {
      return "prop";
    }
  }

  return "missing";
}

/**
 * @param {string} filePath
 * @param {ts.SourceFile} sourceFile
 * @param {ts.JsxOpeningLikeElement} el
 * @param {string} detail
 */
function report(filePath, sourceFile, el, detail) {
  const { line } = sourceFile.getLineAndCharacterOfPosition(el.getStart(sourceFile));
  violations.push({
    file: path.relative(ROOT, filePath),
    line: line + 1,
    detail,
  });
}

/**
 * @param {string} filePath
 */
function checkFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const kind = filePath.endsWith(".tsx")
    ? ts.ScriptKind.TSX
    : ts.ScriptKind.JSX;
  const sourceFile = ts.createSourceFile(
    filePath,
    text,
    ts.ScriptTarget.Latest,
    true,
    kind
  );

  const trackedHandlers = findTrackedHandlerNames(sourceFile);
  const propParams = collectPropParamNames(sourceFile);

  const visit = (node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(sourceFile);
      const isLink = LINK_TAGS.has(tag);
      const onClickAttr = findAttr(node.attributes, "onClick");
      const onClickExpr = onClickAttr
        ? getAttrExpression(onClickAttr)
        : undefined;

      if (isLink || onClickExpr) {
        if (onClickExpr) {
          const result = classifyHandler(
            onClickExpr,
            trackedHandlers,
            propParams
          );
          if (result === "missing") {
            report(
              filePath,
              sourceFile,
              node,
              `<${tag}> onClick is missing mixpanel.track`
            );
          }
        } else if (isLink) {
          report(
            filePath,
            sourceFile,
            node,
            `<${tag}> is missing an onClick with mixpanel.track`
          );
        }
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
}

for (const file of walkDir(SRC)) {
  checkFile(file);
}

if (violations.length === 0) {
  console.log("✓ All links and onClick handlers include mixpanel.track");
  process.exit(0);
}

console.error(
  `✗ Found ${violations.length} interactive element(s) without mixpanel.track:\n`
);
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  ${v.detail}`);
}
console.error(
  "\nAdd mixpanel.track in the onClick handler (or same-file named handler)."
);
process.exit(1);
