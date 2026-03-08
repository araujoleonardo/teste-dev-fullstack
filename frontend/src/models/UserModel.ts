export class UserModel {
  nome: string;
  login: string;
  senha: string;

  constructor(data: Partial<UserModel> = {}) {
    this.nome = data.nome || "";
    this.login = data.login || "";
    this.senha = data.senha || "";
  }
}
