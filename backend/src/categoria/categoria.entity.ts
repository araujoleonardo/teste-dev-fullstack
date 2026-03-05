import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ReceitaEntity } from '../receita/receita.entity';

@Entity({ name: 'categorias' })
export class CategoriaEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ name: 'nome', length: 100, nullable: false, unique: true })
  nome: string;

  @OneToMany(() => ReceitaEntity, (receita) => receita.categoria)
  receitas: ReceitaEntity[];
}
