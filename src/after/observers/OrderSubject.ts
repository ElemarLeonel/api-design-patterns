import { IOrderObserver } from './IOrderObserver';

export class OrderSubject {
  private observers: IOrderObserver[] = [];

  public attach(observer: IOrderObserver): void {
    this.observers.push(observer);
  }

  public detach(observer: IOrderObserver): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  public async notify(orderId: number, status: string, customerName: string, totalPrice: number): Promise<void> {
    const promises = this.observers.map(observer => 
      observer.update(orderId, status, customerName, totalPrice)
    );
    await Promise.all(promises);
  }
}
