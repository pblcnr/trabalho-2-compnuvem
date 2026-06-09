require('dotenv').config();
const mysql = require('mysql2/promise');

const writePool = mysql.createPool({
  host:     process.env.DB_WRITE_HOST,
  port:     process.env.DB_WRITE_PORT,
  user:     process.env.DB_WRITE_USER,
  password: process.env.DB_WRITE_PASSWORD,
  database: process.env.DB_WRITE_DATABASE,
});

module.exports = writePool;
