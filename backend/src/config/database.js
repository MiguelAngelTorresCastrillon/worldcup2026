// src/config/database.js
// Patrón: Singleton — una sola instancia del pool de conexiones
const { Pool } = require('pg');
require('dotenv').config();

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this.pool = new Pool({
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT,
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    Database.instance = this;
  }

  query(text, params) {
    return this.pool.query(text, params);
  }
}

module.exports = new Database();