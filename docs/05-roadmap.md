# Beach Tennis Manager — Roadmap de Implementação

## 1. Objetivo

Este roadmap organiza a implementação incremental do Beach Tennis Manager em entregas pequenas, verificáveis e independentes sempre que possível.

A ordem considera as dependências técnicas e de domínio descritas em:

- `docs/01-visao-e-requisitos.md`;
- `docs/02-regras-de-negocio.md`;
- `docs/03-modelo-de-dominio.md`;
- `docs/04-arquitetura.md`.

O roadmap separa o núcleo funcional mínimo das funcionalidades posteriores. Não transforma pontos ainda indefinidos em requisitos de implementação.

## 2. Critérios de priorização

A sequência segue estes critérios:

- estabelecer uma base reproduzível antes das funcionalidades;
- validar primeiro o fluxo central do domínio;
- colocar autenticação, autorização e isolamento antes de expor dados operacionais;
- implementar o ciclo junto de suas regras históricas e configurações congeladas;
- manter pagamentos e reposições dependentes do ciclo;
- deixar relatórios e refinamentos para depois que houver dados confiáveis;
- entregar cada etapa em uma mudança pequena, testável e revisável.

## 3. Núcleo funcional mínimo

O núcleo inicial deve permitir que um professor autenticado:

1. acesse somente sua própria operação;
2. gerencie alunos sem duplicar CPF;
3. crie turmas com capacidade;
4. matricule alunos em suas turmas com condição comercial própria;
5. registre aulas concretas;
6. registre presença ou ausência por aluno;
7. crie e acompanhe ciclos de quatro aulas;
8. preserve o valor e as configurações aplicáveis ao ciclo;
9. registre pagamentos relacionados ao ciclo;
10. gere créditos de reposição e utilize créditos conforme as regras definidas.

O mínimo operacional pode ser implementado em incrementos, mas não deve considerar a funcionalidade pronta enquanto as regras críticas de segurança e histórico não estiverem protegidas no backend.

## 4. Decisões preliminares antes do código

Estas decisões técnicas não são regras de negócio, mas precisam ser tomadas para iniciar a implementação:

- formato do repositório: monorepo ou aplicações organizadas de outra forma;
- adoção ou não de `packages/contracts` para compartilhar contratos;
- ferramenta de workspace, se monorepo for adotado;
- escolha do ORM ou query builder, com Prisma como candidato;
- estratégia de sessão: cookie seguro ou token;
- ferramenta de validação de entrada e forma de representar contratos;
- convenções iniciais da API REST;
- ferramenta de testes;
- estratégia local de execução do PostgreSQL;
- plataforma de CI/CD e ambientes de execução, quando a automação for iniciada.

As seguintes decisões de negócio também devem ser observadas antes das funcionalidades que dependem delas:

- permissões detalhadas por ação, especialmente alterações financeiras por administradores;
- cálculo exato de faturamento e indicadores;
- relatórios obrigatórios da primeira versão;
- regras detalhadas de cobrança e pagamento além do registro básico;
- conjunto completo de configurações operacionais, além do limite de reposições e prazo de ausência já documentados.

As decisões já documentadas não devem ser reabertas como pendências. Isso inclui validade do crédito, turma de reposição do mesmo professor sem compatibilidade de nível, cancelamentos especificados, feriados, falta em reposição e encerramento da matrícula.

## 5. Fases do roadmap

### Fase 0 — Preparação e decisões técnicas mínimas

**Objetivo:** tornar explícita a forma de trabalho e fechar apenas as escolhas técnicas necessárias para criar a base.

**Entregas:**

- registrar as decisões técnicas escolhidas para o início;
- confirmar a estrutura do repositório;
- definir comandos esperados de instalação, desenvolvimento, testes, lint, typecheck e build;
- definir convenções de nomes, configuração e variáveis de ambiente;
- criar ou atualizar a documentação de contribuição somente se necessário.

**Dependências:** nenhuma.

**Critérios de conclusão:**

- as decisões mínimas estão registradas;
- os comandos esperados estão definidos;
- não há decisão de negócio pendente sendo mascarada como configuração técnica.

**Commit independente sugerido:** `docs: registrar decisões iniciais do projeto`.

### Fase 1 — Estrutura inicial das aplicações

**Objetivo:** criar a base do backend e do frontend de acordo com a arquitetura escolhida.

**Entregas:**

