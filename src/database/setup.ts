import sqlite3 from 'sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../database.sqlite');

export function getDatabaseConnection(): sqlite3.Database {
  return new sqlite3.Database(DB_PATH);
}

export function initializeDatabase(): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    const db = getDatabaseConnection();

    db.serialize(() => {
      // Criar tabela de produtos
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          price REAL NOT NULL
        )
      `, (err) => {
        if (err) return reject(err);
      });

      // Criar tabela de pedidos
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_name TEXT NOT NULL,
          shipping_type TEXT NOT NULL,
          shipping_cost REAL NOT NULL,
          payment_method TEXT NOT NULL,
          payment_status TEXT NOT NULL,
          total_price REAL NOT NULL,
          status TEXT NOT NULL,
          gift_wrap INTEGER DEFAULT 0,
          insurance INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) return reject(err);
      });

      // Criar tabela de itens do pedido
      db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          price REAL NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders (id),
          FOREIGN KEY (product_id) REFERENCES products (id)
        )
      `, (err) => {
        if (err) return reject(err);
      });

      // Semear produtos se a tabela estiver vazia
      db.get("SELECT COUNT(*) as count FROM products", (err, row: any) => {
        if (err) return reject(err);

        if (row.count === 0) {
          const stmt = db.prepare("INSERT INTO products (name, price) VALUES (?, ?)");
          stmt.run("Notebook Gamer", 4500.00);
          stmt.run("Mouse Wireless", 150.00);
          stmt.run("Teclado Mecânico", 350.00);
          stmt.run("Monitor 24''", 900.00);
          stmt.finalize((finalizeErr) => {
            if (finalizeErr) return reject(finalizeErr);
            console.log("Banco de dados SQLite inicializado e produtos semeados!");
            resolve(db);
          });
        } else {
          resolve(db);
        }
      });
    });
  });
}
