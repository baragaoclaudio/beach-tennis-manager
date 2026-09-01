# Beach Tennis Manager

## 1. Visão geral

O **Beach Tennis Manager** é um sistema de gestão voltado para professores e profissionais de Beach Tennis.

O sistema tem como objetivo centralizar e organizar a gestão de alunos, turmas, aulas, presença, pagamentos, ciclos de aulas e reposições, reduzindo a dependência de controles manuais e informações dispersas.

O sistema será desenvolvido inicialmente para atender a uma operação real de aulas de Beach Tennis, mas sua arquitetura deverá permitir que outros professores também utilizem a plataforma.

O projeto possui dois objetivos principais:

1. Resolver problemas reais de gestão da operação de aulas.
2. Servir como projeto profissional de desenvolvimento de software, demonstrando boas práticas de arquitetura, desenvolvimento, testes, documentação, controle de versão e utilização de ferramentas modernas de desenvolvimento assistido por IA.

---

## 2. Problema

A gestão de aulas de Beach Tennis pode envolver diversas informações relacionadas entre si:

* alunos;
* professores;
* turmas;
* horários;
* aulas realizadas;
* presença e ausência;
* reposições;
* pagamentos;
* valores diferenciados por aluno;
* ciclos de aulas;
* vagas disponíveis;
* informações financeiras.

Quando essas informações são controladas manualmente, torna-se mais difícil responder perguntas como:

* Quais alunos estão ativos?
* Em qual turma cada aluno está?
* Quantas aulas do ciclo um aluno já realizou?
* Quem está com pagamento pendente?
* Qual o valor pago por cada aluno?
* Quais alunos possuem direito a reposição?
* Existem vagas disponíveis em determinada turma?
* Quantos alunos cada professor possui?
* Qual é o faturamento de determinado período?
* Qual é o faturamento total da operação?

O sistema deverá centralizar essas informações e manter o histórico das operações.

---

## 3. Objetivos

### 3.1. Objetivo geral

Desenvolver uma plataforma de gestão para professores de Beach Tennis que permita controlar alunos, turmas, aulas, pagamentos, presença e reposições de forma organizada e segura.

### 3.2. Objetivos específicos

O sistema deverá permitir:

* cadastrar e gerenciar alunos;
* cadastrar e gerenciar professores;
* criar e administrar turmas;
* controlar horários e capacidade das turmas;
* relacionar alunos às turmas;
* registrar aulas realizadas;
* registrar presença e ausência;
* controlar ciclos de aulas;
* registrar pagamentos;
* controlar valores individuais;
* controlar créditos de reposição;
* identificar vagas disponíveis;
* manter histórico das informações;
* disponibilizar relatórios;
* permitir diferentes níveis de acesso;
* permitir que vários professores utilizem o mesmo sistema.

---

## 4. Usuários do sistema

O sistema será multiusuário.

Inicialmente serão considerados dois principais papéis de acesso.

### 4.1. Professor

O professor poderá administrar os dados relacionados às suas próprias atividades.

Entre suas responsabilidades estarão:

* visualizar suas turmas;
* visualizar os alunos relacionados às suas turmas;
* cadastrar e atualizar informações permitidas dos alunos;
* registrar aulas;
* registrar presença;
* registrar ausências;
* administrar reposições;
* registrar pagamentos;
* consultar informações financeiras relacionadas à sua operação.

Um professor não deverá ter acesso aos dados operacionais de outros professores sem uma relação que permita esse acesso.

### 4.2. Administrador

O administrador terá acesso global ao sistema.

Entre suas responsabilidades estarão:

* visualizar professores;
* visualizar todas as turmas;
* visualizar todos os alunos;
* consultar informações financeiras globais;
* gerar relatórios consolidados;
* acompanhar indicadores gerais da operação;
* administrar configurações globais do sistema.

O administrador deverá possuir permissões superiores às de um professor.

---

## 5. Modelo de acesso

O sistema utilizará controle de acesso baseado em papéis.

Conceitualmente:

```text
Usuário
   │
   └── Papel
        ├── PROFESSOR
        └── ADMIN
```

