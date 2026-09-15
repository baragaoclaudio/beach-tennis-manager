# Beach Tennis Manager

## Requisitos

- Node.js 20 ou superior;
- npm 10 ou superior;
- Docker Desktop com Compose.

## Configuração local

1. Copie `.env.example` para `.env`. Ajuste pelo menos `JWT_SECRET` (mínimo de 32 caracteres), `ADMIN_EMAIL` e `ADMIN_PASSWORD` (mínimo de 12 caracteres no seed).
2. Instale as dependências com `npm install`.
3. Inicie o PostgreSQL com `docker compose up -d`.
4. Aplique as migrations: `npm run drizzle:migrate -w @beach-tennis-manager/api`.
5. Crie ou atualize o administrador de desenvolvimento: `npm run drizzle:seed -w @beach-tennis-manager/api`.

O seed usa `ADMIN_EMAIL` e `ADMIN_PASSWORD` do `.env` na raiz do repositório.

## Comandos

- `npm run dev`: inicia a API e o frontend em paralelo;
- `npm run build`: gera os builds;
- `npm run typecheck`: verifica os tipos;
- `npm test`: executa os testes;
- `docker compose down`: para o PostgreSQL;
- `docker compose down -v`: para o PostgreSQL e remove o volume local.

## Aplicações

- API: [http://localhost:3333](http://localhost:3333) — `GET /health` responde `{ "status": "ok" }`.
- Frontend: [http://localhost:5173](http://localhost:5173).

A autenticação disponível nesta etapa é somente para `ADMIN`, pelo login na aplicação web. Login de `PROFESSOR` e o núcleo operacional (alunos, turmas, aulas, ciclos, financeiro) ainda não estão implementados.
