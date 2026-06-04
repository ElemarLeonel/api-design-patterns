import { IShippingStrategy } from './IShippingStrategy';

export class NormalShipping implements IShippingStrategy {
  public calculate(subtotal: number): number {
    // Regra: Frete grátis para compras acima de R$ 200, caso contrário R$ 15
    return subtotal >= 200 ? 0.00 : 15.00;
  }
}
