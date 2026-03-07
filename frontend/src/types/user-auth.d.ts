export interface UserAuth {
  id: string;
  nome: string;
  login: string;
  senha: string;
}

export interface ResponseToken {
  access_token: string;
  expires_in: number;
}

