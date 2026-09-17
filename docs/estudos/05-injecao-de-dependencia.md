# 05 — Injeção de Dependência

> Material de estudo do Beach Tennis Manager.
>
> Este documento aprofunda Dependency Injection (DI), partindo do problema de dependências rígidas e conectando o conceito ao Dependency Inversion Principle (DIP), composição, testabilidade e arquitetura.
>
> O objetivo não é decorar `constructor(private dependency: ...)`. É entender por que a dependência deve ser fornecida de fora, quem deve criá-la, quais benefícios isso traz e quais custos existem.

---

## Sumário

1. [Como estudar este documento](#1-como-estudar-este-documento)
2. [O que é uma dependência](#2-o-que-é-uma-dependência)
3. [O problema da criação interna](#3-o-problema-da-criação-interna)
4. [O que é Injeção de Dependência](#4-o-que-é-injeção-de-dependência)
5. [DIP × DI](#5-dip--di)
6. [Injeção pelo construtor](#6-injeção-pelo-construtor)
7. [Injeção por parâmetro](#7-injeção-por-parâmetro)
8. [Injeção por propriedade](#8-injeção-por-propriedade)
9. [Quem cria as dependências?](#9-quem-cria-as-dependências)
10. [Composition Root](#10-composition-root)
11. [Abstrações e interfaces](#11-abstrações-e-interfaces)
12. [DI e testabilidade](#12-di-e-testabilidade)
13. [DI e desacoplamento](#13-di-e-desacoplamento)
14. [DI Container](#14-di-container)
15. [Quando usar e quando evitar](#15-quando-usar-e-quando-evitar)
16. [Erros comuns](#16-erros-comuns)
17. [Código ruim → análise → refatoração](#17-código-ruim--análise--refatoração)
18. [Aplicação no Beach Tennis Manager](#18-aplicação-no-beach-tennis-manager)
19. [Exercícios](#19-exercícios)
20. [Perguntas de entrevista](#20-perguntas-de-entrevista)
21. [Perguntas de aprofundamento](#21-perguntas-de-aprofundamento)
22. [Checklist de domínio](#22-checklist-de-domínio)

---

# 1. Como estudar este documento

No documento anterior vimos:

```text
DIP = princípio
DI  = técnica
```

Agora vamos transformar isso em código.

A sequência de raciocínio será:

```text
uma classe precisa de algo
        ↓
esse algo é uma dependência
        ↓
a classe pode criar a dependência
        ↓
ou receber a dependência pronta
        ↓
receber de fora = injeção
```

A questão importante é:

> Por que receber de fora pode ser melhor?

---

# 2. O que é uma dependência?

## 2.1 O que é?

Uma dependência é algo que uma parte do software precisa para realizar seu trabalho.

Exemplo:

```ts
class RegisterStudent {
  constructor(
    private repository: StudentRepository,
  ) {}
}
```

`StudentRepository` é uma dependência de `RegisterStudent`.

A classe não consegue executar sua operação sem alguma forma de persistência.

---

## 2.2 Por que existe?

Componentes raramente trabalham completamente isolados.

Um caso de uso pode precisar de:

```text
repositório
serviço externo
relógio
gerador de ID
logger
```

---

## 2.3 Qual problema resolve?

Reconhecer dependências permite controlar melhor:

```text
quem conhece quem
quem cria quem
quem pode ser substituído
```

---

## 2.4 Como funciona?

Considere:

```ts
class RegisterStudent {
  constructor(
    private repository: StudentRepository,
  ) {}

  async execute(input: CreateStudentInput) {
    await this.repository.save(input);
  }
}
```

Temos:

```text
RegisterStudent
       ↓
StudentRepository
```

---

## 2.5 Quando eu usaria?

Sempre que uma classe ou função precisar colaborar com outra coisa.

---

## 2.6 Quando eu evitaria?

Não devemos criar abstrações artificiais para qualquer valor simples.

Por exemplo:

```ts
function add(a: number, b: number) {
  return a + b;
}
```

não precisa de um:

```text
AdditionProvider
```

sem uma razão real.

---

## 2.7 Exemplo

Dependência concreta:

```ts
class ReportService {
  constructor(
    private pdfGenerator: PdfGenerator,
  ) {}
}
```

---

## 2.8 Como aparece no Beach Tennis Manager?

Um caso de uso pode depender de:

```text
StudentRepository
EnrollmentRepository
CycleRepository
```

e outros contratos necessários à operação.

A composição concreta dessas dependências deve ficar fora da regra principal.

---

# 3. O problema da criação interna

## 3.1 O que é?

Considere:

```ts
class RegisterStudent {
  private repository =
    new DrizzleStudentRepository();

  async execute(input: CreateStudentInput) {
    await this.repository.save(input);
  }
}
```

A classe está criando sua própria dependência.

---

## 3.2 Por que isso pode ser um problema?

Porque agora:

```text
RegisterStudent
        ↓
DrizzleStudentRepository
        ↓
Drizzle
        ↓
PostgreSQL
```

O caso de uso conhece detalhes de infraestrutura.

---

## 3.3 Qual problema resolve?

A criação externa da dependência pode reduzir o acoplamento entre:

```text
regra
```

e:

```text
implementação concreta
```

---

## 3.4 Como funciona?

Em vez de:

```ts
new DrizzleStudentRepository()
```

dentro da classe:

```ts
class RegisterStudent {
  constructor(
    private repository: StudentRepository,
  ) {}
}
```

E fora:

```ts
const repository =
  new DrizzleStudentRepository();

const useCase =
  new RegisterStudent(repository);
```

---

## 3.5 Quando eu usaria?

Principalmente quando a dependência:

- possui implementação concreta substituível;
- é externa;
- precisa ser simulada em testes;
- representa uma fronteira arquitetural.

---

## 3.6 Quando eu evitaria?

Para objetos simples e locais, criar diretamente pode ser perfeitamente adequado.

Exemplo:

```ts
const date = new Date();
```

Não precisamos obrigatoriamente criar um `DateFactory` para tudo.

---

## 3.7 Exemplo

Acoplado:

```ts
class PaymentService {
  private gateway = new PixGateway();
}
```

Injetado:

```ts
class PaymentService {
  constructor(
    private gateway: PaymentGateway,
  ) {}
}
```

---

## 3.8 Como aparece no Beach Tennis Manager?

O caso de uso não deve precisar saber:

```text
Drizzle
PostgreSQL
detalhes do SQL
```

para executar uma regra de negócio.

Esses detalhes pertencem à infraestrutura.

---

# 4. O que é Injeção de Dependência?

## 4.1 O que é?

Injeção de Dependência é uma técnica na qual um objeto recebe de fora os componentes de que precisa, em vez de criá-los internamente.

Exemplo:

```ts
class RegisterStudent {
  constructor(
    private repository: StudentRepository,
  ) {}
}
```

A dependência:

```text
repository
```

é fornecida externamente.

---

## 4.2 Por que existe?

Para separar:

```text
uso de uma dependência
```

de:

```text
criação da dependência
```

---

## 4.3 Qual problema resolve?

Ajuda a controlar:

```text
acoplamento
testabilidade
composição
substituição de implementações
```

---

## 4.4 Como funciona?

Temos três participantes:

```text
         cria
          ↓
Composition Root
      ↓
implementação
      ↓
contrato
      ↑
      |
  caso de uso
```

O caso de uso conhece o contrato.

A composição fornece a implementação.

---

## 4.5 Quando eu usaria?

É particularmente útil em aplicações com:

```text
casos de uso
repositórios
integrações externas
serviços
infraestrutura
```

---

## 4.6 Quando eu evitaria?

Não use DI apenas por moda.

Uma dependência trivial pode ser criada diretamente se isso não criar um problema arquitetural.

---

## 4.7 Exemplo

```ts
interface NotificationProvider {
  send(message: string): Promise<void>;
}

class RegisterStudent {
  constructor(
    private notification: NotificationProvider,
  ) {}
}
```

Composição:

```ts
const notification =
  new WhatsAppProvider();

const useCase =
  new RegisterStudent(notification);
```

---

## 4.8 Como aparece no Beach Tennis Manager?

Uma operação que eventualmente envie uma notificação pode depender de:

```ts
NotificationProvider
```

sem conhecer diretamente a implementação do provedor.

---

# 5. DIP × DI

## 5.1 O que é?

São conceitos diferentes.

### DIP

É um princípio de design.

Ele orienta a direção das dependências.

### DI

É uma técnica de construção.

Ela permite fornecer dependências externamente.

---

## 5.2 Por que existe essa distinção?

Porque podemos fazer DI sem necessariamente ter um bom design.

Exemplo:

```ts
class Service {
  constructor(
    private database: DrizzleDatabase,
  ) {}
}
```

A dependência foi injetada.

Mas o componente ainda depende diretamente de um detalhe concreto.

Portanto:

```text
DI ≠ automaticamente DIP
```

---

## 5.3 Qual problema resolve?

A distinção evita decorar:

> "Use DI e pronto, apliquei SOLID."

Não necessariamente.

---

## 5.4 Como funciona?

Uma aplicação mais alinhada ao DIP:

```ts
class Service {
  constructor(
    private repository: StudentRepository,
  ) {}
}
```

A implementação concreta:

```ts
DrizzleStudentRepository
```

é fornecida na composição.

---

## 5.5 Quando eu usaria?

Sempre que estiver avaliando arquitetura, pergunte:

```text
estou apenas injetando?
```

ou:

```text
estou realmente invertendo a dependência?
```

---

## 5.6 Quando eu evitaria?

Não crie uma interface apenas para poder dizer que existe DI.

---

## 5.7 Exemplo

DI sem boa abstração:

```ts
class Service {
  constructor(
    private db: DrizzleDatabase,
  ) {}
}
```

DI com abstração:

```ts
class Service {
  constructor(
    private repository: StudentRepository,
  ) {}
}
```

---

## 5.8 Como aparece no Beach Tennis Manager?

Casos de uso devem preferencialmente depender dos contratos definidos para a aplicação, enquanto Drizzle e PostgreSQL permanecem na infraestrutura.

---

# 6. Injeção pelo construtor

## 6.1 O que é?

É a forma mais comum de DI.

A dependência é recebida pelo construtor:

```ts
class Service {
  constructor(
    private repository: StudentRepository,
  ) {}
}
```

---

## 6.2 Por que existe?

Porque deixa a dependência explícita.

Ao olhar para a classe, sabemos:

```text
Service precisa de StudentRepository
```

---

## 6.3 Qual problema resolve?

Ajuda a evitar objetos parcialmente configurados.

Se a dependência é obrigatória, ela deve existir desde a criação.

---

## 6.4 Como funciona?

```ts
const repository =
  new DrizzleStudentRepository();

const service =
  new RegisterStudent(repository);
```

---

## 6.5 Quando eu usaria?

É geralmente a opção preferida para dependências obrigatórias.

---

## 6.6 Quando eu evitaria?

Se a dependência for realmente opcional, o design pode exigir outra abordagem.

Mesmo assim, opcionalidade deve ser explícita.

---

## 6.7 Exemplo

```ts
class RegisterStudent {
  constructor(
    private readonly repository: StudentRepository,
  ) {}
}
```

O `readonly` indica que a referência não será substituída depois da construção.

Ele não significa que o objeto apontado se tornou profundamente imutável.

---

## 6.8 Como aparece no Beach Tennis Manager?

```ts
class RegisterAbsence {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly lessonRepository: LessonRepository,
  ) {}
}
```

As dependências obrigatórias ficam visíveis.

---

# 7. Injeção por parâmetro

## 7.1 O que é?

A dependência pode ser fornecida diretamente a uma função ou método.

Exemplo:

```ts
function generateReport(
  repository: ReportRepository,
) {
  // ...
}
```

---

## 7.2 Por que existe?

Nem toda dependência precisa pertencer ao estado de um objeto.

---

## 7.3 Qual problema resolve?

Evita transformar uma dependência temporária em estado permanente.

---

## 7.4 Como funciona?

```ts
async function calculate(
  clock: Clock,
) {
  const now = clock.now();
}
```

---

## 7.5 Quando eu usaria?

Quando a dependência:

- é específica de uma operação;
- não precisa ser armazenada;
- faz sentido como parte explícita do contrato da função.

---

## 7.6 Quando eu evitaria?

Se praticamente todos os métodos de uma classe precisam da mesma dependência, provavelmente o construtor comunica melhor.

---

## 7.7 Exemplo

```ts
function createExpirationDate(
  clock: Clock,
  hours: number,
) {
  return clock.now().getTime() + hours;
}
```

---

## 7.8 Como aparece no Beach Tennis Manager?

Um relógio abstraído poderia ser útil em testes quando uma regra depende de:

```text
data/hora atual
```

Isso só deve ser introduzido quando a necessidade real surgir.

---

# 8. Injeção por propriedade

## 8.1 O que é?

A dependência é atribuída a uma propriedade depois da criação.

Exemplo:

```ts
class Service {
  repository!: StudentRepository;
}
```

Depois:

```ts
service.repository = repository;
```

---

## 8.2 Por que existe?

Alguns frameworks e tecnologias utilizam esse padrão.

---

## 8.3 Qual problema resolve?

Permite configuração posterior.

---

## 8.4 Como funciona?

O objeto pode existir antes da dependência ser fornecida.

---

## 8.5 Quando eu usaria?

Em geral, somente quando a tecnologia ou framework exigir ou quando a dependência realmente for opcional.

---

## 8.6 Quando eu evitaria?

Para dependências obrigatórias, normalmente prefira o construtor.

---

## 8.7 Exemplo

```ts
class Service {
  repository!: StudentRepository;
}
```

Esse design permite:

```ts
const service = new Service();

service.execute(); // problema potencial
```

---

## 8.8 Como aparece no Beach Tennis Manager?

Para o projeto, a injeção por construtor será preferível para dependências obrigatórias.

---

# 9. Quem cria as dependências?

## 9.1 O que é?

Uma pergunta importante:

> Se o serviço não cria suas dependências, quem cria?

A resposta é:

```text
uma composição externa
```

---

## 9.2 Por que existe?

Algum lugar precisa conhecer as implementações concretas.

Não podemos simplesmente eliminar a criação.

---

## 9.3 Qual problema resolve?

Centraliza a composição.

---

## 9.4 Como funciona?

Exemplo:

```ts
const repository =
  new DrizzleStudentRepository();

const notification =
  new WhatsAppProvider();

const useCase =
  new RegisterStudent(
    repository,
    notification,
  );
```

Esse código pode ficar em um ponto de composição.

---

## 9.5 Quando eu usaria?

Sempre que a aplicação tiver múltiplas dependências que precisam ser conectadas.

---

## 9.6 Quando eu evitaria?

Não precisa existir um container sofisticado para três objetos.

---

## 9.7 Exemplo

```text
main
 ↓
cria infraestrutura
 ↓
cria repositórios
 ↓
cria casos de uso
 ↓
cria controllers
 ↓
inicia servidor
```

---

## 9.8 Como aparece no Beach Tennis Manager?

A inicialização da API pode montar:

```text
Fastify
PostgreSQL/Drizzle
Repositories
Use Cases
Controllers
Routes
```

A aplicação fica responsável por conectar as peças.

---

# 10. Composition Root

## 10.1 O que é?

**Composition Root** é o ponto da aplicação onde as dependências são conectadas.

É onde decidimos:

```text
qual implementação concreta será usada
```

---

## 10.2 Por que existe?

Porque queremos que as regras de negócio não precisem saber como o sistema inteiro é montado.

---

## 10.3 Qual problema resolve?

Evita espalhar:

```ts
new Drizzle...
new WhatsApp...
new ...
```

por toda a aplicação.

---

## 10.4 Como funciona?

Conceitualmente:

```ts
const studentRepository =
  new DrizzleStudentRepository();

const registerStudent =
  new RegisterStudent(
    studentRepository,
  );
```

Esse local conhece:

```text
contratos
implementações
```

---

## 10.5 Quando eu usaria?

Em aplicações estruturadas.

---

## 10.6 Quando eu evitaria?

Em scripts minúsculos, uma estrutura formal pode ser desnecessária.

---

## 10.7 Exemplo

```text
src/
├── application/
├── domain/
├── infrastructure/
└── main.ts
```

`main.ts` pode participar da composição.

---

## 10.8 Como aparece no Beach Tennis Manager?

A inicialização da API deve ser capaz de montar a aplicação sem fazer o domínio conhecer Fastify ou Drizzle.

---

# 11. Abstrações e interfaces

## 11.1 O que é?

Uma abstração define o que uma dependência oferece sem exigir que o consumidor conheça todos os detalhes de implementação.

Exemplo:

```ts
interface StudentRepository {
  findById(id: string): Promise<Student | null>;
  save(student: Student): Promise<void>;
}
```

---

## 11.2 Por que existe?

Para criar uma fronteira estável entre:

```text
quem precisa da operação
```

e:

```text
quem implementa a operação
```

---

## 11.3 Qual problema resolve?

Reduz dependência direta de detalhes.

---

## 11.4 Como funciona?

Consumidor:

```ts
class RegisterStudent {
  constructor(
    private repository: StudentRepository,
  ) {}
}
```

Implementação:

```ts
class DrizzleStudentRepository
  implements StudentRepository {
  // ...
}
```

---

## 11.5 Quando eu usaria?

Quando existe uma fronteira arquitetural relevante ou uma necessidade real de substituição.

---

## 11.6 Quando eu evitaria?

Não crie interfaces automaticamente para toda classe.

---

## 11.7 Exemplo

```ts
interface Clock {
  now(): Date;
}
```

Implementação real:

```ts
class SystemClock implements Clock {
  now() {
    return new Date();
  }
}
```

Fake:

```ts
class FixedClock implements Clock {
  constructor(
    private readonly current: Date,
  ) {}

  now() {
    return this.current;
  }
}
```

---

## 11.8 Como aparece no Beach Tennis Manager?

Interfaces de repositório podem proteger a aplicação dos detalhes de:

```text
Drizzle
PostgreSQL
SQL
```

---

# 12. DI e testabilidade

## 12.1 O que é?

Uma das maiores vantagens práticas da DI é permitir substituir dependências durante testes.

---

## 12.2 Por que existe?

Imagine testar:

```ts
RegisterStudent
```

sem querer conectar ao PostgreSQL.

---

## 12.3 Qual problema resolve?

Podemos fornecer uma implementação falsa.

---

## 12.4 Como funciona?

Contrato:

```ts
interface StudentRepository {
  save(student: Student): Promise<void>;
}
```

Fake:

```ts
class FakeStudentRepository
  implements StudentRepository {

  students: Student[] = [];

  async save(student: Student) {
    this.students.push(student);
  }
}
```

Teste:

```ts
const repository =
  new FakeStudentRepository();

const useCase =
  new RegisterStudent(repository);
```

---

## 12.5 Quando eu usaria?

Em testes unitários e de componentes isolados.

---

## 12.6 Quando eu evitaria?

Não transforme todo teste em um teste cheio de mocks.

**Mock** é um tipo de test double usado para controlar ou verificar interações.

Às vezes um teste de integração usando infraestrutura real é mais apropriado.

---

## 12.7 Exemplo

Sem DI:

```ts
class RegisterStudent {
  private repository =
    new DrizzleStudentRepository();
}
```

O teste fica preso ao Drizzle.

Com DI:

```ts
class RegisterStudent {
  constructor(
    private repository: StudentRepository,
  ) {}
}
```

O teste pode fornecer um fake.

---

## 12.8 Como aparece no Beach Tennis Manager?

Podemos testar regras de:

```text
ciclo
ausência
reposição
crédito
```

sem precisar usar PostgreSQL em todos os testes.

Isso não elimina a necessidade de testes de integração.

---

# 13. DI e desacoplamento

## 13.1 O que é?

Desacoplamento significa reduzir dependências desnecessárias entre partes do sistema.

---

## 13.2 Por que existe?

Quando A depende diretamente de B, mudanças em B podem exigir mudanças em A.

---

## 13.3 Qual problema resolve?

DI pode reduzir o acoplamento entre:

```text
consumidor
```

e:

```text
implementação
```

---

## 13.4 Como funciona?

Antes:

```text
UseCase → DrizzleRepository
```

Depois:

```text
UseCase → Repository
             ↑
             |
       DrizzleRepository
```

---

## 13.5 Quando eu usaria?

Quando a implementação é detalhe de uma fronteira importante.

---

## 13.6 Quando eu evitaria?

Não vale a pena desacoplar artificialmente coisas que sempre evoluem juntas.

---

## 13.7 Exemplo

```text
PaymentService
      ↓
PaymentGateway
      ↑
      |
PixGateway
```

---

## 13.8 Como aparece no Beach Tennis Manager?

Casos de uso devem depender das necessidades da aplicação, não da tecnologia específica de persistência.

---

# 14. DI Container

## 14.1 O que é?

Um **DI Container** é uma ferramenta ou mecanismo que registra dependências e resolve quais implementações devem ser fornecidas.

Em vez de escrever manualmente:

```ts
const repository = new DrizzleStudentRepository();

const service = new RegisterStudent(repository);
```

um container pode cuidar da resolução.

---

## 14.2 Por que existe?

Aplicações grandes podem ter muitas dependências.

A composição manual pode ficar extensa.

---

## 14.3 Qual problema resolve?

Automatiza a montagem de objetos.

---

## 14.4 Como funciona?

Conceitualmente:

```text
container
  |
  +-- StudentRepository → DrizzleStudentRepository
  |
  +-- NotificationProvider → WhatsAppProvider
```

Quando alguém pede:

```text
StudentRepository
```

o container fornece:

```text
DrizzleStudentRepository
```

---

## 14.5 Quando eu usaria?

Quando a quantidade de dependências e componentes justificar.

---

## 14.6 Quando eu evitaria?

No início de um projeto pequeno, composição manual pode ser:

```text
mais explícita
mais fácil de entender
mais fácil de depurar
```

---

## 14.7 Exemplo

Sem container:

```ts
const repository =
  new DrizzleStudentRepository();

const service =
  new RegisterStudent(repository);
```

Com container:

```text
container.resolve(RegisterStudent)
```

A ferramenta conhece as relações.

---

## 14.8 Como aparece no Beach Tennis Manager?

Não existe necessidade de adotar um container imediatamente.

A composição manual pode ser suficiente enquanto a arquitetura estiver crescendo.

---

# 15. Quando usar e quando evitar

## 15.1 Quando usar

DI é particularmente interessante quando:

```text
a dependência é externa
a implementação pode variar
o componente precisa ser testado isoladamente
existe uma fronteira arquitetural
a criação é complexa
```

---

## 15.2 Quando evitar

Pode ser exagero quando:

```text
o objeto é trivial
a dependência não varia
não existe fronteira relevante
a abstração adiciona mais código que valor
```

---

## 15.3 Exemplo

Não precisamos:

```ts
class StringFactory {
  create(value: string) {
    return value;
  }
}
```

apenas para aplicar DI.

---

## 15.4 Como aparece no Beach Tennis Manager?

Uma dependência como:

```text
DrizzleStudentRepository
```

é um bom candidato a uma fronteira de infraestrutura.

Já:

```ts
new Date()
```

não precisa automaticamente de abstração.

---

# 16. Erros comuns

## 16.1 Confundir DI com interface

DI não exige interface.

Podemos injetar uma classe concreta:

```ts
class Service {
  constructor(
    private logger: ConsoleLogger,
  ) {}
}
```

Ainda existe DI.

---

## 16.2 Confundir DI com DIP

Como já vimos:

```text
DI = técnica
DIP = princípio
```

---

## 16.3 Criar interface para tudo

Isso gera:

```text
mais arquivos
mais indireção
mais complexidade
```

sem necessariamente melhorar o design.

---

## 16.4 Criar um container cedo demais

Um container pode esconder de onde as dependências vêm.

A composição manual pode ser mais didática e transparente.

---

## 16.5 Injetar dependências demais

Uma classe assim:

```ts
constructor(
  a,
  b,
  c,
  d,
  e,
  f,
  g,
  h,
) {}
```

pode indicar:

```text
responsabilidade excessiva
```

ou uma composição mal organizada.

DI não resolve SRP automaticamente.

---

# 17. Código ruim → análise → refatoração

## 17.1 Código inicial

```ts
class RegisterAbsence {
  async execute(
    studentId: string,
    lessonId: string,
  ) {
    const repository =
      new DrizzleAbsenceRepository();

    const notification =
      new WhatsAppProvider();

    const student =
      await repository.findStudent(studentId);

    if (!student) {
      return;
    }

    await repository.save({
      studentId,
      lessonId,
    });

    await notification.send(
      student.phone,
      "Ausência registrada",
    );
  }
}
```

---

## 17.2 Análise

O caso de uso cria:

```text
DrizzleAbsenceRepository
WhatsAppProvider
```

Ele conhece detalhes concretos.

---

## 17.3 Problema

Isso dificulta:

```text
testes
substituição
manutenção
separação arquitetural
```

---

## 17.4 Primeira refatoração

```ts
interface AbsenceRepository {
  findStudent(
    id: string,
  ): Promise<Student | null>;

  save(absence: Absence): Promise<void>;
}

interface NotificationProvider {
  send(
    recipient: string,
    message: string,
  ): Promise<void>;
}
```

Caso de uso:

```ts
class RegisterAbsence {
  constructor(
    private readonly repository: AbsenceRepository,
    private readonly notification: NotificationProvider,
  ) {}

  async execute(
    studentId: string,
    lessonId: string,
  ) {
    const student =
      await this.repository.findStudent(studentId);

    if (!student) {
      return;
    }

    await this.repository.save({
      studentId,
      lessonId,
    });

    await this.notification.send(
      student.phone,
      "Ausência registrada",
    );
  }
}
```

---

## 17.5 Composição

Fora do caso de uso:

```ts
const repository =
  new DrizzleAbsenceRepository();

const notification =
  new WhatsAppProvider();

const useCase =
  new RegisterAbsence(
    repository,
    notification,
  );
```

Agora:

```text
RegisterAbsence
       ↓
interfaces
       ↑
implementações concretas
```

---

## 17.6 Ainda existe trabalho

A refatoração acima melhora as dependências, mas não define toda a regra de ausência.

No Beach Tennis Manager, as regras documentadas precisam determinar:

```text
tipo de ausência
prazo de aviso
configuração do professor
limite de reposições
ciclo
crédito
```

DI resolve a composição de dependências.

Ela não resolve a modelagem do domínio.

---

# 18. Aplicação no Beach Tennis Manager

Uma visão arquitetural simplificada:

```text
HTTP / Fastify
      ↓
Controller
      ↓
Use Case
      ↓
Contratos
      ↓
Implementações
      ↓
Drizzle
      ↓
PostgreSQL
```

---

## 18.1 Controller

Pode receber:

```text
request
```

e chamar o caso de uso.

---

## 18.2 Use Case

Recebe dependências:

```ts
class RegisterStudent {
  constructor(
    private readonly repository: StudentRepository,
  ) {}
}
```

---

## 18.3 Contrato

```ts
interface StudentRepository {
  findById(id: string): Promise<Student | null>;
  save(student: Student): Promise<void>;
}
```

---

## 18.4 Infraestrutura

```ts
class DrizzleStudentRepository
  implements StudentRepository {
  // detalhes do Drizzle
}
```

---

## 18.5 Composition Root

Conecta:

```text
DrizzleStudentRepository
        ↓
StudentRepository
        ↓
RegisterStudent
        ↓
Controller
```

---

## 18.6 Benefício

Se amanhã a persistência mudar:

```text
Drizzle
→ outra implementação
```

o caso de uso pode permanecer dependente do mesmo contrato.

Isso não significa que a troca será sempre trivial.

O contrato precisa ser compatível e a infraestrutura nova precisa implementar seu comportamento corretamente.

---

# 19. Exercícios

## Exercício 1 — Identificar dependências

Analise:

```ts
class StudentService {
  constructor(
    private repository: StudentRepository,
    private notifier: NotificationProvider,
  ) {}
}
```

Liste as dependências.

---

## Exercício 2 — Criação interna

Refatore:

```ts
class StudentService {
  private repository =
    new DrizzleStudentRepository();
}
```

para DI.

---

## Exercício 3 — DIP × DI

Explique:

```text
qual parte é princípio?
qual parte é técnica?
```

---

## Exercício 4 — Teste

Crie:

```ts
FakeStudentRepository
```

e use-o para testar um caso de uso.

---

## Exercício 5 — Composition Root

Desenhe:

```text
main
 ↓
repository
 ↓
use case
 ↓
controller
```

e explique por que cada objeto é criado naquele ponto.

---

## Exercício 6 — Beach Tennis Manager

Escolha uma operação como:

```text
Registrar ausência
```

e identifique:

```text
dependências de domínio
dependências de persistência
dependências externas
```

Depois indique quais deveriam ser injetadas.

---

# 20. Perguntas de entrevista

## O que é Dependency Injection?

É uma técnica na qual um componente recebe de fora as dependências necessárias para executar seu trabalho, em vez de criá-las internamente.

---

## Por que usar DI?

Para reduzir acoplamento entre consumidores e implementações, facilitar testes e centralizar a composição das dependências quando isso traz valor.

---

## O que é DIP?

É um princípio de design que orienta módulos importantes a dependerem de abstrações em vez de detalhes concretos.

---

## DI e DIP são iguais?

Não.

```text
DIP = princípio
DI = técnica
```

---

## Qual tipo de DI você prefere?

Para dependências obrigatórias, normalmente injeção pelo construtor, porque deixa o contrato explícito e evita objetos incompletos.

---

## O que é Composition Root?

É o ponto da aplicação onde as implementações concretas são conectadas aos componentes que precisam delas.

---

## O que é um DI Container?

É um mecanismo que automatiza o registro e a resolução de dependências.

---

## Todo projeto precisa de DI Container?

Não.

Projetos pequenos ou médios podem funcionar muito bem com composição manual.

---

# 21. Perguntas de aprofundamento

### 1. Posso usar DI sem interfaces?

Sim.

DI significa fornecer a dependência externamente.

Interface é apenas uma possível abstração.

---

### 2. Posso aplicar DIP sem um container?

Sim.

Um container é apenas uma forma de automatizar a composição.

---

### 3. DI reduz todo acoplamento?

Não.

Ela pode reduzir determinados tipos de acoplamento, principalmente entre consumidor e implementação concreta.

---

### 4. Uma classe com muitas dependências está errada?

Não necessariamente.

Mas é um sinal para investigar:

```text
ela possui responsabilidades demais?
```

---

### 5. Por que injeção por construtor costuma ser preferida?

Porque as dependências obrigatórias ficam explícitas no momento da criação do objeto.

---

### 6. Qual é o problema de criar a dependência dentro da classe?

A classe passa a controlar simultaneamente:

```text
seu trabalho
+
criação da infraestrutura
```

Isso pode aumentar acoplamento e dificultar substituição e testes.

---

### 7. DI melhora performance?

Não é esse o objetivo principal.

Ela é uma técnica de design e composição.

---

### 8. Um fake é a mesma coisa que um mock?

Não exatamente.

"Test double" é o termo geral.

Um fake possui uma implementação simplificada que funciona de maneira controlada.

Um mock normalmente é usado para verificar interações esperadas.

Os termos podem variar entre bibliotecas e comunidades.

---

### 9. Posso usar DI demais?

Sim.

Excesso de abstrações pode gerar:

```text
indireção
complexidade
dificuldade de navegação
```

---

### 10. DI substitui arquitetura?

Não.

DI é uma técnica dentro de um design maior.

---

# 22. Checklist de domínio

### Dependências

- [ ] Sei definir dependência.
- [ ] Sei identificar dependências concretas.
- [ ] Sei explicar o problema da criação interna.

### Dependency Injection

- [ ] Sei definir DI.
- [ ] Sei explicar por que ela existe.
- [ ] Sei aplicar injeção pelo construtor.
- [ ] Sei diferenciar DI de DIP.
- [ ] Sei explicar quando DI pode ser desnecessária.

### Abstrações

- [ ] Sei explicar por que uma interface pode proteger uma fronteira.
- [ ] Sei evitar interfaces artificiais.
- [ ] Sei relacionar abstração com acoplamento.

### Composition Root

- [ ] Sei explicar o que é Composition Root.
- [ ] Sei identificar onde as implementações concretas devem ser conectadas.
- [ ] Sei explicar por que a regra de negócio não deve montar sua infraestrutura.

### Testes

- [ ] Sei criar uma implementação fake.
- [ ] Sei explicar como DI facilita testes.
- [ ] Sei diferenciar teste unitário de integração em termos gerais.
- [ ] Sei explicar que DI não elimina a necessidade de testes de integração.

### Arquitetura

- [ ] Consigo desenhar a direção das dependências.
- [ ] Consigo explicar o fluxo contrato → implementação.
- [ ] Consigo aplicar DI no Beach Tennis Manager.
- [ ] Consigo justificar quando não usar um container.
- [ ] Consigo explicar os trade-offs da solução.

---

# Conclusão

Injeção de Dependência pode parecer simplesmente isto:

```ts
constructor(private repository: Repository) {}
```

Mas a técnica representa uma decisão arquitetural maior:

```text
quem usa uma dependência
não precisa necessariamente
criar a dependência.
```

A composição pode acontecer fora:

```text
implementação concreta
        ↓
composição
        ↓
contrato
        ↓
caso de uso
```

Isso permite separar:

```text
regra
```

de:

```text
detalhe técnico
```

e conecta diretamente os fundamentos estudados até agora:

```text
Responsabilidade
      ↓
Coesão
      ↓
Acoplamento
      ↓
Dependência
      ↓
Abstração
      ↓
DIP
      ↓
Dependency Injection
```

No Beach Tennis Manager, esse conhecimento será importante para estruturar:

```text
Controllers
Use Cases
Repositories
Domain
Infrastructure
External Providers
```

sem transformar o projeto em uma coleção de abstrações desnecessárias.

O próximo passo natural é estudar **Design Patterns**, mas agora com uma base importante: padrões não serão apresentados como "receitas para decorar". Vamos estudar o problema que cada padrão resolve, a estrutura da solução, seus trade-offs e quando ele deve ou não ser utilizado.
