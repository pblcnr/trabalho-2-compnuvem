import 'dotenv/config';
import { createPool } from 'mysql2/promise';

const hosts = process.env.DB_READ_HOSTS.split(',').map(h => h.trim());

const readPools = hosts.map(host =>
  createPool({
    host,
    port:     process.env.DB_READ_PORT,
    user:     process.env.DB_READ_USER,
    password: process.env.DB_READ_PASSWORD,
    database: process.env.DB_READ_DATABASE,
    ssl: {
      rejectUnauthorized: false,
    },
  })
);

let current = 0;

function getReadPool() {
  const pool = readPools[current];
  current = (current + 1) % readPools.length;
  return pool;
}

function closeReadPools() {
  return Promise.all(readPools.map(p => p.end()));
}

export { getReadPool, closeReadPools };
