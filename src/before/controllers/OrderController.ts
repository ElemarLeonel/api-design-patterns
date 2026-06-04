import { Request, Response } from 'express';
import { getDatabaseConnection } from '../../database/setup';

export class OrderController {
  public async createOrder(req: Request, res: Response): Promise<void> {
    const { customerName, items, shippingType, paymentMethod, giftWrap, insurance } = req.body;

    // Validação simples
    if (!customerName || !items || !Array.isArray(items) || items.length === 0 || !shippingType || !paymentMethod) {
      res.status(400).json({ error: 'Dados obrigatórios faltando!' });
      return;
    }

    const db = getDatabaseConnection();

    // 1. Buscar preços dos produtos no banco (Usando callbacks e loops aninhados do sqlite3)
    let totalPrice = 0;
    const itemsWithDetails: any[] = [];
    let completedQueries = 0;
    let hasError = false;

    // Simulação de Iterator bruto: iteração usando for simples e manipulação de array cru
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      db.get('SELECT * FROM products WHERE id = ?', [item.productId], (err, product: any) => {
        if (hasError) return;

        if (err || !product) {
          hasError = true;
          db.close();
          res.status(404).json({ error: `Erro ou Produto com ID ${item.productId} não encontrado!` });
          return;
        }

        const itemTotal = product.price * item.quantity;
        totalPrice += itemTotal;
        itemsWithDetails.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity
        });

        completedQueries++;

        if (completedQueries === items.length) {
          // Aplica um desconto fixo iterando cruamente caso haja mais de 3 itens
          let totalItemsCount = 0;
          for (let j = 0; j < itemsWithDetails.length; j++) {
            totalItemsCount += itemsWithDetails[j].quantity;
          }
          if (totalItemsCount >= 3) {
            totalPrice -= 10; // Desconto em massa
          }

          // 2. Cálculo do frete hardcoded (Simulando Strategy embutido)
          let shippingCost = 0;
          if (shippingType === 'express') {
            shippingCost = 50.00;
          } else if (shippingType === 'normal') {
            shippingCost = 15.00;
          } else if (shippingType === 'pickup') {
            shippingCost = 0.00;
          } else {
            db.close();
            res.status(400).json({ error: 'Tipo de frete inválido!' });
            return;
          }

          totalPrice += shippingCost;

          // 3. Acréscimos de adicionais hardcoded (Simulando Decorator embutido)
          if (giftWrap === true) { totalPrice += 10.00; }
          if (insurance === true) { totalPrice += 25.00; }

          // 4. Gateway de Pagamento acoplado (Simulando Factory/Strategy de pagamentos embutida)
          let paymentStatus = 'PENDING';
          if (paymentMethod === 'pix') {
            console.log(`[PIX Gateway] Gerando QR Code para R$ ${totalPrice.toFixed(2)}`);
            paymentStatus = 'PAID';
          } else if (paymentMethod === 'credit_card') {
            console.log(`[CreditCard Gateway] Transacionando R$ ${totalPrice.toFixed(2)}`);
            paymentStatus = 'PAID';
          } else {
            db.close();
            res.status(400).json({ error: 'Método de pagamento não suportado!' });
            return;
          }

          // 5. Inserir Pedido no Banco de Dados (SQL puro)
          db.run(
            `INSERT INTO orders (customer_name, shipping_type, shipping_cost, payment_method, payment_status, total_price, status, gift_wrap, insurance) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              customerName, shippingType, shippingCost, paymentMethod, paymentStatus, totalPrice, 
              paymentStatus === 'PAID' ? 'paid' : 'pending', giftWrap ? 1 : 0, insurance ? 1 : 0
            ],
            function (insertErr) {
              if (insertErr) {
                db.close();
                res.status(500).json({ error: insertErr.message });
                return;
              }

              const orderId = this.lastID;

              // 6. Inserir itens
              let itemsInserted = 0;
              for (const detail of itemsWithDetails) {
                db.run(
                  `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
                  [orderId, detail.productId, detail.quantity, detail.price],
                  () => {
                    itemsInserted++;

                    if (itemsInserted === itemsWithDetails.length) {
                      // 7. Integração de rastreio legada (Adapter ausente) - XML concatenado no controller
                      const correiosLegacyXml = `<rastreio><pedido>${orderId}</pedido><nome>${customerName}</nome></rastreio>`;
                      console.log(`[Legacy Tracking] Enviando XML de rastreio cru: ${correiosLegacyXml}`);

                      // 8. Disparo de Notificações acoplado e específico (Bridge e Observer ausentes)
                      console.log(`[SendGrid API] Mandando POST HTTP cru para SendGrid para e-mail: ${customerName}`);
                      console.log(`[Twilio API] Mandando POST HTTP cru para Twilio para SMS do pedido: ${orderId}`);

                      db.close();
                      res.status(201).json({
                        message: 'Pedido criado com sucesso (Sem padrões)!',
                        orderId, customerName, totalPrice, status: paymentStatus === 'PAID' ? 'paid' : 'pending', items: itemsWithDetails
                      });
                    }
                  }
                );
              }
            }
          );
        }
      });
    }
  }

  // Novo: Reorder acoplado (Simulando ausência do padrão Prototype)
  public async reorder(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const db = getDatabaseConnection();

    // Precisa buscar o pedido inteiro, e seus itens separadamente
    db.get('SELECT * FROM orders WHERE id = ?', [id], (err, oldOrder: any) => {
      if (err || !oldOrder) {
        db.close();
        res.status(404).json({ error: 'Pedido antigo não encontrado!' });
        return;
      }

      db.all('SELECT * FROM order_items WHERE order_id = ?', [oldOrder.id], (err2, oldItems: any[]) => {
        if (err2 || !oldItems) {
          db.close();
          res.status(500).json({ error: 'Falha ao buscar itens antigos' });
          return;
        }

        // Criar novo pedido (Clone Manual Hardcoded)
        db.run(
          `INSERT INTO orders (customer_name, shipping_type, shipping_cost, payment_method, payment_status, total_price, status, gift_wrap, insurance) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            oldOrder.customer_name + ' (Reorder)', // Muda levemente o nome
            oldOrder.shipping_type,
            oldOrder.shipping_cost,
            oldOrder.payment_method,
            oldOrder.payment_status,
            oldOrder.total_price,
            oldOrder.status,
            oldOrder.gift_wrap,
            oldOrder.insurance
          ],
          function (insertErr) {
            if (insertErr) {
              db.close();
              res.status(500).json({ error: insertErr.message });
              return;
            }

            const newOrderId = this.lastID;
            let itemsInserted = 0;

            for (const item of oldItems) {
              db.run(
                `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
                [newOrderId, item.product_id, item.quantity, item.price],
                () => {
                  itemsInserted++;
                  if (itemsInserted === oldItems.length) {
                    db.close();
                    res.status(201).json({ message: 'Pedido clonado manualmente com sucesso', newOrderId });
                  }
                }
              );
            }
          }
        );
      });
    });
  }
}
