import { writePool } from '../db/index.js';

const catalogos = [
  { descricao: 'Notebook Gamer', categoria: 'Eletrônicos', valorMin: 3000, valorMax: 7000 },
  { descricao: 'Mouse sem Fio', categoria: 'Periféricos', valorMin: 80, valorMax: 350 },
  { descricao: 'Teclado Mecânico RGB', categoria: 'Periféricos', valorMin: 150, valorMax: 600 },
  { descricao: 'Monitor 24 polegadas', categoria: 'Monitores', valorMin: 800, valorMax: 1500 },
  { descricao: 'Headset com Microfone', categoria: 'Áudio', valorMin: 120, valorMax: 500 },
  { descricao: 'Cadeira Ergonômica', categoria: 'Escritório', valorMin: 600, valorMax: 1800 },
  { descricao: 'Roteador Wi-Fi 6', categoria: 'Redes', valorMin: 250, valorMax: 800 },
  { descricao: 'SSD NVMe 1TB', categoria: 'Armazenamento', valorMin: 350, valorMax: 750 },
  { descricao: 'Memória RAM DDR4 16GB', categoria: 'Componentes', valorMin: 200, valorMax: 450 },
  { descricao: 'Gabinete ATX', categoria: 'Componentes', valorMin: 180, valorMax: 550 }
];

async function insertProdutoAleatorio() {
  const item = catalogos[Math.floor(Math.random() * catalogos.length)];
  const descricao = `${item.descricao} Mod. ${Math.floor(Math.random() * 100)}`;
  const categoria = item.categoria;
  const valor = parseFloat((Math.random() * (item.valorMax - item.valorMin) + item.valorMin).toFixed(2));
  const estoque = Math.floor(Math.random() * 80) + 5; 

  const [result] = await writePool.execute(
    'INSERT INTO produto (descricao, categoria, valor, estoque, criado_por) VALUES (?, ?, ?, ?, ?)',
    [descricao, categoria, valor, estoque, 'grupo_3']
  );

  console.log(`[Escrita - Primário] Produto inserido:`, {
    id: result.insertId,
    descricao,
    valor,
    estoque
  });

  return { id: result.insertId, descricao, categoria, valor, estoque };
}

export { insertProdutoAleatorio };

