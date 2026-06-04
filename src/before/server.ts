import express from 'express';
import { initializeDatabase } from '../database/setup';
import { OrderController } from './controllers/OrderController';

const app = express();
const port = 3000;

app.use(express.json());

const orderController = new OrderController();

// Rota de criação de pedidos
app.post('/orders', (req, res) => orderController.createOrder(req, res));

// Rota de reorder manual (Clone)
app.post('/orders/:id/reorder', (req, res) => orderController.reorder(req, res));


// Rota simples de listagem de produtos para os alunos testarem
app.get('/products', (req, res) => {
  const sqlite3 = require('sqlite3').verbose();
  const path = require('path');
  const db = new sqlite3.Database(path.resolve(__dirname, '../../database.sqlite'));

  db.all('SELECT * FROM products', [], (err: any, rows: any) => {
    db.close();
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`[Versão Sem Padrões] API rodando na porta ${port}`);
    });
  })
  .catch((err) => {
    console.error('Falha ao inicializar o banco de dados:', err);
  });
