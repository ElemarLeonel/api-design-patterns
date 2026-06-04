import { OrderItemsIterator } from './OrderItemsIterator';

export class OrderItemsCollection {
  private items: any[] = [];

  public addItem(item: any): void {
    this.items.push(item);
  }

  public createIterator(): OrderItemsIterator {
    return new OrderItemsIterator(this.items);
  }

  public getItemsArray(): any[] {
    return this.items;
  }
}
