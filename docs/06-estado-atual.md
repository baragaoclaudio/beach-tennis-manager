# Beach Tennis Manager — Estado Atual

> Última atualização: 15/09/2026
>
> Status: Em desenvolvimento — fundação técnica e autenticação ADMIN implementadas; núcleo operacional do domínio ainda não implementado.

---

## 1. Visão geral

O **Beach Tennis Manager** é um sistema de gestão para uma operação de aulas de Beach Tennis.

O sistema tem como objetivo centralizar a gestão de:

- alunos;
- professores;
- turmas;
- aulas;
- presença;
- faltas;
- reposições;
- matrículas;
- ciclos de aulas;
- pagamentos;
- valores individuais;
- vagas;
- relatórios;
- futuramente, evolução técnica dos alunos e integrações externas.

O projeto possui dois objetivos principais:

1. atender a uma necessidade real de gestão de aulas de Beach Tennis;
2. servir como projeto profissional de portfólio, demonstrando arquitetura, desenvolvimento backend/frontend, banco de dados, testes, documentação, Git/GitHub e uso responsável de ferramentas de IA.

---

## 2. Objetivos técnicos

O projeto está sendo desenvolvido com foco em:

- código organizado e sustentável;
- separação de responsabilidades;
- boas práticas de arquitetura;
- segurança;
- testes automatizados;
- documentação técnica;
- versionamento com Git;
- desenvolvimento incremental;
- utilização de IA como ferramenta de apoio ao desenvolvimento.

A documentação de negócio e regras deve permanecer como fonte de verdade para o domínio.

---

## 3. Stack atual e decisões tecnológicas

Esta seção descreve as principais tecnologias utilizadas atualmente no projeto, o problema que cada uma resolve e o motivo de sua escolha.

A stack não deve ser entendida como um conjunto de tecnologias escolhidas isoladamente. As decisões foram tomadas considerando o domínio do sistema, a experiência prévia de desenvolvimento, o objetivo de aprendizado e a necessidade de construir um projeto profissional de portfólio.

### 3.1 Node.js

#### O que é?

Node.js é um ambiente de execução que permite executar JavaScript fora do navegador.

Tradicionalmente, JavaScript é associado ao frontend:

    Navegador
        ↓
    JavaScript

Com Node.js, JavaScript também pode ser executado no servidor:

    Servidor
        ↓
    Node.js
        ↓
    JavaScript / TypeScript

Isso permite utilizar JavaScript ou TypeScript para construir APIs, serviços e outras aplicações de backend.

#### Por que foi escolhido?

Node.js foi escolhido principalmente por:

- experiência prévia com JavaScript e TypeScript;
- possibilidade de utilizar a mesma linguagem no frontend e backend;
- forte presença no mercado;
- bom suporte ao desenvolvimento de APIs;
- ecossistema amplo.

A utilização de TypeScript no backend também permite aplicar tipagem ao domínio da aplicação.

#### Papel no projeto

Node.js é o ambiente de execução da API.

    TypeScript
        ↓
    Node.js
        ↓
    Fastify
        ↓
    API

---

### 3.2 TypeScript

#### O que é?

TypeScript é um superset do JavaScript que adiciona, entre outros recursos, tipagem estática.

Exemplo:

    function soma(a: number, b: number): number {
      return a + b;
    }

O compilador pode identificar diversos problemas antes da aplicação ser executada.

#### Por que foi escolhido?

O domínio do Beach Tennis Manager possui diversas entidades e relações:

    Professor
    Aluno
    Turma
    Matrícula
    Aula
    Ciclo
    Reposição
    Pagamento

A tipagem ajuda a tornar essas estruturas mais explícitas e previsíveis.

Além disso, TypeScript já faz parte da experiência técnica existente e é amplamente utilizado no mercado.

#### Papel no projeto

TypeScript é utilizado tanto no backend quanto no frontend:

    React + TypeScript
            ↓
          HTTP
            ↓
    Fastify + TypeScript

---

### 3.3 Fastify

#### O que é?

Fastify é um framework web para Node.js.

Ele fornece a estrutura necessária para construir a API HTTP, incluindo recursos relacionados a:

- rotas;
- requisições;
- respostas;
- hooks;
- plugins;
- validações e schemas;
- integração com TypeScript.

#### Por que foi escolhido?

