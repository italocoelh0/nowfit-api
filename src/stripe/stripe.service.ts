import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;

    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }

    this.stripe = new Stripe(stripeSecretKey, {
      typescript: true,
    });
  }

  getStripeInstance(): Stripe {
    return this.stripe;
  }

  getPublishableKey(): string {
    return this.configService.get<string>('STRIPE_PUBLISHABLE_KEY') || '';
  }

  getCurrency(): string {
    return this.configService.get<string>('STRIPE_CURRENCY') || 'brl';
  }

  async getConstumerById(customerId: string) {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      return customer;
    } catch (error) {
      throw new Error(`Error retrieving customer: ${error.message}`);
    }
  }

  async getCostumerByEmail(email: string) {
    try {
      const customers = await this.stripe.customers.list({ email });
      return customers.data.length > 0 ? customers.data[0] : null;
    } catch (error) {
      throw new Error(`Error retrieving customer by email: ${error.message}`);
    }
  }

  // Métodos para criar um Customer
  async createCustomer(email: string, name?: string) {
    try {
      const existentCostumer = await this.getCostumerByEmail(email);
      if (existentCostumer) {
        return existentCostumer;
      }

      const customer = await this.stripe.customers.create({
        email,
        name,
      });
      return customer;
    } catch (error) {
      throw new Error(`Error creating customer: ${error.message}`);
    }
  }

  // Método para criar um PaymentIntent
  async createPaymentIntent(
    amount: number,
    currency: string,
    customerId?: string,
    metadata: Record<string, any> = {},
  ) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe trabalha com centavos
        currency: currency || this.getCurrency(),
        customer: customerId,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      return paymentIntent;
    } catch (error) {
      throw new Error(`Error creating payment intent: ${error.message}`);
    }
  }

  // Método para criar uma Checkout Session
  async createCheckoutSession(
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
    }>,
    successUrl: string,
    cancelUrl: string,
    customerId?: string,
    metadata: Record<string, any> = {},
  ) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card', 'boleto'],
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer: customerId,
        metadata,
      });
      return session;
    } catch (error) {
      throw new Error(`Error creating checkout session: ${error.message}`);
    }
  }

  // Método para criar um produto
  async createProduct(name: string, description?: string, images?: string[]) {
    try {
      const product = await this.stripe.products.create({
        name,
        description,
        images,
      });
      return product;
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  // Método para criar um preço
  async createPrice(
    productId: string,
    unitAmount: number,
    currency: string,
    interval?: 'day' | 'week' | 'month' | 'year',
  ) {
    try {
      const price = await this.stripe.prices.create({
        product: productId,
        unit_amount: unitAmount * 100, // Converte para centavos
        currency: currency || this.getCurrency(),
        ...(interval && { recurring: { interval } }),
      });
      return price;
    } catch (error) {
      throw new Error(`Error creating price: ${error.message}`);
    }
  }

  // Método para recuperar um PaymentIntent
  async retrievePaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId,
      );
      return paymentIntent;
    } catch (error) {
      throw new Error(`Error retrieving payment intent: ${error.message}`);
    }
  }

  // Método para confirmar um PaymentIntent
  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        { payment_method: paymentMethodId },
      );
      return paymentIntent;
    } catch (error) {
      throw new Error(`Error confirming payment intent: ${error.message}`);
    }
  }

  // Método para processar webhooks
  constructEvent(payload: Buffer, signature: string) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }

    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
  }

  // Método para listar customers
  async listCustomers(limit: number = 10) {
    try {
      const customers = await this.stripe.customers.list({ limit });
      return customers;
    } catch (error) {
      throw new Error(`Error listing customers: ${error.message}`);
    }
  }

  // Método para criar um reembolso
  async createRefund(chargeId: string, amount?: number) {
    try {
      const refund = await this.stripe.refunds.create({
        charge: chargeId,
        ...(amount && { amount: Math.round(amount * 100) }),
      });
      return refund;
    } catch (error) {
      throw new Error(`Error creating refund: ${error.message}`);
    }
  }
}