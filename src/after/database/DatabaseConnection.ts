import sqlite3 from 'sqlite3';
import path from 'path';

export class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private db: sqlite3.Database;

  private constructor() {
    const dbPath = path.resolve(__dirname, '../../../database.sqlite');
    this.db = new sqlite3.Database(dbPath);
    console.log('[Singleton] Conexão com SQLite estabelecida.');
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getDatabase(): sqlite3.Database {
    return this.db;
  }
}
