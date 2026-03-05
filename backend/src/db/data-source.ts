import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { ReceitaEntity } from '../receita/receita.entity';

dotenv.config();

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [CategoriaEntity, UsuarioEntity, ReceitaEntity],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
});
