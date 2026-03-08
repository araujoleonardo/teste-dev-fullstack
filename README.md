# Teste Dev Fullstack — Gerenciador de Receitas

Projeto fullstack para gerenciar receitas culinárias. O backend é uma API REST feita com NestJS e o frontend é uma SPA em Vue 3. Banco de dados MySQL, cache/autenticação via Redis, tudo orquestrado com Docker.

---

## Tecnologias usadas

**Backend:** NestJS, TypeORM, MySQL 8, Redis, JWT (Passport), bcrypt, Swagger

**Frontend:** Vue 3 (Composition API), Pinia, Vue Router 4, Axios, Tailwind CSS 4, Vitest

---

## Como rodar

### Apos clonar o projeto abra na raiz
Primeiro, copie o `.env` do backend:

```bash
cp backend/.env.example backend/.env
```

Depois sobe tudo com Docker através do docker-compose.yml que se encontra na raiz do rpojeto:

```bash
docker compose up -d
```

Pronto. Os serviços ficam em:

- Frontend: http://localhost:3000
- API: http://localhost:4000
- Swagger: http://localhost:4000/doc
- phpMyAdmin: http://localhost:8080

> Usuário do phpMyAdmin: `root` / Senha: `123`

---

## Banco de dados

Ao subir o projeto é preciso rodar as migrations e os seeds:

```bash
# Cria as tabelas
docker exec -it api-node npm run migration:run

# Popula com dados iniciais para categorias
docker exec -it api-node npm run seed
```

Para gerar uma nova migration depois de alterar alguma entidade:

```bash
docker exec -it api-node npm run migration:generate
```

---

## Testes

### Backend

Os testes unitários mocam tudo (repositórios, Redis, JWT) e rodam sem depender do banco:

```bash
docker exec -it api-node npm run test
```

Os testes E2E sobem o NestJS completo com SQLite em memória e um Redis mockado:

```bash
docker exec -it api-node npm run test:e2e
```

Para mostrar os detalhes:

```bash
docker exec -it api-node npm run test:e2e -- --verbose --runInBand
```

### Frontend

```bash
docker exec -it app-vue npm run test
```

---

## Sobre a autenticação

O login retorna um JWT que é salvo em cookie. Nas rotas protegidas o token é enviado via `Authorization: Bearer`. O logout adiciona o token na blacklist do Redis e ele fica inválido até expirar.

---

## Referências

- https://docs.nestjs.com/
- https://typeorm.io/docs/getting-started
- https://redis.io/docs/latest/develop/clients/nodejs/
- https://vuejs.org/
- https://vitest.dev/
- https://merakiui.com/components
- https://readymadeui.com/
