# Estudo Teórico — Desenvolvimento de Software

> Guia didático de preparação para entrevistas técnicas — níveis Junior e Pleno.
>
> Objetivo: entender os conceitos de verdade, saber explicar cada termo técnico com clareza e relacionar teoria, código, testes e arquitetura ao projeto **Beach Tennis Manager**.

---

# 1. Como usar este material

Não tente decorar respostas prontas.

Para cada assunto, procure conseguir responder:

1. O que é?
2. Por que existe?
3. Qual problema resolve?
4. Como funciona?
5. Quando eu usaria?
6. Quando eu evitaria?
7. Consegue dar um exemplo?
8. Como isso apareceria no Beach Tennis Manager?

Uma boa resposta de entrevista normalmente segue:

**definição → motivo → exemplo → trade-off → aplicação prática.**

### O que é um trade-off?

Trade-off é uma escolha em que ganhar uma característica normalmente significa abrir mão de outra.

Exemplo:

- uma solução muito simples pode ser fácil de manter;
- uma solução muito genérica pode ser mais flexível;
- porém, a solução genérica pode aumentar a complexidade.

Portanto, desenvolvimento de software não é apenas perguntar "qual é a melhor tecnologia?", mas também:

> "Qual solução resolve este problema com complexidade adequada?"

---

# PARTE I — FUNDAMENTOS

# 2. O que é programação?

Programação é o processo de escrever instruções que um computador consegue executar para produzir determinado comportamento.

Um programa recebe informações, processa essas informações e produz algum resultado.

Exemplo:

```typescript
function calcularTotal(valor: number, quantidade: number): number {
  return valor * quantidade;
}
```

A função recebe dois valores, realiza uma operação e devolve um resultado.

## Por que isso importa?

Antes de aprender arquitetura, padrões e frameworks, precisamos entender o básico:

```text
entrada
  ↓
processamento
  ↓
saída
```

Uma API, por exemplo, também segue essa ideia:

```text
requisição HTTP
  ↓
validação
  ↓
regra de negócio
  ↓
banco
  ↓
resposta HTTP
```

---

# 3. Variável

Uma variável é um nome associado a um valor que o programa utiliza durante sua execução.

```typescript
const nome = "João";
let idade = 28;
```

`nome` e `idade` são variáveis.

## const x let

`const` impede a reatribuição da variável.

```typescript
const nome = "João";
// nome = "Maria"; // erro
```

`let` permite reatribuição:

```typescript
let idade = 28;
idade = 29;
```

Isso não significa que objetos declarados com `const` sejam completamente imutáveis.

```typescript
const aluno = {
  nome: "João",
};

aluno.nome = "Maria";
```

A referência não mudou, mas uma propriedade do objeto foi alterada.

---

# 4. Tipos

Um tipo descreve que espécie de valor estamos manipulando.

Em TypeScript podemos ter:

```typescript
const nome: string = "João";
const idade: number = 28;
const ativo: boolean = true;
```

Também podemos criar tipos próprios:

```typescript
type Aluno = {
  id: string;
  nome: string;
};
```

## TypeScript garante tudo em tempo de execução?

Não.

TypeScript ajuda principalmente durante desenvolvimento e compilação.

Se uma API recebe JSON vindo da internet, o conteúdo real pode não obedecer ao tipo declarado.

Por isso validação de entrada continua sendo importante.

Exemplo com Zod:

```typescript
const schema = z.object({
  nome: z.string(),
  idade: z.number().int().positive(),
});
```

Aqui estamos verificando os dados que realmente chegaram.

---

# 5. Função

Uma função agrupa um comportamento que pode receber dados e produzir um resultado.

```typescript
function somar(a: number, b: number): number {
  return a + b;
}
```

- `a` e `b` são parâmetros.
- `2` e `3`, em `somar(2, 3)`, são argumentos.
- `number` depois dos parênteses indica o tipo retornado.

## Parâmetro x argumento

```typescript
function saudar(nome: string) {
  return `Olá ${nome}`;
}

saudar("Claudio");
```

`nome` é parâmetro.

`"Claudio"` é argumento.

---

# 6. O que é uma classe?

Uma classe é uma estrutura usada para representar um tipo de objeto, reunindo dados e comportamentos relacionados.

```typescript
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

A classe descreve o que um `Aluno` possui e faz.

---

# 7. O que é um objeto?

Um objeto é uma instância concreta de uma classe.

```typescript
const aluno = new Aluno("João", 25);
```

Aqui:

```text
Aluno = classe
aluno = objeto
```

Podemos criar vários objetos:

```typescript
const aluno1 = new Aluno("João", 25);
const aluno2 = new Aluno("Maria", 30);
```

A classe funciona como uma definição; os objetos são instâncias concretas.

---

# PARTE II — ORIENTAÇÃO A OBJETOS

# 8. O que é OOP?

OOP significa **Object-Oriented Programming**, ou Programação Orientada a Objetos.

É um paradigma de programação que organiza o software em torno de objetos que possuem dados e comportamentos.

Os conceitos tradicionalmente associados são:

- encapsulamento;
- abstração;
- herança;
- polimorfismo.

Esses conceitos não devem ser apenas decorados. Eles existem para ajudar a organizar responsabilidades e controlar a complexidade do software.

---

# 9. Encapsulamento

Encapsulamento significa controlar como o estado interno de um objeto pode ser acessado ou alterado.

Imagine uma conta bancária.

Não queremos que qualquer parte do programa possa fazer:

```typescript
conta.saldo = -100000;
```

Podemos proteger o estado:

```typescript
class Conta {
  private saldo = 0;

  depositar(valor: number): void {
    if (valor <= 0) {
      throw new Error("Valor inválido");
    }

    this.saldo += valor;
  }

  consultarSaldo(): number {
    return this.saldo;
  }
}
```

Agora o objeto controla como seu saldo pode mudar.

## O que é estado?

Estado são os dados que representam a situação atual de um objeto.

No exemplo:

```text
saldo = 500
```

é parte do estado da conta.

## O que é uma regra/invariante?

Uma invariante é uma condição que deve continuar verdadeira enquanto o objeto estiver válido.

Por exemplo:

> saldo não pode ser alterado por uma operação inválida.

O encapsulamento ajuda a proteger essas condições.

---

# 10. Abstração

Abstração significa representar aquilo que é relevante para determinado contexto e esconder detalhes desnecessários.

Imagine dirigir um carro.

Você utiliza:

```text
acelerador
freio
volante
```

Não precisa conhecer cada detalhe da combustão interna para dirigir.

No software acontece algo parecido.

Um serviço pode oferecer:

```typescript
paymentService.charge(payment);
```

O código que utiliza o serviço não precisa conhecer todos os detalhes internos da integração com o provedor.

---

# 11. Herança

Herança permite que uma classe seja baseada em outra.

```typescript
class Animal {
  comer(): void {
    console.log("Comendo");
  }
}

