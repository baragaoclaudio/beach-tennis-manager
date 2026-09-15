# Estudo Teórico --- Desenvolvimento de Software

> Material de preparação para entrevistas técnicas --- níveis Junior e
> Pleno.
>
> Objetivo: revisar fundamentos, entender os conceitos de verdade e
> conseguir explicá-los com clareza durante uma entrevista, relacionando
> a teoria com situações práticas do projeto **Beach Tennis Manager**.

------------------------------------------------------------------------

# 1. Como estudar este material

Não tente decorar respostas prontas.

Para cada assunto, procure conseguir responder:

1.  **O que é?**
2.  **Por que existe?**
3.  **Quando eu usaria?**
4.  **Consegue dar um exemplo?**

Uma boa resposta começa com uma definição simples, explica o motivo e
termina com um exemplo prático.

------------------------------------------------------------------------

# 2. Nível Junior

## 2.1 O que é uma classe?

Uma **classe** é uma estrutura que define características e
comportamentos que objetos daquele tipo podem possuir.

Ela funciona como um modelo e pode possuir atributos, métodos,
construtores e regras.

``` typescript
class Aluno {
  constructor(
    public nome: string,
    public idade: number,
  ) {}

  apresentar(): string {
    return `Meu nome é ${this.nome}`;
  }
}
```

**Resposta de entrevista:**

> "Classe é uma estrutura que representa um tipo de objeto, definindo
> seus dados e comportamentos."

------------------------------------------------------------------------

## 2.2 O que é um objeto?

Um **objeto** é uma instância de uma classe.

``` typescript
const aluno = new Aluno("João", 25);
```

Aqui `Aluno` é a classe e `aluno` é o objeto.

Podemos ter vários objetos da mesma classe:

``` typescript
const aluno1 = new Aluno("João", 25);
const aluno2 = new Aluno("Maria", 30);
```

------------------------------------------------------------------------

# 3. Quais linguagens você programa?

A resposta deve refletir sua experiência real.

Uma resposta possível:

> "Minha experiência principal é com PHP e Laravel no backend,
> JavaScript e TypeScript, principalmente com Angular e Ionic. Também
> trabalhei com MySQL e SQL Server. Atualmente estou aprofundando uma
> stack com Node.js, TypeScript, Fastify, React, PostgreSQL e Docker."

Não liste tecnologias que você não conseguiria explicar se o
entrevistador aprofundasse.

------------------------------------------------------------------------

# 4. Qual foi a coisa mais legal que você fez?

Essa pergunta procura entender experiência prática, capacidade de
resolver problemas, impacto e autonomia.

Use:

**Contexto → Ação → Resultado**

> "Em um projeto, tínhamos um problema de X. Eu fiquei responsável por
> Y. Implementei Z e o resultado foi W."

Evite apenas dizer que fez "um sistema muito grande".

------------------------------------------------------------------------

# 5. Principais conceitos de OOP

OOP significa **Object-Oriented Programming**, ou Programação Orientada
a Objetos.

Os quatro conceitos tradicionalmente associados são:

1.  Encapsulamento
2.  Abstração
3.  Herança
4.  Polimorfismo

## Encapsulamento

Esconde detalhes internos e controla como um objeto pode ser manipulado.

``` typescript
class Conta {
  private saldo = 0;

  depositar(valor: number) {
    if (valor <= 0) {
      throw new Error("Valor inválido");
    }

    this.saldo += valor;
  }

  consultarSaldo() {
    return this.saldo;
  }
}
```

## Abstração

Representa apenas os aspectos relevantes de algo, escondendo detalhes
desnecessários.

## Herança

Permite que uma classe derive características e comportamentos de outra.

``` typescript
class Animal {
  comer() {}
}

class Cachorro extends Animal {
  latir() {}
}
```

## Polimorfismo

Permite que diferentes tipos respondam de maneiras diferentes à mesma
abstração.

``` typescript
interface Notificacao {
  enviar(): void;
}

class Email implements Notificacao {
  enviar() {
    console.log("Enviando email");
  }
}

class WhatsApp implements Notificacao {
  enviar() {
    console.log("Enviando WhatsApp");
  }
}
```

------------------------------------------------------------------------

# 6. Classe abstrata x Interface

**Classe abstrata:** pode fornecer implementação, estado e métodos
abstratos.

