# Beach Tennis Manager — Arquitetura Técnica

## 1. Objetivo e princípios arquiteturais

Este documento apresenta uma proposta de arquitetura técnica para o Beach Tennis Manager, considerando os requisitos e as regras documentados em:

- `docs/01-visao-e-requisitos.md`;
- `docs/02-regras-de-negocio.md`;
- `docs/03-modelo-de-dominio.md`.

A arquitetura deve apoiar uma operação real de aulas de Beach Tennis e também servir como projeto profissional de portfólio.

Princípios propostos:

- manter as regras de negócio independentes de framework e banco de dados;
- concentrar autenticação, autorização e isolamento de dados no backend;
- preferir um monólito modular simples a microserviços;
- separar domínio, casos de uso, entrada/saída e infraestrutura;
- preservar informações históricas, especialmente valores e configurações de ciclos;
- validar dados na fronteira da aplicação e também proteger invariantes no domínio;
- favorecer testes automatizados das regras principais;
- manter contratos explícitos entre frontend e backend;
- evitar que decisões técnicas sejam confundidas com regras de negócio;
- permitir evolução sem exigir reescrita completa.

As regras de negócio documentadas são a fonte de verdade. Quando houver diferença entre a lista inicial de questões do documento de visão e uma regra posteriormente definida em `docs/02-regras-de-negocio.md`, deve prevalecer a regra definida no documento de regras.

## 2. Visão geral da arquitetura

### Decisão proposta: monólito modular

A primeira versão deve ser organizada como uma aplicação monolítica modular:

```text
[ React + TypeScript ]
          │ HTTP/JSON
          ▼
[ Node.js + TypeScript + Fastify ]
          │
          ▼
[ Camada de persistência ]
          │
          ▼
[ PostgreSQL ]
```

O frontend e o backend podem ser implantados separadamente, mas pertencem inicialmente ao mesmo produto e compartilham contratos documentados. O backend concentra os casos de uso e as regras do domínio. O PostgreSQL armazena o estado e o histórico persistente.

Microserviços, mensageria e processamento distribuído não são necessários para o escopo inicial. Poderão ser avaliados no futuro caso surjam necessidades reais de escala, isolamento operacional ou processamento assíncrono.

## 3. Responsabilidades das partes

### Frontend

O frontend será responsável por:

- apresentar turmas, alunos, matrículas, aulas, ciclos, pagamentos e reposições permitidos ao usuário;
- coletar e exibir dados de entrada;
- conduzir fluxos de interação;
- apresentar erros de validação e falhas da API;
- manter estado de tela e navegação;
- solicitar dados ao backend;
- adaptar a experiência para computadores e dispositivos móveis.

O frontend não é responsável por segurança, autorização ou isolamento de dados. Ocultar uma tela ou botão não substitui a validação no backend.

### Backend

O backend será responsável por:

- autenticação;
- autorização baseada em papéis;
- isolamento dos dados entre professores;
- validação de entrada;
- execução dos casos de uso;
- aplicação das regras de negócio;
- resolução das configurações global e específica do professor;
- congelamento das configurações aplicáveis no início do ciclo;
- controle de transações e persistência;
- tratamento uniforme de erros;
- disponibilização da API REST;
- auditoria e logging técnico conforme necessário.

### Banco de dados

O banco será responsável por persistir:

- identidades e papéis;
- professores e alunos;
- turmas, matrículas e aulas;
- registros de participação;
- ciclos, pagamentos e créditos de reposição;
- configurações globais e por professor;
- informações históricas necessárias ao domínio.

O banco não deve ser usado como substituto da camada de domínio. Restrições de persistência podem reforçar invariantes, mas o comportamento do negócio deve permanecer explícito nos casos de uso e no domínio.

## 4. Organização conceitual do backend

A organização proposta é baseada em módulos de negócio e camadas:

```text
Interface HTTP
    ↓
Casos de uso
    ↓
Domínio
    ↓
Portas de persistência e serviços
    ↓
Infraestrutura
```

### Interface HTTP