class Cachorro extends Animal {
  latir(): void {
    console.log("Au");
  }
}
```

`Cachorro` herda o comportamento de `Animal`.

Herança pode ser útil quando existe uma relação realmente forte de especialização.

Mas hierarquias profundas podem aumentar o acoplamento.

---

# 12. Polimorfismo

Polimorfismo significa que diferentes implementações podem ser utilizadas através de uma mesma abstração.

```typescript
interface Notificacao {
  enviar(mensagem: string): void;
}

class EmailNotificacao implements Notificacao {
  enviar(mensagem: string): void {
    console.log(`Email: ${mensagem}`);
  }
}

class WhatsAppNotificacao implements Notificacao {
  enviar(mensagem: string): void {
    console.log(`WhatsApp: ${mensagem}`);
  }
}
```

Podemos trabalhar com:

```typescript
function notificar(
  notificacao: Notificacao,
  mensagem: string,
) {
  notificacao.enviar(mensagem);
}
```

O código consumidor não precisa conhecer qual implementação concreta recebeu.

---

# 13. Interface

Uma interface define um contrato.

Contrato significa:

> "Quem implementar isso precisa oferecer estas operações."

```typescript
interface StudentRepository {
  findById(id: string): Promise<Student | null>;
  save(student: Student): Promise<void>;
}
```

A interface não precisa saber se o armazenamento será:

```text
PostgreSQL
MySQL
memória
API externa
fake de teste
```

Ela descreve o que o consumidor precisa.

---

# 14. Classe abstrata x interface

Uma classe abstrata pode possuir:

- estado;
- métodos implementados;
- métodos abstratos;
- comportamento compartilhado.

Uma interface é principalmente um contrato.

Exemplo:

```typescript
interface Notificacao {
  enviar(mensagem: string): void;
}
```

Uma classe abstrata:

```typescript
abstract class Relatorio {
  abstract gerar(): string;

  salvar(): void {
    console.log("Salvando relatório");
  }
}
```

### Como responder na entrevista?

> "Interface é útil para definir contratos e permitir diferentes implementações. Classe abstrata faz mais sentido quando existe comportamento ou estado compartilhado entre classes relacionadas."

---

# 15. Composição

Composição significa construir um objeto utilizando outros objetos/dependências.

```typescript
class RelatorioService {
  constructor(
    private repository: StudentRepository,
  ) {}
}
```

O serviço possui uma dependência de repositório.

Em vez de criar uma hierarquia:

```text
Classe A
  ↓
Classe B
  ↓
Classe C
  ↓
Classe D
```

podemos montar comportamentos:

```text
Service
 ├── Repository
 ├── Validator
 └── Notifier
```

---

# 16. Composição x herança

Uma regra prática muito conhecida é:

> Prefira composição à herança quando composição representar melhor o relacionamento.

Herança:

```text
Cachorro IS-A Animal
```

Composição:

```text
Aula HAS-A Horário
```

Ou:

```text
UseCase HAS-A Repository
```

Composição geralmente facilita trocar uma dependência sem modificar uma hierarquia inteira.

Herança não é proibida. Ela deve ser usada quando a relação de especialização realmente fizer sentido.

---

# 17. O que é acoplamento?

**Acoplamento** é o grau de dependência entre partes de um sistema.

Imagine:

```text
A depende diretamente de B
```

Se A precisa conhecer muitos detalhes de B, o acoplamento tende a ser maior.

Exemplo:

```typescript
class StudentService {
  private repository = new PostgresStudentRepository();
}
```

Agora `StudentService` está diretamente ligado à implementação PostgreSQL.

Se mudarmos para outro armazenamento, precisamos mexer no serviço.

Podemos reduzir esse acoplamento:

```typescript
interface StudentRepository {
  findById(id: string): Promise<Student | null>;
}

class StudentService {
  constructor(
    private repository: StudentRepository,
  ) {}
}
```

Agora o serviço depende do contrato, e não diretamente da implementação.

## Baixo acoplamento

Baixo acoplamento significa que módulos possuem menos dependências desnecessárias entre si.

Isso tende a facilitar:

- testes;
- manutenção;
- evolução;
- substituição de implementações.

---

# 18. O que é coesão?

**Coesão** mede o quanto as responsabilidades de uma parte do sistema estão relacionadas entre si.

Alta coesão:

```text
StudentService
 ├── criar aluno
 ├── atualizar aluno
 └── buscar aluno
```

As responsabilidades estão relacionadas.

Baixa coesão:

```text
StudentService
 ├── criar aluno
 ├── enviar email
 ├── gerar PDF
 ├── calcular imposto
 ├── fazer backup
 └── processar pagamento
```

Aqui existem muitas responsabilidades diferentes.

## Relação entre coesão e acoplamento

Uma boa meta é:

```text
alta coesão
+
baixo acoplamento
```

Isso significa que cada módulo possui responsabilidades relacionadas e depende pouco de detalhes externos.

---

# PARTE III — QUALIDADE DE CÓDIGO

# 19. Função pura

Uma função pura possui duas propriedades:

1. Para a mesma entrada, sempre produz a mesma saída.
2. Não causa efeitos colaterais observáveis.

```typescript
function somar(a: number, b: number): number {
  return a + b;
}
```

Não depende de banco, horário atual, arquivo ou variável global.

## Efeito colateral

Efeito colateral é uma alteração/ação externa provocada pela execução da função.

Exemplos:

- escrever no banco;
- escrever arquivo;
- fazer requisição HTTP;
- alterar variável global;
- enviar mensagem;
- modificar estado compartilhado.

Nem todo efeito colateral é ruim.

O ponto é controlá-lo.

---

# 20. DRY

DRY significa **Don't Repeat Yourself**.

A ideia é evitar duplicação de conhecimento ou regra.

Porém:

> DRY não significa transformar qualquer código parecido em uma abstração.

Duas partes podem parecer iguais hoje e possuir motivos diferentes para mudar amanhã.

---

# 21. KISS

KISS significa **Keep It Simple**.

A ideia é preferir soluções simples quando elas resolvem adequadamente o problema.

Exemplo:

Se um `if` resolve uma regra, talvez não seja necessário criar cinco classes e três patterns.

---

# 22. YAGNI

YAGNI significa **You Aren't Gonna Need It**.

A ideia é evitar implementar funcionalidades apenas porque talvez sejam necessárias no futuro.

Exemplo:

Se o Beach Tennis Manager ainda não precisa de suporte a 20 gateways de pagamento, não precisamos criar uma arquitetura gigantesca para eles agora.

Podemos projetar de forma extensível sem implementar complexidade desnecessária.

---

# PARTE IV — SOLID E DEPENDÊNCIAS

# 23. O que é Injeção de Dependência?

Uma dependência é algo que uma classe precisa para executar seu trabalho.

Exemplo:

```text
StudentService precisa de StudentRepository
```

Injeção de Dependência significa fornecer essa dependência externamente.

Evitar:

```typescript
class StudentService {
  private repository = new PostgresStudentRepository();
}
```

Preferir:

```typescript
class StudentService {
  constructor(
    private repository: StudentRepository,
  ) {}
}
```

Agora quem cria `StudentService` decide qual implementação fornecer.

---

# 24. Inversão de Dependência x Injeção de Dependência

Esses conceitos são relacionados, mas não são a mesma coisa.

### Injeção de Dependência

É uma técnica para fornecer dependências externamente.

### Dependency Inversion Principle

É um princípio do SOLID que, de forma simplificada, recomenda que módulos de alto nível não dependam diretamente de detalhes concretos.

Exemplo:

```text
Errado conceitualmente:

