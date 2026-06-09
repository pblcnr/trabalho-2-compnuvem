import { getReadPool } from '../db/index.js';

async function executarConsultas(pedidoId, clienteId) {
  // Buscar pedido por ID
  const [pedidos] = await getReadPool().execute(
    `SELECT p.id, c.nome, p.valor_total, p.status
     FROM pedido p
     JOIN cliente c ON c.id = p.cliente_id
     WHERE p.id = ?`,
    [pedidoId]
  );
  const pedido = pedidos[0];
  console.log({ id: pedido.id, cliente: pedido.nome, valor_total: pedido.valor_total, status: pedido.status });

  // Buscar itens do pedido
  const [itens] = await getReadPool().execute(
    `SELECT pi.id, pr.descricao, pi.quantidade
     FROM pedido_item pi
     JOIN produto pr ON pr.id = pi.produto_id
     WHERE pi.pedido_id = ?`,
    [pedidoId]
  );
  for (const item of itens) {
    console.log({ id: item.id, produto: item.descricao, quantidade: item.quantidade });
  }

  // Histórico do cliente
  const [historico] = await getReadPool().execute(
    `SELECT id, valor_total
     FROM pedido
     WHERE cliente_id = ?
     ORDER BY criado_em DESC
     LIMIT 5`,
    [clienteId]
  );
  for (const row of historico) {
    console.log({ id: row.id, valor_total: row.valor_total });
  }

  // Relatório agregado
  const [relatorio] = await getReadPool().execute(
    `SELECT COUNT(*) AS total_pedidos, AVG(valor_total) AS valor_medio, SUM(valor_total) AS valor_total_vendido
     FROM pedido`
  );
  const r = relatorio[0];
  console.log({ total_pedidos: r.total_pedidos, valor_medio: r.valor_medio, valor_total_vendido: r.valor_total_vendido });
}

export { executarConsultas };
