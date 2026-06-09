import { Router } from 'express';
import { getReadPool } from '../../db/index.js';

const router = Router();

router.get('/baixo-estoque', async (req, res) => {
  try {
    const [produtos] = await getReadPool().execute(
      `SELECT id, descricao, categoria, valor, estoque
       FROM produto
       WHERE estoque < 20
       ORDER BY estoque ASC`
    );

    res.json({
      produtos: produtos.map(p => ({
        id: p.id,
        descricao: p.descricao,
        categoria: p.categoria,
        valor: p.valor,
        estoque: p.estoque,
      })),
    });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
