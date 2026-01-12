import { Controller, Post, Body, Get, Query, Headers, Req, HttpCode } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateCheckoutDto } from 'src/dto/create-checkout-dto';
import type { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly supabaseService: SupabaseService,
  ) { }

  @Get('config')
  getConfig() {
    return {
      publishableKey: this.stripeService.getPublishableKey(),
      currency: this.stripeService.getCurrency(),
    };
  }

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() body: { amount: number; customerId?: string; metadata?: Record<string, any> },
  ) {
    const { amount, customerId, metadata } = body;
    return await this.stripeService.createPaymentIntent(
      amount,
      'brl',
      customerId,
      metadata
    );
  }

  @Post('checkout')
  async createCheckout(
    @Body() createCheckoutDto: CreateCheckoutDto
  ) {
    const session = await this.stripeService.createCheckoutSession(
      createCheckoutDto.lineItems,
      createCheckoutDto.successUrl || 'https://seusite.com/success',
      createCheckoutDto.cancelUrl || 'https://seusite.com/cancel',
      createCheckoutDto.customerId,
      createCheckoutDto.metadata
    );

    return { url: session.url, sessionId: session.id };
  }

  @Post('create-customer')
  async createCustomer(@Body() body: { email: string; name?: string }) {
    const { email, name } = body;
    return await this.stripeService.createCustomer(email, name);
  }

  @Get('customer')
  async getCustomer(@Query('email') email?: string, @Query('id') id?: string) {
    if (id) {
      return await this.stripeService.getConstumerById(id);
    }
    if (email) {
      return await this.stripeService.getCostumerByEmail(email);
    }
    throw new Error('Email or ID required');
  }

  @Get('customers')
  async listCustomers(@Query('limit') limit: number = 10) {
    return await this.stripeService.listCustomers(limit);
  }

  @Post('create-product')
  async createProduct(@Body() body: { name: string; description?: string; images?: string[] }) {
    const { name, description, images } = body;
    return await this.stripeService.createProduct(name, description, images);
  }

  @Post('create-price')
  async createPrice(
    @Body() body: { 
      productId: string; 
      unitAmount: number; 
      currency?: string; 
      interval?: 'day' | 'week' | 'month' | 'year' 
    }
  ) {
    const { productId, unitAmount, currency, interval } = body;
    return await this.stripeService.createPrice(productId, unitAmount, currency || 'brl', interval);
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: Request & { rawBody?: Buffer }
  ) {
    if (!request.rawBody) {
      throw new Error('Raw body is required for webhook verification');
    }

    try {
      const event = this.stripeService.constructEvent(
        request.rawBody,
        signature
      );

      console.log('📨 Webhook recebido:', event.type);

      // Processar diferentes tipos de eventos
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          console.log('✅ Checkout completado:', session.id);

          // Extrair metadados
          const userId = session.metadata?.userId;
          const flameAmount = parseInt(session.metadata?.flameAmount || '0');
          const amountPaid = session.amount_total ? session.amount_total / 100 : 0;

          if (userId && flameAmount > 0) {
            // Atualiza as flames do usuário no Supabase
            const success = await this.supabaseService.updateUserFlames(userId, flameAmount);

            if (success) {
              // Registra a transação
              await this.supabaseService.createPaymentRecord({
                userId,
                flameAmount,
                amountPaid,
                paymentIntentId: session.payment_intent as string,
                status: 'completed',
              });

              console.log(`🔥 ${flameAmount} Flames adicionadas para usuário ${userId}`);
            }
          }
          break;
        }

        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object;
          console.log('💰 PaymentIntent bem-sucedido:', paymentIntent.id);
          break;
        }

        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object;
          console.log('❌ PaymentIntent falhou:', paymentIntent.id);
          
          // Registrar falha
          if (paymentIntent.metadata?.userId) {
            await this.supabaseService.createPaymentRecord({
              userId: paymentIntent.metadata.userId,
              flameAmount: parseInt(paymentIntent.metadata.flameAmount || '0'),
              amountPaid: paymentIntent.amount / 100,
              paymentIntentId: paymentIntent.id,
              status: 'failed',
            });
          }
          break;
        }

        default:
          console.log(`⚠️ Evento não tratado: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('❌ Erro ao processar webhook:', error);
      throw error;
    }
  }

  @Post('refund')
  async createRefund(@Body() body: { chargeId: string; amount?: number }) {
    const { chargeId, amount } = body;
    return await this.stripeService.createRefund(chargeId, amount);
  }

  @Get('payment-intent/:id')
  async getPaymentIntent(@Query('id') id: string) {
    return await this.stripeService.retrievePaymentIntent(id);
  }
}