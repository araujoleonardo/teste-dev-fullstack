export class CategoriaModel {
  id?: number | string
  nome?: string;

  constructor(data: Partial<CategoriaModel> = {}) {
    this.id = data.id || undefined;
    this.nome = data.nome || undefined;
  }
}