- criar a aplicação Node.js, TypeScript e Fastify;
- criar a aplicação React e TypeScript;
- estabelecer a separação conceitual entre interface, aplicação, domínio e infraestrutura no backend;
- estabelecer a organização inicial do frontend por aplicação, módulos e componentes compartilhados;
- configurar scripts mínimos de desenvolvimento, build e verificação de tipos;
- manter `packages/contracts` somente se a decisão de monorepo e compartilhamento tiver sido aprovada.

**Dependências:** Fase 0.

**Critérios de conclusão:**

- backend inicia e responde a uma verificação básica;
- frontend inicia e renderiza uma tela mínima;
- build e typecheck executam;
- nenhuma regra de negócio está implementada em rota ou componente sem necessidade.

**Commit independente sugerido:** `chore: criar estrutura inicial das aplicações`.

### Fase 2 — Backend base e contrato HTTP

**Objetivo:** estabelecer o núcleo técnico comum da API.

**Entregas:**

- configurar o servidor Fastify;
- definir composição da aplicação e ciclo de vida;
- criar tratamento global de erros;
- criar configuração por ambiente;
- criar logging básico sem dados sensíveis;
- definir resposta de erro consistente;
- criar uma rota de saúde sem regra de negócio;
- definir a primeira convenção de contratos HTTP.

**Dependências:** Fase 1.

**Critérios de conclusão:**

- a API inicia com configuração documentada;
- a rota de saúde responde;
- erros inesperados não expõem stack trace ao cliente;
- logs básicos permitem identificar requisição e falha.

**Commit independente sugerido:** `feat(api): criar base do servidor e erros HTTP`.

### Fase 3 — PostgreSQL e persistência base

**Objetivo:** conectar o backend ao PostgreSQL com uma fronteira de persistência testável.

**Entregas:**

- configurar conexão com PostgreSQL;
- escolher e configurar o ORM ou query builder;
- definir repositórios ou portas de persistência iniciais;
- configurar transações para casos de uso;
- definir estratégia de migrations quando a modelagem concreta começar;
- criar teste de integração de conexão e persistência mínima.

**Dependências:** Fase 2 e decisão de ORM da Fase 0.

**Critérios de conclusão:**

- o backend conecta ao PostgreSQL em ambiente local;
- o acesso ao banco não vaza para a camada de domínio;
- uma transação de teste pode ser executada e revertida;
- comandos de banco estão documentados.

**Commit independente sugerido:** `chore(api): configurar persistencia PostgreSQL`.

### Fase 4 — Usuário, Professor e autenticação

**Objetivo:** permitir autenticação e identificar o professor da sessão.

**Entregas:**

- implementar os conceitos de Usuário e Professor;
- representar os papéis `PROFESSOR` e `ADMIN`;
- proteger credenciais com hashing;
- implementar autenticação conforme a estratégia escolhida;
- disponibilizar login e identificação do usuário autenticado;
- criar middleware ou mecanismo equivalente para contexto de autenticação.

**Dependências:** Fases 2 e 3; decisão de sessão da Fase 0.

**Critérios de conclusão:**

- usuário válido consegue autenticar;
- credencial inválida é rejeitada sem exposição de informação sensível;
- a requisição autenticada carrega identidade e papel;
- testes cobrem autenticação e papéis básicos.

**Commit independente sugerido:** `feat(auth): implementar autenticacao e papeis`.

### Fase 5 — Autorização e isolamento por professor

**Objetivo:** impedir acesso ou alteração indevida entre operações de professores.

**Entregas:**

- implementar autorização no backend;
- aplicar o escopo do professor aos casos de uso e consultas;
- permitir visão global ao administrador conforme as regras documentadas;
- cobrir listas, detalhes, criação, alteração, encerramento e relatórios futuros com o mesmo princípio;
- criar testes negativos de acesso entre professores.

**Dependências:** Fase 4.

**Critérios de conclusão:**

- um professor não acessa dados de outro professor;
- filtros ou identificadores enviados pelo cliente não contornam o escopo;
- o administrador possui visão global conforme o que já está definido;
- testes verificam isolamento em leitura e escrita.

**Commit independente sugerido:** `feat(auth): aplicar autorizacao e isolamento por professor`.

### Fase 6 — Alunos

**Objetivo:** criar o cadastro único de alunos com proteção contra duplicidade de CPF.

**Entregas:**

