
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeModule } from './stripe/stripe.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    StripeModule,
    PaymentsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}