Existem diversas opções para construção de APIs Node.js, como:

- Express;
- Fastify;
- NestJS;
- Hono.

Fastify foi escolhido por ser uma solução relativamente leve, explícita e adequada para uma API REST.

Também permite conhecer mais profundamente responsabilidades que frameworks mais completos podem esconder.

#### Papel no projeto

O fluxo geral da API é:

    HTTP Request
          ↓
       Fastify
          ↓
        Route
          ↓
      Application
          ↓
     Infrastructure
          ↓
     HTTP Response

A escolha também contribui para o objetivo de aprendizado de arquitetura backend.

---

### 3.4 React

#### O que é?

React é uma biblioteca para construção de interfaces de usuário.

A aplicação é organizada utilizando componentes.

Exemplo conceitual:

    App
    ├── Header
    ├── Sidebar
    ├── StudentList
    │   └── StudentCard
    └── StudentForm

#### Por que foi escolhido?

React foi escolhido por:

- ampla utilização no mercado;
- ecossistema consolidado;
- relevância profissional;
- experiência prévia com desenvolvimento frontend;
- oportunidade de aprofundar conhecimentos diferentes dos utilizados anteriormente com Angular.

#### Papel no projeto

React é responsável pela aplicação web utilizada pelos usuários do sistema.

---

### 3.5 Vite

#### O que é?

Vite é uma ferramenta de desenvolvimento e build para aplicações frontend modernas.

Ele fornece, entre outras coisas:

- servidor de desenvolvimento;
- Hot Module Replacement;
- processo de build;
- integração com TypeScript.

#### Por que foi escolhido?

Vite é uma solução moderna e simples para aplicações React.

O objetivo é ter uma infraestrutura frontend rápida e previsível sem transformar o bundler em uma preocupação central do projeto.

#### Papel no projeto

O fluxo é:

    React + TypeScript
            ↓
           Vite
            ↓
    Servidor de desenvolvimento
            ↓
    Build de produção

Atualmente o frontend é executado na porta `5173`.

---

### 3.6 PostgreSQL

#### O que é?

PostgreSQL é um sistema gerenciador de banco de dados relacional.

Ele é responsável por armazenar os dados persistentes da aplicação.

Exemplos de informações que futuramente estarão relacionadas no banco:

- Users;
- Professors;
- Students;
- Classes;
- Enrollments;
- Lessons;
- Payments.

#### Por que foi escolhido?

O domínio possui diversos relacionamentos e regras de integridade.

Por exemplo:

    Professor
        ↓
    Turma
        ↓
    Matrícula
        ↓
    Aluno

Também existem relações entre ciclos, aulas, pagamentos, faltas e reposições.

Um banco relacional é adequado para esse tipo de domínio.

PostgreSQL também é uma tecnologia madura e amplamente utilizada profissionalmente.

#### Por que não MongoDB?

MongoDB é uma alternativa válida, mas não foi escolhido porque o domínio possui forte característica relacional.

Por exemplo:

- uma matrícula pertence a um aluno;
- uma matrícula pertence a uma turma;
- uma turma pertence a um professor;
- um ciclo pertence a uma matrícula.

Essas relações e invariantes se encaixam naturalmente em um banco relacional.

#### Papel no projeto

PostgreSQL é o armazenamento persistente principal:

    Aplicação
        ↓
      Drizzle
        ↓
        SQL
        ↓
    PostgreSQL

A versão utilizada atualmente é PostgreSQL 16.

---

### 3.7 Drizzle ORM

#### O que é?

Drizzle é uma ferramenta de acesso a banco de dados para TypeScript, utilizada como ORM/toolkit.

ORM significa:

> Object-Relational Mapping.

O objetivo é permitir que a aplicação trabalhe com o banco utilizando estruturas integradas ao TypeScript, mantendo uma relação próxima com o modelo SQL.

#### Por que foi escolhido?

O projeto inicialmente utilizava Prisma, mas posteriormente foi realizada uma migração completa para Drizzle.

Drizzle foi escolhido por proporcionar:

- forte integração com TypeScript;
- tipagem;
- abordagem relativamente próxima do SQL;
- menor nível de abstração;
- maior explicitude nas operações de banco.

Essa escolha também é importante para o objetivo de aprendizado.

