import { IShippingStrategy } from './IShippingStrategy';

export class PickupShipping implements IShippingStrategy {
  public calculate(subtotal: number): number {
    return 0.00;
  }
}