**Interface:** normalmente define um contrato.

``` typescript
interface Notificacao {
  enviar(mensagem: string): void;
}
```

Uma resposta boa:

> "Uso interface principalmente para definir contratos e reduzir
> acoplamento. Uma classe abstrata faz sentido quando existe
> comportamento ou estado compartilhado entre implementações."

------------------------------------------------------------------------

# 7. Boas práticas

Algumas boas práticas:

-   nomes claros;
-   funções pequenas;
-   evitar duplicação desnecessária;
-   separar responsabilidades;
-   baixo acoplamento;
-   alta coesão;
-   validação de entrada;
-   tratamento adequado de erros;
-   testes automatizados;
-   controle de versão;
-   documentação das decisões importantes;
-   princípios SOLID;
-   segurança;
-   código legível.

Boa prática não significa aplicar uma regra cegamente. O contexto
importa.

------------------------------------------------------------------------

# 8. Frameworks

Seu histórico inclui:

-   Laravel;
-   Angular;
-   Ionic;
-   atualmente Fastify e React no projeto de estudo/portfólio.

Esteja preparado para explicar arquitetura, ciclo de requisição,
middleware/hooks, ORM, validação, autenticação, testes e organização.

------------------------------------------------------------------------

# 9. DevOps / Infraestrutura

DevOps não é apenas Docker.

Conceitos importantes:

-   Linux;
-   Docker;
-   Docker Compose;
-   CI/CD;
-   pipelines;
-   ambientes;
-   variáveis de ambiente;
-   logs;
-   monitoramento;
-   deploy;
-   redes;
-   DNS;
-   reverse proxy;
-   HTTPS;
-   gerenciamento de secrets;
-   observabilidade.

No projeto atual já estão sendo praticados Docker Compose, PostgreSQL em
container, variáveis de ambiente, Git, GitHub, testes e execução de
API/frontend.

------------------------------------------------------------------------

# 10. Versionadores de código

O principal sistema de controle de versão moderno é o **Git**.

Conceitos:

-   repository;
-   commit;
-   branch;
-   merge;
-   rebase;
-   remote;
-   fetch;
-   pull;
-   push;
-   tag;
-   cherry-pick;
-   revert;
-   stash.

### Git x GitHub

**Git** é o sistema de controle de versão.

**GitHub** é uma plataforma que hospeda repositórios Git e oferece
recursos como Pull Requests, Issues, Actions e revisão de código.

------------------------------------------------------------------------

# 11. Por que composição em vez de herança?

**Composition over inheritance** significa preferir montar
comportamentos por meio de objetos/dependências em vez de criar
hierarquias profundas de herança.

Composição tende a oferecer:

-   menor acoplamento;
-   maior flexibilidade;
-   facilidade para trocar comportamentos;
-   menor risco de hierarquias complexas;
-   testes mais simples em muitos casos.

Isso não significa que herança seja proibida.

------------------------------------------------------------------------

# 12. O que é uma função pura?

Uma função pura possui duas características:

1.  Para a mesma entrada, produz sempre a mesma saída.
2.  Não possui efeitos colaterais observáveis.

``` typescript
function somar(a: number, b: number): number {
  return a + b;
}
```

Efeitos colaterais incluem:

-   alterar variável externa;
-   escrever arquivo;
-   acessar banco;
-   fazer requisição HTTP;
-   modificar estado compartilhado.

Funções puras facilitam testes e previsibilidade.

------------------------------------------------------------------------

# 13. Verbos HTTP

  Método   Uso comum
  -------- -----------------------
  GET      Consultar
  POST     Criar/processar
  PUT      Substituir um recurso
  PATCH    Alterar parcialmente
  DELETE   Remover

### PUT x PATCH

**PUT** normalmente representa substituição do recurso.

**PATCH** representa alteração parcial.

------------------------------------------------------------------------

# 14. Status Codes

## 2xx --- sucesso

-   **200 OK** --- sucesso.
-   **201 Created** --- recurso criado.
-   **204 No Content** --- sucesso sem conteúdo no corpo.

## 3xx --- redirecionamento

-   **301 Moved Permanently** --- recurso movido permanentemente.
-   **304 Not Modified** --- relacionado a mecanismos
    condicionais/cache.

## 4xx --- erro do cliente

