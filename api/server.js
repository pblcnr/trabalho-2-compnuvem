import 'dotenv/config';
import express from 'express';

import pedidosRouter from './routes/pedidos.js';
import clientesRouter from './routes/clientes.js';
import produtosRouter from './routes/produtos.js';
import relatoriosRouter from './routes/relatorios.js';

const app = express();

app.use(express.json());

app.use('/pedidos', pedidosRouter);
app.use('/clientes', clientesRouter);
app.use('/produtos', produtosRouter);
app.use('/relatorios', relatoriosRouter);

app.listen(process.env.API_PORT, () => {
  console.log(`API running on port ${process.env.API_PORT}`);
});

export default app;