UseCase
   ↓
PostgresRepository
```

Podemos ter:

```text
UseCase
   ↓
StudentRepository (abstração)
   ↑
PostgresStudentRepository
```

O caso de uso conhece o contrato.

A implementação concreta conhece o contrato.

Isso reduz acoplamento.

---

# 25. SOLID

SOLID é um conjunto de cinco princípios de design de software.

## S — Single Responsibility Principle

Uma unidade de código deve possuir uma responsabilidade bem definida e um motivo principal para mudança.

Não significa:

> "uma classe só pode ter um método."

Significa evitar misturar responsabilidades sem relação.

---

## O — Open/Closed Principle

Entidades de software devem ser abertas para extensão e fechadas para modificação.

A ideia é conseguir adicionar comportamentos sem precisar alterar constantemente código estável.

---

## L — Liskov Substitution Principle

Um subtipo deve poder ser utilizado no lugar do tipo base sem quebrar as expectativas do código.

Um exemplo clássico de problema ocorre quando uma classe filha herda uma operação, mas não consegue respeitar o comportamento esperado pelo tipo pai.

---

## I — Interface Segregation Principle

É preferível ter interfaces pequenas e específicas do que uma interface gigantesca.

Em vez de:

```typescript
interface UserService {
  create(): void;
  update(): void;
  delete(): void;
  sendEmail(): void;
  exportPdf(): void;
  processPayment(): void;
}
```

podemos separar contratos conforme as responsabilidades.

---

## D — Dependency Inversion Principle

Módulos importantes devem depender de abstrações, não diretamente de detalhes concretos.

Esse princípio aparece diretamente no nosso uso de:

```text
Use Case
   ↓
Repository interface
   ↑
Drizzle/PostgreSQL
```

---

# PARTE V — DESIGN PATTERNS

# 26. O que é um Design Pattern?

Design Pattern é uma solução recorrente para um problema recorrente de design de software.

Um pattern não é uma biblioteca nem um código que devemos copiar cegamente.

Antes de usar um pattern, pergunte:

> "Qual problema estou tentando resolver?"

---

# 27. Strategy

Strategy permite encapsular diferentes algoritmos/comportamentos atrás de uma mesma abstração.

Exemplo:

```text
CalculoPreco
 ├── PrecoNormal
 ├── PrecoComDesconto
 └── PrecoPromocional
```

O consumidor pode utilizar uma estratégia sem conhecer seus detalhes.

---

# 28. Factory

Factory centraliza a criação de objetos quando criar esses objetos envolve decisões ou detalhes que não queremos espalhar pelo código.

Exemplo conceitual:

```typescript
const notification = NotificationFactory.create("email");
```

A chamada não precisa conhecer todos os detalhes da construção.

---

# 29. Adapter

Adapter permite adaptar uma interface para outra.

Imagine que nosso sistema espera:

```typescript
interface PaymentGateway {
  charge(amount: number): Promise<void>;
}
```

Mas um provedor externo possui:

```typescript
externalProvider.makePayment(valueInCents: number);
```

Um Adapter pode traduzir uma interface para a outra.

---

# 30. Decorator

Decorator adiciona comportamento a um objeto sem precisar modificar sua implementação original.

Exemplo:

```text
Repository
   ↓
LoggingRepository
   ↓
CacheRepository
   ↓
Repository real
```

O comportamento pode ser "envolvido".

---

# 31. Proxy x Decorator

Os dois podem envolver outro objeto, mas o objetivo pode ser diferente.

### Decorator

Normalmente adiciona comportamento.

Exemplo:

```text
Repository
 ↓
LoggingDecorator
```

### Proxy

Normalmente controla o acesso ao objeto.

Exemplo:

```text
Proxy
 ↓
verifica autorização
 ↓
objeto real
```

As implementações podem parecer semelhantes, mas a intenção é diferente.

---

# PARTE VI — ARQUITETURA

# 32. O que é arquitetura de software?

Arquitetura é a organização estrutural do sistema e das suas principais decisões técnicas.

Ela envolve:

- componentes;
- responsabilidades;
- dependências;
- comunicação;
- persistência;
- segurança;
- implantação;
- limites entre módulos.

Arquitetura não é simplesmente criar pastas.

---

# 33. Controller

Controller é a parte que normalmente recebe uma requisição HTTP e coordena a entrada/saída da camada web.

Exemplo:

```text
POST /students
       ↓
Controller
       ↓
CreateStudentUseCase
```

O controller não deveria concentrar toda a regra de negócio.

---

# 34. Use Case

Use Case representa uma ação relevante para o sistema.

Exemplos:

```text
CreateStudent
RegisterAbsence
UseMakeupCredit
CreatePayment
CloseCycle
```

O Use Case coordena o fluxo necessário para realizar aquela ação.

---

# 35. Domínio

Domínio é o conjunto de conceitos e regras relacionados ao problema que estamos resolvendo.

No Beach Tennis Manager:

```text
Aluno
Professor
Turma
Aula
Matrícula
Ciclo
Pagamento
Falta
Reposição
Crédito de reposição
```

Esses conceitos fazem parte do domínio.

---

# 36. Infraestrutura

Infraestrutura contém detalhes técnicos externos ao núcleo da regra de negócio.

Exemplos:

```text
PostgreSQL
Drizzle
Fastify
JWT
Cookies
APIs externas
sistema de arquivos
serviços de email
```

A ideia é evitar que a regra de negócio fique dependente desnecessariamente desses detalhes.

---

# 37. Repository

Repository é uma abstração para acesso a dados.

Exemplo:

```typescript
interface StudentRepository {
  findById(id: string): Promise<Student | null>;
  save(student: Student): Promise<void>;
}
```

Uma implementação pode utilizar PostgreSQL:

```text
StudentRepository
       ↑
