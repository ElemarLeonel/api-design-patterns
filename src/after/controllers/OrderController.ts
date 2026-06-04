import { Request, Response } from 'express';
import { CheckoutFacade } from '../facades/CheckoutFacade';

export class OrderController {
  private checkoutFacade: CheckoutFacade;

  constructor() {
    // Injeção da Facade
    this.checkoutFacade = new CheckoutFacade();
  }

  public async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { customerName, items, shippingType, paymentMethod, giftWrap, insurance } = req.body;

      if (!customerName || !items || !Array.isArray(items) || items.length === 0 || !shippingType || !paymentMethod) {
        res.status(400).json({ error: 'Dados obrigatórios faltando!' });
        return;
      }

      // Chama a Facade (que esconde Builder, Command, Observer, Adapter...)
      const result = await this.checkoutFacade.processCheckout({
        customerName, items, shippingType, paymentMethod,
        giftWrap: giftWrap || false, insurance: insurance || false
      });

      res.status(201).json(result);
    } catch (error: any) {
      console.error('[After - OrderController Error]', error);
      res.status(500).json({ error: error.message || 'Erro interno no servidor' });
    }
  }

  // Novo: Rota para o Prototype
  public async reorder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.checkoutFacade.processReorder(Number(id));
      res.status(201).json(result);
    } catch (error: any) {
      console.error('[After - OrderController Error no Reorder]', error);
      res.status(500).json({ error: error.message || 'Erro interno no servidor ao clonar' });
    }
  }
}

