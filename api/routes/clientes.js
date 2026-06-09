import { Router } from 'express';
import { getReadPool } from '../../db/index.js';

const router = Router();

router.get('/:id/pedidos', async (req, res) => {
  try {
    const { id } = req.params;

    const [pedidos] = await getReadPool().execute(
      `SELECT id, valor_total, status, criado_em
       FROM pedido
       WHERE cliente_id = ?
       ORDER BY criado_em DESC
       LIMIT 5`,
      [id]
    );

    res.json({
      cliente_id: Number(id),
      pedidos: pedidos.map(p => ({
        id: p.id,
        valor_total: p.valor_total,
        status: p.status,
        criado_em: p.criado_em,
      })),
    });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