A autorização deverá ser aplicada no backend.

Não será suficiente apenas esconder informações no frontend.

O backend deverá validar se o usuário autenticado possui permissão para acessar ou modificar determinado recurso.

---

## 6. Alunos

Cada aluno deverá possuir um cadastro único no sistema.

O aluno terá uma identificação interna própria, utilizada como chave primária.

O CPF deverá ser único no cadastro de alunos e será utilizado para evitar duplicidade de registros.

Exemplo conceitual:

```text
Aluno
├── id: UUID
├── nome
├── CPF: UNIQUE
├── telefone
└── demais informações
```

Um mesmo aluno poderá possuir relacionamento com mais de um professor.

### Exemplo

```text
Professor A
    │
    └── João

Professor B
    │
    └── João
```

Nesse cenário existe apenas **um cadastro de João**, e não dois.

O sistema deverá reconhecer que o mesmo aluno possui relacionamento com professores diferentes.

---

## 7. Turmas

Uma turma representa uma configuração recorrente de aulas.

Exemplo:

```text
Turma: Terça-feira 19h
Professor: Claudio
Nível: D
Capacidade: 4 alunos
```

A turma poderá possuir menos alunos do que sua capacidade máxima.

Exemplo:

```text
Capacidade: 4
Alunos ativos: 3
Vagas disponíveis: 1
```

A turma deverá possuir um preço padrão.

Entretanto, o valor efetivamente pago por cada aluno poderá ser diferente.

---

## 8. Matrícula

A relação entre aluno, professor e turma será representada por uma matrícula.

A matrícula permitirá armazenar informações específicas daquela relação.

Conceitualmente:

```text
Aluno
   │
   └── Matrícula
          ├── Professor
          ├── Turma
          └── Condições comerciais
```

Isso permite que o mesmo aluno participe de mais de uma turma.

### Exemplo

João participa de duas turmas:

```text
João
│
├── Matrícula 1
│     ├── Terça-feira
│     └── Valor: R$ 100
│
└── Matrícula 2
      ├── Quinta-feira
      └── Valor: R$ 50
```

O valor da matrícula representa a condição comercial específica daquele aluno naquela turma.

---

## 9. Ciclo de aulas e cobrança

A cobrança será baseada em um ciclo de **4 aulas**.

Apesar de atualmente ser utilizado o termo "mensalidade", o sistema deverá tratar a cobrança internamente como um ciclo de aulas.

O pagamento ocorre antecipadamente.

### Exemplo

Um aluno realiza um pagamento de:

```text
R$ 200
```

Esse pagamento dará direito às próximas:

```text
4 aulas
```

O ciclo não estará necessariamente vinculado ao mês do calendário.

Portanto, um ciclo poderá começar em determinado mês e terminar no mês seguinte.

### Exemplo

```text
05/09 → pagamento
10/09 → aula 1
17/09 → aula 2
24/09 → aula 3
01/10 → aula 4
```

Nesse caso, o mesmo ciclo atravessou dois meses.

Cada matrícula possuirá seus próprios ciclos de cobrança.

---

## 10. Histórico financeiro

O valor efetivamente cobrado deverá ser registrado no ciclo de cobrança.

Isso é necessário porque o preço de uma matrícula poderá mudar no futuro.

### Exemplo

João paga atualmente:

```text
R$ 100
```

Posteriormente, seu valor é alterado para:

```text
R$ 120
```

Os ciclos anteriores deverão continuar registrando:

```text
Ciclo antigo → R$ 100
Ciclo novo   → R$ 120
```

O histórico financeiro não deverá ser alterado retroativamente pela mudança de preço.

---

## 11. Aulas

Uma distinção importante será feita entre **turma** e **aula**.

### Turma

Representa uma configuração recorrente.

```text
Turma:
Terça-feira às 19h
```

### Aula

Representa uma ocorrência concreta.

```text
Aula:
10/09/2026 às 19h
```

Portanto:

```text
Turma
  │
  ├── Aula 10/09
  ├── Aula 17/09
  ├── Aula 24/09
  └── Aula 01/10
```

Essa separação permitirá manter histórico das aulas realizadas.