- criar casos de uso para cadastrar, consultar, atualizar e desativar aluno;
- validar CPF único;
- preservar o cadastro único quando o aluno se relacionar com mais de um professor;
- expor operações autenticadas com isolamento adequado.

**Dependências:** Fase 5 e persistência da Fase 3.

**Critérios de conclusão:**

- não é possível cadastrar dois alunos com o mesmo CPF;
- o mesmo aluno pode ser relacionado a operações distintas;
- professor consulta somente alunos relacionados à própria operação;
- testes unitários e de integração cobrem unicidade e escopo.

**Commit independente sugerido:** `feat(students): implementar cadastro de alunos`.

### Fase 7 — Turmas

**Objetivo:** representar recorrências de aulas e controlar capacidade.

**Entregas:**

- criar e administrar turmas;
- registrar professor responsável;
- registrar recorrência, características, capacidade e preço padrão;
- ativar e desativar turmas;
- calcular ou consultar vagas disponíveis conforme o estado das matrículas.

**Dependências:** Fase 5; pode iniciar após Fase 6 para testar relação com aluno, mas não depende de cadastro completo de aluno para sua estrutura básica.

**Critérios de conclusão:**

- turma pertence ao professor correto;
- capacidade máxima de quatro alunos ativos é respeitada;
- turma pode ter menos alunos que sua capacidade;
- professor não consulta ou altera turma de outra operação;
- testes cobrem capacidade e isolamento.

**Commit independente sugerido:** `feat(classes): implementar turmas e capacidade`.

### Fase 8 — Matrículas

**Objetivo:** relacionar aluno, professor e turma com condição comercial individual.

**Entregas:**

- criar matrícula entre aluno, professor e turma;
- validar que o professor da matrícula é o professor da turma;
- registrar condições comerciais e valor vigente;
- permitir múltiplas matrículas do mesmo aluno;
- permitir encerramento da matrícula sem apagar histórico;
- impedir novo ciclo após o encerramento da matrícula, preservando ciclo já iniciado e pago.

**Dependências:** Fases 6 e 7.

**Critérios de conclusão:**

- matrícula relaciona aluno, professor e turma;
- valores de matrículas diferentes podem coexistir;
- capacidade da turma é respeitada;
- encerramento preserva os dados históricos;
- testes cobrem múltiplas matrículas e encerramento.

**Commit independente sugerido:** `feat(enrollments): implementar matriculas`.

### Fase 9 — Aulas

**Objetivo:** registrar ocorrências concretas das turmas.

**Entregas:**

- registrar aulas por data e horário;
- distinguir turma recorrente de aula concreta;
- registrar realização e cancelamento;
- registrar motivos documentados de cancelamento: professor, chuva/condições climáticas e indisponibilidade da quadra;
- representar feriados sem consumir aula do ciclo.

**Dependências:** Fase 7; matrícula é necessária para vincular participantes, mas a ocorrência da aula pertence à turma.

**Critérios de conclusão:**

- uma turma possui histórico de aulas;
- cancelamentos permanecem registrados;
- os motivos documentados são reconhecidos;
- feriado não é tratado como início ou consumo de aula do ciclo.

**Commit independente sugerido:** `feat(lessons): registrar ocorrencias de aulas`.

### Fase 10 — Registro de Participação

**Objetivo:** registrar o fato ocorrido com cada aluno em cada aula.

**Entregas:**

- criar Registro de Participação ligado à aula e à matrícula;
- representar somente presença ou ausência;
- registrar comunicação de ausência quando houver;
- registrar uso da aula como reposição quando aplicável, sem transformar isso em situação de presença ou ausência;
- preparar a associação ao ciclo.

**Dependências:** Fases 8 e 9.

**Critérios de conclusão:**

- cada aluno relacionado pode ter sua situação registrada individualmente;
- o registro indica `PRESENTE` ou `AUSENTE`;
- o direito à reposição não é modelado como situação do registro;
- testes cobrem presença, ausência e vínculo correto.

**Commit independente sugerido:** `feat(attendance): implementar registros de participacao`.

### Fase 11 — Configurações globais e por professor

**Objetivo:** disponibilizar a administração das configurações já definidas e consolidar a resolução usada pelos ciclos.

**Entregas:**

- administrar configurações globais por usuário administrador;
- administrar configurações específicas por professor conforme a autorização definida;
- implementar prioridade da configuração do professor;
- implementar fallback global;
- manter o snapshot dos ciclos sem recálculo retroativo;
- cobrir especialmente limite máximo de reposições e prazo mínimo de ausência.

