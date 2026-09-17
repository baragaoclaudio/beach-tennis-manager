# 04 — SOLID

> Material de estudo do Beach Tennis Manager.
>
> Este documento apresenta os cinco princípios SOLID como ferramentas de raciocínio para design de software.
>
> O objetivo não é decorar cinco siglas. É entender quais problemas cada princípio tenta evitar, reconhecer esses problemas no código e avaliar se uma mudança realmente melhora o design.
>
> Os princípios estudados aqui são especialmente importantes para os próximos módulos de Injeção de Dependência, Design Patterns e Arquitetura.

---

## Sumário

1. [Como estudar este documento](#1-como-estudar-este-documento)
2. [Antes do SOLID: por que esses princípios existem?](#2-antes-do-solid-por-que-esses-princípios-existem)
3. [S — Single Responsibility Principle](#3-s--single-responsibility-principle)
4. [O — Open/Closed Principle](#4-o--openclosed-principle)
5. [L — Liskov Substitution Principle](#5-l--liskov-substitution-principle)
6. [I — Interface Segregation Principle](#6-i--interface-segregation-principle)
7. [D — Dependency Inversion Principle](#7-d--dependency-inversion-principle)
8. [Como os cinco princípios se relacionam](#8-como-os-cinco-princípios-se-relacionam)
9. [SOLID não é uma receita](#9-solid-não-é-uma-receita)
10. [Código ruim → análise → refatoração](#10-código-ruim--análise--refatoração)
11. [Aplicação integrada no Beach Tennis Manager](#11-aplicação-integrada-no-beach-tennis-manager)
12. [Exercícios](#12-exercícios)
13. [Perguntas de entrevista](#13-perguntas-de-entrevista)
14. [Perguntas de aprofundamento](#14-perguntas-de-aprofundamento)
15. [Checklist de domínio](#15-checklist-de-domínio)

---

# 1. Como estudar este documento

SOLID é frequentemente apresentado assim:

```text
S = Single Responsibility Principle
O = Open/Closed Principle
L = Liskov Substitution Principle
I = Interface Segregation Principle
D = Dependency Inversion Principle
```

Saber expandir as siglas é o nível mais básico.

O objetivo aqui é chegar a outro nível:

```text
identificar o problema
        ↓
entender por que ele existe
        ↓
avaliar alternativas
        ↓
entender o custo da solução
        ↓
aplicar apenas quando fizer sentido
```

Um princípio de design não é uma lei da linguagem.

É uma orientação para tomar decisões.

---

# 2. Antes do SOLID: por que esses princípios existem?

## 2.1 O que estamos tentando melhorar?

No módulo anterior estudamos:

```text
responsabilidade
coesão
acoplamento
dependência
abstração
encapsulamento
composição
```

SOLID usa muitos desses conceitos para orientar decisões de design.

O objetivo geral é facilitar a evolução do software.

---

## 2.2 Um exemplo do problema

Imagine:

```ts
class StudentService {
  createStudent() {}
  updateStudent() {}
  sendWhatsApp() {}
  generatePdf() {}
  calculatePayment() {}
  saveToDatabase() {}
}
```

O código pode funcionar.

Mas temos perguntas:

```text
Quem é responsável por enviar WhatsApp?
Quem conhece o banco?
Quem gera PDF?
Quem calcula pagamento?
```

Se tudo estiver concentrado, mudanças diferentes podem atingir a mesma classe.

---

## 2.3 O que SOLID tenta evitar?

De maneira geral, os princípios ajudam a discutir:

```text
responsabilidades excessivas
dependências rígidas
hierarquias incorretas
interfaces grandes
implementações difíceis de substituir
```

---

# 3. S — Single Responsibility Principle

## 3.1 O que é?

O Single Responsibility Principle (SRP), ou **Princípio da Responsabilidade Única**, afirma:

> Uma classe deve ter um único motivo para mudar.

A parte mais importante da definição é:

```text
motivo para mudar
```

e não:

```text
uma única função
```

---

## 3.2 Por que existe?

Porque uma classe com diferentes motivos de mudança tende a acumular responsabilidades que evoluem independentemente.

Imagine:

```text
StudentService
├── regra de aluno
├── banco
├── WhatsApp
└── PDF
```

Mudanças em qualquer uma dessas áreas podem exigir alteração na mesma classe.

---

## 3.3 Qual problema resolve?

SRP ajuda a reduzir:

- classes com responsabilidades não relacionadas;
- mudanças concentradas em um único lugar;
- efeitos colaterais inesperados;
- dificuldade de teste;
- baixa coesão.

---

## 3.4 Como funciona?

Considere:

```ts
class StudentService {
  createStudent(data: CreateStudentInput) {
    // valida
    // salva
    // envia mensagem
    // gera documento
  }
}
```

Podemos perguntar:

```text
A regra de criação mudou.
A integração de WhatsApp mudou.
O formato do documento mudou.
O banco mudou.
```

Todos esses motivos podem modificar a mesma classe.

Uma possível divisão:

```text
StudentService
StudentRepository
NotificationService
StudentDocumentGenerator
```

A divisão exata depende da arquitetura.

---

## 3.5 Quando eu usaria?

SRP deve ser considerado quando uma classe ou módulo possui responsabilidades que:

- pertencem a conceitos diferentes;
- mudam por motivos diferentes;
- possuem dependências diferentes;
- dificultam testes.

---

## 3.6 Quando eu evitaria?

Evite fragmentar automaticamente.

Isto pode ser exagero:

```text
StudentNameValidator
StudentCpfValidator
StudentEmailValidator
StudentPhoneValidator
```

se essas validações fizerem parte de um mesmo conceito simples e a separação não melhorar o design.

---

## 3.7 Exemplo

Antes:

```ts
class PaymentService {
  calculate() {}
  save() {}
  sendReceipt() {}
}
```

Depois, potencialmente:

```text
PaymentService
PaymentRepository
ReceiptSender
```

Cada parte possui um foco diferente.

---

## 3.8 Como aparece no Beach Tennis Manager?

Considere uma operação de ausência.

Uma classe não deveria automaticamente assumir:

```text
calcular regra
buscar banco
salvar banco
enviar WhatsApp
gerar relatório
```

Uma possível separação seria:

```text
caso de uso
    ↓
regras
    ↓
repositórios
    ↓
provedores externos
```

O desenho exato será definido na arquitetura.

---

## 3.9 Conceitos relacionados

SRP se relaciona diretamente com:

```text
coesão
responsabilidade
acoplamento
separação de preocupações
```

**Separação de preocupações** significa organizar o sistema de modo que preocupações diferentes não fiquem misturadas sem necessidade.

---

## 3.10 Erros comuns

### "Uma classe só pode ter um método"

Errado.

SRP não limita quantidade de métodos.

### "Um arquivo deve ter uma classe"

Também não é a definição do princípio.

### "Toda função precisa virar uma classe"

Não.

---

## 3.11 Trade-offs

Separar responsabilidades pode:

```text
reduzir acoplamento
aumentar coesão
facilitar testes
```

Mas também pode:

```text
aumentar quantidade de arquivos
aumentar indireção
dificultar navegação
```

Por isso, devemos buscar uma divisão útil.

---

## 3.12 Código ruim

```ts
class StudentService {
  async create(data: CreateStudentInput) {
    // valida dados

    // salva no banco

    // envia WhatsApp

    // gera PDF

    // envia e-mail
  }
}
```

---

## 3.13 Análise

Existem vários motivos de mudança:

```text
regra de aluno
banco
WhatsApp
PDF
e-mail
```

Isso sugere baixa coesão.

---

## 3.14 Refatoração

Uma possível direção:

```ts
class StudentService {
  constructor(
    private repository: StudentRepository,
    private notifier: NotificationProvider,
  ) {}

  async create(data: CreateStudentInput) {
    // regra de aplicação
    // persistência através do contrato
    // notificação através do contrato
  }
}
```

Ainda pode haver outras decisões.

O objetivo não é simplesmente criar mais classes.

---

## 3.15 Testes

Depois da separação, podemos testar:

```text
regra
persistência
notificação
```

com menor necessidade de executar o sistema inteiro.

---

## 3.16 Exercícios

1. Encontre três motivos diferentes para uma classe mudar.
2. Proponha uma divisão.
3. Explique por que a divisão melhora ou piora o código.
4. Diga quais dependências cada parte teria.

---

## 3.17 Perguntas de entrevista

### O que é SRP?

Uma classe deve ter um único motivo para mudar.

### SRP significa uma classe com apenas uma responsabilidade?

A definição é melhor entendida através de "um motivo para mudar". Uma responsabilidade deve representar um conjunto coerente de mudanças relacionadas.

---

# 4. O — Open/Closed Principle

## 4.1 O que é?

O Open/Closed Principle (OCP), ou **Princípio Aberto/Fechado**, afirma:

> Entidades de software devem estar abertas para extensão, mas fechadas para modificação.

Isso não significa que nunca podemos editar código existente.

Significa que determinadas variações devem poder ser adicionadas sem modificar continuamente uma parte central estável.

---

## 4.2 Por que existe?

Porque alterações frequentes em código central podem gerar regressões.

Imagine:

```ts
function calculatePayment(type: string) {
  if (type === "pix") {
    // ...
  }

  if (type === "card") {
    // ...
  }

  if (type === "boleto") {
    // ...
  }
}
```

Sempre que surgir um novo tipo:

```text
editar a função
```

Isso pode funcionar, mas se a quantidade de variações crescer, a função se torna um ponto de mudança constante.

---

## 4.3 Qual problema resolve?

OCP ajuda a controlar mudanças quando existe uma dimensão de variação bem definida.

---

## 4.4 Como funciona?

Uma forma comum é utilizar polimorfismo.

```ts
interface PaymentMethod {
  pay(value: number): Promise<void>;
}
```

Implementações:

```ts
class PixPayment implements PaymentMethod {
  async pay(value: number) {}
}

class CardPayment implements PaymentMethod {
  async pay(value: number) {}
}
```

O código consumidor trabalha com:

```ts
PaymentMethod
```

e novas implementações podem ser adicionadas.

---

## 4.5 Quando eu usaria?

Quando:

- a variação é real;
- novos casos aparecem com frequência;
- existe um contrato estável;
- condicionais estão crescendo;
- a extensão pode ser isolada.

---

## 4.6 Quando eu evitaria?

Não crie uma arquitetura extensível para uma variação que provavelmente nunca existirá.

Se temos:

```ts
if (status === "ACTIVE") {}
```

não precisamos criar:

```text
StatusStrategyFactory
StatusProvider
StatusResolver
```

apenas por precaução.

---

## 4.7 Exemplo

Sem polimorfismo:

```ts
function notify(
  type: string,
  message: string,
) {
  if (type === "whatsapp") {
    // ...
  }

  if (type === "email") {
    // ...
  }
}
```

Com contrato:

```ts
interface NotificationProvider {
  send(message: string): Promise<void>;
}
```

Cada implementação pode cuidar da própria forma de envio.

---

## 4.8 Como aparece no Beach Tennis Manager?

Se futuramente existirem diferentes provedores de notificação:

```text
WhatsApp
E-mail
outro provedor
```

podemos ter:

```text
NotificationProvider
        |
        +-- WhatsAppProvider
        +-- EmailProvider
```

Não devemos criar isso hoje apenas porque "pode ser útil".

---

## 4.9 Conceitos relacionados

OCP se relaciona com:

```text
polimorfismo
abstração
composição
acoplamento
```

---

## 4.10 Erros comuns

### "Fechado para modificação significa nunca editar código"

Não.

Código sempre pode precisar de manutenção.

O princípio fala sobre organizar pontos de variação.

---

## 4.11 Trade-offs

Benefícios:

```text
extensão localizada
menor impacto no código estável
```

Custos:

```text
mais abstrações
mais componentes
mais indireção
```

---

## 4.12 Código ruim

```ts
function sendNotification(
  provider: string,
  message: string,
) {
  if (provider === "whatsapp") {
    // ...
  } else if (provider === "email") {
    // ...
  } else if (provider === "sms") {
    // ...
  }
}
```

---

## 4.13 Análise

Cada novo provedor exige alterar a função central.

Se a quantidade de provedores crescer, a função pode se tornar difícil de manter.

---

## 4.14 Refatoração

```ts
interface NotificationProvider {
  send(message: string): Promise<void>;
}
```

Implementações:

```ts
class WhatsAppProvider implements NotificationProvider {
  async send(message: string) {}
}

class EmailProvider implements NotificationProvider {
  async send(message: string) {}
}
```

Consumidor:

```ts
class NotificationService {
  constructor(
    private provider: NotificationProvider,
  ) {}

  send(message: string) {
    return this.provider.send(message);
  }
}
```

---

## 4.15 Testes

Podemos testar `NotificationService` usando uma implementação falsa:

```ts
class FakeNotificationProvider
  implements NotificationProvider {

  messages: string[] = [];

  async send(message: string) {
    this.messages.push(message);
  }
}
```

Isso também prepara o terreno para Injeção de Dependência.

---

## 4.16 Exercícios

1. Encontre um `if/switch` que representa variações.
2. Pergunte se essas variações realmente precisam crescer.
3. Se sim, proponha uma abstração.
4. Se não, justifique por que manter o `if` é melhor.

---

## 4.17 Perguntas de entrevista

### O que significa Open/Closed?

Que uma parte estável do software deve poder receber extensões sem precisar ser constantemente modificada para cada nova variação.

### OCP significa que não podemos alterar código?

Não.

Significa controlar pontos de variação.

---

# 5. L — Liskov Substitution Principle

## 5.1 O que é?

O Liskov Substitution Principle (LSP), ou **Princípio da Substituição de Liskov**, afirma, em essência:

> Subtipos devem poder substituir seus tipos base sem quebrar as expectativas estabelecidas pelo contrato.

Este é um dos princípios mais importantes para entender herança corretamente.

---

## 5.2 Por que existe?

Porque herança pode criar uma relação que parece correta sintaticamente, mas é incorreta conceitualmente.

Exemplo clássico:

```text
Bird
  ↑
Penguin
```

Se `Bird` possui:

```ts
fly()
```

e `Penguin` não pode voar, então:

```ts
function makeBirdFly(bird: Bird) {
  bird.fly();
}
```

pode quebrar quando receber um pinguim.

O problema não é o pinguim.

O problema é o contrato da abstração `Bird`.

---

## 5.3 Qual problema resolve?

LSP ajuda a evitar hierarquias em que subclasses:

- quebram expectativas;
- lançam exceções inesperadas;
- ignoram operações;
- alteram significado do contrato;
- exigem condições especiais.

---

## 5.4 Como funciona?

Imagine:

```ts
interface Bird {
  fly(): void;
}
```

Não é adequado colocar um tipo que não pode cumprir esse contrato.

Uma modelagem melhor:

```ts
interface Bird {}

interface FlyingBird extends Bird {
  fly(): void;
}
```

Agora:

```text
Bird
FlyingBird
```

representam capacidades diferentes.

---

## 5.5 Quando eu usaria?

LSP deve ser considerado sempre que houver:

- herança;
- subtipos;
- interfaces com múltiplas implementações;
- polimorfismo.

---

## 5.6 Quando eu evitaria?

Evite criar hierarquias apenas para compartilhar código.

Se a substituição não faz sentido, provavelmente a relação de herança está errada.

---

## 5.7 Exemplo

Problema:

```ts
class ReadOnlyRepository extends Repository {
  save() {
    throw new Error("Não suportado");
  }
}
```

Se o contrato de `Repository` promete que `save()` funciona, o subtipo viola a expectativa.

---

## 5.8 Como aparece no Beach Tennis Manager?

Imagine uma interface:

```ts
interface StudentRepository {
  findById(id: string): Promise<Student | null>;
  save(student: Student): Promise<void>;
}
```

Uma implementação que aceita `findById`, mas sempre falha em `save`, não seria uma substituição válida se o contrato promete persistência.

---

## 5.9 Conceitos relacionados

LSP se conecta com:

```text
herança
polimorfismo
contratos
abstração
pré-condições
pós-condições
```

**Pré-condição** é aquilo que precisa ser verdadeiro antes de uma operação.

**Pós-condição** é aquilo que deve ser verdadeiro depois que ela termina.

---

## 5.10 Erros comuns

### "Se compila, respeita LSP"

Não.

O compilador verifica estrutura e tipos, mas não todas as expectativas comportamentais.

### "Subclasse pode mudar completamente o significado"

Isso pode quebrar a substituição.

---

## 5.11 Trade-offs

LSP favorece contratos mais confiáveis.

O custo é que talvez seja necessário:

```text
redesenhar hierarquias
separar interfaces
usar composição
```

---

## 5.12 Código ruim

```ts
class Repository {
  save(data: unknown) {}
}

class ReadOnlyRepository extends Repository {
  save(data: unknown) {
    throw new Error("Operação não suportada");
  }
}
```

---

## 5.13 Análise

O código diz:

```text
ReadOnlyRepository é um Repository
```

mas o contrato de `Repository` promete:

```text
save()
```

A substituição quebra.

---

## 5.14 Refatoração

Separar capacidades:

```ts
interface Reader<T> {
  findById(id: string): Promise<T | null>;
}

interface Writer<T> {
  save(entity: T): Promise<void>;
}
```

Agora uma implementação somente leitura pode implementar apenas:

```ts
Reader<T>
```

---

## 5.15 Testes

Testes comportamentais são importantes para LSP.

Não basta verificar:

```text
classe implementa interface
```

É necessário verificar se ela respeita o contrato.

---

## 5.16 Exercícios

1. Crie uma hierarquia que viole LSP.
2. Explique qual expectativa foi quebrada.
3. Resolva usando composição ou interfaces menores.
4. Explique por que a nova solução é mais coerente.

---

## 5.17 Perguntas de entrevista

### O que é LSP?

É o princípio de que subtipos devem poder substituir seus tipos base sem quebrar as expectativas do contrato.

### Como identificar uma violação?

Quando uma implementação precisa:

```text
lançar exceções inesperadas
ignorar métodos
alterar significativamente o significado
exigir pré-condições incompatíveis
```

---

# 6. I — Interface Segregation Principle

## 6.1 O que é?

O Interface Segregation Principle (ISP), ou **Princípio da Segregação de Interfaces**, afirma:

> Clientes não devem ser obrigados a depender de métodos que não utilizam.

Aqui, "cliente" significa qualquer parte do código que utiliza uma interface.

---

## 6.2 Por que existe?

Interfaces muito grandes criam dependências desnecessárias.

Considere:

```ts
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}
```

Uma implementação que só precisa:

```text
work()
```

é obrigada a conhecer os outros métodos.

---

## 6.3 Qual problema resolve?

ISP reduz:

- contratos gigantes;
- dependências desnecessárias;
- implementações artificiais;
- mudanças que afetam consumidores que não precisam delas.

---

## 6.4 Como funciona?

Em vez de:

```ts
interface StudentService {
  create(): void;
  update(): void;
  delete(): void;
  exportPdf(): void;
  sendWhatsApp(): void;
}
```

podemos separar contratos quando os consumidores possuem necessidades diferentes.

```ts
interface StudentReader {
  findById(id: string): Promise<Student | null>;
}

interface StudentWriter {
  save(student: Student): Promise<void>;
}
```

---

## 6.5 Quando eu usaria?

Quando uma interface:

- possui muitos métodos;
- possui grupos de métodos usados por consumidores diferentes;
- obriga implementações a fornecer operações irrelevantes.

---

## 6.6 Quando eu evitaria?

Não divida interfaces pequenas sem necessidade.

Isto:

```ts
interface IdProvider {
  getId(): string;
}

interface NameProvider {
  getName(): string;
}
```

pode ser fragmentação excessiva se os conceitos sempre forem utilizados juntos.

---

## 6.7 Exemplo

Interface grande:

```ts
interface UserRepository {
  findById(): void;
  findAll(): void;
  save(): void;
  delete(): void;
  export(): void;
}
```

Possível separação:

```ts
interface UserReader {
  findById(): void;
  findAll(): void;
}

interface UserWriter {
  save(): void;
  delete(): void;
}
```

---

## 6.8 Como aparece no Beach Tennis Manager?

Um caso de uso de consulta pode precisar apenas:

```text
buscar matrícula
```

Não existe necessariamente motivo para ele depender de um contrato que também oferece:

```text
criar
atualizar
deletar
exportar
```

---

## 6.9 Conceitos relacionados

ISP se relaciona com:

```text
coesão
acoplamento
abstração
responsabilidade
LSP
```

---

## 6.10 Erros comuns

### "Toda interface deve ser pequena"

Não.

Ela deve ser coerente para seus consumidores.

### "Uma interface com cinco métodos viola ISP"

Não necessariamente.

O problema é obrigar consumidores a depender de operações que não precisam.

---

## 6.11 Trade-offs

Interfaces menores podem:

```text
reduzir acoplamento
facilitar testes
melhorar contratos
```

Mas podem:

```text
aumentar quantidade de interfaces
```

---

## 6.12 Código ruim

```ts
interface StudentRepository {
  findById(): void;
  save(): void;
  delete(): void;
  exportPdf(): void;
  sendWhatsApp(): void;
}
```

---

## 6.13 Análise

Mistura:

```text
persistência
relatório
notificação
```

e obriga consumidores a conhecer capacidades diferentes.

---

## 6.14 Refatoração

```ts
interface StudentReader {
  findById(id: string): Promise<Student | null>;
}

interface StudentWriter {
  save(student: Student): Promise<void>;
  delete(id: string): Promise<void>;
}

interface StudentExporter {
  exportPdf(id: string): Promise<Buffer>;
}
```

A divisão deve ser baseada nos consumidores reais.

---

## 6.15 Testes

Uma interface menor facilita criar doubles de teste.

**Test double** é uma implementação usada em testes no lugar de uma dependência real.

Exemplo:

```ts
class FakeStudentReader implements StudentReader {
  async findById(id: string) {
    return null;
  }
}
```

---

## 6.16 Exercícios

Pegue:

```ts
interface TeacherService {
  create();
  update();
  delete();
  listStudents();
  sendMessage();
  generateReport();
}
```

Separe em contratos coerentes.

Depois explique quem utilizaria cada um.

---

## 6.17 Perguntas de entrevista

### O que é ISP?

Consumidores não devem ser obrigados a depender de métodos que não utilizam.

### Interface pequena é sempre melhor?

Não.

O objetivo é coesão e dependência adequada, não simplesmente quantidade de métodos.

---

# 7. D — Dependency Inversion Principle

## 7.1 O que é?

O Dependency Inversion Principle (DIP), ou **Princípio da Inversão de Dependência**, afirma, de forma resumida:

> Módulos de alto nível não devem depender diretamente de módulos de baixo nível. Ambos devem depender de abstrações.

E:

> Abstrações não devem depender de detalhes. Detalhes devem depender de abstrações.

Este é provavelmente o princípio que mais conecta SOLID com arquitetura e Injeção de Dependência.

---

## 7.2 Por que existe?

Porque detalhes técnicos mudam.

Exemplos:

```text
PostgreSQL
Drizzle
WhatsApp
HTTP
filesystem
```

Se regras importantes dependem diretamente desses detalhes, mudanças técnicas podem se espalhar.

---

## 7.3 Qual problema resolve?

DIP ajuda a separar:

```text
regra importante
```

de:

```text
detalhe de implementação
```

---

## 7.4 Como funciona?

Considere:

```ts
class RegisterStudent {
  private repository = new DrizzleStudentRepository();

  async execute(input: CreateStudentInput) {
    await this.repository.save(input);
  }
}
```

O caso de uso conhece diretamente:

```text
DrizzleStudentRepository
```

Uma alternativa:

```ts
interface StudentRepository {
  save(student: Student): Promise<void>;
}

class RegisterStudent {
  constructor(
    private repository: StudentRepository,
  ) {}

  async execute(input: CreateStudentInput) {
    await this.repository.save(input);
  }
}
```

Agora:

```text
RegisterStudent
       |
StudentRepository
       ^
       |
DrizzleStudentRepository
```

A implementação concreta depende do contrato utilizado pela regra.

---

## 7.5 Quando eu usaria?

DIP é especialmente útil em:

- casos de uso;
- domínio;
- infraestrutura;
- repositórios;
- integrações externas;
- sistemas com testes isolados.

---

## 7.6 Quando eu evitaria?

Não crie abstrações para cada chamada simples.

Se uma função trivial usa uma biblioteca diretamente e não existe uma fronteira arquitetural relevante, introduzir um contrato pode ser apenas custo.

---

## 7.7 Exemplo

Direto:

```ts
class PaymentService {
  private gateway = new PixGateway();
}
```

Com abstração:

```ts
interface PaymentGateway {
  pay(value: number): Promise<void>;
}

class PaymentService {
  constructor(
    private gateway: PaymentGateway,
  ) {}
}
```

---

## 7.8 Como aparece no Beach Tennis Manager?

A arquitetura já utiliza:

```text
Node.js
TypeScript
Fastify
Drizzle
PostgreSQL
```

Uma regra de negócio não deveria precisar conhecer detalhes específicos do Drizzle.

Uma possível direção:

```text
Caso de uso
    ↓
Repository interface
    ↑
Drizzle repository
    ↓
PostgreSQL
```

Isso permite que a regra de aplicação dependa de um contrato, enquanto a infraestrutura conhece a tecnologia.

---

## 7.9 DIP × Dependency Injection

Esses conceitos são frequentemente confundidos.

### DIP

É um **princípio de design**.

Ele orienta a direção das dependências.

### Dependency Injection

É uma **técnica** para fornecer uma dependência a um componente em vez de fazê-lo criá-la diretamente.

Exemplo:

```ts
class PaymentService {
  constructor(
    private gateway: PaymentGateway,
  ) {}
}
```

A dependência foi injetada pelo construtor.

Portanto:

```text
DIP = princípio
DI = técnica
```

Podemos usar DI sem necessariamente aplicar DIP de maneira inteligente.

---

## 7.10 Conceitos relacionados

DIP se conecta diretamente com:

```text
abstração
acoplamento
composição
Dependency Injection
arquitetura
testabilidade
```

---

## 7.11 Erros comuns

### "DIP significa sempre usar interface"

Não.

Abstração pode assumir diferentes formas.

### "Injeção de dependência e inversão de dependência são a mesma coisa"

Não.

São conceitos relacionados, mas diferentes.

### "Toda dependência deve ser injetada"

Não necessariamente.

---

## 7.12 Trade-offs

Benefícios:

```text
menor acoplamento
melhor testabilidade
isolamento de infraestrutura
facilidade de substituição
```

Custos:

```text
mais abstrações
mais configuração
mais indireção
```

---

## 7.13 Código ruim

```ts
class RegisterAbsence {
  private repository =
    new DrizzleAbsenceRepository();

  private whatsapp =
    new WhatsAppProvider();

  async execute(input: Input) {
    // regra
    await this.repository.save(input);
    await this.whatsapp.send("...");
  }
}
```

O caso de uso conhece diretamente detalhes concretos.

---

## 7.14 Análise

Mudanças em:

```text
Drizzle
WhatsApp
```

podem exigir alterações no caso de uso.

Além disso, testar o caso de uso exige lidar com essas implementações concretas.

---

## 7.15 Refatoração

```ts
interface AbsenceRepository {
  save(absence: Absence): Promise<void>;
}

interface NotificationProvider {
  send(message: string): Promise<void>;
}

class RegisterAbsence {
  constructor(
    private absenceRepository: AbsenceRepository,
    private notificationProvider: NotificationProvider,
  ) {}

  async execute(input: Input) {
    // regra

    await this.absenceRepository.save(/* ... */);

    await this.notificationProvider.send("...");
  }
}
```

Agora a construção das implementações acontece fora do caso de uso.

Esse ponto será aprofundado no próximo módulo.

---

## 7.16 Testes

Podemos fornecer fakes:

```ts
class FakeAbsenceRepository
  implements AbsenceRepository {

  async save() {
    // registra chamada para o teste
  }
}
```

E:

```ts
class FakeNotificationProvider
  implements NotificationProvider {

  async send() {
    // registra mensagem
  }
}
```

O teste consegue verificar o comportamento sem acessar PostgreSQL ou um provedor externo real.

---

## 7.17 Exercícios

1. Crie um serviço que depende diretamente de uma implementação concreta.
2. Identifique a dependência.
3. Crie um contrato.
4. Injete a dependência.
5. Explique a diferença entre DIP e DI.

---

## 7.18 Perguntas de entrevista

### O que é DIP?

É o princípio que orienta módulos importantes a dependerem de abstrações em vez de detalhes concretos, invertendo a direção tradicional da dependência.

### O que é Dependency Injection?

É uma técnica em que uma dependência é fornecida ao componente por fora, em vez de ser criada diretamente por ele.

### DIP e DI são a mesma coisa?

Não.

DIP é princípio.

DI é técnica.

---

# 8. Como os cinco princípios se relacionam

Os princípios não são cinco regras independentes.

Eles se reforçam.

## SRP

Pergunta:

> As responsabilidades estão coerentes?

---

## OCP

Pergunta:

> Como esta parte deve evoluir quando surgir uma nova variação?

---

## LSP

Pergunta:

> Esta implementação realmente pode substituir o contrato que declara implementar?

---

## ISP

Pergunta:

> O consumidor está dependendo de coisas que não precisa?

---

## DIP

Pergunta:

> A regra importante depende de detalhes concretos ou de uma abstração adequada?

---

## Visão integrada

```text
SRP
 ↓
responsabilidades coerentes

OCP
 ↓
variações isoladas

LSP
 ↓
contratos confiáveis

ISP
 ↓
contratos adequados aos consumidores

DIP
 ↓
dependências apontando para abstrações
```

---

# 9. SOLID não é uma receita

## 9.1 O que é?

SOLID é um conjunto de princípios de design.

Não é uma arquitetura pronta.

---

## 9.2 Por que isso importa?

Porque é possível criar um código extremamente complexo tentando obedecer aos princípios mecanicamente.

Exemplo exagerado:

```text
CreateStudentService
CreateStudentServiceInterface
CreateStudentRepositoryInterface
CreateStudentRepositoryAdapter
CreateStudentFactory
CreateStudentFactoryInterface
CreateStudentStrategy
CreateStudentStrategyFactory
```

para uma operação simples.

---

## 9.3 Qual problema resolve?

Entender os princípios como ferramentas evita dogmatismo.

**Dogmatismo** significa seguir uma regra rigidamente sem analisar o contexto.

---

## 9.4 Como funciona?

A pergunta correta é:

```text
Qual problema estou tentando resolver?
```

e não:

```text
Qual princípio posso aplicar aqui?
```

---

## 9.5 Quando eu usaria?

Quando o código apresentar sinais de:

```text
alta responsabilidade
alto acoplamento
interfaces inadequadas
variações difíceis
hierarquias quebradas
```

---

## 9.6 Quando eu evitaria?

Quando aplicar o princípio gerar mais complexidade do que o problema original.

---

## 9.7 Exemplo

Código simples:

```ts
function calcularTotal(
  values: number[],
) {
  return values.reduce(
    (total, value) => total + value,
    0,
  );
}
```

Não precisamos criar:

```text
ICalculator
CalculatorService
CalculatorFactory
```

sem necessidade.

---

## 9.8 Como aparece no Beach Tennis Manager?

O Beach Tennis Manager possui regras suficientemente complexas para justificar bons limites arquiteturais.

Mas não devemos transformar cada função em uma abstração apenas para "ficar SOLID".

---

# 10. Código ruim → análise → refatoração

Considere:

```ts
class AbsenceService {
  async register(
    studentId: string,
    lessonId: string,
  ) {
    const student =
      await drizzleStudentRepository.findById(studentId);

    const lesson =
      await drizzleLessonRepository.findById(lessonId);

    if (!student || !student.active) {
      return false;
    }

    if (!lesson || lesson.status !== "REALIZADA") {
      return false;
    }

    if (lesson.noticeHours >= 6) {
      student.makeupCredits++;

      await drizzleStudentRepository.save(student);

      await whatsappProvider.send(
        student.phone,
        "Reposição disponível",
      );
    }

    return true;
  }
}
```

---

## 10.1 SRP

A classe está:

```text
consultando
validando
aplicando regra
alterando estado
persistindo
notificando
```

Existem vários motivos de mudança.

---

## 10.2 OCP

Se surgir outro provedor de notificação:

```text
e-mail
```

a classe pode precisar mudar.

---

## 10.3 DIP

A classe depende diretamente de:

```text
Drizzle
WhatsApp
```

Detalhes concretos.

---

## 10.4 ISP

Se o repositório fornecido tiver dezenas de operações que o caso de uso não utiliza, podemos estar criando dependência desnecessária.

---

## 10.5 LSP

Se criarmos implementações alternativas para os contratos, elas precisam respeitar seus comportamentos esperados.

---

## 10.6 Primeira direção de refatoração

```ts
interface StudentRepository {
  findById(id: string): Promise<Student | null>;
  save(student: Student): Promise<void>;
}

interface LessonRepository {
  findById(id: string): Promise<Lesson | null>;
}

interface NotificationProvider {
  send(
    recipient: string,
    message: string,
  ): Promise<void>;
}
```

Depois:

```ts
class AbsenceService {
  constructor(
    private students: StudentRepository,
    private lessons: LessonRepository,
    private notifications: NotificationProvider,
  ) {}

  async register(
    studentId: string,
    lessonId: string,
  ) {
    // fluxo
  }
}
```

---

## 10.7 Atenção à regra de negócio

O exemplo usa:

```ts
lesson.noticeHours >= 6
```

apenas para demonstrar um problema de design.

No Beach Tennis Manager:

```text
6 horas não é uma regra fixa.
```

O prazo mínimo de aviso é configurável por professor, com fallback para configuração global.

Além disso, a avaliação real da ausência depende das regras documentadas de:

```text
tipo de ausência
aviso
prazo
limite de reposições
ciclo
crédito
```

Portanto, a refatoração estrutural não deve ser confundida com a implementação final da regra de negócio.

---

# 11. Aplicação integrada no Beach Tennis Manager

Considere a arquitetura conceitual:

```text
HTTP
 ↓
Controller
 ↓
Use Case
 ↓
Domain / regras
 ↓
Repository interface
 ↓
Drizzle
 ↓
PostgreSQL
```

E uma integração:

```text
Use Case
 ↓
NotificationProvider
 ↓
WhatsApp
```

Os princípios podem aparecer assim.

---

## SRP

Controller:

```text
traduz HTTP
```

Caso de uso:

```text
coordena operação
```

Repository:

```text
persistência
```

Provider:

```text
integração externa
```

---

## OCP

Se existirem diferentes provedores:

```text
NotificationProvider
├── WhatsApp
└── Email
```

podemos adicionar implementações.

---

## LSP

Cada implementação precisa respeitar o contrato:

```text
NotificationProvider
```

---

## ISP

Um caso de uso deve receber apenas os contratos necessários.

---

## DIP

Casos de uso importantes dependem de abstrações.

---

# 12. Exercícios

## Exercício 1 — SRP

Analise:

```ts
class TeacherService {
  createTeacher() {}
  saveToDatabase() {}
  sendWhatsApp() {}
  generateReport() {}
}
```

Liste os possíveis motivos de mudança.

---

## Exercício 2 — OCP

Crie um sistema que envie:

```text
WhatsApp
Email
```

Primeiro usando `if`.

Depois usando polimorfismo.

Compare as duas soluções.

---

## Exercício 3 — LSP

Crie uma hierarquia em que uma subclasse não consiga cumprir o contrato do pai.

Depois corrija.

---

## Exercício 4 — ISP

Pegue:

```ts
interface StudentRepository {
  findById();
  findAll();
  save();
  delete();
  exportPdf();
}
```

Separe em interfaces menores.

Explique quem precisa de cada uma.

---

## Exercício 5 — DIP

Crie:

```ts
class RegisterPayment {
  private repository =
    new DrizzlePaymentRepository();
}
```

Refatore para depender de uma abstração.

---

## Exercício 6 — Integração

Escolha uma funcionalidade do Beach Tennis Manager e identifique:

```text
SRP
OCP
LSP
ISP
DIP
```

Não force um princípio onde não existe um problema.

Explique quando você **não aplicaria** cada um.

---

# 13. Perguntas de entrevista

## O que significa SOLID?

É um conjunto de cinco princípios de design:

```text
S — Single Responsibility Principle
O — Open/Closed Principle
L — Liskov Substitution Principle
I — Interface Segregation Principle
D — Dependency Inversion Principle
```

Eles ajudam a pensar sobre responsabilidades, extensão, contratos, interfaces e dependências.

---

## Explique SRP.

Uma classe deve ter um único motivo para mudar.

---

## Explique OCP.

Partes estáveis devem permitir extensão sem exigir modificações constantes para cada nova variação.

---

## Explique LSP.

Subtipos devem poder substituir seus tipos base sem quebrar as expectativas do contrato.

---

## Explique ISP.

Consumidores não devem ser obrigados a depender de métodos que não utilizam.

---

## Explique DIP.

Módulos importantes devem depender de abstrações em vez de detalhes concretos, e os detalhes devem depender dessas abstrações.

---

## Qual princípio está relacionado a uma classe com responsabilidades demais?

SRP.

---

## Qual princípio está relacionado a interfaces grandes?

ISP.

---

## Qual princípio está diretamente relacionado à herança?

LSP.

---

## Qual princípio está diretamente relacionado à extensão através de novas implementações?

OCP.

---

## Qual princípio está relacionado à direção das dependências?

DIP.

---

# 14. Perguntas de aprofundamento

### 1. SRP significa uma classe ter apenas um método?

Não.

Significa possuir um único motivo para mudar.

---

### 2. OCP significa nunca modificar código existente?

Não.

Código precisa ser corrigido e evoluído.

O objetivo é evitar que uma parte central precise ser alterada repetidamente para cada nova variação quando essa variação pode ser isolada.

---

### 3. LSP é apenas sobre herança?

Não.

A ideia se aplica a qualquer relação de substituição por contrato, embora seja especialmente discutida no contexto de herança e polimorfismo.

---

### 4. Interface pequena é sempre melhor?

Não.

Uma interface deve ser coesa para seus consumidores.

---

### 5. DIP significa usar interfaces em todas as dependências?

Não.

O princípio fala sobre depender de abstrações adequadas.

Uma interface desnecessária pode ser pior que uma dependência concreta simples.

---

### 6. Dependency Injection é SOLID?

DI não é um dos cinco princípios.

É uma técnica frequentemente usada para aplicar DIP.

---

### 7. SOLID garante código bom?

Não.

São princípios de design.

Código também depende de:

```text
domínio
arquitetura
testes
simplicidade
clareza
requisitos
trade-offs
```

---

### 8. Posso violar SOLID conscientemente?

Sim.

Uma decisão consciente baseada no contexto pode ser melhor do que aplicar um princípio mecanicamente.

---

### 9. SOLID serve apenas para Orientação a Objetos?

Os nomes e exemplos vêm principalmente do design orientado a objetos, mas várias ideias — como responsabilidade, acoplamento, coesão e dependências — são úteis em outros estilos de programação.

---

# 15. Checklist de domínio

### SOLID

- [ ] Sei explicar o que SOLID representa.
- [ ] Sei explicar por que os princípios existem.
- [ ] Sei diferenciar princípio de regra absoluta.

### SRP

- [ ] Sei explicar "um motivo para mudar".
- [ ] Sei identificar múltiplos motivos de mudança.
- [ ] Sei evitar fragmentação exagerada.

### OCP

- [ ] Sei explicar "aberto para extensão e fechado para modificação".
- [ ] Sei identificar uma variação que pode justificar polimorfismo.
- [ ] Sei reconhecer quando um `if` simples é melhor.

### LSP

- [ ] Sei explicar substituição.
- [ ] Sei identificar contrato quebrado.
- [ ] Sei reconhecer uma hierarquia de herança problemática.
- [ ] Sei diferenciar compatibilidade estrutural de compatibilidade comportamental.

### ISP

- [ ] Sei explicar clientes de uma interface.
- [ ] Sei identificar interfaces grandes.
- [ ] Sei separar contratos quando consumidores possuem necessidades diferentes.
- [ ] Sei evitar interfaces artificialmente pequenas.

### DIP

- [ ] Sei explicar dependência de abstração.
- [ ] Sei identificar dependência direta de infraestrutura.
- [ ] Sei explicar a direção das dependências.
- [ ] Sei diferenciar DIP de DI.
- [ ] Sei explicar por que DI ajuda na aplicação de DIP.

### Prática

- [ ] Consigo identificar problemas SOLID em código real.
- [ ] Consigo propor uma refatoração.
- [ ] Consigo explicar os trade-offs.
- [ ] Consigo dizer quando não aplicaria um princípio.
- [ ] Consigo relacionar SOLID ao Beach Tennis Manager.
- [ ] Consigo explicar cada princípio em uma entrevista sem apenas repetir a definição.

---

# Conclusão

SOLID não deve ser decorado como:

```text
S = ...
O = ...
L = ...
I = ...
D = ...
```

O conhecimento realmente útil é conseguir olhar para um código e perguntar:

```text
Esta classe tem motivos de mudança diferentes?
        ↓
Esta variação está isolada?
        ↓
Esta implementação pode realmente substituir o contrato?
        ↓
O consumidor depende de coisas que não usa?
        ↓
A regra importante depende de um detalhe técnico?
```

Essas perguntas conectam SOLID aos fundamentos estudados anteriormente:

```text
Responsabilidade
Coesão
Acoplamento
Dependência
Abstração
Encapsulamento
Composição
```

E preparam o próximo passo:

```text
SOLID
   ↓
Dependency Inversion Principle
   ↓
Dependency Injection
   ↓
composição de objetos
   ↓
Design Patterns
   ↓
Arquitetura
```

O próximo módulo aprofundará **Injeção de Dependência**, mostrando como transformar o princípio de inversão de dependência em uma técnica prática de construção do sistema.
