# 06 — Design Patterns

> Material de estudo do Beach Tennis Manager.
>
> O objetivo deste documento é aprender Design Patterns como soluções para problemas recorrentes de design de software — e não como uma lista de receitas para decorar.
>
> Um padrão só faz sentido quando entendemos primeiro o problema que estamos tentando resolver.

---

# Sumário

1. [Como estudar Design Patterns](#1-como-estudar-design-patterns)
2. [O que é um Design Pattern](#2-o-que-é-um-design-pattern)
3. [Por que Design Patterns existem](#3-por-que-design-patterns-existem)
4. [Pattern não é framework nem biblioteca](#4-pattern-não-é-framework-nem-biblioteca)
5. [Como reconhecer quando um pattern pode ajudar](#5-como-reconhecer-quando-um-pattern-pode-ajudar)
6. [Trade-offs](#6-trade-offs)
7. [Singleton](#7-singleton)
8. [Factory Method](#8-factory-method)
9. [Factory](#9-factory)
10. [Builder](#10-builder)
11. [Strategy](#11-strategy)
12. [Adapter](#12-adapter)
13. [Decorator](#13-decorator)
14. [Facade](#14-facade)
15. [Observer](#15-observer)
16. [Repository como padrão arquitetural](#16-repository-como-padrão-arquitetural)
17. [Padrões e Injeção de Dependência](#17-padrões-e-injeção-de-dependência)
18. [Como escolher um pattern](#18-como-escolher-um-pattern)
19. [Código ruim → análise → refatoração](#19-código-ruim--análise--refatoração)
20. [Aplicação no Beach Tennis Manager](#20-aplicação-no-beach-tennis-manager)
21. [Erros comuns](#21-erros-comuns)
22. [Exercícios](#22-exercícios)
23. [Perguntas de entrevista](#23-perguntas-de-entrevista)
24. [Perguntas de aprofundamento](#24-perguntas-de-aprofundamento)
25. [Checklist de domínio](#25-checklist-de-domínio)

---

# 1. Como estudar Design Patterns

Não comece decorando:

```text
Factory
Strategy
Adapter
Decorator
Observer
Singleton
```

Comece perguntando:

```text
Qual problema estou enfrentando?
```

Depois:

```text
Esse problema aparece repetidamente?
```

Depois:

```text
Existe uma solução conhecida para esse tipo de problema?
```

E finalmente:

```text
Quais são os custos dessa solução?
```

A sequência é:

```text
Problema
   ↓
Forças / restrições
   ↓
Possíveis soluções
   ↓
Pattern
   ↓
Trade-offs
```

---

# 2. O que é um Design Pattern?

## 2.1 O que é?

Design Pattern é uma solução recorrente e generalizável para um problema de design de software.

Ele não é simplesmente um trecho de código.

É uma ideia de organização de responsabilidades e colaboração entre componentes.

---

## 2.2 Por que existe?

Porque determinados problemas aparecem várias vezes em diferentes sistemas.

Por exemplo:

```text
"Preciso trocar o comportamento dependendo de uma regra."
```

Esse tipo de problema pode ser modelado com Strategy.

---

## 2.3 Qual problema resolve?

Um pattern oferece um vocabulário comum.

Em uma conversa técnica, dizer:

> "Aqui podemos usar Strategy."

pode resumir uma estrutura inteira de colaboração.

Mas isso só funciona se a equipe conhecer o padrão.

---

## 2.4 Como funciona?

Um pattern normalmente descreve:

```text
contexto
problema
participantes
responsabilidades
colaborações
consequências
```

---

## 2.5 Quando eu usaria?

Quando o problema realmente se encaixa no padrão.

---

## 2.6 Quando eu evitaria?

Quando o pattern adiciona mais complexidade do que o problema exige.

---

## 2.7 Exemplo

Imagine:

```ts
if (type === "pix") {
  // ...
}

if (type === "credit_card") {
  // ...
}

if (type === "cash") {
  // ...
}
```

Se essas regras crescerem e variarem independentemente, Strategy pode ser uma solução.

---

## 2.8 Como aparece no Beach Tennis Manager?

Podemos ter diferentes políticas para:

```text
ausência
reposição
cálculo de preço
notificação
```

Mas só devemos criar Strategies quando existir uma variação real que justifique a abstração.

---

# 3. Por que Design Patterns existem?

## 3.1 O que é?

Patterns surgem de problemas recorrentes.

---

## 3.2 Por que existe?

Software precisa lidar com mudanças.

Uma solução pode funcionar hoje e ficar difícil de manter amanhã.

Patterns ajudam a organizar pontos de variação conhecidos.

---

## 3.3 Qual problema resolve?

Principalmente problemas de design relacionados a:

```text
responsabilidade
acoplamento
criação de objetos
variação de comportamento
composição
integração
comunicação
```

---

## 3.4 Como funciona?

Cada pattern possui uma estrutura diferente.

Não existe:

```text
"um pattern para tudo"
```

---

## 3.5 Quando eu usaria?

Quando a estrutura proposta realmente ajuda.

---

## 3.6 Quando eu evitaria?

Quando estamos tentando encaixar um problema em um pattern apenas porque conhecemos o nome dele.

---

## 3.7 Exemplo

Ter conhecimento de Strategy não significa que todo `if` deve virar Strategy.

---

## 3.8 Como aparece no Beach Tennis Manager?

Se houver apenas uma política de cálculo:

```ts
calculatePrice();
```

talvez uma função simples seja suficiente.

Se existirem políticas independentes:

```text
Preço padrão
Preço promocional
Preço por professor
Preço por modalidade
```

uma Strategy pode começar a fazer sentido.

---

# 4. Pattern não é framework nem biblioteca

## Pattern

É uma solução de design.

## Biblioteca

É código reutilizável que você chama.

Exemplo:

```text
Zod
Drizzle
```

## Framework

É uma estrutura que influencia como a aplicação é construída.

Exemplo:

```text
Fastify
React
```

## Pattern

Pode existir usando qualquer linguagem ou biblioteca.

---

# 5. Como reconhecer quando um pattern pode ajudar

Use estas perguntas:

### 1. Existe uma variação?

```text
A
B
C
```

### 2. Essa variação tende a crescer?

### 3. As regras precisam ser isoladas?

### 4. Existe acoplamento difícil de controlar?

### 5. A criação dos objetos ficou complexa?

### 6. Existe uma interface incompatível com outra?

### 7. O comportamento precisa ser combinado dinamicamente?

Se várias respostas forem "sim", vale investigar patterns.

---

# 6. Trade-offs

## 6.1 O que é?

Trade-off é uma troca.

Você ganha alguma coisa e normalmente paga algum custo.

---

## 6.2 Exemplo

Strategy pode melhorar:

```text
extensibilidade
testabilidade
separação de regras
```

mas pode aumentar:

```text
quantidade de classes
quantidade de arquivos
indireção
```

---

## 6.3 Regra importante

Não pergunte apenas:

> "Esse pattern é bom?"

Pergunte:

> "O custo desse pattern é justificável para este problema?"

---

# 7. Singleton

## 7.1 O que é?

Singleton é um padrão que busca garantir uma única instância de determinado objeto dentro de um contexto.

Exemplo conceitual:

```ts
class Configuration {
  private static instance: Configuration;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Configuration();
    }

    return this.instance;
  }
}
```

---

## 7.2 Por que existe?

Para controlar a criação de uma instância compartilhada.

---

## 7.3 Qual problema resolve?

Pode resolver casos em que uma única instância realmente faz sentido.

---

## 7.4 Como funciona?

A própria classe controla a instância.

---

## 7.5 Quando eu usaria?

Com bastante cautela.

---

## 7.6 Quando eu evitaria?

Em serviços de negócio que poderiam receber suas dependências.

Singleton pode criar estado global implícito e dificultar testes.

---

## 7.7 Exemplo

Um objeto de configuração imutável pode, dependendo da arquitetura, ter ciclo de vida único.

---

## 7.8 Como aparece no Beach Tennis Manager?

Não há necessidade de transformar automaticamente:

```text
repositories
services
use cases
```

em Singleton.

A composição da aplicação pode controlar o ciclo de vida dessas instâncias.

---

# 8. Factory Method

## 8.1 O que é?

Factory Method é um padrão relacionado à criação de objetos, permitindo que a decisão sobre qual objeto concreto criar seja delegada.

---

## 8.2 Por que existe?

Porque às vezes criar diretamente:

```ts
new ConcreteClass()
```

espalha decisões de criação pelo sistema.

---

## 8.3 Qual problema resolve?

Centraliza ou delega decisões de criação.

---

## 8.4 Como funciona?

Uma operação de criação pode retornar uma abstração:

```ts
interface Notification {
  send(): Promise<void>;
}
```

A implementação pode variar.

---

## 8.5 Quando eu usaria?

Quando a escolha da implementação é parte importante do problema.

---

## 8.6 Quando eu evitaria?

Se só existe uma implementação e não há complexidade de criação.

---

## 8.7 Exemplo

```ts
interface PaymentGateway {
  charge(value: number): Promise<void>;
}

class PaymentGatewayFactory {
  create(type: string): PaymentGateway {
    if (type === "pix") {
      return new PixGateway();
    }

    throw new Error("Unsupported gateway");
  }
}
```

---

## 8.8 Como aparece no Beach Tennis Manager?

Pode existir uma factory para criar um provider específico quando houver múltiplas integrações reais.

Não devemos criar uma factory apenas porque "factory é boa prática".

---

# 9. Factory

## 9.1 O que é?

"Factory" é um termo amplo usado para componentes responsáveis pela criação de objetos.

Nem toda Factory implementa exatamente o GoF Factory Method.

---

## 9.2 Por que existe?

Para retirar complexidade de criação de quem utiliza o objeto.

---

## 9.3 Qual problema resolve?

Centraliza regras de construção.

---

## 9.4 Como funciona?

Exemplo:

```ts
function createUserRepository(
  database: Database,
): UserRepository {
  return new DrizzleUserRepository(database);
}
```

---

## 9.5 Quando eu usaria?

Quando a construção envolve:

```text
múltiplas dependências
decisões
configuração
```

---

## 9.6 Quando eu evitaria?

Quando:

```ts
new UserRepository(db)
```

já é suficientemente simples.

---

## 9.7 Exemplo

```ts
const repository =
  createUserRepository(database);
```

---

## 9.8 Como aparece no Beach Tennis Manager?

Factories podem ajudar na composição da infraestrutura, mas não são obrigatórias.

---

# 10. Builder

## 10.1 O que é?

Builder é um padrão para construir objetos complexos passo a passo.

---

## 10.2 Por que existe?

Quando um objeto possui muitas opções de configuração.

---

## 10.3 Qual problema resolve?

Evita construtores difíceis de ler:

```ts
new Report(
  title,
  filters,
  sort,
  pagination,
  includePayments,
  includeAbsences,
);
```

---

## 10.4 Como funciona?

Algo como:

```ts
const report =
  new ReportBuilder()
    .withTitle("Financeiro")
    .withPayments()
    .withAbsences()
    .build();
```

---

## 10.5 Quando eu usaria?

Quando a construção realmente possui várias etapas/opções.

---

## 10.6 Quando eu evitaria?

Para objetos simples.

---

## 10.7 Exemplo

```ts
class ReportBuilder {
  private payments = false;
  private absences = false;

  withPayments() {
    this.payments = true;
    return this;
  }

  withAbsences() {
    this.absences = true;
    return this;
  }

  build() {
    return {
      payments: this.payments,
      absences: this.absences,
    };
  }
}
```

---

## 10.8 Como aparece no Beach Tennis Manager?

Pode ser útil para relatórios complexos, caso a quantidade de filtros e opções cresça.

No começo, um objeto de parâmetros simples pode ser melhor.

---

# 11. Strategy

## 11.1 O que é?

Strategy encapsula algoritmos ou regras intercambiáveis atrás de um contrato comum.

---

## 11.2 Por que existe?

Para evitar que uma classe fique acumulando:

```ts
if
else if
else if
```

para comportamentos diferentes.

---

## 11.3 Qual problema resolve?

Permite trocar uma estratégia sem alterar o consumidor principal.

---

## 11.4 Como funciona?

Contrato:

```ts
interface PricingStrategy {
  calculate(input: PricingInput): number;
}
```

Estratégias:

```ts
class DefaultPricing
  implements PricingStrategy {
  calculate(input: PricingInput) {
    return input.basePrice;
  }
}
```

```ts
class DiscountPricing
  implements PricingStrategy {
  calculate(input: PricingInput) {
    return input.basePrice * 0.9;
  }
}
```

Consumidor:

```ts
class PriceCalculator {
  constructor(
    private readonly strategy: PricingStrategy,
  ) {}

  calculate(input: PricingInput) {
    return this.strategy.calculate(input);
  }
}
```

---

## 11.5 Quando eu usaria?

Quando existem algoritmos/regras alternativas que:

- têm a mesma finalidade;
- podem ser trocadas;
- precisam evoluir separadamente.

---

## 11.6 Quando eu evitaria?

Se existe apenas uma regra simples.

---

## 11.7 Exemplo

```text
PricingStrategy
      ↑
      |
 ┌────┴─────┐
 |          |
Default   Discount
```

---

## 11.8 Como aparece no Beach Tennis Manager?

Pode fazer sentido para políticas configuráveis de:

```text
cálculo de preço
```

ou outras regras que tenham variantes reais.

Mas regras de negócio documentadas devem continuar sendo a fonte de verdade.

---

# 12. Adapter

## 12.1 O que é?

Adapter transforma uma interface em outra interface esperada pelo consumidor.

---

## 12.2 Por que existe?

Sistemas externos nem sempre possuem o contrato que nossa aplicação deseja.

---

## 12.3 Qual problema resolve?

Evita espalhar conhecimento de APIs externas pela aplicação.

---

## 12.4 Como funciona?

Nossa aplicação espera:

```ts
interface NotificationProvider {
  send(
    phone: string,
    message: string,
  ): Promise<void>;
}
```

Um provedor externo pode oferecer:

```ts
externalApi.sendMessage(
  phoneNumber,
  text,
);
```

O Adapter transforma:

```text
NotificationProvider
        ↓
WhatsAppAdapter
        ↓
API externa
```

---

## 12.5 Quando eu usaria?

Para integrar:

```text
APIs
SDKs
bibliotecas
sistemas legados
```

com contratos diferentes.

---

## 12.6 Quando eu evitaria?

Se não existe incompatibilidade real.

---

## 12.7 Exemplo

```ts
class WhatsAppAdapter
  implements NotificationProvider {

  constructor(
    private readonly client: ExternalWhatsAppClient,
  ) {}

  async send(
    phone: string,
    message: string,
  ) {
    await this.client.sendMessage(
      phone,
      message,
    );
  }
}
```

---

## 12.8 Como aparece no Beach Tennis Manager?

No futuro, se o sistema integrar WhatsApp, Pix ou outro serviço externo, Adapter pode proteger a aplicação dos detalhes específicos do fornecedor.

---

# 13. Decorator

## 13.1 O que é?

Decorator adiciona comportamento a um objeto sem alterar sua implementação original.

---

## 13.2 Por que existe?

Para combinar comportamentos de forma composicional.

---

## 13.3 Qual problema resolve?

Pode evitar criar muitas subclasses para pequenas variações.

---

## 13.4 Como funciona?

Contrato:

```ts
interface StudentRepository {
  save(student: Student): Promise<void>;
}
```

Implementação:

```ts
class DrizzleStudentRepository
  implements StudentRepository {
  async save(student: Student) {
    // persistência
  }
}
```

Decorator:

```ts
class LoggingStudentRepository
  implements StudentRepository {

  constructor(
    private readonly repository: StudentRepository,
  ) {}

  async save(student: Student) {
    console.log("Saving student");

    await this.repository.save(student);
  }
}
```

Agora:

```text
LoggingStudentRepository
        ↓
DrizzleStudentRepository
```

---

## 13.5 Quando eu usaria?

Para comportamentos transversais ou adicionais, como:

```text
logging
métricas
cache
retry
```

quando a composição fizer sentido.

---

## 13.6 Quando eu evitaria?

Se uma função simples resolver o problema.

---

## 13.7 Exemplo

```ts
const repository =
  new LoggingStudentRepository(
    new DrizzleStudentRepository(),
  );
```

---

## 13.8 Como aparece no Beach Tennis Manager?

Pode ser útil futuramente para:

```text
Repository + logging
Repository + métricas
Provider + retry
```

sem alterar o componente principal.

---

# 14. Facade

## 14.1 O que é?

Facade fornece uma interface simplificada para um conjunto de componentes mais complexo.

---

## 14.2 Por que existe?

Para evitar que consumidores precisem conhecer vários detalhes internos.

---

## 14.3 Qual problema resolve?

Reduz a complexidade percebida pelo consumidor.

---

## 14.4 Como funciona?

Imagine:

```text
PaymentService
ReceiptService
NotificationService
CycleService
```

Uma Facade poderia oferecer:

```ts
completeCyclePayment();
```

internamente coordenando essas operações.

---

## 14.5 Quando eu usaria?

Quando um subsistema possui muitas etapas e uma operação comum pode simplificar seu uso.

---

## 14.6 Quando eu evitaria?

Se a Facade apenas repassar todos os métodos sem adicionar valor.

---

## 14.7 Exemplo

```ts
class CyclePaymentFacade {
  constructor(
    private readonly payment: PaymentService,
    private readonly receipt: ReceiptService,
    private readonly notification: NotificationService,
  ) {}

  async completePayment() {
    await this.payment.process();
    await this.receipt.generate();
    await this.notification.send();
  }
}
```

---

## 14.8 Como aparece no Beach Tennis Manager?

Uma operação administrativa complexa pode futuramente coordenar:

```text
pagamento
ciclo
comprovante
notificação
```

Mas devemos evitar colocar regras de domínio aleatórias em uma Facade.

---

# 15. Observer

## 15.1 O que é?

Observer cria uma relação em que mudanças em um objeto podem ser comunicadas a interessados.

---

## 15.2 Por que existe?

Para permitir reação a eventos sem acoplar diretamente todos os componentes.

---

## 15.3 Qual problema resolve?

Permite:

```text
evento
  ↓
vários interessados
```

---

## 15.4 Como funciona?

Conceitualmente:

```text
StudentRegistered
      ↓
 ┌────┼────┐
 ↓    ↓    ↓
log  email notification
```

---

## 15.5 Quando eu usaria?

Quando vários componentes precisam reagir a um acontecimento.

---

## 15.6 Quando eu evitaria?

Se houver apenas uma ação direta e simples.

---

## 15.7 Exemplo

```ts
type StudentRegisteredHandler =
  (event: StudentRegistered) => Promise<void>;
```

Handlers:

```ts
sendNotification
writeAuditLog
updateMetrics
```

---

## 15.8 Como aparece no Beach Tennis Manager?

Quando um aluno for cadastrado, futuramente poderíamos ter eventos para:

```text
auditoria
notificação
integração
métricas
```

Isso exige cuidado com consistência, transações e falhas.

Não devemos adicionar eventos apenas porque Observer é um pattern conhecido.

---

# 16. Repository como padrão arquitetural

## 16.1 O que é?

Repository é uma abstração que representa operações de acesso a um conjunto de objetos/dados sem expor ao consumidor os detalhes de persistência.

---

## 16.2 Por que existe?

Para separar regra de negócio de:

```text
SQL
ORM
banco
infraestrutura
```

---

## 16.3 Qual problema resolve?

Evita que casos de uso precisem conhecer diretamente detalhes de persistência.

---

## 16.4 Como funciona?

```ts
interface StudentRepository {
  findById(id: string): Promise<Student | null>;
  save(student: Student): Promise<void>;
}
```

Implementação:

```ts
class DrizzleStudentRepository
  implements StudentRepository {
  // Drizzle
}
```

---

## 16.5 Quando eu usaria?

Quando a arquitetura exige uma fronteira clara entre aplicação/domínio e persistência.

---

## 16.6 Quando eu evitaria?

Em aplicações extremamente simples, abstrair persistência pode ser desnecessário.

---

## 16.7 Exemplo

```text
Use Case
   ↓
StudentRepository
   ↓
DrizzleStudentRepository
   ↓
PostgreSQL
```

---

## 16.8 Como aparece no Beach Tennis Manager?

O projeto já possui Drizzle como tecnologia de persistência.

A arquitetura deve evitar espalhar consultas Drizzle por todos os casos de uso.

---

# 17. Padrões e Injeção de Dependência

Design Patterns não vivem isolados.

Eles podem trabalhar juntos.

Exemplo:

```text
Dependency Injection
        ↓
Strategy
        ↓
Repository
        ↓
Adapter
        ↓
Decorator
```

DI pode ser usada para montar todos eles.

---

## Exemplo

```ts
const repository =
  new DrizzleStudentRepository();

const loggedRepository =
  new LoggingStudentRepository(
    repository,
  );

const useCase =
  new RegisterStudent(
    loggedRepository,
  );
```

Aqui temos:

```text
Decorator
+
Dependency Injection
+
Repository
```

---

# 18. Como escolher um pattern

Use este processo.

## Passo 1 — Descreva o problema sem citar pattern

Ruim:

> "Quero usar Strategy."

Melhor:

> "Tenho cinco políticas de cálculo que mudam independentemente."

---

## Passo 2 — Identifique o ponto de variação

Pergunte:

```text
O que muda?
```

---

## Passo 3 — Identifique o que deveria permanecer estável

Exemplo:

```text
contrato de cálculo
```

permanece estável.

---

## Passo 4 — Avalie soluções simples

Antes do pattern:

```text
função
objeto
map
switch
composição
```

podem ser suficientes.

---

## Passo 5 — Só então considere um pattern

Pattern deve resolver um problema real.

---

## Passo 6 — Avalie o custo

Pergunte:

```text
quantas classes?
quantas abstrações?
qual complexidade?
qual benefício?
```

---

# 19. Código ruim → análise → refatoração

## 19.1 Código inicial

Imagine uma calculadora de preços:

```ts
class PriceCalculator {
  calculate(type: string, basePrice: number) {
    if (type === "normal") {
      return basePrice;
    }

    if (type === "discount") {
      return basePrice * 0.9;
    }

    if (type === "premium") {
      return basePrice * 0.8;
    }

    throw new Error("Unknown type");
  }
}
```

---

## 19.2 Análise

A classe conhece todas as estratégias.

Quando uma nova regra aparece:

```text
novo if
```

---

## 19.3 Problema

A classe pode crescer continuamente.

---

## 19.4 Refatoração

Contrato:

```ts
interface PricingStrategy {
  calculate(basePrice: number): number;
}
```

Implementações:

```ts
class NormalPricing
  implements PricingStrategy {

  calculate(basePrice: number) {
    return basePrice;
  }
}
```

```ts
class DiscountPricing
  implements PricingStrategy {

  calculate(basePrice: number) {
    return basePrice * 0.9;
  }
}
```

Contexto:

```ts
class PriceCalculator {
  constructor(
    private readonly strategy: PricingStrategy,
  ) {}

  calculate(basePrice: number) {
    return this.strategy.calculate(basePrice);
  }
}
```

---

## 19.5 Resultado

Agora:

```text
PriceCalculator
       ↓
PricingStrategy
       ↑
 ┌─────┴─────┐
Normal     Discount
```

A regra pode variar sem alterar o consumidor.

---

## 19.6 Mas existe um detalhe importante

Se só existir:

```text
NormalPricing
```

Strategy pode ser exagero.

O pattern passou a ser interessante porque existe uma variação real.

---

# 20. Aplicação no Beach Tennis Manager

Alguns candidatos naturais:

| Problema | Possível solução |
|---|---|
| Diferentes políticas de cálculo | Strategy |
| Integração com API externa | Adapter |
| Comportamento adicional | Decorator |
| Construção complexa | Builder/Factory |
| Abstração de persistência | Repository |
| Reação a eventos | Observer/event handlers |
| Composição de dependências | Dependency Injection |

Essa tabela **não significa que devemos implementar todos eles**.

Ela serve para reconhecer situações.

---

## Exemplo: reposição

Suponha que futuramente existam políticas claramente distintas:

```text
Reposição padrão
Reposição especial
Reposição promocional
```

Poderíamos avaliar Strategy.

Mas primeiro precisamos confirmar:

```text
quais são realmente as regras?
```

A documentação de negócio continua sendo a fonte de verdade.

---

## Exemplo: WhatsApp

Se futuramente o sistema integrar um fornecedor externo:

```text
Use Case
   ↓
NotificationProvider
   ↑
WhatsAppAdapter
   ↓
API externa
```

Adapter pode proteger a aplicação.

---

## Exemplo: logging

```text
Use Case
   ↓
Repository
   ↑
LoggingRepository
   ↓
DrizzleRepository
```

Decorator pode adicionar logging sem alterar a implementação original.

---

# 21. Erros comuns

## 21.1 Patternitis

"Patternitis" é o uso excessivo de padrões.

Exemplo:

```text
Factory
FactoryFactory
StrategyFactory
StrategyManager
ProviderFactory
```

para resolver um problema simples.

---

## 21.2 Decorar nomes

Saber explicar Strategy é mais importante do que decorar uma implementação específica.

---

## 21.3 Usar pattern antes de entender o problema

Primeiro:

```text
problema
```

depois:

```text
solução
```

---

## 21.4 Confundir Repository com ORM

Drizzle é tecnologia de persistência.

Repository é uma abstração arquitetural.

Eles não são a mesma coisa.

---

## 21.5 Confundir Adapter com Facade

### Adapter

Resolve incompatibilidade de interfaces.

```text
A → B
```

### Facade

Simplifica um subsistema.

```text
A + B + C → interface simples
```

---

## 21.6 Confundir Decorator com herança

Decorator normalmente compõe:

```text
objeto
  ↓
decorator
  ↓
objeto original
```

em vez de criar uma árvore de subclasses.

---

# 22. Exercícios

## Exercício 1 — Identificação

Para cada cenário, escolha se algum pattern parece apropriado:

### A

Uma API externa possui nomes e parâmetros diferentes dos contratos da aplicação.

### B

Existem cinco algoritmos intercambiáveis.

### C

Um objeto possui quinze opções de construção.

### D

Um serviço precisa apenas chamar uma função simples.

Explique suas escolhas.

---

## Exercício 2 — Strategy

Crie:

```ts
interface PricingStrategy
```

e duas implementações.

---

## Exercício 3 — Adapter

Imagine:

```ts
interface NotificationProvider {
  send(phone: string, message: string): Promise<void>;
}
```

Crie um Adapter para uma API externa fictícia.

---

## Exercício 4 — Decorator

Crie:

```text
LoggingStudentRepository
```

envolvendo:

```text
StudentRepository
```

---

## Exercício 5 — Trade-off

Escolha um pattern e responda:

```text
O que ele melhora?
O que ele adiciona?
Quando ele seria exagero?
```

---

## Exercício 6 — Beach Tennis Manager

Escolha uma funcionalidade real do projeto e responda:

```text
Qual problema existe?
Qual ponto varia?
Qual solução simples eu tentaria primeiro?
Um pattern realmente ajudaria?
Qual seria o custo?
```

---

# 23. Perguntas de entrevista

## O que é Design Pattern?

Uma solução recorrente e generalizável para um problema de design de software.

---

## Pattern é código pronto?

Não.

É principalmente uma forma de estruturar responsabilidades e colaboração.

---

## Cite alguns Design Patterns.

Por exemplo:

```text
Strategy
Adapter
Decorator
Factory
Builder
Observer
Facade
Singleton
Repository
```

É importante não apenas citar, mas explicar o problema resolvido por cada um.

---

## O que é Strategy?

É um padrão que encapsula comportamentos/algoritmos intercambiáveis atrás de um contrato comum.

---

## O que é Adapter?

É um padrão que adapta uma interface para outra esperada pelo consumidor.

---

## O que é Decorator?

É uma forma de adicionar comportamento a um objeto por composição, mantendo o contrato.

---

## Factory e Factory Method são iguais?

Não necessariamente.

"Factory" é um termo amplo para componentes de criação.

Factory Method é um padrão específico descrito pelo catálogo GoF.

---

## Todo `if` deve virar Strategy?

Não.

O pattern só faz sentido quando a variação e sua evolução justificam a abstração.

---

## O que é Patternitis?

É o uso excessivo de padrões, adicionando complexidade sem benefício proporcional.

---

# 24. Perguntas de aprofundamento

### 1. Design Pattern é sempre uma boa prática?

Não.

Um pattern pode ser uma solução ruim para um contexto específico.

---

### 2. Qual a relação entre Strategy e Open/Closed Principle?

Strategy pode ajudar a permitir novas estratégias sem modificar o consumidor principal.

Mas usar Strategy não garante automaticamente que todo o design esteja correto.

---

### 3. Adapter e Facade são iguais?

Não.

Adapter resolve incompatibilidade.

Facade simplifica acesso.

---

### 4. Decorator substitui herança?

Em alguns cenários, composição com Decorator pode ser uma alternativa mais flexível à criação de muitas subclasses.

Não significa que herança deixou de ter utilidade.

---

### 5. Repository é necessariamente um GoF Design Pattern?

Não deve ser tratado simplesmente como um dos 23 padrões clássicos do GoF.

É um padrão arquitetural/abstração de persistência muito utilizado em aplicações.

---

### 6. Singleton é sempre ruim?

Não.

O problema é usar estado global ou ciclo de vida único sem necessidade.

---

### 7. DI e Design Patterns podem coexistir?

Sim.

DI é frequentemente usada para montar componentes que seguem outros patterns.

---

### 8. Como saber se um pattern é necessário?

Comece pelo problema e tente a solução mais simples que atenda aos requisitos.

---

### 9. Posso inventar meu próprio pattern?

Pode existir uma solução recorrente própria de uma equipe ou domínio.

Mas antes de criar nomenclatura nova, vale verificar se um padrão conhecido já descreve o problema.

---

### 10. Pattern ajuda a eliminar complexidade?

Nem sempre.

Frequentemente ele:

```text
move
organiza
isola
```

a complexidade.

O custo total pode continuar existindo.

---

# 25. Checklist de domínio

- [ ] Sei definir Design Pattern.
- [ ] Sei explicar por que patterns existem.
- [ ] Sei diferenciar pattern, biblioteca e framework.
- [ ] Sei explicar trade-off.
- [ ] Sei reconhecer quando uma abstração pode ser exagerada.
- [ ] Sei explicar Strategy.
- [ ] Sei explicar Adapter.
- [ ] Sei explicar Decorator.
- [ ] Sei explicar Factory.
- [ ] Sei explicar Builder.
- [ ] Sei explicar Facade.
- [ ] Sei explicar Observer.
- [ ] Sei explicar os riscos de Singleton.
- [ ] Sei explicar Repository como abstração arquitetural.
- [ ] Sei relacionar patterns com DI.
- [ ] Sei distinguir Adapter de Facade.
- [ ] Sei distinguir Strategy de um simples `if`.
- [ ] Consigo justificar por que usar ou não usar um pattern.
- [ ] Consigo analisar o custo de uma abstração.
- [ ] Consigo aplicar esse raciocínio ao Beach Tennis Manager.

---

# Conclusão

O conhecimento importante de Design Patterns não é:

```text
"Eu sei 20 patterns."
```

É:

```text
"Eu consigo reconhecer um problema de design,
avaliar alternativas,
escolher uma solução adequada
e explicar seus trade-offs."
```

Uma boa sequência de raciocínio é:

```text
Problema
   ↓
Solução simples
   ↓
Ponto de variação
   ↓
Acoplamento
   ↓
Responsabilidades
   ↓
Pattern, se necessário
   ↓
Trade-offs
   ↓
Testes
```

No Beach Tennis Manager, os patterns serão utilizados apenas quando ajudarem o design real.

O objetivo não é construir um projeto cheio de patterns.

O objetivo é construir um sistema que seja:

```text
compreensível
testável
manutenível
evolutivo
```

e conseguir explicar tecnicamente por que cada decisão foi tomada.

O próximo estudo será **07 — Arquitetura**, conectando os conceitos anteriores:

```text
responsabilidade
↓
coesão
↓
acoplamento
↓
abstração
↓
DI
↓
patterns
↓
arquitetura
```
