# Houston Land Rovers

## Local development

```bash
npm install
npm run dev
```

## Klaviyo setup

The site uses the server-side Klaviyo API for registrations, contact-form
submissions, and event invitations. Configure these environment variables
locally and in the deployment:

```bash
KLAVIYO_PRIVATE_API_KEY=pk_...
KLAVIYO_LIST_ID=...
NEXT_PUBLIC_SITE_URL=https://houstonlandrovers.com
```

Keep the private key server-only. Its API scopes must allow event creation,
profile imports, and profile/list subscriptions for the existing forms.

### Invitation email flow

Invitations are recorded as the Klaviyo metric
`Invited to Houston Land Rovers`. They do not add the recipient to a marketing
list.

1. Submit a test invitation from `/events` so the metric and its profile appear
   in Klaviyo.
2. In Klaviyo, create a flow from scratch and choose the
   `Invited to Houston Land Rovers` metric as its trigger.
3. Add an email immediately after the trigger. Suggested subject:
   `You've been invited to Houston Land Rovers`.
4. Add a registration button using the event property
   `{{ event.registration_url }}` as its URL.
5. Explain in the email that someone in the Houston Land Rovers community
   requested the one-time invitation. Do not describe the recipient as a
   subscriber.
6. Add a flow filter so a profile can enter no more than once within the period
   you choose, and keep Klaviyo Smart Sending enabled.
7. Ask Klaviyo to mark the message as transactional before turning the flow
   live. This is important because invitees have not consented to marketing.
   Klaviyo controls transactional-email eligibility and approval.
8. Preview the email with real event data, send a test, then set the flow live.

The API route includes a honeypot and a best-effort limit of three invitations
per IP per hour. Because application instances do not share memory, also add a
distributed rate-limit rule for `POST /api/klaviyo/invite` in the deployment
firewall before launch. A CAPTCHA such as Cloudflare Turnstile is recommended
if abuse becomes an issue.

## Site resources

Land Rover media images: https://media.landrover.com/en/images
