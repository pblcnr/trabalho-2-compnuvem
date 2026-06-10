import { writePool, closeReadPools } from '../db/index.js';
import { insertClienteAleatorio } from './clientes.js';
import { insertProdutoAleatorio } from './produtos.js';
import { criarPedidoAleatorio } from './pedidos.js';
import { executarConsultas } from './consultas.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let rodando = true;

const encerrar = async () => {
  console.log('\nEncerrando aplicação de fluxos graciosamente...');
  rodando = false;
  try {
    await writePool.end();
    await closeReadPools();
    console.log('Pools de conexão encerrados com sucesso!');
  } catch (err) {
    console.error('Erro ao fechar os pools de conexão:', err);
  }
  process.exit(0);
};

process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);

async function iniciarFluxoContinuo() {
  console.log('Iniciando aplicação de fluxos de maneira contínua. Pressione Ctrl+C para parar.\n');
  let ciclo = 1;

  while (rodando) {
    console.log(`=== Início do Ciclo #${ciclo} ===`);
    try {
      await insertClienteAleatorio();
      await insertProdutoAleatorio();
      await sleep(1000);

      const pedido = await criarPedidoAleatorio();

      if (pedido) {
        await sleep(1000);
        await executarConsultas(pedido.pedidoId, pedido.clienteId);
      }
    } catch (err) {
      console.error(`\n[Erro no Ciclo #${ciclo}]:`, err.message);
    }
    console.log(`=== Fim do Ciclo #${ciclo} ===\n`);
    ciclo++;

    await sleep(3000);
  }
}

iniciarFluxoContinuo();