**Dependências:** Fases 4 e 5.

**Critérios de conclusão:**

- configuração específica prevalece quando definida;
- configuração global é usada quando não há específica;
- alteração de qualquer origem afeta apenas ciclos ainda não iniciados;
- permissões de alteração estão definidas e testadas.

**Commit independente sugerido:** `feat(settings): implementar configuracoes operacionais`.

### Fase 12 — Ciclo de cobrança e snapshot

**Objetivo:** implementar o núcleo financeiro-operacional de quatro aulas com preservação histórica.

**Entregas:**

- criar ciclos próprios por matrícula;
- registrar valor efetivamente cobrado;
- representar o direito a quatro aulas;
- permitir pagamento antes do início do ciclo;
- iniciar o ciclo na primeira aula efetivamente realizada ou utilizada como parte dele;
- não iniciar ciclo em feriado;
- contar aulas efetivamente recebidas, considerando reposições e extensões;
- resolver configuração específica do professor com fallback global;
- congelar no início do ciclo o limite máximo de reposições e o prazo mínimo de comunicação de ausência;
- impedir alteração retroativa por mudança de preço ou configuração;
- preservar ciclo já iniciado e pago quando a matrícula for encerrada.

**Dependências:** Fases 3, 8, 9, 10 e 11.

**Critérios de conclusão:**

- um ciclo nasce associado a uma matrícula;
- seu valor histórico não muda após alteração da matrícula;
- sua configuração efetiva é congelada no início;
- feriados não iniciam nem consomem aula;
- o ciclo é concluído quando o aluno recebe quatro aulas;
- alterações posteriores não afetam ciclos iniciados;
- testes cobrem início, quatro aulas, pagamento antecipado, snapshot, feriados e histórico.

**Commit independente sugerido:** `feat(billing): implementar ciclos e configuracoes congeladas`.

### Fase 13 — Pagamentos

**Objetivo:** manter o histórico de pagamentos relacionados aos ciclos.

**Entregas:**

- registrar pagamento ligado a um ciclo;
- registrar valor, data, método, situação e comprovante quando aplicável;
- suportar PIX como método registrado, sem integração automática;
- permitir consultas dentro do escopo autorizado;
- não implementar regras financeiras ainda não definidas.

**Dependências:** Fases 5 e 12; regras adicionais de cobrança e pagamento podem bloquear funcionalidades além do registro básico.

**Critérios de conclusão:**

- cada pagamento está relacionado a um ciclo;
- histórico pode ser consultado com isolamento;
- valor e situação são preservados;
- não há integração automática de PIX no MVP.

**Commit independente sugerido:** `feat(payments): registrar pagamentos por ciclo`.

### Fase 14 — Créditos de reposição

**Objetivo:** controlar a geração e utilização dos direitos de reposição definidos.

**Entregas:**

- gerar crédito separado do Registro de Participação;
- gerar crédito por ausência válida ou cancelamento documentado;
- vincular crédito à matrícula e ao ciclo de origem;
- aplicar o limite congelado do ciclo;
- utilizar crédito em aula com vaga de qualquer turma do mesmo professor;
- não exigir compatibilidade de nível;
- impedir transferência para outra matrícula;
- tratar uso da próxima aula prevista como reposição e estender o ciclo;
- não gerar novo crédito automaticamente por ausência em aula de reposição;
- encerrar disponibilidade de créditos quando o ciclo for encerrado.

**Dependências:** Fases 7, 9, 10, 11 e 12.

**Critérios de conclusão:**

- ausência no prazo usa o prazo congelado e pode originar crédito;
- ausência fora do prazo ou sem aviso não origina crédito;
- cancelamentos aplicáveis respeitam o limite;
- crédito é usado uma vez, no professor correto e com vaga;
- feriado não gera crédito individual;
- testes cobrem todas as situações definidas de geração e utilização.

**Commit independente sugerido:** `feat(makeups): implementar creditos de reposicao`.

### Fase 15 — Frontend operacional do núcleo

**Objetivo:** disponibilizar uma experiência utilizável para o núcleo funcional já protegido pelo backend.

**Entregas:**

- fluxo de autenticação;
- telas de alunos, turmas e matrículas;
- telas de aulas e registros de participação;
- visão de ciclos, pagamentos e créditos;
- estados de carregamento, vazio, sucesso e erro;
- navegação conforme papel e dados retornados pela API;
- experiência responsiva em computador e dispositivo móvel.