O projeto não deve esconder completamente o funcionamento do banco atrás de uma abstração.

A intenção é compreender a relação:

    TypeScript
        ↓
      Drizzle
        ↓
        SQL
        ↓
    PostgreSQL

#### Papel no projeto

Drizzle é responsável pela integração entre a aplicação e o PostgreSQL, além de participar da definição e evolução do schema através das migrations.

---

### 3.8 Zod

#### O que é?

Zod é uma biblioteca de validação de dados e definição de schemas para TypeScript.

Exemplo:

    const loginSchema = z.object({
      email: z.email(),
      password: z.string().min(1),
    });

#### Por que foi escolhido?

TypeScript realiza verificações principalmente durante o desenvolvimento e compilação.

Ele não garante que dados recebidos pela internet sejam realmente válidos em tempo de execução.

Por exemplo:

    {
      "email": 123,
      "password": null
    }

Uma API precisa validar esses dados em runtime.

O fluxo é:

    Request externa
          ↓
         Zod
          ↓
    Dados validados
          ↓
      Aplicação

#### Papel no projeto

Zod é utilizado para validar dados recebidos pela aplicação e reduzir a entrada de dados inválidos no domínio.

Uma distinção importante é:

> TypeScript fornece segurança de tipos durante o desenvolvimento; Zod permite validar dados externos durante a execução.

---

### 3.9 Vitest

#### O que é?

Vitest é o framework utilizado para testes automatizados.

Ele permite executar testes e verificar se o comportamento da aplicação corresponde ao esperado.

#### Por que foi escolhido?

Foi escolhido pela boa integração com o ecossistema TypeScript/Vite e pela simplicidade para criação e execução dos testes.

Também queremos utilizar testes desde as primeiras etapas do projeto, e não somente depois que todas as funcionalidades estiverem prontas.

#### Papel no projeto

Atualmente existem testes relacionados principalmente à autenticação.

A API possui testes envolvendo:

- JWT;
- login;
- refresh;
- rotação;
- reuse detection;
- logout;
- `/auth/me`.

O frontend possui testes relacionados a:

- cliente HTTP;
- refresh;
- single-flight;
- tratamento de erros de autenticação.

---

### 3.10 Docker Compose

#### O que é?

Docker permite executar aplicações e serviços isolados em containers.

Docker Compose permite definir e executar serviços relacionados de forma declarativa.

No projeto atual, o Compose é utilizado principalmente para executar o PostgreSQL.

    Docker Compose
          ↓
       PostgreSQL

Enquanto API e frontend são executados diretamente no ambiente de desenvolvimento:

    Node.js → máquina local
    React   → máquina local

#### Por que foi escolhido?

O objetivo é evitar uma instalação manual específica do PostgreSQL em cada máquina de desenvolvimento.

Com:

    docker compose up

o banco pode ser inicializado de forma previsível.

Docker Compose também facilita a reprodução do ambiente de desenvolvimento.

#### Papel no projeto

Atualmente o Compose fornece o PostgreSQL utilizado durante o desenvolvimento local.

---

### 3.11 npm Workspaces

#### O que é?

npm Workspaces é um recurso do npm para trabalhar com múltiplos projetos/pacotes dentro de um mesmo repositório.

O projeto utiliza um monorepo:

    apps/
    ├── api
    └── web

O `package.json` da raiz coordena os workspaces.

#### Por que foi escolhido?

Frontend e backend pertencem ao mesmo produto e são desenvolvidos conjuntamente.

O monorepo facilita:

- gerenciamento de dependências;
- execução de scripts;
- versionamento;
- organização do projeto;
- desenvolvimento conjunto.

Existe possibilidade futura de criação de pacotes compartilhados, como contratos, mas isso ainda não foi implementado.

#### Papel no projeto

O npm Workspace funciona como camada de organização do monorepo:

    Projeto
    ├── API
    └── Web

---

### 3.12 JWT

#### O que é?

JWT significa JSON Web Token.

É um formato de token utilizado para transportar informações assinadas entre partes.

No nosso caso:

    Login
      ↓
    Servidor cria JWT
      ↓
    Cookie
      ↓
    Browser

Depois:

    Request
      ↓
    JWT
      ↓
    Servidor verifica assinatura
      ↓
    Identidade

#### Por que foi escolhido?

