import { IOrderRepository } from './IOrderRepository';
import { DatabaseConnection } from '../database/DatabaseConnection';

export class SQLiteOrderRepository implements IOrderRepository {
  private getDb() {
    return DatabaseConnection.getInstance().getDatabase();
  }

  public findProductById(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getDb().get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  public saveOrder(order: {
    customerName: string;
    shippingType: string;
    shippingCost: number;
    paymentMethod: string;
    paymentStatus: string;
    totalPrice: number;
    status: string;
    giftWrap: boolean;
    insurance: boolean;
  }): Promise<number> {
    return new Promise((resolve, reject) => {
      this.getDb().run(
        `INSERT INTO orders (customer_name, shipping_type, shipping_cost, payment_method, payment_status, total_price, status, gift_wrap, insurance) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.customerName,
          order.shippingType,
          order.shippingCost,
          order.paymentMethod,
          order.paymentStatus,
          order.totalPrice,
          order.status,
          order.giftWrap ? 1 : 0,
          order.insurance ? 1 : 0
        ],
        function (err) {
          if (err) return reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  public saveOrderItem(orderId: number, item: {
    productId: number;
    quantity: number;
    price: number;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getDb().run(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, item.price],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }
}
