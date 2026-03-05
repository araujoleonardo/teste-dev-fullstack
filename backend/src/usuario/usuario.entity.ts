import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'usuarios' })
export class UsuarioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nome', length: 100, nullable: false })
  nome: string;

  @Column({ name: 'login', length: 100, nullable: false, unique: true })
  login: string;

  @Column({ name: 'senha', length: 255, nullable: false })
  senha: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: string;

  @UpdateDateColumn({ name: 'alterado_em' })
  alteradoEm: string;
}