Porque precisamos de um mecanismo de autenticação adequado para uma aplicação web moderna.

Nosso Access Token é:

- HS256;
- validade de 10 minutos;
- armazenado em cookie HttpOnly.

JWT não significa automaticamente que um sistema é seguro.

A segurança depende de fatores como:

- armazenamento;
- expiração;
- validação;
- rotação;
- revogação;
- proteção contra roubo e reutilização;
- configuração adequada dos cookies.

Por isso utilizamos também Refresh Token e reuse detection.

---

### 3.13 Refresh Token

#### O que é?

É um token utilizado para obter um novo Access Token sem exigir que o usuário faça login novamente.

Nossa arquitetura utiliza:

    Access Token
    10 minutos

    Refresh Token
    8 horas

Quando o Access Token expira:

    Access expirou
          ↓
        Refresh
          ↓
    novo Access Token
          +
    novo Refresh Token

#### Por que foi escolhido?

Não queremos deixar um Access Token válido por muitas horas.

Um Access Token curto reduz a janela de utilização caso seja comprometido.

O Refresh Token permite manter a sessão do usuário sem exigir login novamente a cada expiração do Access Token.

---

### 3.14 jose

#### O que é?

`jose` é uma biblioteca JavaScript/TypeScript para trabalhar com padrões JOSE, incluindo JWT/JWS/JWE.

É utilizada no projeto para:

- assinar JWT;
- verificar JWT;
- trabalhar com algoritmos criptográficos suportados.

#### Por que foi escolhido?

Não queremos implementar criptografia ou os protocolos JWT manualmente.

A regra é utilizar bibliotecas maduras para operações criptográficas e de segurança.

---

### 3.15 Argon2

#### O que é?

Argon2 é um algoritmo de hash de senha projetado especificamente para armazenamento seguro de credenciais.

O fluxo é:

    Senha
      ↓
    Argon2
      ↓
    Hash
      ↓
    Banco

A senha original não é armazenada.

#### Por que foi escolhido?

Senhas devem ser armazenadas utilizando um algoritmo específico para password hashing, com custo computacional e de memória configurável.

No projeto:

    Senha → Argon2
    Refresh Token → SHA-256

São problemas diferentes e, portanto, utilizam mecanismos diferentes.

---

### 3.16 Cookies HttpOnly

#### O que são?

Cookies são informações armazenadas pelo navegador e enviadas automaticamente nas requisições correspondentes.

Quando configurados como `HttpOnly`, não podem ser acessados diretamente pelo JavaScript da página.

No projeto utilizamos:

- `btm_access`;
- `btm_refresh`.

#### Por que foram escolhidos?

Não queremos deixar os tokens disponíveis diretamente para o JavaScript da aplicação.

Também utilizamos:

- `HttpOnly`;
- `SameSite=Lax`;
- `Path=/`;
- `Secure` em produção.

---

# 4. Estrutura atual do projeto

O projeto utiliza um monorepo com aplicações separadas para backend e frontend.

Estrutura simplificada atual:

    beach-tennis-manager/
    ├── apps/
    │   ├── api/
    │   │   ├── src/
    │   │   │   ├── modules/
    │   │   │   │   └── auth/
    │   │   │   └── infrastructure/
    │   │   └── drizzle/
    │   │       └── migrations/
    │   │
    │   └── web/
    │
    ├── docs/
    │   ├── 01-visao-e-requisitos.md
    │   ├── 02-regras-de-negocio.md
    │   ├── 03-modelo-de-dominio.md
    │   ├── 04-arquitetura.md
    │   ├── 05-roadmap.md
    │   └── 06-estado-atual.md
    │
    ├── .cursor/
    │   └── rules/
    │       └── projeto-global.mdc
    │
    ├── README.md
    ├── docker-compose.yml
    ├── package.json
    └── .env

Os módulos de domínio, como alunos, turmas e aulas, ainda não foram implementados.

---

# 5. Estado atual da autenticação

A autenticação inicial do sistema está implementada para o papel `ADMIN`.

Atualmente existem os seguintes endpoints:

    POST /auth/admin/login
    GET  /auth/me
    POST /auth/refresh
    POST /auth/logout

## 5.1 Access Token

O Access Token é um JWT com:

- algoritmo HS256;
- validade de 10 minutos;
- armazenamento em cookie HttpOnly;
- cookie `btm_access`.

