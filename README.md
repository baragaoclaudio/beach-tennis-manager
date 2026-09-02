# Beach Tennis Manager

## Requisitos

- Node.js 20 ou superior;
- npm 10 ou superior;
- Docker Desktop com Compose.

## Configuração local

1. Copie `.env.example` para `.env` quando precisar customizar as variáveis.
2. Instale as dependências com `npm install`.
3. Inicie o PostgreSQL com `docker compose up -d`.

## Comandos

- `npm run dev`: inicia os apps em modo de desenvolvimento;
- `npm run build`: gera os builds;
- `npm run typecheck`: verifica os tipos;
- `npm test`: executa os testes;
- `docker compose down`: para o PostgreSQL;
- `docker compose down -v`: para o PostgreSQL e remove o volume local.

A API expõe `GET /health` na porta `3333`.