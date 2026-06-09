import { writePool, closeReadPools } from '../db/index.js';
import { insertClientes } from './clientes.js';
import { insertProdutos } from './produtos.js';
import { insertPedidos } from './pedidos.js';
import { executarConsultas } from './consultas.js';

try {
  await insertClientes();
  await insertProdutos();

  const pedidos = await insertPedidos();

  for (const { pedidoId, clienteId } of pedidos) {
    await executarConsultas(pedidoId, clienteId);
  }
} catch (err) {
  console.error(err);
} finally {
  await writePool.end();
  await closeReadPools();
}