Inclui a integração com Fastify:

- rotas;
- handlers ou controllers;
- schemas de request e response;
- autenticação da requisição;
- conversão entre HTTP e objetos de aplicação;
- mapeamento de erros para respostas HTTP.

Essa camada não deve conter a regra completa de ciclo, reposição ou cálculo de direito.

### Casos de uso

Coordenam ações solicitadas pelo usuário, por exemplo:

- cadastrar ou atualizar aluno;
- criar e administrar turma;
- realizar matrícula;
- registrar aula;
- registrar presença ou ausência;
- iniciar ou atualizar o ciclo conforme o evento de aula efetivamente realizada ou utilizada;
- registrar pagamento;
- avaliar ausência e gerar crédito quando aplicável;
- utilizar crédito em aula com vaga;
- configurar regra global ou específica do professor;
- consultar relatórios permitidos.

Os nomes acima são exemplos de fronteiras de aplicação, não uma definição final da API.

### Domínio

Contém as entidades e comportamentos conceituais descritos no modelo de domínio:

- Usuário;
- Professor;
- Aluno;
- Turma;
- Matrícula;
- Aula;
- Registro de Participação;
- Ciclo de cobrança;
- Pagamento;
- Crédito de Reposição;
- Configuração Global;
- Configuração por Professor.

Também deve conter políticas ou serviços de domínio quando uma regra envolver mais de uma entidade, como resolver a configuração efetiva, verificar vaga ou avaliar o direito à reposição.

Não é necessário criar uma camada ou serviço artificial para cada entidade. A divisão deve refletir responsabilidades e casos de uso reais.

### Portas e infraestrutura

As camadas internas devem depender de abstrações para acesso a dados e serviços externos. Implementações concretas ficam na infraestrutura, incluindo:

- cliente do PostgreSQL;
- ORM ou query builder escolhido;
- repositórios;
- gerenciamento de transações;
- hashing e verificação de credenciais;
- geração e validação de tokens;
- armazenamento de comprovantes, se definido posteriormente;
- logger e configuração da aplicação.

## 5. Organização conceitual do frontend

A aplicação React deve ser organizada por funcionalidades do domínio, evitando uma única camada global de componentes sem contexto.

Organização proposta:

- páginas e rotas da aplicação;
- componentes de tela e componentes compartilhados;
- formulários e validações de apresentação;
- clientes da API e contratos de transporte;
- estado de autenticação e sessão;
- estado de dados remotos e cache;
- tratamento de carregamento, vazio e erro;
- estilos e layout responsivo.

Módulos de interface podem acompanhar as áreas de alunos, professores, turmas, matrículas, aulas, ciclos, pagamentos, reposições, configurações e relatórios.

A interface pode oferecer validações antecipadas para melhorar a experiência, mas o backend continua sendo a autoridade para validar regras e permissões.

## 6. Comunicação entre frontend e backend

A comunicação será feita por HTTP usando JSON, salvo necessidades futuras documentadas.

Princípios propostos:

- usar HTTPS fora do ambiente local;
- enviar credenciais de sessão de forma segura;
- manter contratos de request e response versionáveis;
- representar datas e valores monetários sem ambiguidades;
- distinguir erro de validação, não autenticação, não autorização, conflito e falha interna;
- não enviar ao frontend dados que o usuário não tem autorização para consultar;
- tratar estados de carregamento, sucesso, vazio e erro.

O frontend não deve calcular como autoridade o limite de reposições, o prazo mínimo de ausência, o valor histórico do ciclo ou o direito à reposição. Esses resultados devem vir do backend.

## 7. API REST

### Decisão proposta

Usar uma API REST orientada a recursos do domínio, com respostas JSON e contratos documentados.

Recursos conceituais:

- usuários e sessão;
- professores;
- alunos;
- turmas;
- matrículas;
- aulas;
- registros de participação;
- ciclos de cobrança;
- pagamentos;
- créditos de reposição;
- configurações globais;
- configurações por professor;
- relatórios.

