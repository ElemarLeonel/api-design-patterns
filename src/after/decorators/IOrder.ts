export interface IOrder {
  calculateTotal(): number;
  getDescription(): string;
  clone(): IOrder;
}

