import { dataSource } from './data-source';
import { runSeeders } from 'typeorm-extension';
import CategoriaSeeder from './seeds/categorias.seed';

dataSource
  .initialize()
  .then(async () => {
    console.log('Banco de dados conectado.');

    await runSeeders(dataSource, {
      seeds: [CategoriaSeeder],
    });

    console.log('Seeds finalizados!');
    process.exit();
  })
  .catch((error) => {
    console.error('Erro ao conectar no banco:', error);
    process.exit(1);
  });