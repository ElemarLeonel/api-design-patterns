export class OrderItemsIterator {
  private items: any[];
  private position: number = 0;

  constructor(items: any[]) {
    this.items = items;
  }

  public hasNext(): boolean {
    return this.position < this.items.length;
  }

  public next(): any {
    if (this.hasNext()) {
      return this.items[this.position++];
    }
    return null;
  }
}