-   **400 Bad Request** --- requisição inválida.
-   **401 Unauthorized** --- autenticação ausente ou inválida.
-   **403 Forbidden** --- autenticado, mas sem permissão.
-   **404 Not Found** --- recurso não encontrado.
-   **409 Conflict** --- conflito com o estado atual.

## 5xx --- erro do servidor

-   **500 Internal Server Error** --- erro interno.
-   **502 Bad Gateway** --- resposta inválida recebida por servidor
    intermediário.
-   **503 Service Unavailable** --- serviço indisponível.

------------------------------------------------------------------------

# 15. Bancos de dados

Seu histórico inclui:

-   MySQL;
-   SQL Server;
-   PostgreSQL no projeto atual.

Esteja preparado para:

-   índices;
-   chaves primárias;
-   chaves estrangeiras;
-   normalização;
-   transações;
-   locks;
-   isolamento;
-   joins;
-   constraints;
-   cardinalidade;
-   planos de execução;
-   migrations.

------------------------------------------------------------------------

# 16. Integração com APIs

Uma integração normalmente envolve:

1.  construir a requisição;
2.  autenticar;
3.  enviar dados;
4.  interpretar resposta;
5.  tratar erros;
6.  lidar com timeout;
7.  eventualmente implementar retry;
8.  registrar informações para diagnóstico.

É importante considerar:

``` text
API disponível
API indisponível
timeout
resposta inválida
401
403
404
429
500
```

------------------------------------------------------------------------

# 17. Livros

Essa pergunta procura entender seu hábito de estudo.

Não invente livros.

Se não lembrar ou não tiver hábito de leitura técnica, uma resposta
honesta é melhor:

> "Tenho estudado principalmente por documentação oficial, cursos e
> projetos práticos. Estou estruturando uma rotina de leitura técnica."

O importante é realmente conhecer aquilo que mencionar.

------------------------------------------------------------------------

# 18. Nível Pleno

Agora o entrevistador normalmente espera mais do que uma definição.

Procure explicar:

-   por que uma técnica existe;
-   quais problemas resolve;
-   quais trade-offs possui;
-   quando não usar;
-   como aplicaria na prática.

------------------------------------------------------------------------

# 19. O que é Injeção de Dependência?

É uma técnica em que um objeto recebe de fora as dependências que
precisa.

Em vez de:

``` typescript
class StudentService {
  private repository = new StudentRepository();
}
```

podemos fazer:

``` typescript
class StudentService {
  constructor(
    private repository: StudentRepository,
  ) {}
}
```

Benefícios:

-   menor acoplamento;
-   maior testabilidade;
-   facilidade para substituir implementações;
-   separação de responsabilidades.

Com uma interface:

``` typescript
interface StudentRepository {
  findById(id: string): Promise<Student | null>;
}
```

um teste pode fornecer um repositório fake.

------------------------------------------------------------------------

# 20. Design Patterns

Design Patterns são soluções recorrentes para problemas recorrentes de
design.

Exemplos:

-   Factory;
-   Strategy;
-   Adapter;
-   Decorator;
-   Observer;
-   Repository;
-   Builder;
-   Singleton;
-   Command.

Não basta decorar nomes.

Pergunte:

> "Qual problema esse padrão resolve?"

### Strategy

Imagine diferentes formas de calcular desconto:

``` text
DescontoAluno
DescontoPromocional
DescontoProfessor
```

Uma estratégia comum permite trocar a implementação sem alterar o código
consumidor.

Design Pattern não significa automaticamente código melhor. Padrões
desnecessários aumentam complexidade.

------------------------------------------------------------------------

# 21. SOLID

## S --- Single Responsibility Principle

Uma classe/módulo deve ter uma responsabilidade bem definida e um motivo
principal para mudança.

Não significa que uma classe só pode ter um método.

## O --- Open/Closed Principle

Software deve estar aberto para extensão, mas fechado para modificação.

## L --- Liskov Substitution Principle

Um subtipo deve poder substituir seu tipo base sem quebrar as
expectativas do código cliente.

## I --- Interface Segregation Principle

É melhor ter interfaces menores e específicas do que uma interface
gigante que obriga implementações a depender de métodos que não usam.

## D --- Dependency Inversion Principle

Módulos de alto nível não devem depender diretamente de detalhes
concretos. Ambos devem depender de abstrações.

------------------------------------------------------------------------

