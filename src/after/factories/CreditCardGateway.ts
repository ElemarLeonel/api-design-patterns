import { IPaymentGateway } from './IPaymentGateway';

export class CreditCardGateway implements IPaymentGateway {
  public async processPayment(amount: number): Promise<{ success: boolean; transactionId: string }> {
    console.log(`[Factory - CreditCard] Transacionando R$ ${amount.toFixed(2)} com operadora de cartão de crédito...`);
    // Simulando chamada de API de Cartão
    const transactionId = 'CC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    return { success: true, transactionId };
  }
}