DrizzleStudentRepository
       ↓
PostgreSQL
```

O caso de uso não precisa conhecer SQL diretamente.

---

# 38. Arquitetura em camadas

Uma arquitetura simples pode ser:

```text
HTTP
 ↓
Controller
 ↓
Application / Use Case
 ↓
Domain
 ↓
Infrastructure
 ↓
Database
```

Cada camada possui uma responsabilidade.

---

# 39. Clean Architecture

Clean Architecture é uma abordagem que procura proteger as regras centrais do sistema contra detalhes externos.

Uma ideia importante é:

> detalhes dependem das regras centrais, e não o contrário.

Por exemplo:

```text
PostgreSQL pode mudar
Fastify pode mudar
React pode mudar
provedor de pagamento pode mudar

mas as regras do ciclo de 4 aulas continuam sendo regras do domínio.
```

---

# 40. Arquitetura Hexagonal

Também conhecida como **Ports and Adapters**.

A ideia é separar o núcleo da aplicação das tecnologias externas.

```text
             PostgreSQL
                 ↓
             Adapter
                 ↓
        ┌─────────────────┐
        │   Aplicação     │
        │    / Domínio    │
        └─────────────────┘
          ↑             ↑
       Adapter        Adapter
          ↑             ↑
        HTTP          API externa
```

### Port

Port é uma interface/contrato que representa uma necessidade ou ponto de comunicação.

### Adapter

Adapter implementa essa comunicação.

---

# 41. Monólito

Monólito é uma aplicação implantada como uma unidade principal.

Isso não significa necessariamente código desorganizado.

Podemos ter um:

> **Modular Monolith**

em que a aplicação é uma unidade de deploy, mas internamente possui módulos bem separados.

Para muitos sistemas, isso é mais simples do que começar com microsserviços.

---

# 42. Microsserviços

Microsserviços dividem um sistema em serviços menores, normalmente com responsabilidades e ciclos de implantação independentes.

Possíveis benefícios:

- implantação independente;
- escalabilidade independente;
- isolamento de determinadas responsabilidades.

Possíveis custos:

- comunicação de rede;
- observabilidade mais complexa;
- deploy mais complexo;
- consistência distribuída;
- maior custo operacional.

Não devemos escolher microsserviços apenas porque parecem mais "profissionais".

---

# 43. Entidade anêmica

Uma entidade anêmica é uma entidade que possui principalmente dados, enquanto as regras relacionadas a ela ficam espalhadas em serviços externos.

Exemplo:

```typescript
class Cycle {
  id: string;
  classes: number;
}
```

E toda regra fica em:

```text
CycleService
CycleManager
CycleHelper
CycleUtils
...
```

Isso pode dificultar a compreensão de onde o comportamento pertence.

Mas entidades anêmicas não são automaticamente erradas. O modelo adequado depende do domínio e da arquitetura adotada.

---

# 44. DDD

DDD significa **Domain-Driven Design**.

É uma abordagem que procura modelar software de acordo com o domínio e sua linguagem.

Termos importantes:

- entidade;
- value object;
- agregado;
- serviço de domínio;
- linguagem ubíqua;
- bounded context.

Não é necessário aplicar todos esses conceitos em qualquer sistema.

---

# PARTE VII — HTTP E APIs

# 45. O que é HTTP?

HTTP é um protocolo utilizado para comunicação entre sistemas na web.

Uma comunicação básica envolve:

```text
Cliente
  ↓
Request
  ↓
Servidor
  ↓
Response
  ↓
Cliente
```

---

# 46. Request

Uma requisição HTTP possui informações como:

- método;
- URL;
- headers;
- body;
- parâmetros.

Exemplo:

```http
POST /students
Content-Type: application/json
```

Body:

```json
{
  "name": "João"
}
```

---

# 47. Response

A resposta possui:

- status code;
- headers;
- body, quando necessário.

Exemplo:

```http
HTTP/1.1 201 Created
Content-Type: application/json
```

Body:

```json
{
  "id": "123",
  "name": "João"
}
```

---

# 48. Verbos HTTP

## GET

Consultar.

```http
GET /students
```

## POST

Criar ou executar uma operação que não seja uma simples atualização idempotente.

```http
POST /students
```

## PUT

Normalmente representa substituição do recurso.

```http
PUT /students/123
```

## PATCH

Alteração parcial.

```http
PATCH /students/123
```

## DELETE

Remoção.

```http
DELETE /students/123
```

---

# 49. Idempotência

Uma operação idempotente pode ser repetida sem produzir um efeito adicional diferente do primeiro resultado final.

Exemplo conceitual:

```text
PUT /students/123
nome = João
```

Executar a mesma operação várias vezes deve resultar no mesmo estado final.

Isso é especialmente importante em integrações e retries.

---

# 50. Status codes

## 2xx — sucesso

### 200 OK

Requisição executada com sucesso.

### 201 Created

Recurso criado.

### 204 No Content

Sucesso sem conteúdo no corpo.

---

## 3xx — redirecionamento/cache

### 301

Recurso movido permanentemente.

### 304

Recurso não foi alterado em relação à versão que o cliente já possui.

---

## 4xx — problema na requisição/contexto do cliente

### 400

Requisição inválida.

### 401

Autenticação ausente ou inválida.

### 403

Identidade conhecida, mas sem autorização para aquela operação.

### 404

Recurso não encontrado.

### 409

Conflito com o estado atual.

No Beach Tennis Manager, um conflito pode ser apropriado em situações como tentativa de reutilizar um refresh token já rotacionado.

---

## 5xx — problema no servidor

### 500

Erro interno.

### 502

Servidor intermediário recebeu resposta inválida de outro servidor.

### 503

Serviço indisponível.

---

# 51. API

API significa **Application Programming Interface**.

É um contrato que permite que um sistema utilize funcionalidades ou dados de outro sistema.

Exemplo:

```text
Frontend React
     ↓ HTTP
Backend Fastify
     ↓