# 22. Onde deve ficar a lógica de negócio?

Uma regra importante:

> Regras de negócio não devem ficar espalhadas aleatoriamente entre
> controller, banco, frontend e infraestrutura.

Um exemplo de organização:

``` text
HTTP
 ↓
Controller / Route
 ↓
Application / Use Case
 ↓
Domain
 ↓
Infrastructure
```

Uma regra como:

> "Um ciclo possui quatro aulas efetivamente utilizadas."

é regra de negócio.

Ela não deveria depender diretamente de Fastify, PostgreSQL, HTTP ou
React.

------------------------------------------------------------------------

# 23. Padrões de arquitetura

Conheça:

-   Layered Architecture;
-   Clean Architecture;
-   Hexagonal Architecture;
-   Ports and Adapters;
-   Modular Monolith;
-   Microservices.

## Layered

Divide o sistema em camadas:

``` text
Controller
Service
Repository
Database
```

## Clean Architecture

Procura manter regras centrais independentes de detalhes externos.

## Hexagonal Architecture

Também conhecida como Ports and Adapters.

``` text
Domínio / aplicação
        ↕
     Ports
        ↕
    Adapters
```

Banco, HTTP e serviços externos são detalhes conectados por adaptadores.

## Modular Monolith

Uma única aplicação implantável, mas organizada internamente em módulos
bem separados.

------------------------------------------------------------------------

# 24. O que é uma entidade anêmica?

Uma entidade anêmica é um objeto que contém principalmente dados,
enquanto regras e comportamentos relacionados ficam espalhados em outros
serviços.

Exemplo:

``` typescript
class Student {
  id: string;
  name: string;
  price: number;
}
```

E as regras ficam em vários serviços.

O conceito é especialmente discutido em contraste com modelos ricos em
comportamento e Domain-Driven Design.

Importante:

> Entidade anêmica não significa automaticamente que o sistema está
> errado.

Depende do contexto arquitetural.

------------------------------------------------------------------------

# 25. Principais mudanças do HTTP/2

HTTP/2 trouxe melhorias importantes:

-   multiplexação;
-   compressão de headers com HPACK;
-   streams;
-   frames binários;
-   múltiplos streams dentro de uma conexão TCP.

A multiplexação permite transportar múltiplas requisições/respostas
simultaneamente pela mesma conexão.

HTTP/2 não significa simplesmente "HTTP mais rápido"; existem vários
fatores envolvidos no ganho real.

------------------------------------------------------------------------

# 26. O que é um Proxy Reverso?

Um reverse proxy fica na frente dos servidores da aplicação:

``` text
Cliente
   ↓
Reverse Proxy
   ↓
API / Aplicação
```

Exemplos:

-   Nginx;
-   HAProxy;
-   Traefik.

Pode ser usado para:

-   TLS/HTTPS;
-   roteamento;
-   balanceamento;
-   cache;
-   compressão;
-   controle de acesso;
-   esconder infraestrutura interna.

Um proxy tradicional representa o cliente; um reverse proxy representa o
servidor.

------------------------------------------------------------------------

# 27. Sistemas de fila

Filas permitem processamento assíncrono.

``` text
HTTP Request
   ↓
Enfileira tarefa
   ↓
Resposta rápida

Fila
   ↓
Worker
   ↓
Processamento
```

Tecnologias:

-   RabbitMQ;
-   Kafka;
-   Amazon SQS;
-   Redis Streams;
-   BullMQ.

Usos:

-   emails;
-   processamento de arquivos;
-   notificações;
-   tarefas demoradas;
-   integrações externas.

Conceitos:

-   producer;
-   consumer;
-   worker;
-   retry;
-   dead-letter queue;
-   idempotência;
-   ordering;
-   acknowledgment.

------------------------------------------------------------------------

# 28. Proxy x Decorator

Os dois podem envolver um objeto e interceptar chamadas.

## Proxy

Controla ou intermedeia o acesso a um objeto.

Pode adicionar:

-   autorização;
-   lazy loading;
-   cache;
-   controle de acesso.

## Decorator

Adiciona comportamento a um objeto sem alterar diretamente sua
implementação original.

``` text
Repository
    ↓
CacheDecorator
    ↓
LoggingDecorator
```

Diferença simplificada:

**Proxy:** foco em controlar/intermediar acesso.