---

## 12. Presença e ausência

O sistema deverá permitir registrar a situação de cada aluno em cada aula.

Inicialmente serão considerados estados como:

* presente;
* ausência;
* ausência com direito a reposição.

As regras completas para concessão e utilização de reposições serão definidas no documento de regras de negócio.

---

## 13. Reposição de aulas

O sistema deverá possuir mecanismo para controle de reposições.

A reposição será tratada como um direito/crédito do aluno, separado da simples ausência.

Conceitualmente:

```text
Ausência válida
      │
      ▼
Crédito de reposição
      │
      ├── utilizado em vaga disponível
      │
      └── utilizado posteriormente como extensão do ciclo
```

O professor não será obrigado a criar uma aula adicional exclusivamente para atender uma reposição.

Quando houver uma vaga disponível em outra turma compatível, o aluno poderá utilizar seu crédito.

Caso não exista uma oportunidade de reposição antes da próxima aula originalmente prevista, poderá ocorrer a extensão do ciclo.

### Exemplo

```text
Aula 1 → presente
Aula 2 → presente
Aula 3 → ausência válida
Aula 4 → utilizada como reposição da aula 3
```

Nesse cenário, a aula originalmente prevista como aula 4 será realizada posteriormente, permitindo que o aluno complete suas quatro aulas do ciclo.

As regras detalhadas de reposição ainda serão definidas.

---

## 14. Pagamentos

O sistema deverá permitir registrar pagamentos realizados pelos alunos.

Inicialmente, o PIX será considerado um dos principais métodos de pagamento.

O sistema deverá permitir registrar informações como:

* valor;
* data;
* método de pagamento;
* ciclo relacionado;
* situação do pagamento;
* comprovante, quando aplicável.

As regras detalhadas de cobrança e pagamento ainda poderão evoluir durante o desenvolvimento.

---

## 15. Relatórios

O sistema deverá permitir a geração de relatórios.

Professores deverão visualizar relatórios relacionados à sua própria operação.

Administradores poderão visualizar relatórios consolidados.

Exemplos de relatórios futuros:

* alunos ativos;
* alunos por professor;
* alunos por turma;
* ocupação das turmas;
* pagamentos;
* inadimplência;
* faturamento;
* aulas realizadas;
* faltas;
* reposições pendentes;
* evolução financeira.

---

## 16. Requisitos funcionais iniciais

Os requisitos funcionais serão identificados com o prefixo RF.

### RF-001 — Gerenciamento de usuários

O sistema deverá permitir autenticar usuários e controlar suas permissões de acordo com seus papéis.

### RF-002 — Gerenciamento de professores

O sistema deverá permitir cadastrar e administrar professores.

### RF-003 — Gerenciamento de alunos

O sistema deverá permitir cadastrar, consultar, editar e desativar alunos.

### RF-004 — Identificação única do aluno

O sistema deverá impedir o cadastro de dois alunos com o mesmo CPF.

### RF-005 — Gerenciamento de turmas

O sistema deverá permitir criar, editar, ativar e desativar turmas.

### RF-006 — Matrícula de alunos

O sistema deverá permitir relacionar alunos às turmas por meio de matrículas.

### RF-007 — Múltiplas matrículas

Um aluno poderá possuir múltiplas matrículas simultaneamente.

### RF-008 — Valores individualizados

O sistema deverá permitir definir condições comerciais específicas por matrícula.

### RF-009 — Ciclos de cobrança

O sistema deverá permitir controlar ciclos compostos por quatro aulas.

### RF-010 — Registro de pagamentos

O sistema deverá permitir registrar pagamentos vinculados aos ciclos.

### RF-011 — Registro de aulas

O sistema deverá permitir registrar as ocorrências concretas das aulas.

### RF-012 — Controle de presença

O sistema deverá permitir registrar presença e ausência dos alunos.

### RF-013 — Controle de reposições

O sistema deverá permitir controlar créditos e utilizações de reposição.

### RF-014 — Controle de vagas

O sistema deverá permitir identificar vagas disponíveis nas turmas.

### RF-015 — Relatórios

