import type { Categoria } from "./categoria-data";

export interface Receita {
  id: number;
  nome: string;
  tempoPreparoMinutos: number;
  porcoes: number;
  modoPreparo: string;
  ingredientes: string;
  idUsuarios: number;
  idCategorias: number;
  criadoEm: string;
  alteradoEm: string;
  categoria?: Categoria;
  usuario?: {
    id: number;
    nome: string;
  };
}

export interface ReceitaForm {
  id?: number;
  nome: string;
  tempoPreparoMinutos: number | null;
  porcoes: number | null;
  modoPreparo: string;
  ingredientes: string;
  idUsuarios: number | null;
  idCategorias?: number;
}

export interface PropsReceita {
  visible: boolean;
  handleClose: () => void;
  tipoForm: 'novo' | 'update';
  receita?: Receita;
}