**Decorator:** foco em adicionar comportamento.

As fronteiras podem se sobrepor na prática.

------------------------------------------------------------------------

# 29. Arquitetura de microsserviços

Microsserviços dividem o sistema em serviços menores e relativamente
independentes.

``` text
                    ┌── Student Service
Cliente → Gateway ──┼── Payment Service
                    ├── Class Service
                    └── Notification Service
```

Comunicação pode ocorrer via:

-   HTTP;
-   gRPC;
-   mensagens;
-   eventos.

### Benefícios

-   deploy independente;
-   escalabilidade independente;
-   isolamento de domínios;
-   equipes independentes.

### Custos

-   maior complexidade operacional;
-   observabilidade distribuída;
-   comunicação de rede;
-   consistência distribuída;
-   deploy mais complexo;
-   debugging mais difícil;
-   necessidade de lidar com falhas entre serviços.

Microsserviços não são automaticamente melhores. Para sistemas menores,
um monólito modular pode ser mais adequado.

------------------------------------------------------------------------

# 30. SQL x NoSQL

## SQL

Bancos relacionais trabalham com:

-   tabelas;
-   linhas;
-   colunas;
-   relacionamentos;
-   constraints;
-   SQL;
-   transações.

Exemplos:

-   PostgreSQL;
-   MySQL;
-   SQL Server;
-   Oracle.

## NoSQL

"NoSQL" reúne diferentes modelos não relacionais:

-   documentos;
-   chave-valor;
-   grafos;
-   wide-column.

Exemplos:

-   MongoDB;
-   Redis;
-   Cassandra;
-   Neo4j.

Não pense em "SQL para pequeno e NoSQL para grande".

A escolha depende dos requisitos.

Para o Beach Tennis Manager, PostgreSQL faz sentido porque existem
muitos relacionamentos e regras envolvendo:

``` text
Professor
Aluno
Turma
Matrícula
Aula
Ciclo
Pagamento
Reposição
```

------------------------------------------------------------------------

# 31. Alta coesão e baixo acoplamento

## Alta coesão

Uma unidade de código possui responsabilidades fortemente relacionadas.

``` text
PaymentService
 ├── createPayment
 ├── confirmPayment
 └── cancelPayment
```

Essas responsabilidades pertencem ao mesmo domínio.

## Baixo acoplamento

Um módulo depende pouco dos detalhes internos de outros módulos.

Por exemplo, depender diretamente de `PostgresStudentRepository` cria
mais acoplamento à infraestrutura do que depender de uma abstração
`StudentRepository`.

### Objetivo

``` text
Alta coesão
+
Baixo acoplamento
```

Isso tende a produzir sistemas mais fáceis de testar, modificar,
entender e evoluir.

------------------------------------------------------------------------

# 32. Ligando a teoria ao Beach Tennis Manager

  Conceito                 Aplicação possível
  ------------------------ --------------------------------------
  OOP                      Entidades e serviços
  Encapsulamento           Regras protegidas dentro do domínio
  Abstração                Interfaces/ports
  Polimorfismo             Diferentes implementações
  Composição               Composição de serviços e componentes
  Funções puras            Cálculos determinísticos
  HTTP                     API REST
  Status codes             Contratos da API
  Banco SQL                PostgreSQL
  Injeção de dependência   Serviços e repositórios
  SOLID                    Organização dos módulos
  Repository               Acesso ao banco
  Arquitetura em camadas   Separação de responsabilidades
  Baixo acoplamento        Ports/adapters e interfaces
  Alta coesão              Módulos focados
  Docker                   Infraestrutura local
  Git                      Controle de versão
  Testes                   Validação das regras

------------------------------------------------------------------------

# 33. Perguntas para praticar

## Junior

1.  O que é uma classe?
2.  O que é um objeto?
3.  Qual a diferença entre classe e objeto?
4.  O que é encapsulamento?
5.  O que é abstração?
6.  O que é herança?
7.  O que é polimorfismo?
8.  Qual a diferença entre classe abstrata e interface?
9.  O que é uma função pura?
10. O que significa composição sobre herança?
11. Quais métodos HTTP você conhece?
12. Qual a diferença entre PUT e PATCH?
13. O que significa 200?
14. Qual a diferença entre 401 e 403?
15. O que significa 404?
16. O que significa 500?
17. O que é Git?
18. Qual a diferença entre Git e GitHub?
19. O que é Docker?
20. O que é uma API?
21. O que é REST?
22. Quais bancos você conhece?
23. O que é uma chave primária?
24. O que é uma chave estrangeira?
25. O que é um índice?

