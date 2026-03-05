import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';

@Entity({ name: 'receitas' })
export class ReceitaEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ name: 'nome', length: 45, nullable: false })
  nome: string;

  @Column({ name: 'tempo_preparo_minutos', unsigned: true })
  tempoPreparoMinutos: number;

  @Column({ name: 'porcoes', unsigned: true })
  porcoes: number;

  @Column({ name: 'modo_preparo', type: 'text', nullable: false })
  modoPreparo: string;

  @Column({ name: 'ingredientes', type: 'text' })
  ingredientes: string;

  @Column({
    name: 'id_usuarios',
    unsigned: true,
    nullable: false,
    foreignKeyConstraintName: 'fk_id_usuarios',
  })
  idUsuarios: number;

  @Column({
    name: 'id_categorias',
    unsigned: true,
    foreignKeyConstraintName: 'fk_id_categorias',
  })
  idCategorias: number;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: string;

  @UpdateDateColumn({ name: 'alterado_em' })
  alteradoEm: string;

  @ManyToOne(
    () => UsuarioEntity,
    (usuario: UsuarioEntity) => usuario.receitas,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'id_usuarios' })
  usuario: UsuarioEntity;

  @ManyToOne(
    () => CategoriaEntity,
    (categoria: CategoriaEntity) => categoria.receitas,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'id_categorias' })
  categoria: CategoriaEntity;
}
