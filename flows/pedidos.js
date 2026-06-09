import { writePool, getReadPool } from '../db/index.js';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function insertPedidos() {
  const resultado = [];

  for (let i = 0; i < 3; i++) {
    const readPool = getReadPool();

    const [clientes] = await readPool.execute(
      'SELECT id, nome FROM cliente ORDER BY RAND() LIMIT 1'
    );
    const cliente = clientes[0];

    const numProdutos = randomInt(1, 3);
    const [produtos] = await getReadPool().execute(
      'SELECT id, valor FROM produto ORDER BY RAND() LIMIT ?',
      [numProdutos]
    );

    const itens = produtos.map(p => ({ ...p, valor: parseFloat(p.valor), quantidade: randomInt(1, 3) }));
    const valorTotal = itens.reduce((sum, item) => sum + item.valor * item.quantidade, 0);

    const [pedidoResult] = await writePool.execute(
      'INSERT INTO pedido (cliente_id, valor_total, status, criado_por) VALUES (?, ?, ?, ?)',
      [cliente.id, valorTotal, 'FINALIZADO', 'grupo_3']
    );
    const pedidoId = pedidoResult.insertId;

    for (const item of itens) {
      await writePool.execute(
        'INSERT INTO pedido_item (pedido_id, produto_id, quantidade, valor_unitario) VALUES (?, ?, ?, ?)',
        [pedidoId, item.id, item.quantidade, item.valor]
      );
    }

    console.log({
      id: pedidoId,
      cliente: cliente.nome,
      valor_total: valorTotal,
      itens: itens.length,
    });

    resultado.push({ pedidoId, clienteId: cliente.id });
  }

  return resultado;
}

export { insertPedidos };