## Pleno

1.  O que é injeção de dependência?
2.  Por que injeção de dependência ajuda nos testes?
3.  O que são Design Patterns?
4.  Quais Patterns você conhece?
5.  Explique SOLID.
6.  O que é Dependency Inversion?
7.  Onde deve ficar a lógica de negócio?
8.  O que é Clean Architecture?
9.  O que é arquitetura hexagonal?
10. O que é um monólito modular?
11. O que é uma entidade anêmica?
12. O que mudou no HTTP/2?
13. O que é multiplexação?
14. O que é um reverse proxy?
15. Para que serve um sistema de filas?
16. O que é idempotência?
17. Qual a diferença entre Proxy e Decorator?
18. Como funcionam microsserviços?
19. Quais são os problemas de microsserviços?
20. Qual a diferença entre SQL e NoSQL?
21. O que é alta coesão?
22. O que é baixo acoplamento?
23. Como reduzir acoplamento?
24. Quando escolher monólito em vez de microsserviços?
25. Quais são os trade-offs de uma decisão arquitetural?

------------------------------------------------------------------------

# 34. Método de resposta em entrevista

Para cada pergunta:

``` text
1. Definição
2. Motivo
3. Exemplo
4. Trade-off (quando fizer sentido)
```

Exemplo:

**Pergunta:** O que é injeção de dependência?

``` text
Definição:
É uma técnica em que uma classe recebe suas dependências de fora.

Motivo:
Reduz acoplamento e facilita testes.

Exemplo:
Um StudentService recebe um StudentRepository pelo construtor.

Trade-off:
Pode aumentar abstrações e configuração se usada de maneira exagerada.
```

------------------------------------------------------------------------

# 35. Sequência recomendada de estudo

``` text
Fundamentos
    ↓
OOP
    ↓
SOLID
    ↓
Injeção de Dependência
    ↓
Design Patterns
    ↓
Arquitetura
    ↓
HTTP / APIs
    ↓
Banco de Dados
    ↓
Filas
    ↓
Infraestrutura
    ↓
Trade-offs
```

O objetivo não é responder como um livro.

É conseguir conversar tecnicamente, explicar decisões e defender por que
escolheu determinada solução.

------------------------------------------------------------------------

# 36. Regra de ouro para entrevistas

Não tente parecer mais experiente do que realmente é.

Uma resposta como:

> "Não implementei isso diretamente, mas entendo o conceito e consigo
> explicar como eu investigaria ou implementaria."

é melhor do que inventar experiência.

Para uma posição Pleno, são importantes:

-   raciocínio;
-   investigação;
-   trade-offs;
-   comunicação;
-   organização;
-   capacidade de evoluir uma solução.

------------------------------------------------------------------------

# 37. Ciclo de estudo

Este documento deve ser estudado em paralelo com:

-   `docs/06-estado-atual.md` --- estado atual e decisões tecnológicas;
-   `docs/04-arquitetura.md` --- arquitetura;
-   `docs/02-regras-de-negocio.md` --- regras;
-   código do projeto --- aplicação prática.

O ciclo recomendado:

``` text
ESTUDAR TEORIA
      ↓
ENTENDER O CONCEITO
      ↓
IDENTIFICAR NO PROJETO
      ↓
IMPLEMENTAR
      ↓
TESTAR
      ↓
EXPLICAR COM SUAS PRÓPRIAS PALAVRAS
```

------------------------------------------------------------------------

# 38. Checklist de domínio

Antes de considerar um assunto estudado:

-   [ ] Consigo definir o conceito sem consultar.
-   [ ] Consigo explicar por que ele existe.
-   [ ] Consigo dar um exemplo.
-   [ ] Consigo explicar quando usaria.
-   [ ] Consigo explicar quando evitaria.
-   [ ] Consigo relacionar o conceito ao Beach Tennis Manager.
-   [ ] Consigo responder uma pergunta de aprofundamento.

Quando conseguir fazer isso, o conceito deixou de ser apenas algo
decorado e passou a fazer parte do seu conhecimento técnico.