A API deve tratar ações que representam comportamentos do domínio por casos de uso explícitos, sem expor diretamente operações genéricas de banco de dados.

Boas práticas propostas:

- usar métodos HTTP conforme a intenção da operação;
- retornar códigos HTTP coerentes;
- validar payloads e parâmetros;
- aplicar paginação e filtros quando consultas puderem crescer;
- não vazar dados de outro professor em listas, detalhes, filtros ou relatórios;
- definir estratégia de compatibilidade quando contratos evoluírem.

### Ponto em aberto

A documentação de negócio não define a lista final de endpoints, convenções de versionamento, paginação, ordenação ou filtros. Esses detalhes devem ser definidos ao desenhar a API concreta.

## 8. Autenticação e autorização

### Autenticação

O backend deve autenticar usuários e associar cada requisição a uma identidade autenticada. Credenciais não devem ser armazenadas em texto puro; devem ser protegidas por mecanismo apropriado de hashing.

A estratégia de sessão, por cookie seguro ou token, ainda não está definida na documentação.

### Autorização

A autorização deve considerar o papel do usuário:

- `PROFESSOR`: acesso à própria operação, conforme as relações permitidas;
- `ADMIN`: acesso global, incluindo consulta de professores, alunos, turmas e relatórios consolidados e administração das configurações globais.

A autorização deve ser verificada no backend em cada caso de uso relevante. Deve existir uma distinção clara entre estar autenticado e poder acessar ou alterar determinado recurso.

### Ponto em aberto

A documentação não define permissões detalhadas por ação, inclusive se o administrador poderá editar dados financeiros de qualquer professor. Isso deve ser decidido antes da implementação dessas operações.

## 9. Isolamento de dados entre professores

O professor responsável deve ser identificado de forma confiável a partir da sessão autenticada, nunca de um identificador enviado pelo frontend como única proteção.

O backend deve aplicar o escopo do professor:

- em consultas de turmas, alunos relacionados, matrículas e aulas;
- em presenças, ausências, reposições e pagamentos;
- em configurações específicas;
- em relatórios e agregações;
- em operações de criação, alteração e encerramento.

A relação aluno-professor ocorre por meio das matrículas. O mesmo aluno pode aparecer para mais de um professor, sem duplicação cadastral. Isso exige que consultas respeitem o relacionamento operacional do professor e não tratem o cadastro global do aluno como autorização automática para todos os seus dados.

Administradores possuem visão global conforme as regras documentadas.

Testes de autorização devem tentar acessar recursos de outro professor e verificar que o backend nega ou não expõe os dados, conforme o contrato definido.

## 10. Validação de dados

A validação deve ocorrer em níveis complementares:

1. validação de transporte: formato, tipos, campos obrigatórios e limites de entrada;
2. validação de aplicação: existência, relações, permissões e pré-condições do caso de uso;
3. validação de domínio: invariantes e regras de negócio;
4. restrições de persistência: integridade referencial e unicidade que possam ser reforçadas pelo banco.

Regras que devem ser preservadas pelo backend incluem:

- CPF único entre alunos;
- capacidade máxima de quatro alunos ativos na turma;
- matrícula relacionando aluno, professor e turma;
- ciclo com direito a quatro aulas;
- valor efetivamente cobrado preservado no ciclo;
- configuração específica com prioridade sobre a global;
- snapshot das configurações no início do ciclo;
- ausência avaliando o prazo congelado no ciclo;
- crédito vinculado à matrícula e ao ciclo de origem;
- crédito usado somente em turma do mesmo professor e com vaga;
- feriado sem iniciar ciclo e sem consumir aula;
- ciclo encerrado sem alteração automática retroativa.

Validações de formato não devem ser apresentadas como regras de negócio novas. Quando a documentação não definir um detalhe, ele deve ser registrado como decisão técnica ou ponto em aberto.

## 11. Persistência e acesso ao banco

### PostgreSQL

PostgreSQL é a base proposta para persistência transacional do sistema. Deve armazenar os dados operacionais e históricos com integridade referencial, transações e controles de acesso adequados.

