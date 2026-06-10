import { writePool, getReadPool } from '../db/index.js';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function criarPedidoAleatorio() {
  const readPool = getReadPool();
  const [clientes] = await readPool.execute(
    'SELECT id, nome FROM cliente ORDER BY RAND() LIMIT 1'
  );
  const cliente = clientes[0];

  if (!cliente) {
    console.log('[Escrita - Primário] Nenhum cliente encontrado na réplica para criar pedido.');
    return null;
  }

  const numProdutos = parseInt(randomInt(1, 3), 10);
  const [produtos] = await readPool.execute(
    `SELECT id, valor FROM produto ORDER BY RAND() LIMIT ${numProdutos}`
  );

  if (produtos.length === 0) {
    console.log('[Escrita - Primário] Nenhum produto encontrado na réplica para criar pedido.');
    return null;
  }

  const itens = produtos.map(p => ({
    ...p,
    valor: parseFloat(p.valor),
    quantidade: randomInt(1, 3)
  }));
  
  const valorTotal = parseFloat(itens.reduce((sum, item) => sum + item.valor * item.quantidade, 0).toFixed(2));

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

  console.log(`[Escrita - Primário] Pedido Gravado:`, {
    id_pedido: pedidoId,
    cliente: cliente.nome,
    valor_total: valorTotal,
    quantidade_itens: itens.length
  });

  return { pedidoId, clienteId: cliente.id };
}

export { criarPedidoAleatorio };