**Dependências:** Fases 4 a 14, conforme cada tela; contratos HTTP definidos na Fase 2.

**Critérios de conclusão:**

- professor executa o fluxo principal pela interface;
- frontend não implementa autorização como mecanismo de segurança;
- erros da API são apresentados de forma compreensível;
- fluxos prioritários possuem testes de interface.

**Commit independente sugerido:** `feat(web): criar interface operacional do nucleo`.

### Fase 16 — Relatórios e visão financeira básica

**Objetivo:** disponibilizar consultas derivadas dos dados já confiáveis do domínio.

**Entregas:**

- implementar somente relatórios priorizados após a decisão sobre a primeira versão;
- respeitar isolamento por professor;
- permitir visão consolidada ao administrador conforme permissões definidas;
- apresentar pagamentos, aulas, faltas, reposições e ocupação quando fizerem parte do conjunto aprovado;
- definir e documentar o cálculo de faturamento antes de implementá-lo.

**Dependências:** Fases 5, 13 e 14; decisão dos relatórios e do cálculo financeiro.

**Critérios de conclusão:**

- relatórios têm escopo de acesso testado;
- cálculos financeiros aprovados possuem testes;
- não há relatório implementado com regra de negócio indefinida.

**Commit independente sugerido:** `feat(reports): adicionar relatorios priorizados`.

### Fase 17 — Documentação da API

**Objetivo:** tornar o contrato da API verificável e útil para frontend, testes e portfólio.

**Entregas:**

- publicar especificação OpenAPI;
- documentar autenticação e autorização;
- documentar requests, responses e erros;
- documentar escopo por papel;
- incluir exemplos dos fluxos principais;
- manter a especificação alinhada aos casos de uso implementados.

**Dependências:** Fases 2 e 15; deve acompanhar as mudanças, mas pode ser consolidada nesta fase.

**Critérios de conclusão:**

- recursos principais estão documentados;
- contratos e erros podem ser consultados sem ler a implementação;
- a documentação não apresenta regras não aprovadas.

**Commit independente sugerido:** `docs(api): documentar contrato REST com OpenAPI`.

### Fase 18 — Docker e ambiente reproduzível

**Objetivo:** padronizar a execução local do projeto.

**Entregas:**

- criar Docker Compose para PostgreSQL e serviços adotados;
- documentar variáveis de ambiente;
- documentar comandos para subir, testar e encerrar o ambiente;
- evitar credenciais reais no repositório;
- validar execução em uma máquina limpa ou ambiente equivalente.

**Dependências:** Fases 1, 3 e decisões de ambiente.

**Critérios de conclusão:**

- PostgreSQL local inicia de forma reproduzível;
- aplicação e testes conseguem usar o ambiente documentado;
- segredos não estão versionados.

**Commit independente sugerido:** `chore: padronizar ambiente local com Docker`.

### Fase 19 — CI/CD

**Objetivo:** automatizar as verificações de qualidade antes da integração e preparar entregas.

**Entregas:**

- configurar instalação reproduzível;
- executar lint, typecheck, testes e build;
- executar integração com banco quando aplicável;
- validar dependências e segurança conforme ferramenta escolhida;
- definir política de falha do pipeline;
- preparar deploy somente quando ambientes e provedor estiverem definidos.

**Dependências:** Fases 1, 2, 3, 17 e 18; plataforma de CI/CD e hospedagem continuam decisões técnicas abertas.

**Critérios de conclusão:**

- uma alteração sem qualidade mínima falha no pipeline;
- uma alteração válida executa todas as verificações definidas;
- nenhum deploy automático é ativado sem ambiente aprovado.

**Commit independente sugerido:** `ci: configurar verificacoes automatizadas`.

### Fase 20 — Observabilidade, segurança e refinamentos

**Objetivo:** fortalecer o sistema após o núcleo funcional estar validado.

**Entregas:**

- revisar logs e dados sensíveis;
- adicionar identificador de correlação quando adotado;
- definir métricas, alertas e retenção conforme necessidade real;
- revisar permissões e testes de isolamento;
- revisar desempenho de consultas e paginação;
- corrigir inconsistências de UX e acessibilidade;
- atualizar documentação de decisões e regras;
- priorizar melhorias com base em uso real, sem ampliar o escopo por suposição.

