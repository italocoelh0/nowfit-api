export interface StripeConfig {
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
  currency: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  id: string;
  amount: number;
  currency: string;
  status: string;
}

export interface CheckoutSessionParams {
  lineItems: Array<{
    price_data: {
      currency: string;
      product_data: {
        name: string;
        description?: string;
        images?: string[];
      };
      unit_amount: number;
    };
    quantity: number;
  }>;
  successUrl: string;
  cancelUrl: string;
  customerId?: string;
  metadata?: Record<string, any>;
}