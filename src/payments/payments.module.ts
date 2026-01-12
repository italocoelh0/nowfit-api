import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [PaymentsController],
})
export class PaymentsModule {}