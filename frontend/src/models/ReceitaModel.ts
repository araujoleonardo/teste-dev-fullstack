import type { ReceitaForm } from "@/types/receita-data";

export class ReceitaModel implements ReceitaForm {
  id?: number;
  nome: string;
  tempoPreparoMinutos: number | null;
  porcoes: number | null;
  modoPreparo: string;
  ingredientes: string;
  idUsuarios: number | null;
  idCategorias?: number;

  constructor(data: Partial<ReceitaForm> = {}) {
    this.id = data.id;
    this.nome = data.nome || "";
    this.tempoPreparoMinutos = data.tempoPreparoMinutos ?? null;
    this.porcoes = data.porcoes ?? null;
    this.modoPreparo = data.modoPreparo || "";
    this.ingredientes = data.ingredientes || "";
    this.idUsuarios = data.idUsuarios ?? null;
    this.idCategorias = data.idCategorias ?? undefined;
  }
}
