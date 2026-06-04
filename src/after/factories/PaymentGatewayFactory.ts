import { IPaymentGateway } from './IPaymentGateway';
import { PixGateway } from './PixGateway';
import { CreditCardGateway } from './CreditCardGateway';

export class PaymentGatewayFactory {
  public static createGateway(method: string): IPaymentGateway {
    switch (method.toLowerCase()) {
      case 'pix':
        return new PixGateway();
      case 'credit_card':
        return new CreditCardGateway();
      default:
        throw new Error(`Método de pagamento '${method}' não é suportado pelo Gateway.`);
    }
  }
}
