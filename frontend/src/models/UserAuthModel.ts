export class UserAuthModel {
  id: string;
  nome: string;
  login: string;
  senha: string;

  constructor(data: Partial<UserAuthModel> = {}) {
    this.id = data.id || '';
    this.nome = data.nome || '';
    this.login = data.login || '';
    this.senha = data.senha || '';
  }
}
