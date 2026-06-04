import { IPaymentGateway } from './IPaymentGateway';

export class PixGateway implements IPaymentGateway {
  public async processPayment(amount: number): Promise<{ success: boolean; transactionId: string }> {
    console.log(`[Factory - PIX] Gerando QR Code Dinâmico e processando R$ ${amount.toFixed(2)}...`);
    // Simulando chamada de API de PIX
    const transactionId = 'PIX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    return { success: true, transactionId };
  }
}
