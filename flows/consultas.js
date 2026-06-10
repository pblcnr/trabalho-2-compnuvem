import { getReadPool } from '../db/index.js';

async function executarConsultas(pedidoId, clienteId) {
  const readPool = getReadPool();

  console.log('\n--- [Leitura - Réplica] Iniciando Consultas ---');

  const [pedidos] = await readPool.execute(
    `SELECT p.id, c.nome, p.valor_total, p.status
     FROM pedido p
     JOIN cliente c ON c.id = p.cliente_id
     WHERE p.id = ?`,
    [pedidoId]
  );
  const pedido = pedidos[0];
  if (pedido) {
    console.log(`\n4.1 — Buscar pedido por ID`);
    console.log(`Pedido ${pedido.id}`);
    console.log(`Cliente: ${pedido.nome}`);
    console.log(`Valor total: ${pedido.valor_total}`);
    console.log(`Status: ${pedido.status}`);
  }

  const [itens] = await readPool.execute(
    `SELECT pi.id, pr.descricao, pi.quantidade
     FROM pedido_item pi
     JOIN produto pr ON pr.id = pi.produto_id
     WHERE pi.pedido_id = ?`,
    [pedidoId]
  );
  console.log(`\n4.2 — Buscar itens do pedido`);
  for (const item of itens) {
    console.log(`PedidoItem ${item.id}`);
    console.log(`Produto: ${item.descricao}`);
    console.log(`Quantidade: ${item.quantidade}`);
  }

  const [historico] = await readPool.execute(
    `SELECT id, valor_total
     FROM pedido
     WHERE cliente_id = ?
     ORDER BY criado_em DESC
     LIMIT 5`,
    [clienteId]
  );
  console.log(`\n4.3 — Histórico do cliente`);
  for (const row of historico) {
    console.log(`Pedido ${row.id} - R$ ${row.valor_total}`);
  }

  const [relatorio] = await readPool.execute(
    `SELECT COUNT(*) AS total_pedidos, AVG(valor_total) AS valor_medio, SUM(valor_total) AS valor_total_vendido
     FROM pedido`
  );
  const r = relatorio[0];
  console.log(`\n4.4 — Relatório agregado`);
  console.log(`Quantidade total de pedidos: ${r.total_pedidos}`);
  console.log(`Valor médio dos pedidos: ${parseFloat(Number(r.valor_medio || 0).toFixed(2))}`);
  console.log(`Valor total vendido: ${r.valor_total_vendido || 0}`);
  
  console.log('--------------------------------------------------\n');
}

export { executarConsultas };