PostgreSQL
```

O frontend utiliza a API do backend.

---

# 52. REST

REST é um estilo arquitetural para sistemas distribuídos.

Uma API RESTful costuma trabalhar com recursos.

Exemplo:

```text
GET    /students
POST   /students
GET    /students/123
PATCH  /students/123
DELETE /students/123
```

REST não significa simplesmente "usar JSON".

---

# PARTE VIII — AUTENTICAÇÃO E SEGURANÇA

# 53. Autenticação x autorização

### Autenticação

Responde:

> "Quem é você?"

Exemplo:

```text
email + senha
```

### Autorização

Responde:

> "O que você pode fazer?"

Exemplo:

```text
ADMIN pode consultar todos os professores.
PROFESSOR só pode acessar seus próprios dados.
```

---

# 54. Cookie

Cookie é um pequeno dado armazenado pelo navegador e enviado conforme as regras do domínio/caminho.

No nosso projeto utilizamos cookies HttpOnly para tokens.

---

# 55. HttpOnly

Um cookie `HttpOnly` não fica disponível diretamente para JavaScript através de `document.cookie`.

Isso reduz a exposição de tokens a determinados ataques de XSS.

Não significa que cookies sejam automaticamente seguros. Ainda precisamos considerar:

- HTTPS;
- SameSite;
- CSRF;
- configuração correta de domínio/path;
- expiração.

---

# 56. JWT

JWT significa **JSON Web Token**.

É um formato de token assinado que pode carregar claims.

No projeto:

```text
Access Token
  ↓
JWT
```

Claims importantes incluem:

```text
sub
email
role
iat
exp
```

### O que é claim?

Claim é uma informação declarada dentro do token.

### Assinatura

A assinatura permite verificar se o token foi alterado e se foi produzido por quem possui o segredo/chave correspondente.

---

# 57. Access Token x Refresh Token

Access Token:

- vida curta;
- usado para autenticar requisições;
- no projeto possui TTL de 10 minutos.

Refresh Token:

- vida maior;
- utilizado para obter novo Access Token;
- no projeto possui TTL de 8 horas;
- é armazenado no banco através de hash;
- possui rotação.

Fluxo:

```text
Login
 ↓
Access Token + Refresh Token
 ↓
Access expira
 ↓
Refresh Token
 ↓
novo Access Token + novo Refresh Token
```

---

# 58. Rotação de Refresh Token

Na rotação:

```text
Refresh A
   ↓
usado
   ↓
Refresh B
```

O token A deixa de ser válido.

Se alguém tentar reutilizar A, o servidor consegue identificar o uso indevido/reuso.

Isso é uma camada importante de segurança.

---

# PARTE IX — BANCO DE DADOS

# 59. Banco relacional

Um banco relacional organiza dados em tabelas relacionadas.

PostgreSQL, MySQL e SQL Server são bancos relacionais.

Exemplo:

```text
students
teachers
classes
enrollments
payments
cycles
```

---

# 60. Chave primária

Primary Key identifica unicamente uma linha.

Exemplo:

```text
students.id
```

No projeto utilizamos UUID como identificador técnico dos alunos.

---

# 61. Chave estrangeira

Foreign Key cria uma relação entre tabelas.

Exemplo:

```text
enrollments.student_id
        ↓
students.id
```

Isso ajuda o banco a preservar integridade referencial.

---

# 62. Constraint

Constraint é uma regra que o banco utiliza para impedir estados inválidos.

Exemplos:

```text
PRIMARY KEY
FOREIGN KEY
UNIQUE
NOT NULL
CHECK
```

Exemplo:

```sql
cpf TEXT UNIQUE NOT NULL
```

Isso ajuda a garantir que dois alunos não tenham o mesmo CPF.

---

# 63. Índice

Índice é uma estrutura utilizada pelo banco para encontrar dados com mais eficiência em determinadas consultas.

Imagine um livro.

Sem índice:

```text
procura página por página
```

Com índice:

```text
vai diretamente para a região relevante
```

Índices podem melhorar consultas, mas possuem custo:

- ocupam espaço;
- precisam ser atualizados;
- podem aumentar custo de escrita.

Portanto, não devemos criar índices indiscriminadamente.

---

# 64. JOIN

JOIN combina dados relacionados de tabelas.

Exemplo:

```sql
SELECT
  students.name,
  enrollments.id
FROM students
JOIN enrollments
  ON enrollments.student_id = students.id;
```

Isso permite consultar informações relacionadas sem duplicar todos os dados em uma única tabela.

---

# 65. Normalização

Normalização é uma forma de organizar dados para reduzir duplicação e inconsistências.

Em vez de repetir:

```text
Professor = João
Telefone = ...
```

em milhares de linhas, mantemos o professor em sua própria tabela e referenciamos seu ID.

Normalização excessiva também pode tornar consultas mais complexas. Novamente existe trade-off.

---

# 66. Transação

Transação é um conjunto de operações tratadas como uma unidade lógica.

Exemplo:

```text
criar pagamento
+
atualizar ciclo
+
registrar movimentação
```

Se uma etapa falhar, talvez seja necessário desfazer as anteriores.

A transação permite buscar esse comportamento.

---

# 67. ACID

ACID descreve propriedades importantes de transações.

### Atomicidade

Tudo ou nada.

### Consistência

A transação deve preservar as regras de integridade.

### Isolamento

Operações concorrentes não devem produzir estados incorretos por interferência inadequada.

### Durabilidade

Depois de confirmada, a alteração deve persistir conforme as garantias do banco.

---

# 68. Concorrência

Concorrência acontece quando múltiplas operações ocorrem sobre dados relacionados ao mesmo tempo.

Exemplo:

```text
Professor A tenta ocupar a última vaga
Professor B tenta ocupar a mesma vaga
```

Se o sistema não tratar isso corretamente, podemos acabar com mais alunos do que o limite permitido.

---

# 69. Lock

Lock é um mecanismo de controle de acesso concorrente.

Ele pode impedir que operações incompatíveis alterem determinados dados simultaneamente.

O tipo e o nível de lock devem ser escolhidos de acordo com o problema.

---

# 70. Isolation Level

Isolation Level define como transações concorrentes podem enxergar alterações umas das outras.

Níveis conhecidos incluem:

```text
Read Uncommitted
Read Committed
Repeatable Read
Serializable
```

Quanto mais forte o isolamento, dependendo do banco e da operação, maior pode ser o custo de concorrência.

---

# 71. Migration

Migration é uma alteração versionada na estrutura do banco.

Exemplo:

```text
0000_initial_schema.sql
0001_replace_sessions_with_refresh_tokens.sql
```

Isso permite que o schema evolua de maneira reproduzível.

---

# 72. ORM

ORM significa **Object-Relational Mapping**.

Ele cria uma camada de abstração para trabalhar com dados relacionais através de código.

No projeto utilizamos:

```text
Drizzle ORM
```

ORM não elimina a necessidade de conhecer SQL.

Um desenvolvedor precisa entender o que a consulta realmente está fazendo no banco.

---

# 73. SQL x NoSQL

SQL/relacional costuma ser adequado quando:

- relações são importantes;
- consistência é importante;
- transações são relevantes;
- estrutura dos dados é bem definida.

NoSQL engloba várias categorias de bancos não relacionais.

Exemplos de modelos:

```text
documentos
chave-valor
colunar
grafos
```

Não existe uma regra universal de que NoSQL é mais rápido ou SQL é sempre melhor.

A escolha depende do problema.

---

# PARTE X — DEVOPS E INFRAESTRUTURA

# 74. O que é DevOps?

DevOps é um conjunto de práticas e cultura que aproxima desenvolvimento e operações, buscando entregar software de forma confiável e repetível.

Não significa simplesmente:

> "usar Docker."

Envolve temas como:

- automação;
- CI/CD;
- infraestrutura;
- deploy;
- observabilidade;
- segurança;
- ambientes;
- colaboração.

---

# 75. Linux

Linux é um sistema operacional amplamente utilizado em servidores.

Conceitos básicos importantes:

```text
filesystem
processos
permissões
usuários
serviços
rede
logs
shell
```

---

# 76. Docker

Docker permite empacotar aplicações e suas dependências em containers.

Um container é um ambiente isolado para executar um processo e seus recursos necessários.

No projeto:

```text
PostgreSQL
   ↓