A modelagem concreta de tabelas, colunas e migrations não faz parte deste documento.

### ORM

#### Decisão proposta: avaliar Prisma

Prisma é um candidato adequado porque oferece:

- integração madura com TypeScript;
- schema declarativo;
- client tipado;
- suporte a PostgreSQL;
- migrations e ferramentas úteis para desenvolvimento;
- boa apresentação para um projeto de portfólio.

A camada de aplicação não deve depender diretamente do client do ORM em todos os casos. Repositórios e serviços de infraestrutura devem limitar o acoplamento e permitir testes mais simples.

#### Ponto em aberto

A escolha entre Prisma, outro ORM ou query builder ainda não foi formalmente tomada. Antes de decidir, devem ser comparados requisitos de transações, consultas, migrations, testes, desempenho e familiaridade da equipe.

### Transações

Operações que alterem mais de um elemento relacionado devem ser atômicas. Isso é especialmente relevante para:

- registrar participação e gerar crédito quando aplicável;
- utilizar crédito e registrar a aula de reposição;
- iniciar ciclo e persistir suas configurações congeladas;
- registrar pagamento e sua relação com o ciclo.

A fronteira exata de cada transação deve acompanhar o caso de uso, sem espalhar controle transacional pelo frontend.

## 12. Tratamento de erros

O backend deve possuir um formato consistente para erros, contendo ao menos uma categoria estável e uma mensagem adequada para apresentação ou logging.

Categorias conceituais:

- entrada inválida;
- autenticação ausente ou inválida;
- autorização negada;
- recurso não encontrado;
- conflito de estado ou unicidade;
- regra de negócio não permitida;
- falha inesperada.

Detalhes internos, stack traces, credenciais e dados sensíveis não devem ser enviados ao cliente. Erros inesperados devem receber um identificador de correlação quando isso for adotado pela observabilidade.

O frontend deve transformar erros conhecidos em mensagens úteis, sem substituir a semântica de segurança ou de negócio definida pelo backend.

## 13. Testes

### Backend e domínio

Priorizar testes unitários para regras como:

- CPF único e cadastro único do aluno;
- capacidade da turma;
- múltiplas matrículas;
- valor individual da matrícula;
- valor histórico do ciclo;
- início do ciclo na primeira aula efetivamente realizada ou utilizada;
- pagamento anterior ao início do ciclo;
- congelamento do limite de reposições e do prazo de ausência;
- fallback global e prioridade da configuração do professor;
- presença e ausência como fatos do registro;
- geração e utilização de créditos;
- limite de reposições;
- feriados;
- cancelamentos;
- encerramento da matrícula e continuidade do ciclo já iniciado e pago;
- autorização e isolamento entre professores.

Testes de integração devem verificar casos de uso com persistência real ou ambiente equivalente, especialmente transações e concorrência relevante.

### Frontend

Testar principalmente:

- fluxos de autenticação;
- formulários e estados de validação;
- renderização de dados autorizados;
- tratamento de carregamento, vazio e erro;
- fluxos de aula, presença, ciclo, pagamento e reposição;
- responsividade dos fluxos prioritários.

### Ponto em aberto

A documentação não define uma meta numérica de cobertura. A cobertura deve ser usada como indicador, sem substituir testes de comportamento das regras críticas.

## 14. Documentação da API

### Decisão proposta

Documentar a API com OpenAPI, mantendo a especificação próxima do backend e disponibilizando uma visualização para desenvolvimento.

A documentação deve descrever:

- autenticação;
- operações e recursos;
- parâmetros e payloads;
- respostas de sucesso;
- erros possíveis;
- requisitos de autorização;
- exemplos de uso;
- comportamento relevante de paginação e filtros quando definido.

A especificação da API não deve inventar regras de negócio. Deve refletir os casos de uso efetivamente implementados e as regras documentadas.

## 15. Docker e ambiente de desenvolvimento

### Decisão proposta

Usar Docker Compose para disponibilizar o PostgreSQL localmente e, quando útil, os serviços da aplicação. O ambiente deve permitir que um novo desenvolvedor execute o projeto com instruções claras e configuração por variáveis de ambiente.

