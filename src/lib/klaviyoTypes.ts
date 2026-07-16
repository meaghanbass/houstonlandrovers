export type KlaviyoSubscribePayload = {
  email: string;
  source: "contact" | "registration";
  firstName?: string;
  lastName?: string;
  city?: string;
  vehicle?: string;
  instagram?: string;
  message?: string;
};