Docker container
```

Enquanto:

```text
API
Web
```

podem executar diretamente na máquina durante o desenvolvimento.

---

# 77. Docker Compose

Docker Compose permite definir múltiplos serviços e sua configuração em um arquivo.

Exemplo conceitual:

```text
compose.yaml

postgres
redis
...
```

Ele facilita subir o ambiente local de desenvolvimento.

---

# 78. Variáveis de ambiente

Configurações que variam por ambiente não devem ser necessariamente colocadas diretamente no código.

Exemplo:

```text
DATABASE_URL
JWT_SECRET
```

Podemos ter:

```text
desenvolvimento
teste
produção
```

com configurações diferentes.

Segredos não devem ser versionados no Git.

---

# 79. CI/CD

CI = **Continuous Integration**.

Ajuda a validar alterações automaticamente.

Exemplo:

```text
push
 ↓
lint
 ↓
typecheck
 ↓
tests
 ↓
build
```

CD = **Continuous Delivery/Deployment**, dependendo do contexto.

Pode automatizar entrega/deploy.

---

# 80. Reverse Proxy

Reverse proxy é um servidor intermediário que recebe requisições e encaminha para serviços internos.

Exemplo:

```text
Internet
   ↓
Nginx / Proxy
   ↓
API
```

Pode ajudar com:

- HTTPS;
- roteamento;
- headers;
- compressão;
- balanceamento;
- segurança.

---

# 81. DNS

DNS traduz nomes de domínio para endereços utilizados na rede.

Exemplo:

```text
api.meusistema.com
        ↓
servidor
```

Não é o mesmo que hospedagem. DNS é o mecanismo de resolução de nomes.

---

# 82. HTTPS

HTTPS é HTTP protegido por TLS.

Ele ajuda a proteger a comunicação contra leitura/modificação indevida durante o transporte.

Em produção, autenticação e cookies devem ser configurados considerando HTTPS.

---

# PARTE XI — FILAS

# 83. O que é uma fila?

Uma fila permite colocar uma tarefa para ser processada posteriormente.

Exemplo:

```text
API
 ↓
fila
 ↓
worker
 ↓
envia WhatsApp
```

Isso evita que uma requisição precise esperar toda a operação externa terminar.

---

# 84. Producer, Consumer e Worker

### Producer

Produz/publica uma tarefa.

### Consumer

Recebe/processa a tarefa.

### Worker

Processo que executa o trabalho.

Exemplo:

```text
Backend = producer
Fila = armazenamento
Worker = consumer
```

---

# 85. Retry

Retry é tentar novamente uma operação que falhou.

Não devemos repetir tudo indiscriminadamente.

Precisamos considerar:

- tipo de erro;
- quantidade de tentativas;
- intervalo;
- idempotência.

---

# 86. Dead Letter Queue

DLQ é uma fila para mensagens que não conseguiram ser processadas após determinadas tentativas.

Isso permite investigação posterior sem perder completamente a tarefa.

---

# PARTE XII — HTTP/2

# 87. O que é HTTP/2?

HTTP/2 é uma versão do protocolo HTTP com mecanismos para melhorar a eficiência da comunicação.

Entre seus conceitos estão:

- streams;
- frames;
- multiplexação;
- compressão de headers.

---

# 88. Multiplexação

Em HTTP/1.1, múltiplas requisições podiam exigir mecanismos diferentes de conexão/reutilização.

HTTP/2 permite transportar múltiplos streams simultaneamente dentro de uma conexão.

Conceitualmente:

```text
uma conexão
 ├── stream A
 ├── stream B
 ├── stream C
 └── stream D
```

Isso reduz determinados custos de comunicação.

---

# 89. Frames

HTTP/2 divide mensagens em unidades chamadas frames.

Frames pertencem a streams.

Não é necessário decorar todos os tipos para uma entrevista inicial, mas é importante entender a ideia:

```text
conexão
  ↓
streams
  ↓
frames
```

---

# 90. HPACK

HPACK é um mecanismo utilizado pelo HTTP/2 para compressão de headers.

A ideia é reduzir dados repetidos entre requisições.

---

# PARTE XIII — TESTES

# 91. Por que testar?

Testes automatizados verificam se o comportamento do sistema continua correto.

Eles também ajudam a detectar regressões.

### Regressão

Regressão é quando uma alteração nova quebra um comportamento que anteriormente funcionava.

---

# 92. Teste unitário

Testa uma unidade pequena e isolada de comportamento.

Exemplo:

```text
calcular valor do desconto
```

Pode ser executado sem banco ou rede.

---

# 93. Teste de integração

Testa a interação entre componentes reais.

Exemplo:

```text
Use Case
 ↓
Repository
 ↓
PostgreSQL
```

---

# 94. Teste E2E

E2E significa **End-to-End**.

Testa um fluxo mais próximo do uso real.

Exemplo:

```text
login
 ↓
criar aluno
 ↓
consultar aluno
 ↓
logout
```

---

# PARTE XIV — GIT

# 95. O que é Git?

Git é um sistema distribuído de controle de versão.

Ele registra alterações no código ao longo do tempo.

---

# 96. Git x GitHub

### Git

Ferramenta de controle de versão.

### GitHub

Plataforma que hospeda repositórios Git e fornece recursos como:

- Pull Requests;
- Issues;
- Actions;
- revisão de código;
- colaboração.

---

# 97. Commit

Commit registra um conjunto de alterações.

Exemplo:

```bash
git add .
git commit -m "feat: adiciona cadastro de alunos"
```

Um bom commit deve representar uma mudança coerente.

---

# 98. Branch

Branch é uma linha de desenvolvimento.

Exemplo:

```text
main
  ↓