Claims utilizados:

    sub
    email
    role
    iat
    exp

O segredo utilizado para assinatura é fornecido pela variável de ambiente `JWT_SECRET`, com exigência mínima de 32 caracteres.

---

## 5.2 Refresh Token

O Refresh Token é um token opaco aleatório.

Características:

- validade de 8 horas;
- cookie `btm_refresh`;
- HttpOnly;
- SameSite=Lax;
- Path `/`;
- Secure em produção.

O token original não é armazenado diretamente no banco.

Somente seu hash SHA-256 é persistido.

---

## 5.3 Rotação de Refresh Token

O Refresh Token é rotacionado a cada utilização.

Os tokens pertencem a uma família e a persistência utiliza informações como:

- `family_id`;
- `replaced_by_id`;
- `revoked_at`;
- `expires_at`.

A rotação ocorre em transação com bloqueio da linha correspondente.

---

## 5.4 Reuse Detection

Quando um Refresh Token já utilizado é apresentado novamente, o sistema identifica uma possível reutilização indevida.

Nesse caso:

- a família de tokens é revogada;
- a requisição retorna HTTP `409`;
- nenhum novo token é emitido.

Outras falhas relacionadas ao refresh retornam HTTP `401`.

---

## 5.5 Cookies e transporte

Os tokens não são enviados no corpo JSON das respostas de login ou refresh.

O corpo dessas operações contém somente os dados do usuário.

O frontend não acessa os tokens diretamente.

Não são utilizados:

- `localStorage`;
- `sessionStorage`;
- `Authorization: Bearer`.

As requisições utilizam:

    credentials: include

---

## 5.6 `/auth/me`

O endpoint `/auth/me`:

1. valida o JWT;
2. obtém a identidade através do `sub`;
3. consulta novamente o usuário no banco;
4. verifica o estado atual do usuário, incluindo `isActive`.

O papel presente no JWT, portanto, não é utilizado isoladamente como fonte de autorização atual do usuário.

---

## 5.7 Logout

O endpoint:

    POST /auth/logout

é idempotente e retorna:

    204 No Content

Quando existe um Refresh Token válido apresentado pelo cliente, ele é revogado.

Os cookies de autenticação são limpos.

O Access Token já emitido não é revogado imediatamente e permanece válido até sua expiração natural.

---

# 6. Estado atual do frontend

O frontend possui:

- aplicação React;
- Vite;
- tela de login ADMIN;
- cliente HTTP centralizado;
- envio automático de cookies;
- renovação automática de sessão.

Quando uma requisição recebe HTTP `401`, o cliente tenta utilizar:

    POST /auth/refresh

Após um refresh bem-sucedido, a requisição original pode ser repetida.

O cliente utiliza mecanismo de **single-flight** para evitar múltiplas operações de refresh concorrentes.

Quando o refresh retorna HTTP `409`, o cliente considera a sessão comprometida, bloqueia novas tentativas automáticas de refresh e direciona o usuário para o login.

O Vite possui proxy para encaminhar as requisições de `/auth` para a API.

---

# 7. Estado atual do banco de dados

A persistência utiliza:

- PostgreSQL;
- Drizzle ORM;
- migrations.

Entre as estruturas já existentes estão:

    users
    professors
    refresh_tokens

A tabela `refresh_tokens` é utilizada para persistir o estado dos Refresh Tokens.

Entre os dados utilizados estão:

- `family_id`;
- `replaced_by_id`;
- `revoked_at`;
- `expires_at`;
- hash único do token.

O modelo geral do domínio ainda não foi implementado completamente.

---

# 8. Estado atual do ambiente

O ambiente de desenvolvimento utiliza PostgreSQL através do Docker Compose.

As principais variáveis de ambiente incluem:

    JWT_SECRET
    ADMIN_EMAIL
    ADMIN_PASSWORD
    DATABASE_URL

A configuração do ambiente é carregada a partir do `.env` na raiz do monorepo.

O seed utiliza `ADMIN_EMAIL` e `ADMIN_PASSWORD` para criar ou atualizar o usuário administrativo inicial.

Principais comandos:

    npm run dev
    npm run drizzle:migrate
    npm run drizzle:seed

O comando:

    npm run dev

executa API e frontend em paralelo.

