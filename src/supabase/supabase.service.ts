import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be defined');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Atualiza o saldo de Flames de um usuário
   */
  async updateUserFlames(userId: string, flameAmount: number): Promise<boolean> {
    try {
      // Primeiro, busca o saldo atual
      const { data: userData, error: fetchError } = await this.supabase
        .from('profiles')
        .select('flame_balance')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar usuário:', fetchError);
        return false;
      }

      const currentBalance = userData?.flame_balance || 0;
      const newBalance = currentBalance + flameAmount;

      // Atualiza o saldo
      const { error: updateError } = await this.supabase
        .from('profiles')
        .update({ flame_balance: newBalance })
        .eq('id', userId);

      if (updateError) {
        console.error('Erro ao atualizar flames:', updateError);
        return false;
      }

      console.log(`✅ Flames atualizadas para usuário ${userId}: +${flameAmount} (novo saldo: ${newBalance})`);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar flames:', error);
      return false;
    }
  }

  /**
   * Registra uma transação de pagamento
   */
  async createPaymentRecord(data: {
    userId: string;
    flameAmount: number;
    amountPaid: number;
    paymentIntentId: string;
    status: string;
  }): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('flame_transactions')
        .insert({
          user_id: data.userId,
          flame_amount: data.flameAmount,
          amount_paid: data.amountPaid,
          payment_intent_id: data.paymentIntentId,
          status: data.status,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Erro ao registrar transação:', error);
      } else {
        console.log('✅ Transação registrada com sucesso');
      }
    } catch (error) {
      console.error('Erro ao criar registro de pagamento:', error);
    }
  }
}
