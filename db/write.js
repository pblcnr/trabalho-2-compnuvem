import 'dotenv/config';
import { createPool } from 'mysql2/promise';

const writePool = createPool({
  host:     process.env.DB_WRITE_HOST,
  port:     process.env.DB_WRITE_PORT,
  user:     process.env.DB_WRITE_USER,
  password: process.env.DB_WRITE_PASSWORD,
  database: process.env.DB_WRITE_DATABASE,
});

export default writePool;