Princípios:

- separar configuração local de segredos;
- fornecer arquivo de exemplo de variáveis;
- usar volumes apenas conforme a necessidade do ambiente local;
- manter comandos reproduzíveis para instalar, executar, testar e verificar qualidade;
- não colocar credenciais reais no repositório;
- documentar dependências de runtime.

A integração automática com PIX e WhatsApp está fora do escopo inicial e não deve ser presumida no ambiente.

## 16. CI/CD

### Decisão proposta

Adotar pipeline automatizado para cada alteração relevante, incluindo:

- instalação reproduzível;
- verificação de formatação e lint;
- typecheck;
- testes unitários;
- testes de integração quando configurados;
- build do backend e frontend;
- validações de segurança de dependências, conforme a ferramenta adotada.

O pipeline deve bloquear alterações que quebrem testes, tipos ou build. Deploy automatizado pode ser introduzido depois que o ambiente de execução for definido.

### Ponto em aberto

A plataforma de CI/CD, os ambientes de homologação e produção, a estratégia de deploy e o provedor de hospedagem ainda não estão definidos.

## 17. Observabilidade e logging

A aplicação deve produzir logs estruturados e úteis para diagnosticar falhas sem registrar dados sensíveis desnecessariamente.

Registrar, conforme a necessidade:

- início e resultado de requisições;
- método, rota e status HTTP;
- duração;
- usuário ou papel de forma não sensível;
- identificador de correlação;
- falhas de integração e persistência;
- eventos relevantes de negócio quando necessário para rastreabilidade.

Não registrar senhas, tokens, credenciais ou comprovantes em conteúdo inadequado. Logs não substituem o histórico de domínio: correções manuais de ciclos e informações financeiras devem preservar rastreabilidade de acordo com as regras.

### Ponto em aberto

Métricas, tracing, retenção de logs, alertas e ferramenta de observabilidade ainda não foram escolhidos.

## 18. Segurança

A arquitetura deve contemplar:

- autenticação segura;
- hashing de credenciais;
- autorização no backend;
- isolamento por professor em todos os casos de uso e relatórios;
- transporte protegido fora do ambiente local;
- validação de entrada;
- proteção contra injeção por uso seguro da camada de persistência;
- gestão cuidadosa de segredos;
- princípio do menor privilégio;
- mensagens de erro sem exposição interna;
- atualização e verificação de dependências;
- registro rastreável de alterações manuais relevantes.

A proteção deve considerar que o cliente pode ser adulterado. Nenhum identificador, filtro, papel ou valor enviado pelo frontend deve ser aceito como prova de autorização.

## 19. Estrutura inicial de diretórios

A estrutura abaixo é conceitual e pode ser refinada quando o repositório for implementado:

```text
beach-tennis-manager/
├── docs/
│   ├── 01-visao-e-requisitos.md
│   ├── 02-regras-de-negocio.md
│   ├── 03-modelo-de-dominio.md
│   └── 04-arquitetura.md
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── users/
│   │       │   ├── professors/
│   │       │   ├── students/
│   │       │   ├── classes/
│   │       │   ├── enrollments/
│   │       │   ├── lessons/
│   │       │   ├── attendance/
│   │       │   ├── billing-cycles/
│   │       │   ├── payments/
│   │       │   ├── makeups/
│   │       │   └── settings/
│   │       ├── shared/
│   │       │   ├── domain/
│   │       │   ├── application/
│   │       │   ├── infrastructure/
│   │       │   └── http/
│   │       └── main/
│   └── web/
│       └── src/
│           ├── app/
│           ├── modules/
│           ├── components/
│           ├── services/
│           └── shared/
├── packages/
│   └── contracts/
├── tests/
├── docker-compose.yml
└── README.md
```

O diretório `packages/contracts` é uma possibilidade conceitual e somente será adotado se a decisão futura sobre monorepo e compartilhamento de contratos entre frontend e backend for aprovada.

