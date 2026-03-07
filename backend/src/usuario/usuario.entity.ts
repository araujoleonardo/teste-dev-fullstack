import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReceitaEntity } from '../receita/receita.entity';

@Entity({ name: 'usuarios' })
export class UsuarioEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ name: 'nome', length: 100, nullable: false })
  nome: string;

  @Column({ name: 'login', length: 100, nullable: false, unique: true })
  login: string;

  @Column({ name: 'senha', length: 255, nullable: false, select: false })
  senha: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: string;

  @UpdateDateColumn({ name: 'alterado_em' })
  alteradoEm: string;

  @OneToMany(() => ReceitaEntity, (receita) => receita.usuario)
  receitas: ReceitaEntity[];
}
