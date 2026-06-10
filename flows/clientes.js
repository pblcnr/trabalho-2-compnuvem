import { writePool } from '../db/index.js';

const nomes = ['Ana', 'Bruno', 'Carlos', 'Diana', 'Eduardo', 'Fernanda', 'Gabriel', 'Helena', 'Igor', 'Julia', 'Lucas', 'Mariana', 'Otávio', 'Beatriz', 'Felipe', 'Letícia', 'Gustavo', 'Larissa', 'Thiago', 'Camila'];
const sobrenomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida'];

async function insertClienteAleatorio() {
  const nomeAleatorio = nomes[Math.floor(Math.random() * nomes.length)];
  const sobrenomeAleatorio = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
  const nome = `${nomeAleatorio} ${sobrenomeAleatorio}`;
  const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const email = `${nomeAleatorio.toLowerCase()}.${sobrenomeAleatorio.toLowerCase()}.${uniqueId}@email.com`;

  const [result] = await writePool.execute(
    'INSERT INTO cliente (nome, email, criado_por) VALUES (?, ?, ?)',
    [nome, email, 'grupo_3']
  );

  console.log(`[Escrita - Primário] Cliente inserido:`, {
    id: result.insertId,
    nome,
    email
  });

  return { id: result.insertId, nome, email };
}

export { insertClienteAleatorio };

