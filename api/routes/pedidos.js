import { Router } from 'express';
import { getReadPool } from '../../db/index.js';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [pedidos] = await getReadPool().execute(
      `SELECT p.id, p.valor_total, p.status, p.criado_em,
              c.id AS cliente_id, c.nome AS cliente_nome
       FROM pedido p
       JOIN cliente c ON c.id = p.cliente_id
       WHERE p.id = ?`,
      [id]
    );

    if (pedidos.length === 0) {
      return res.status(404).json({ error: 'Pedido not found' });
    }

    const pedido = pedidos[0];

    const [itens] = await getReadPool().execute(
      `SELECT pi.id, pi.quantidade, pi.valor_unitario,
              pr.id AS produto_id, pr.descricao AS produto_descricao
       FROM pedido_item pi
       JOIN produto pr ON pr.id = pi.produto_id
       WHERE pi.pedido_id = ?`,
      [id]
    );

    res.json({
      id: pedido.id,
      cliente: { id: pedido.cliente_id, nome: pedido.cliente_nome },
      valor_total: pedido.valor_total,
      status: pedido.status,
      criado_em: pedido.criado_em,
      itens: itens.map(item => ({
        id: item.id,
        produto: { id: item.produto_id, descricao: item.produto_descricao },
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario,
      })),
    });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