feature/cadastro-alunos
```

Podemos desenvolver uma funcionalidade sem alterar diretamente a `main`.

---

# 99. Pull Request

Pull Request é uma proposta para integrar alterações de uma branch em outra.

Fluxo:

```text
feature
   ↓
push
   ↓
Pull Request
   ↓
review
   ↓
merge
```

---

# 100. Merge

Merge integra alterações de uma branch em outra.

---

# 101. Rebase

Rebase reaplica commits de uma branch sobre outra base.

É útil para reorganizar histórico em determinados fluxos, mas exige cuidado porque pode reescrever histórico.

---

# 102. Revert

Revert cria um novo commit que desfaz os efeitos de outro commit.

É diferente de apagar o commit do histórico.

---

# PARTE XV — INTEGRAÇÕES

# 103. Integração com API externa

Uma integração precisa considerar que o sistema externo pode falhar.

Não basta:

```text
POST
 ↓
esperar
```

Precisamos considerar:

```text
sucesso
timeout
401
403
404
409
429
500
502
503
resposta inválida
```

---

# 104. Timeout

Timeout define quanto tempo esperamos por uma resposta antes de considerar que a operação demorou demais.

Sem timeout, uma aplicação pode ficar esperando indefinidamente em determinadas situações.

---

# 105. Retry em integrações

Retry pode ser útil para erros temporários.

Exemplo:

```text
tentativa 1 → timeout
tentativa 2 → timeout
tentativa 3 → sucesso
```

Mas devemos tomar cuidado com operações que podem gerar duplicidade.

Por isso idempotência é importante.

---

# 106. Rate limit

Rate limit é uma limitação de quantidade de requisições permitidas em determinado intervalo.

Exemplo:

```text
100 requisições/minuto
```

Se ultrapassarmos, um serviço pode responder:

```text
429 Too Many Requests
```

---

# PARTE XVI — SEGURANÇA

# 107. Princípio do menor privilégio

Cada usuário, serviço ou componente deve possuir somente as permissões necessárias para realizar sua função.

No Beach Tennis Manager:

```text
ADMIN
  ↓
visibilidade global

PROFESSOR
  ↓
somente seus dados
```

Essa regra precisa ser aplicada no backend.

Não podemos confiar apenas no frontend.

---

# 108. Validação de entrada

Dados recebidos do usuário devem ser considerados não confiáveis.

Exemplo:

```text
POST /students
```

Precisamos validar:

```text
nome
CPF
email
telefone
```

Validação evita estados inválidos e reduz determinados riscos.

---

# 109. SQL Injection

SQL Injection ocorre quando entrada não confiável é incorporada de maneira insegura a comandos SQL.

A solução inclui:

- queries parametrizadas;
- ORM/query builders corretamente utilizados;
- validação;
- não concatenar SQL com entrada arbitrária.

---

# PARTE XVII — APLICAÇÃO NO BEACH TENNIS MANAGER

# 110. Transformando teoria em projeto

Nosso projeto é útil para aprender porque possui problemas reais.

Exemplo:

> "Aluno faltou."

Isso parece simples, mas precisamos perguntar:

```text
Foi com aviso?
Quanto tempo antes?
É uma falta válida?
Existe crédito?
O professor atingiu o limite?
A aula era reposição?
O ciclo está aberto?
```

Isso é domínio.

---

# 111. Exemplo: ciclo de 4 aulas

Regra:

> O ciclo inicia quando ocorre a primeira aula efetivamente realizada ou utilizada como parte daquele ciclo.

O pagamento pode acontecer antes.

Quando o ciclo começa, as configurações operacionais aplicáveis são determinadas e congeladas para aquele ciclo.

Uma alteração posterior na configuração não deve modificar retroativamente um ciclo já iniciado.

Feriado não inicia ciclo e não consome uma das quatro aulas.

---

# 112. Exemplo: reposição

Fluxo conceitual:

```text
Aluno falta
   ↓
verifica antecedência
   ↓
falta válida?
   ↓
verifica limite de reposições
   ↓
gera crédito
```

Depois:

```text
Crédito disponível
   ↓
aparece vaga compatível
   ↓
aluno utiliza crédito
   ↓
crédito consumido
```

O crédito pertence à matrícula que o originou.

---

# 113. Exemplo: acoplamento no projeto

Imagine:

```typescript
class RegisterAbsence {
  const database = new PostgresDatabase();
  const whatsapp = new WhatsAppClient();
}
```

O caso de uso conhece detalhes de infraestrutura.

Isso aumenta acoplamento.

Podemos trabalhar com contratos:

```text
RegisterAbsence
 ├── AbsenceRepository
 ├── MakeupCreditRepository
 └── NotificationService
```

As implementações concretas ficam na infraestrutura.

---

# 114. Exemplo: arquitetura do projeto

Uma visão simplificada:

```text
apps/api
│
├── modules
│   ├── auth
│   ├── students
│   ├── teachers
│   ├── classes
│   ├── enrollments
│   ├── cycles
│   ├── payments
│   └── makeups
│
└── infrastructure
    ├── auth
    ├── database
    └── http
```

A ideia é manter:

```text
regra de negócio
        ↓
independente
        ↓
