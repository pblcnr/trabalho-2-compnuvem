import { Router } from 'express';
import { getReadPool } from '../../db/index.js';

const router = Router();

router.get('/vendas', async (req, res) => {
  try {
    const [rows] = await getReadPool().execute(
      `SELECT COUNT(*) AS total_pedidos, AVG(valor_total) AS valor_medio, SUM(valor_total) AS valor_total_vendido
       FROM pedido`
    );

    const r = rows[0];
    res.json({
      total_pedidos: r.total_pedidos,
      valor_medio: r.valor_medio,
      valor_total_vendido: r.valor_total_vendido,
    });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