Essa estrutura não obriga cada entidade a possuir um serviço próprio. Os módulos devem ser agrupados por responsabilidade e podem compartilhar casos de uso ou políticas quando isso representar melhor o domínio.

### Ponto em aberto

A adoção de monorepo, a ferramenta de workspace e a forma de compartilhar contratos entre frontend e backend ainda não foram escolhidas.

## 20. Decisões técnicas e justificativas

| Tema | Decisão proposta | Justificativa |
|---|---|---|
| Estilo arquitetural | Monólito modular | Atende o tamanho atual e preserva evolução sem complexidade de microserviços. |
| Backend | Node.js + TypeScript + Fastify | Base tecnológica definida; TypeScript favorece contratos e manutenção, e Fastify atende uma API HTTP enxuta. |
| Frontend | React + TypeScript | Base tecnológica definida e adequada à interface responsiva e multiusuário. |
| Banco | PostgreSQL | Base tecnológica definida, adequada a consistência transacional e histórico. |
| Domínio | Entidades e políticas independentes de framework | Facilita testes e evita acoplamento das regras ao transporte ou ao banco. |
| ORM | Prisma como candidato | Bom suporte a TypeScript/PostgreSQL e ergonomia, mas a escolha ainda precisa de comparação. |
| API | REST/JSON | Simples, explícita e adequada aos recursos e casos de uso iniciais. |
| Documentação | OpenAPI | Torna o contrato verificável e útil para frontend, testes e portfólio. |
| Ambiente | Docker Compose para desenvolvimento | Reproduzibilidade local, principalmente do PostgreSQL. |
| Testes | Unitários, integração e frontend | Cobre regras críticas, persistência e experiência de uso. |

### Decisões de domínio que a arquitetura deve preservar

- um aluno possui cadastro único e CPF único;
- matrícula relaciona aluno, professor e turma;
- cada matrícula possui ciclos próprios;
- o ciclo dá direito a quatro aulas;
- o ciclo inicia na primeira aula efetivamente realizada ou utilizada como parte dele;
- pagamento pode ocorrer antes do início do ciclo;
- o ciclo preserva o valor efetivamente cobrado;
- configurações específicas têm prioridade sobre globais;
- configurações aplicáveis são determinadas e congeladas no início do ciclo;
- registro de participação indica presença ou ausência, enquanto o crédito representa o direito à reposição;
- feriado não inicia ciclo nem consome aula;
- créditos permanecem vinculados à matrícula e ao ciclo de origem;
- reposição pode ocorrer em turma do mesmo professor, com vaga e sem exigência de compatibilidade de nível;
- alterações posteriores não modificam automaticamente ciclos já iniciados ou encerrados;
- o backend é a autoridade para autenticação, autorização e isolamento.

## 21. Pontos em aberto

Os seguintes pontos permanecem pendentes porque a documentação de requisitos e regras não os define completamente:

- permissões detalhadas de cada ação, especialmente a capacidade de o administrador editar dados financeiros de qualquer professor;
- existência futura de diferentes níveis de administrador;
- cálculo exato do faturamento e dos indicadores financeiros;
- relatórios obrigatórios na primeira versão;
- regras detalhadas de cobrança e pagamento além do registro básico;
- estratégia de sessão, cookie ou token;
- lista final de endpoints e convenções de versionamento da API;
- escolha definitiva do ORM entre Prisma e alternativas;
- conjunto completo de configurações operacionais além das já documentadas;
- formato concreto da persistência do snapshot, sem alterar seu requisito funcional;
- plataforma de CI/CD, hospedagem, ambientes e estratégia de deploy;
- ferramentas e políticas de observabilidade;
- adoção de monorepo e compartilhamento de contratos;
- meta de cobertura de testes;
- política de armazenamento de comprovantes;
- regras financeiras não documentadas, como conciliação, estorno, parcelamento e inadimplência.

Esses pontos não devem ser tratados como regras de negócio decididas. As escolhas técnicas podem ser feitas de forma incremental, registrando a decisão antes de criar a implementação correspondente.
