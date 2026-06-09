import { writePool, getReadPool } from '../db/index.js';

async function insertClientes() {
  for (let i = 0; i < 5; i++) {
    const n = i + 1;
    const nome = `Cliente ${n}`;
    const email = `cliente${n}@email.com`;

    const [result] = await writePool.execute(
      'INSERT INTO cliente (nome, email, criado_por) VALUES (?, ?, ?)',
      [nome, email, 'grupo_3']
    );

    const [rows] = await getReadPool().execute(
      'SELECT id, nome, email FROM cliente WHERE id = ?',
      [result.insertId]
    );

    const row = rows[0];
    console.log({ id: row.id, nome: row.nome, email: row.email });
  }
}

export { insertClientes };
