export interface IPaymentGateway {
  processPayment(amount: number): Promise<{ success: boolean; transactionId: string }>;
}