O sistema deverá permitir gerar relatórios conforme o nível de acesso do usuário.

---

## 17. Requisitos não funcionais iniciais

### RNF-001 — Segurança

O sistema deverá proteger os dados dos usuários e impedir acesso não autorizado.

### RNF-002 — Controle de acesso

As permissões deverão ser validadas no backend.

### RNF-003 — Rastreabilidade

Informações financeiras e históricas importantes não deverão ser alteradas de forma que comprometa seu histórico.

### RNF-004 — Responsividade

A aplicação deverá ser utilizável em computadores e dispositivos móveis.

### RNF-005 — Manutenibilidade

O código deverá seguir uma arquitetura organizada e princípios que facilitem sua manutenção e evolução.

### RNF-006 — Testabilidade

As principais regras de negócio deverão ser passíveis de testes automatizados.

### RNF-007 — Documentação

Decisões relevantes de negócio e arquitetura deverão ser documentadas.

---

## 18. Escopo inicial

### Dentro do escopo

A primeira versão do sistema deverá priorizar:

* autenticação;
* professores;
* alunos;
* turmas;
* matrículas;
* aulas;
* presença;
* ciclos de cobrança;
* pagamentos;
* reposições;
* controle de vagas;
* visão financeira básica;
* controle de acesso;
* documentação.

### Fora do escopo inicial

Os seguintes recursos poderão ser considerados futuramente:

* integração automática com WhatsApp;
* integração automática com PIX;
* envio automático de cobranças;
* notificações automáticas;
* acompanhamento técnico detalhado do desempenho esportivo;
* aplicativo mobile nativo;
* integração com plataformas externas;
* relatórios avançados;
* inteligência artificial aplicada aos dados dos alunos.

Esses itens poderão ser incorporados posteriormente sem fazer parte da primeira versão.

---

## 19. Premissas

As seguintes premissas foram estabelecidas durante a definição inicial do projeto:

* Uma turma poderá possuir até quatro alunos.
* Uma turma poderá possuir menos de quatro alunos.
* Um aluno poderá participar de várias turmas.
* Um aluno poderá possuir relacionamento com vários professores.
* Um aluno deverá possuir cadastro único.
* O CPF será único entre os alunos.
* Cada matrícula poderá possuir condições comerciais próprias.
* O pagamento será antecipado.
* Cada ciclo dará direito a quatro aulas.
* Um ciclo poderá atravessar meses diferentes.
* O professor não será obrigado a criar uma aula adicional exclusivamente para reposição.
* O sistema deverá ser multi-professor.
* Administradores terão visão global.
* Professores terão acesso restrito aos seus próprios dados.

---

## 20. Questões em aberto

As seguintes decisões ainda precisam ser definidas:

* Qual será o prazo mínimo para o aluno avisar uma ausência e obter direito à reposição?
* Quantos créditos de reposição um aluno poderá acumular?
* O crédito de reposição terá prazo de validade?
* Uma reposição poderá ser realizada em qualquer turma?
* Quais critérios definirão uma turma compatível para reposição?
* O que acontece quando o aluno falta à própria reposição?
* Como serão tratadas aulas canceladas pelo professor?
* Como serão tratadas aulas canceladas por chuva?
* Como serão tratadas aulas canceladas pela administração da quadra?
* Como serão tratados feriados?
* O que acontece quando um aluno encerra sua matrícula com créditos de reposição pendentes?
* Como será calculado o faturamento?
* Quais relatórios serão obrigatórios na primeira versão?
* O administrador poderá editar dados financeiros de qualquer professor?
* Haverá diferentes níveis de administrador no futuro?

Essas questões deverão ser definidas antes da implementação das funcionalidades que dependam delas.

---

## 21. Evolução do documento

Este documento representa a visão e os requisitos conhecidos no início do projeto.

Ele deverá evoluir conforme novas necessidades e regras de negócio forem identificadas.

Alterações importantes deverão ser registradas na documentação correspondente e, quando necessário, acompanhadas de uma decisão arquitetural ou de negócio.

A documentação deverá ser considerada uma fonte de referência para o desenvolvimento do sistema.
