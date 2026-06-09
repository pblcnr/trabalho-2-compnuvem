import { writePool, getReadPool } from '../db/index.js';

const produtos = [
  { descricao: 'Notebook', categoria: 'Informatica', valor: 3500.00, estoque: 10 },
  { descricao: 'Mouse',    categoria: 'Informatica', valor:  150.00, estoque: 50 },
  { descricao: 'Teclado',  categoria: 'Informatica', valor:  200.00, estoque: 30 },
  { descricao: 'Monitor',  categoria: 'Informatica', valor: 1200.00, estoque: 15 },
];

async function insertProdutos() {
  for (const produto of produtos) {
    const [result] = await writePool.execute(
      'INSERT INTO produto (descricao, categoria, valor, estoque, criado_por) VALUES (?, ?, ?, ?, ?)',
      [produto.descricao, produto.categoria, produto.valor, produto.estoque, 'grupo_3']
    );

    const [rows] = await getReadPool().execute(
      'SELECT id, descricao, valor, estoque FROM produto WHERE id = ?',
      [result.insertId]
    );

    const row = rows[0];
    console.log({ id: row.id, descricao: row.descricao, valor: row.valor, estoque: row.estoque });
  }
}

export { insertProdutos };