Portas atuais:

    API       → 3333
    Frontend  → 5173

Health check:

    GET /health

---

# 9. Estado atual dos testes

Existem testes automatizados para a autenticação.

A API possui cobertura relacionada a:

- criação e validação de JWT;
- autenticação;
- refresh;
- rotação;
- reuse detection;
- logout;
- `/auth/me`.

O frontend possui testes relacionados a:

- cliente HTTP;
- refresh automático;
- single-flight;
- tratamento de falhas de refresh.

O último estado validado possui:

- 41 testes na API;
- 14 testes no frontend.

Também foram realizados testes manuais no navegador para:

- login;
- logout;
- persistência da autenticação durante F5;
- refresh após remoção do Access Token;
- presença dos cookies de autenticação.

---

# 10. Regras de negócio já definidas

As regras completas do domínio estão documentadas em:

    docs/02-regras-de-negocio.md

Entre as principais definições estão:

## 10.1 Turmas

- capacidade máxima de 4 alunos ativos;
- turmas podem possuir vagas disponíveis;
- cada turma possui preço padrão.

## 10.2 Matrículas

- um aluno pode possuir múltiplas matrículas;
- uma matrícula pode possuir condições comerciais próprias;
- o preço efetivamente utilizado deve ser preservado no histórico dos ciclos.

## 10.3 Ciclos

A mensalidade é tratada como um ciclo de 4 aulas pré-pagas.

O ciclo não necessariamente corresponde a um mês do calendário.

O ciclo começa quando ocorre a primeira aula efetivamente realizada ou utilizada como parte daquele ciclo.

O pagamento pode ocorrer antes do início do ciclo.

As configurações operacionais aplicáveis são determinadas no início do ciclo e permanecem congeladas para aquele ciclo.

## 10.4 Feriados

Feriados:

- não consomem uma das quatro aulas;
- não geram crédito individual;
- estendem o ciclo.

## 10.5 Faltas e reposições

Uma ausência pode gerar crédito de reposição quando respeitadas as regras de aviso prévio configuradas.

O crédito pertence à matrícula que originou a ausência.

O crédito não pode ser transferido para outra matrícula do mesmo aluno.

A reposição pode utilizar uma vaga disponível em outra turma do mesmo professor.

O professor não é obrigado a criar uma aula adicional exclusivamente para reposição.

## 10.6 Limite de reposições

Existe um limite configurável de:

> Máximo de reposições por ciclo.

A configuração pode possuir:

- valor global;
- configuração específica por professor.

## 10.7 Prazo mínimo de aviso

Existe uma configuração de prazo mínimo de aviso em horas.

O valor não é fixo e pode ser configurado de acordo com as regras estabelecidas para a operação.

---

# 11. Papéis e autorização

O sistema possui os papéis:

    ADMIN
    PROFESSOR

O `ADMIN` possui visão global da operação.

O `PROFESSOR` deverá possuir acesso restrito aos dados relacionados à própria operação.

Essa regra está definida no domínio.

Porém, atualmente:

- login de PROFESSOR ainda não foi implementado;
- middleware de autenticação para rotas de domínio ainda não foi implementado;
- autorização dos recursos de domínio ainda não foi implementada;
- isolamento efetivo dos dados por professor ainda não foi implementado.

Portanto, a existência da regra de isolamento não significa que ela já esteja aplicada tecnicamente nas rotas de domínio.

---

# 12. Funcionalidades implementadas

## Infraestrutura

- [x] Monorepo
- [x] npm Workspaces
- [x] Backend Fastify
- [x] Frontend React/Vite
- [x] PostgreSQL
- [x] Docker Compose
- [x] Drizzle ORM
- [x] Migrations
- [x] Seed
- [x] Configuração de ambiente
- [x] Scripts de desenvolvimento
- [x] Health check

## Autenticação ADMIN

- [x] Login ADMIN
- [x] Hash de senha com Argon2
- [x] JWT Access Token
- [x] Refresh Token
- [x] Cookies HttpOnly
- [x] Rotação de Refresh Token
- [x] Famílias de Refresh Token
- [x] Reuse Detection
- [x] Revogação de família
- [x] `/auth/me`
- [x] Logout
- [x] Refresh automático no frontend
- [x] Single-flight
- [x] Testes automatizados

## Núcleo de domínio

Ainda não implementado.

