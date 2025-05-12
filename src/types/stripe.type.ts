export type StripeWebhookAdditionalData = {
  userId: string;
  paymentType: string;
  tierId?: string;
  eduContentId?: string;
  auto_renewal?: string;
  cancel_reason?: string | null;
};