**Dependências:** núcleo funcional e decisões de observabilidade.

**Critérios de conclusão:**

- falhas relevantes são diagnosticáveis sem expor dados sensíveis;
- acessos indevidos continuam cobertos por testes;
- melhorias possuem critério de aceitação e não alteram regras sem documentação;
- documentação técnica permanece atualizada.

**Commit independente sugerido:** commits pequenos por melhoria, sem agrupar alterações não relacionadas.

## 6. Testes obrigatórios das regras de negócio

As seguintes regras devem possuir testes automatizados antes de serem consideradas concluídas:

- cadastro único do aluno e CPF único;
- isolamento de dados entre professores;
- capacidade máxima de quatro alunos ativos por turma;
- múltiplas matrículas para um aluno;
- valor individual por matrícula;
- preservação do valor histórico do ciclo;
- ciclo independente do calendário;
- pagamento antecipado;
- início do ciclo na primeira aula efetivamente realizada ou utilizada;
- feriado sem iniciar ciclo e sem consumir uma das quatro aulas;
- conclusão após quatro aulas efetivamente recebidas;
- fallback da configuração global;
- prioridade da configuração específica do professor;
- congelamento do limite de reposições e do prazo de ausência no ciclo;
- alterações posteriores sem efeito retroativo em ciclos iniciados;
- Registro de Participação com fato `PRESENTE` ou `AUSENTE`;
- ausência dentro, fora ou sem o prazo de comunicação;
- cancelamentos pelo professor, por chuva e por indisponibilidade da quadra;
- geração separada do Crédito de Reposição;
- vínculo do crédito à matrícula e ao ciclo de origem;
- utilização em turma do mesmo professor e com vaga;
- ausência de exigência de compatibilidade de nível;
- impossibilidade de transferência do crédito para outra matrícula;
- falta em aula de reposição sem geração automática de novo crédito;
- encerramento do crédito com o ciclo;
- encerramento da matrícula sem abandonar ciclo já iniciado e previamente pago;
- opção do aluno de concluir ou encerrar o ciclo após o encerramento da matrícula;
- histórico e rastreabilidade de ciclos encerrados.

Os testes devem ser organizados por comportamento, não apenas por quantidade de linhas cobertas.

## 7. Entregas adequadas para commits pequenos

Cada commit deve representar uma alteração compreensível e reversível. Exemplos:

- base de configuração e scripts;
- estrutura inicial de uma aplicação;
- tratamento global de erros;
- conexão e transação de persistência;
- autenticação;
- autorização e isolamento;
- cadastro de alunos;
- turmas e capacidade;
- matrículas;
- aulas;
- registros de participação;
- ciclos e snapshot;
- configurações;
- pagamentos;
- créditos de reposição;
- uma tela ou fluxo de frontend;
- documentação OpenAPI;
- Docker;
- pipeline;
- melhoria específica de observabilidade ou segurança.

Commits que misturam regra de negócio, refatoração ampla e configuração de ambiente devem ser evitados.

## 8. Primeira tarefa prática após aprovação

A primeira tarefa de código recomendada é a **Fase 0, seguida da Fase 1**:

1. registrar as decisões técnicas mínimas, especialmente estrutura do repositório, sessão, validação, testes e ORM;
2. criar a estrutura inicial executável do backend Fastify e do frontend React com TypeScript;
3. configurar scripts mínimos de typecheck, lint, teste e build;
4. comprovar que backend e frontend iniciam e que o PostgreSQL será integrado na fase seguinte.

Essa primeira entrega cria uma base verificável sem antecipar regras de negócio ou modelagem de banco ainda não decididas.

## 9. Pontos em aberto do roadmap

- monorepo, workspace e adoção de `packages/contracts`;
- escolha definitiva de Prisma, outro ORM ou query builder;
- estratégia de sessão por cookie ou token;
- ferramenta de validação e formato definitivo dos contratos;
- plataforma de CI/CD, hospedagem e ambientes;
- métricas, tracing, alertas e retenção de logs;
- permissões detalhadas do administrador;
- cálculo de faturamento e indicadores;
- relatórios obrigatórios do MVP;
- regras detalhadas de cobrança e pagamento;
- conjunto completo de configurações operacionais;
- política de armazenamento de comprovantes;
- meta numérica de cobertura de testes.

Nenhum desses pontos deve ser tratado como regra de negócio definida. As decisões devem ser registradas antes das fases que dependem delas.