detalhes técnicos
```

na medida adequada à complexidade do projeto.

---

# PARTE XVIII — PERGUNTAS DE ENTREVISTA JUNIOR

## 115. O que é classe?

Resposta:

> "Classe é uma estrutura que define dados e comportamentos que objetos daquele tipo podem possuir."

---

## 116. O que é objeto?

> "Objeto é uma instância concreta de uma classe."

---

## 117. Quais conceitos de OOP você conhece?

Explique:

```text
encapsulamento
abstração
herança
polimorfismo
```

Não apenas cite.

---

## 118. Composição x herança?

> "Herança representa uma relação de especialização. Composição monta objetos utilizando outros objetos. Costumo preferir composição quando ela reduz acoplamento e torna as dependências mais flexíveis."

---

## 119. O que é função pura?

> "É uma função que, para a mesma entrada, sempre produz a mesma saída e não possui efeitos colaterais observáveis."

---

## 120. GET x POST?

> "GET é normalmente utilizado para consulta. POST é utilizado para criação ou processamento de operações que não possuem a semântica de uma atualização idempotente."

---

## 121. 401 x 403?

> "401 está relacionado à autenticação. 403 indica que a identidade foi reconhecida, mas não possui autorização para aquela operação."

---

# PARTE XIX — PERGUNTAS DE ENTREVISTA PLENO

# 122. O que é injeção de dependência?

Explique:

```text
dependência
↓
injeção externa
↓
menor acoplamento
↓
testabilidade
```

---

# 123. O que é SOLID?

Não apenas fale os nomes.

Escolha um princípio e explique um exemplo.

Principalmente esteja preparado para explicar:

```text
D = Dependency Inversion Principle
```

e a diferença entre:

```text
DIP
x
Dependency Injection
```

---

# 124. Onde deve ficar a regra de negócio?

Resposta conceitual:

> "A regra de negócio deve ficar em uma camada responsável pelo domínio/aplicação, e não ser espalhada aleatoriamente entre controller, frontend, banco e infraestrutura."

---

# 125. O que é baixo acoplamento?

> "É quando componentes possuem poucas dependências desnecessárias entre si. Isso facilita substituir implementações, testar e evoluir o sistema."

---

# 126. O que é alta coesão?

> "É quando as responsabilidades dentro de um módulo estão fortemente relacionadas."

---

# 127. O que é Repository?

> "É uma abstração para acesso a dados, permitindo que a aplicação trabalhe com uma interface sem precisar conhecer os detalhes de persistência."

---

# 128. Monólito x microsserviços?

Não responda:

> "Microsserviços são melhores."

Explique os trade-offs.

```text
Monólito
+ simplicidade operacional
+ deploy simples
+ desenvolvimento inicial mais simples

Microsserviços
+ independência entre serviços
+ escalabilidade independente

Microsserviços
- rede
- observabilidade
- deploy
- consistência distribuída
- complexidade operacional
```

---

# PARTE XX — COMO RESPONDER UMA ENTREVISTA

Quando perguntarem:

> "O que é X?"

Use:

### 1. Definição

"O conceito X é..."

### 2. Problema

"Ele existe para resolver..."

### 3. Exemplo

"Por exemplo..."

### 4. Trade-off

"Uma desvantagem/limitação é..."

### 5. Projeto

"No Beach Tennis Manager eu aplicaria isso em..."

Isso demonstra compreensão, não apenas memorização.

---

# PARTE XXI — PLANO DE ESTUDO

Sugestão de sequência:

## Semana 1 — Fundamentos

```text
variáveis
tipos
funções
objetos
classes
```

## Semana 2 — OOP

```text
encapsulamento
abstração
herança
polimorfismo
interfaces
composição
acoplamento
coesão
```

## Semana 3 — Código limpo

```text
funções puras
efeitos colaterais
DRY
KISS
YAGNI
SOLID
```

## Semana 4 — Arquitetura

```text
Controller
Use Case
Domain
Repository
Infrastructure
Clean Architecture
Hexagonal
monólito
microsserviços
```

## Semana 5 — HTTP/API

```text
request
response
headers
body
GET
POST
PUT
PATCH
DELETE
status codes
REST
autenticação
autorização
JWT
cookies
```

## Semana 6 — Banco

```text
SQL
PK
FK
constraints
índices
JOIN
transações
ACID
locks
isolamento
migrations
ORM
```

## Semana 7 — Infraestrutura

```text
Linux
Docker
Compose
CI/CD
DNS
HTTPS
reverse proxy
filas
```

## Semana 8 — Entrevista

```text
perguntas Junior
perguntas Pleno
problemas de arquitetura
trade-offs
simulação
teste técnico
```

---

# CHECKLIST FINAL

Antes de uma entrevista, você deve conseguir explicar sem consultar material:

## Junior

- [ ] Classe
- [ ] Objeto
- [ ] OOP
- [ ] Encapsulamento
- [ ] Abstração
- [ ] Herança
- [ ] Polimorfismo
- [ ] Interface
- [ ] Classe abstrata
- [ ] Composição
- [ ] Acoplamento
- [ ] Coesão
- [ ] Função pura
- [ ] Efeito colateral
- [ ] DRY
- [ ] KISS
- [ ] YAGNI
- [ ] Framework
- [ ] Git
- [ ] GitHub
- [ ] HTTP
- [ ] Verbos HTTP
- [ ] Status codes
- [ ] API
- [ ] REST
- [ ] Banco relacional
- [ ] PK
- [ ] FK
- [ ] JOIN
- [ ] Índice
- [ ] Transação
- [ ] API externa

## Pleno

- [ ] Injeção de Dependência
- [ ] Dependency Inversion
- [ ] SOLID
- [ ] Design Patterns
- [ ] Strategy
- [ ] Factory
- [ ] Adapter
- [ ] Decorator
- [ ] Proxy
- [ ] Arquitetura em camadas
- [ ] Clean Architecture
- [ ] Hexagonal Architecture
- [ ] Modular Monolith
- [ ] Microsserviços
- [ ] Entidade anêmica
- [ ] DDD
- [ ] HTTP/2
- [ ] Multiplexação
- [ ] Reverse Proxy
- [ ] Filas
- [ ] Retry
- [ ] DLQ
- [ ] SQL x NoSQL
- [ ] Concorrência
- [ ] Locks
- [ ] Isolation Levels
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] E2E
- [ ] Segurança

---

# CONEXÃO COM O BEACH TENNIS MANAGER

Este material não deve ficar separado do desenvolvimento.

A ideia é estudar um conceito e procurar sua aplicação no projeto.

Exemplos:

```text
Acoplamento
   ↓
Repository + Use Case

SOLID
   ↓
Application + Infrastructure

Transação
   ↓
Pagamento + Ciclo

Índice
   ↓
CPF / buscas

Concorrência
   ↓
vagas da turma

Autorização
   ↓
Professor x ADMIN

JWT
   ↓
autenticação

Filas
   ↓
futura integração WhatsApp

Testes
   ↓
regras de reposição

Arquitetura
   ↓
organização do backend
```

O objetivo final é conseguir fazer esta conexão:

```text
PROBLEMA
   ↓
CONCEITO
   ↓
DECISÃO
   ↓
IMPLEMENTAÇÃO
   ↓
TESTE
   ↓
TRADE-OFF
```

Esse é o tipo de raciocínio que queremos desenvolver para o projeto e para as entrevistas.

---

# Próximo nível de estudo

Depois de entender este material, o próximo passo não deve ser simplesmente ler mais teoria.

Vamos transformar cada tópico em:

1. explicação;
2. exemplo simples;
3. exercício;
4. implementação no Beach Tennis Manager;
5. teste;
6. pergunta de entrevista;
7. pergunta de aprofundamento.

Assim, o estudo deixa de ser apenas memorização e passa a ser prática de engenharia de software.