require('dotenv').config();
const mysql = require('mysql2/promise');

const hosts = process.env.DB_READ_HOSTS.split(',').map(h => h.trim());

const readPools = hosts.map(host =>
  mysql.createPool({
    host,
    port:     process.env.DB_READ_PORT,
    user:     process.env.DB_READ_USER,
    password: process.env.DB_READ_PASSWORD,
    database: process.env.DB_READ_DATABASE,
  })
);

let current = 0;

function getReadPool() {
  const pool = readPools[current];
  current = (current + 1) % readPools.length;
  return pool;
}

module.exports = { getReadPool };