---

# 13. Funcionalidades pendentes

## Autenticação e autorização

- [ ] Login de PROFESSOR
- [ ] Middleware/contexto de autenticação nas rotas de domínio
- [ ] Autorização dos recursos de domínio
- [ ] Isolamento efetivo por professor
- [ ] Permissões detalhadas de ADMIN

## Núcleo operacional

- [ ] Professores
- [ ] Alunos
- [ ] Turmas
- [ ] Matrículas
- [ ] Aulas
- [ ] Presença
- [ ] Faltas
- [ ] Reposições
- [ ] Ciclos
- [ ] Pagamentos
- [ ] Financeiro
- [ ] Relatórios

## Infraestrutura futura

- [ ] OpenAPI
- [ ] CI/CD
- [ ] Contratos compartilhados
- [ ] Observabilidade avançada

## Integrações futuras

- [ ] WhatsApp
- [ ] Integração com pagamentos
- [ ] Outros serviços externos

---

# 14. Dívidas técnicas conhecidas

A migração da autenticação baseada em sessão para JWT + Refresh Token foi realizada de forma incremental.

Ainda existem elementos residuais da implementação anterior:

    btm_session
    SessionRepository

Esses elementos deverão ser removidos em uma etapa futura após a conclusão da migração.

Também permanecem pendências relacionadas a:

- middleware de autorização de domínio;
- login de PROFESSOR;
- isolamento efetivo;
- OpenAPI;
- handler global de erros;
- testes adicionais de persistência.

---

# 15. Estado do roadmap

| Fase | Status |
|---|---|
| Fase 0 — Estrutura inicial/infraestrutura | ✅ Concluída |
| Fase 1 — Estrutura inicial das aplicações | ✅ Concluída |
| Fase 2 — Backend base e contrato HTTP | 🟡 Parcialmente concluída |
| Fase 3 — PostgreSQL e persistência base | 🟡 Parcialmente concluída |
| Fase 4 — Autenticação ADMIN | 🟡 Implementação ADMIN concluída; professor/autorização pendentes |
| Fase 5 — Isolamento por professor | ⏳ Pendente |
| Fases posteriores | ⏳ Planejadas |

O roadmap completo e detalhado permanece em:

    docs/05-roadmap.md

---

# 16. Próximo passo

O próximo grande objetivo é iniciar o núcleo operacional do domínio.

A base esperada é:

    User
      ↓
    Professor
      ↓
    Turma
      ↓
    Matrícula
      ↓
    Aluno

Essa estrutura servirá de base para posteriormente implementar:

    Aulas
      ↓
    Presença/Faltas
      ↓
    Reposições
      ↓
    Ciclos
      ↓
    Pagamentos
      ↓
    Financeiro

A implementação deve continuar de forma incremental:

    Regra de negócio
          ↓
    Modelo de domínio
          ↓
    Persistência
          ↓
    Caso de uso
          ↓
    API
          ↓
    Testes
          ↓
    Documentação
          ↓
    Commit

---

# 17. Princípio de desenvolvimento

O projeto deve manter uma separação clara entre:

## Requisitos e regras de negócio

Documentados principalmente em:

    docs/01-visao-e-requisitos.md
    docs/02-regras-de-negocio.md
    docs/03-modelo-de-dominio.md

## Decisões e arquitetura técnica

Documentadas principalmente em:

    docs/04-arquitetura.md

## Planejamento

Documentado em:

    docs/05-roadmap.md

## Estado atual

Documentado neste arquivo:

    docs/06-estado-atual.md

Essa separação evita que decisões técnicas sejam confundidas com regras de negócio e permite acompanhar a evolução real do projeto.

---

# 18. Princípio de evolução do projeto

O estado descrito neste documento representa o momento atual do desenvolvimento.

Conforme novas funcionalidades forem implementadas, este arquivo deve ser atualizado para refletir:

- novas decisões técnicas;
- novas funcionalidades concluídas;
- novas dívidas técnicas;
- mudanças de arquitetura;
- evolução do roadmap;
- alterações relevantes no ambiente;
- mudanças importantes na estratégia de desenvolvimento.

O documento não substitui a documentação específica de requisitos, regras de negócio, arquitetura ou roadmap.

Ele funciona como um **checkpoint consolidado do estado atual do projeto**.