import { IShippingStrategy } from './IShippingStrategy';

export class ExpressShipping implements IShippingStrategy {
  public calculate(subtotal: number): number {
    return 50.00;
  }
}
