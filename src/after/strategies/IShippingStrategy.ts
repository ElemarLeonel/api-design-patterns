export interface IShippingStrategy {
  calculate(subtotal: number): number;
}
