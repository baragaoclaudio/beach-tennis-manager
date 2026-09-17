# 07 — Arquitetura de Software

> Material de estudo do Beach Tennis Manager.
>
> Este documento conecta os fundamentos estudados anteriormente — responsabilidade, coesão, acoplamento, abstração, DIP, DI e Design Patterns — com a organização de uma aplicação real.
>
> O objetivo não é decorar nomes de arquiteturas. É aprender a tomar decisões sobre limites, dependências e responsabilidades.

---

# Sumário

1. [Como estudar arquitetura](#1-como-estudar-arquitetura)
2. [O que é arquitetura de software](#2-o-que-é-arquitetura-de-software)
3. [Por que arquitetura existe](#3-por-que-arquitetura-existe)
4. [Arquitetura não é estrutura de pastas](#4-arquitetura-não-é-estrutura-de-pastas)
5. [Responsabilidade e limites](#5-responsabilidade-e-limites)
6. [Coesão e acoplamento na arquitetura](#6-coesão-e-acoplamento-na-arquitetura)
7. [Dependência e direção](#7-dependência-e-direção)
8. [Arquitetura em camadas](#8-arquitetura-em-camadas)
9. [Arquitetura em três camadas](#9-arquitetura-em-três-camadas)
10. [Clean Architecture](#10-clean-architecture)
11. [Hexagonal Architecture](#11-hexagonal-architecture)
12. [Onion Architecture](#12-onion-architecture)
13. [Domain e Application](#13-domain-e-application)
14. [Infrastructure](#14-infrastructure)
15. [Interface Adapters](#15-interface-adapters)
16. [Dependências entre camadas](#16-dependências-entre-camadas)
17. [Onde colocar a regra de negócio](#17-onde-colocar-a-regra-de-negócio)
18. [Entidade anêmica e domínio rico](#18-entidade-anêmica-e-domínio-rico)
19. [Arquitetura não é sinônimo de complexidade](#19-arquitetura-não-é-sinônimo-de-complexidade)
20. [Código ruim → análise → refatoração](#20-código-ruim--análise--refatoração)
21. [Aplicação no Beach Tennis Manager](#21-aplicação-no-beach-tennis-manager)
22. [Trade-offs](#22-trade-offs)
23. [Erros comuns](#23-erros-comuns)
24. [Exercícios](#24-exercícios)
25. [Perguntas de entrevista](#25-perguntas-de-entrevista)
26. [Perguntas de aprofundamento](#26-perguntas-de-aprofundamento)
27. [Checklist de domínio](#27-checklist-de-domínio)

---

# 1. Como estudar arquitetura

Arquitetura não começa com:

```text
Qual framework vou usar?
```

Começa com:

```text
Quais são as responsabilidades?
Quais partes mudam?
Quais partes devem permanecer estáveis?
Quem depende de quem?
Onde estão as regras importantes?
```

A sequência:

```text
Problema
   ↓
Responsabilidades
   ↓
Limites
   ↓
Dependências
   ↓
Arquitetura
   ↓
Tecnologias
```

Tecnologia é importante.

Mas arquitetura não deve ser definida apenas pela tecnologia.

---

# 2. O que é arquitetura de software?

## 2.1 O que é?

Arquitetura de software é a organização das partes importantes de um sistema, suas responsabilidades, limites, dependências e formas de colaboração.

Ela responde perguntas como:

```text
Onde fica a regra de negócio?
Quem pode acessar o banco?
Como módulos se comunicam?
Onde ficam integrações externas?
Como uma mudança se propaga?
```

---

## 2.2 Por que existe?

Sistemas crescem.

Sem organização, mudanças aparentemente pequenas podem exigir alterações em várias partes.

---

## 2.3 Qual problema resolve?

Arquitetura busca controlar a complexidade.

Não elimina complexidade.

Organiza-a.

---

## 2.4 Como funciona?

Uma arquitetura define limites.

Por exemplo:

```text
HTTP
 ↓
Application
 ↓
Domain
```

e:

```text
Infrastructure
```

implementa detalhes externos.

---

## 2.5 Quando eu usaria?

Sempre existe alguma arquitetura, mesmo que ela não tenha sido planejada.

A questão é se ela é:

```text
intencional
```

ou:

```text
acidental
```

---

## 2.6 Quando eu evitaria?

Não existe "evitar arquitetura".

O que devemos evitar é arquitetura excessivamente complexa para o problema.

---

## 2.7 Exemplo

Uma aplicação pode colocar tudo em:

```text
routes.ts
```

Ela possui uma arquitetura, mas pode apresentar limites fracos.

Outra aplicação pode separar:

```text
controllers
use cases
repositories
domain
infrastructure
```

com limites explícitos.

---

## 2.8 Como aparece no Beach Tennis Manager?

O projeto precisa separar pelo menos:

```text
entrada HTTP
casos de uso
regras de domínio
persistência
infraestrutura
```

porque o sistema possui regras de negócio relevantes envolvendo:

```text
ciclos
faltas
reposição
créditos
professores
matrículas
pagamentos
```

---

# 3. Por que arquitetura existe?

## 3.1 O que é?

Arquitetura organiza as decisões estruturais de maior impacto.

---

## 3.2 Por que existe?

Porque algumas decisões são caras de mudar depois.

Por exemplo:

```text
acesso ao banco espalhado por todo o código
```

pode tornar uma mudança de persistência muito difícil.

---

## 3.3 Qual problema resolve?

Reduz o impacto de mudanças importantes.

---

## 3.4 Como funciona?

Criamos limites.

Por exemplo:

```text
caso de uso
    ↓
interface de repositório
    ↓
implementação
```

O caso de uso não precisa conhecer o mecanismo de persistência.

---

## 3.5 Quando eu usaria?

Quanto mais complexas forem as regras e mudanças esperadas, mais importante fica uma arquitetura explícita.

---

## 3.6 Quando eu evitaria?

Evite complexidade arquitetural sem necessidade.

Um CRUD muito simples não precisa necessariamente de dezenas de abstrações.

---

## 3.7 Exemplo

Uma aplicação pequena:

```text
route → database
```

pode ser suficiente.

Uma aplicação com regras complexas:

```text
route
 ↓
controller
 ↓
use case
 ↓
domain
 ↓
repository
 ↓
database
```

pode precisar de limites mais claros.

---

## 3.8 Como aparece no Beach Tennis Manager?

O sistema possui regras que não devem depender de Fastify ou Drizzle.

Por isso a arquitetura precisa separar:

```text
regra
```

de:

```text
tecnologia.
```

---

# 4. Arquitetura não é estrutura de pastas

## 4.1 O que é?

Pastas representam organização física.

Arquitetura representa organização conceitual.

---

## 4.2 Por que existe essa distinção?

Podemos ter:

```text
src/
├── controllers
├── services
├── repositories
```

e ainda assim ter uma arquitetura ruim.

---

## 4.3 Qual problema resolve?

Evita acreditar que:

> "Tenho uma pasta domain, então tenho arquitetura limpa."

Não necessariamente.

---

## 4.4 Como funciona?

A arquitetura aparece principalmente na direção das dependências e responsabilidades.

---

## 4.5 Quando eu usaria?

Sempre que avaliar a qualidade estrutural de um sistema.

---

## 4.6 Quando eu evitaria?

Não devemos criar pastas apenas para imitar um diagrama.

---

## 4.7 Exemplo

Arquitetura ruim:

```text
domain → Drizzle
domain → Fastify
```

Mesmo que exista:

```text
domain/
```

---

## 4.8 Como aparece no Beach Tennis Manager?

A estrutura de pastas deve refletir os limites arquiteturais, mas o mais importante é o código respeitar esses limites.

---

# 5. Responsabilidade e limites

## 5.1 O que é?

Uma responsabilidade é uma razão relevante para um componente mudar.

Um limite define onde determinada responsabilidade começa e termina.

---

## 5.2 Por que existe?

Sem limites claros:

```text
controller
```

pode validar HTTP, executar regra, consultar banco e enviar WhatsApp.

---

## 5.3 Qual problema resolve?

Separar responsabilidades torna o sistema mais compreensível e testável.

---

## 5.4 Como funciona?

Por exemplo:

```text
Controller
→ HTTP

Use Case
→ orquestra aplicação

Domain
→ regras de negócio

Repository
→ persistência
```

---

## 5.5 Quando eu usaria?

Sempre que responsabilidades diferentes começarem a se misturar.

---

## 5.6 Quando eu evitaria?

Não crie um componente para cada linha de código.

---

## 5.7 Exemplo

Ruim:

```ts
async function registerStudent(request, reply) {
  // valida HTTP
  // verifica CPF
  // calcula ciclo
  // grava SQL
  // envia WhatsApp
}
```

Melhor:

```text
Controller
 ↓
RegisterStudent
 ↓
StudentRepository
```

---

## 5.8 Como aparece no Beach Tennis Manager?

O Controller não deve decidir sozinho:

```text
se uma falta gera crédito
```

Essa decisão pertence às regras da aplicação/domínio.

---

# 6. Coesão e acoplamento na arquitetura

## 6.1 O que é?

**Coesão** mede o quanto as responsabilidades de um componente estão relacionadas.

**Acoplamento** representa o grau de dependência entre componentes.

---

## 6.2 Por que existe?

Queremos, em geral:

```text
alta coesão
baixo acoplamento
```

---

## 6.3 Qual problema resolve?

Ajuda a controlar mudanças.

Com alta coesão:

```text
coisas relacionadas ficam juntas.
```

Com baixo acoplamento:

```text
mudanças em uma parte afetam menos as outras.
```

---

## 6.4 Como funciona?

Exemplo de alta coesão:

```text
CycleService
→ operações diretamente relacionadas ao ciclo
```

Exemplo de baixa coesão:

```text
Utils
→ ciclo
→ CPF
→ e-mail
→ pagamento
→ HTTP
→ logs
```

---

## 6.5 Quando eu usaria?

Como critério de avaliação de módulos.

---

## 6.6 Quando eu evitaria?

Não trate "baixo acoplamento" como objetivo absoluto.

Algum acoplamento é necessário.

---

## 6.7 Exemplo

```text
A → B
```

A depende de B.

Se A conhecer muitos detalhes internos de B, o acoplamento aumenta.

---

## 6.8 Como aparece no Beach Tennis Manager?

Um caso de uso deve depender das operações necessárias, e não conhecer:

```text
SQL
tabelas
Fastify
detalhes do Drizzle
```

---

# 7. Dependência e direção

## 7.1 O que é?

Dependência arquitetural é uma relação na qual uma parte precisa conhecer outra para funcionar.

---

## 7.2 Por que existe?

Precisamos definir quem pode depender de quem.

---

## 7.3 Qual problema resolve?

Uma direção explícita impede que detalhes de infraestrutura dominem o sistema.

---

## 7.4 Como funciona?

Uma arquitetura pode buscar:

```text
Infraestrutura
      ↓
Aplicação
      ↓
Domínio
```

ou, conceitualmente, fazer as dependências apontarem para abstrações internas.

O ponto central é:

> detalhes externos não devem determinar as regras centrais.

---

## 7.5 Quando eu usaria?

Sempre que houver limites entre componentes.

---

## 7.6 Quando eu evitaria?

Não há necessidade de aplicar a mesma direção rígida a toda função do sistema.

---

## 7.7 Exemplo

Evitar:

```text
UseCase → Drizzle
```

Preferir:

```text
UseCase → StudentRepository
                         ↑
                         |
                    Drizzle
```

---

## 7.8 Como aparece no Beach Tennis Manager?

Esse é um dos princípios centrais da arquitetura do projeto.

---

# 8. Arquitetura em camadas

## 8.1 O que é?

É uma arquitetura que divide o sistema em camadas com responsabilidades diferentes.

Uma forma comum:

```text
Presentation
Application
Domain
Infrastructure
```

---

## 8.2 Por que existe?

Para separar responsabilidades.

---

## 8.3 Qual problema resolve?

Evita que:

```text
HTTP
Banco
Regra
```

fiquem misturados.

---

## 8.4 Como funciona?

Exemplo:

```text
Presentation
     ↓
Application
     ↓
Domain

Infrastructure
```

As dependências são controladas por contratos e regras arquiteturais.

---

## 8.5 Quando eu usaria?

Em aplicações com regras e integrações suficientes para justificar a separação.

---

## 8.6 Quando eu evitaria?

Aplicações muito pequenas podem usar menos camadas.

---

## 8.7 Exemplo

```text
Presentation
  Controller

Application
  RegisterStudent

Domain
  Student

Infrastructure
  DrizzleStudentRepository
```

---

## 8.8 Como aparece no Beach Tennis Manager?

A estrutura do projeto pode seguir esse raciocínio mesmo que os nomes exatos das pastas evoluam.

---

# 9. Arquitetura em três camadas

## 9.1 O que é?

Uma forma clássica de organização:

```text
Presentation
Business
Data Access
```

---

## 9.2 Por que existe?

É simples de entender e muito comum.

---

## 9.3 Qual problema resolve?

Separa:

```text
entrada
regra
persistência
```

---

## 9.4 Como funciona?

```text
Controller
   ↓
Service
   ↓
Repository
   ↓
Database
```

---

## 9.5 Quando eu usaria?

É uma boa solução quando o domínio não exige limites mais sofisticados.

---

## 9.6 Quando eu evitaria?

Quando o `Service` começa a virar:

```text
classe gigante
```

contendo todas as regras.

---

## 9.7 Exemplo

```text
routes
 ↓
services
 ↓
repositories
```

---

## 9.8 Como aparece no Beach Tennis Manager?

Pode ser uma base inicial, mas as regras de negócio do projeto justificam analisar limites mais explícitos.

---

# 10. Clean Architecture

## 10.1 O que é?

Clean Architecture é uma abordagem que organiza o sistema em círculos de responsabilidade e busca manter as regras centrais independentes de detalhes externos.

Uma representação comum:

```text
        Frameworks
     Infrastructure
    Interface Adapters
       Application
          Domain
```

A ideia central é que dependências apontem para dentro, em direção às regras mais importantes.

---

## 10.2 Por que existe?

Para proteger o núcleo do sistema contra mudanças externas.

---

## 10.3 Qual problema resolve?

Ajuda a reduzir dependência de:

```text
framework
banco
API externa
UI
infraestrutura
```

nas regras centrais.

---

## 10.4 Como funciona?

O domínio não precisa saber que existe:

```text
Fastify
Drizzle
PostgreSQL
```

Um caso de uso também pode depender de abstrações, enquanto a infraestrutura implementa essas abstrações.

---

## 10.5 Quando eu usaria?

Quando:

```text
regras de negócio são relevantes
mudanças são esperadas
testabilidade importa
há múltiplas fronteiras técnicas
```

---

## 10.6 Quando eu evitaria?

Para um CRUD extremamente simples, uma Clean Architecture completa pode adicionar abstrações demais.

---

## 10.7 Exemplo

```text
              Infrastructure
                    ↓
            Interface Adapters
                    ↓
               Application
                    ↓
                 Domain
```

O sentido exato das dependências deve ser analisado pelos contratos, não apenas pelo desenho.

---

## 10.8 Como aparece no Beach Tennis Manager?

O projeto já possui características compatíveis com essa abordagem:

```text
Use Cases
Repositories
Infrastructure
Domain
```

A adoção deve continuar pragmática.

---

# 11. Hexagonal Architecture

## 11.1 O que é?

Também conhecida como Ports and Adapters.

A ideia central é separar o núcleo da aplicação das tecnologias externas.

---

## 11.2 Por que existe?

Para permitir que o núcleo interaja com o exterior por contratos.

---

## 11.3 Qual problema resolve?

Evita que detalhes externos invadam o núcleo.

---

## 11.4 Como funciona?

```text
         HTTP
          ↓
       Adapter
          ↓
        Port
          ↓
       Core
          ↑
        Port
          ↑
       Adapter
          ↑
       Database
```

### Port

É um contrato de entrada ou saída.

### Adapter

É uma implementação que conecta o mundo externo ao port.

---

## 11.5 Quando eu usaria?

Quando existem múltiplas fronteiras externas e queremos isolá-las.

---

## 11.6 Quando eu evitaria?

Se a aplicação for tão pequena que os limites não tragam benefício.

---

## 11.7 Exemplo

```ts
interface StudentRepository {
  save(student: Student): Promise<void>;
}
```

Esse contrato pode funcionar como um port de saída.

---

## 11.8 Como aparece no Beach Tennis Manager?

```text
Use Case
   ↓
StudentRepository
   ↑
DrizzleStudentRepository
```

é compatível com a ideia de Port and Adapter.

---

# 12. Onion Architecture

## 12.1 O que é?

Onion Architecture organiza o sistema em camadas concêntricas, colocando o domínio no centro.

Conceitualmente:

```text
        Infrastructure
      Application Services
         Domain Services
            Domain
```

---

## 12.2 Por que existe?

Para enfatizar que o domínio deve ser protegido dos detalhes externos.

---

## 12.3 Qual problema resolve?

Controla a direção das dependências.

---

## 12.4 Como funciona?

Dependências apontam para dentro.

---

## 12.5 Quando eu usaria?

Quando o domínio é importante e queremos manter independência das tecnologias externas.

---

## 12.6 Quando eu evitaria?

Quando o domínio é praticamente inexistente.

---

## 12.7 Exemplo

```text
Infrastructure
      ↓
Application
      ↓
Domain
```

---

## 12.8 Como aparece no Beach Tennis Manager?

As regras relacionadas a:

```text
ciclo
ausência
crédito
reposição
```

são candidatas naturais a permanecer protegidas de infraestrutura.

---

# 13. Domain e Application

Esses conceitos são frequentemente confundidos.

## Domain

Representa regras e conceitos centrais do negócio.

Exemplos:

```text
Aluno
Matrícula
Ciclo
Crédito de reposição
```

## Application

Coordena casos de uso.

Exemplos:

```text
Registrar aluno
Registrar ausência
Registrar pagamento
Fechar ciclo
```

---

## Diferença

Uma pergunta útil:

> Isso representa uma regra/conceito do negócio ou a execução de uma operação da aplicação?

---

# 14. Infrastructure

## 14.1 O que é?

Infrastructure contém detalhes técnicos externos ao núcleo da aplicação.

Exemplos:

```text
PostgreSQL
Drizzle
JWT
Fastify
APIs externas
arquivos
e-mail
WhatsApp
```

---

## 14.2 Por que existe?

Porque tecnologia muda.

---

## 14.3 Qual problema resolve?

Mantém detalhes externos fora das regras centrais.

---

## 14.4 Como funciona?

Exemplo:

```text
Application
    ↓
StudentRepository
    ↑
Infrastructure
```

---

## 14.5 Quando eu usaria?

Em sistemas que precisam controlar fronteiras técnicas.

---

## 14.6 Quando eu evitaria?

Não existe necessidade de criar uma camada artificial para cada biblioteca.

---

## 14.7 Exemplo

```text
DrizzleStudentRepository
```

é infraestrutura.

---

## 14.8 Como aparece no Beach Tennis Manager?

O código específico de Drizzle/PostgreSQL deve permanecer na infraestrutura.

---

# 15. Interface Adapters

## 15.1 O que é?

São componentes que traduzem dados entre o mundo externo e o formato utilizado pela aplicação.

Exemplos:

```text
Controller
Presenter
Mapper
DTO
```

---

## 15.2 O que é DTO?

DTO significa **Data Transfer Object**.

É um objeto usado para transportar dados entre limites.

Exemplo:

```ts
type CreateStudentRequest = {
  name: string;
  cpf: string;
};
```

---

## 15.3 Por que existe?

Porque o formato HTTP não precisa ser igual ao modelo interno.

---

## 15.4 Qual problema resolve?

Evita vazar detalhes internos para APIs externas.

---

## 15.5 Como funciona?

```text
HTTP request
   ↓
Controller
   ↓
DTO
   ↓
Use Case
```

---

## 15.6 Quando eu usaria?

Em APIs e sistemas com limites externos.

---

## 15.7 Quando eu evitaria?

Não crie mapeamentos desnecessários quando os modelos são simples e o custo não se justifica.

---

## 15.8 Como aparece no Beach Tennis Manager?

A API pode receber:

```json
{
  "name": "João",
  "cpf": "..."
}
```

e o Controller transforma isso no input esperado pelo caso de uso.

---

# 16. Dependências entre camadas

Uma regra importante:

> A existência de uma camada não significa que qualquer camada pode acessar qualquer outra.

Exemplo problemático:

```text
Controller → PostgreSQL
```

ou:

```text
Domain → Fastify
```

---

## Estrutura desejada

```text
HTTP
 ↓
Controller
 ↓
Use Case
 ↓
Domain / Ports
 ↑
Infrastructure
```

O importante é a direção e o contrato.

---

# 17. Onde colocar a regra de negócio?

Essa é uma pergunta frequente em entrevistas.

A resposta não é simplesmente:

> "No service."

Precisamos separar tipos de lógica.

### Regra de negócio

Exemplo:

```text
Uma ausência dentro do prazo configurado
pode gerar crédito.
```

Isso pertence ao domínio/aplicação, conforme o contexto da regra.

### Regra de transporte

Exemplo:

```text
HTTP 400
```

Pertence à interface/adapter.

### Regra de persistência

Exemplo:

```text
SELECT ...
```

Pertence à infraestrutura/repositório.

---

## Beach Tennis Manager

A regra:

```text
6 horas
```

não deve ser codificada como constante fixa apenas porque apareceu em um exemplo anterior.

A documentação estabelece que o prazo é configurável por professor, com fallback global.

Portanto a arquitetura deve permitir obter essa configuração corretamente.

---

# 18. Entidade anêmica e domínio rico

## 18.1 O que é uma entidade anêmica?

É uma entidade que contém principalmente dados, enquanto toda a lógica fica em serviços externos.

Exemplo:

```ts
class Cycle {
  id!: string;
  status!: string;
  lessons!: number;
}
```

e:

```ts
class CycleService {
  closeCycle(cycle: Cycle) {
    // toda a regra
  }
}
```

---

## 18.2 Por que isso pode ser um problema?

Quando regras importantes ficam espalhadas em vários serviços, pode ser difícil descobrir onde o comportamento pertence.

---

## 18.3 O que é domínio rico?

Um modelo de domínio rico pode proteger invariantes e comportamentos relacionados ao próprio conceito.

**Invariante** é uma condição que deve permanecer verdadeira.

Exemplo:

```text
um ciclo não pode aceitar arbitrariamente
uma alteração que viole seu estado permitido.
```

---

## 18.4 Qual problema resolve?

Centraliza regras que pertencem naturalmente ao próprio conceito.

---

## 18.5 Quando eu usaria?

Quando o domínio possui comportamento e invariantes significativos.

---

## 18.6 Quando eu evitaria?

Um CRUD simples não precisa transformar cada registro em uma entidade cheia de métodos.

---

## 18.7 Exemplo

Em vez de:

```ts
cycle.lessonsReceived++;

if (cycle.lessonsReceived >= 4) {
  cycle.status = "closed";
}
```

espalhado pela aplicação, podemos estudar uma operação de domínio:

```ts
cycle.registerLesson();
```

que protege suas próprias regras.

---

## 18.8 Como aparece no Beach Tennis Manager?

Ciclos, créditos e matrículas possuem regras importantes.

Isso é um sinal de que algumas operações podem merecer comportamento de domínio explícito.

---

# 19. Arquitetura não é sinônimo de complexidade

Uma arquitetura profissional não significa:

```text
50 interfaces
30 factories
20 services
```

Profissionalismo significa:

```text
clareza
coerência
justificativa
testabilidade
manutenibilidade
```

Uma solução simples e bem justificada pode ser mais profissional que uma arquitetura excessivamente sofisticada.

---

# 20. Código ruim → análise → refatoração

## 20.1 Código inicial

```ts
app.post("/students", async (request, reply) => {
  const { name, cpf } = request.body;

  const existing = await db.query.students.findFirst({
    where: eq(students.cpf, cpf),
  });

  if (existing) {
    return reply.status(409).send({
      message: "Student already exists",
    });
  }

  const [student] = await db
    .insert(students)
    .values({ name, cpf })
    .returning();

  await whatsapp.sendMessage(
    "admin",
    `Aluno ${student.name} criado`,
  );

  return reply.status(201).send(student);
});
```

---

## 20.2 Análise

O endpoint está fazendo:

```text
HTTP
validação
persistência
regra
integração externa
```

Tudo no mesmo lugar.

---

## 20.3 Problemas

### Acoplamento

O endpoint conhece:

```text
Drizzle
PostgreSQL
WhatsApp
```

### Testabilidade

Testar a regra exige montar muita infraestrutura.

### Manutenção

Mudanças podem afetar um componente gigante.

---

## 20.4 Refatoração

Controller:

```ts
class CreateStudentController {
  constructor(
    private readonly useCase: CreateStudent,
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const input = createStudentSchema.parse(request.body);

    const student =
      await this.useCase.execute(input);

    return reply.status(201).send(student);
  }
}
```

Caso de uso:

```ts
class CreateStudent {
  constructor(
    private readonly repository: StudentRepository,
  ) {}

  async execute(input: CreateStudentInput) {
    const existing =
      await this.repository.findByCpf(input.cpf);

    if (existing) {
      throw new StudentAlreadyExistsError();
    }

    return this.repository.create(input);
  }
}
```

Infraestrutura:

```ts
class DrizzleStudentRepository
  implements StudentRepository {
  // Drizzle
}
```

Agora temos:

```text
HTTP
 ↓
Controller
 ↓
Use Case
 ↓
Repository
 ↓
Drizzle
 ↓
PostgreSQL
```

---

# 21. Aplicação no Beach Tennis Manager

Uma visão simplificada do backend:

```text
apps/api/src/

modules/
  auth/
  students/
  professors/
  groups/
  lessons/
  enrollments/
  cycles/
  absences/
  makeups/
  payments/
```

A organização por módulo pode coexistir com camadas internas.

Exemplo conceitual:

```text
modules/students/
├── application/
├── domain/
└── infrastructure/
```

---

## 21.1 Auth

O projeto já possui autenticação com:

```text
JWT Access Token
Refresh Token
HttpOnly cookies
```

A infraestrutura conhece os detalhes de JWT.

A aplicação trabalha com os contratos necessários.

---

## 21.2 Students

Pode possuir:

```text
CreateStudent
FindStudent
UpdateStudent
```

e contratos de persistência.

---

## 21.3 Cycles

Aqui o domínio tende a ser mais importante.

Existem regras sobre:

```text
4 aulas
início do ciclo
pagamento
fechamento
configurações congeladas
```

---

## 21.4 Absences

Possui regras como:

```text
aviso prévio
crédito
professor
limite de reposições
```

Essas regras não devem ficar escondidas dentro de uma rota HTTP.

---

## 21.5 Makeups

Possui relações com:

```text
absence
credit
enrollment
lesson
cycle
```

A arquitetura deve tornar essas relações compreensíveis.

---

# 22. Trade-offs

## Mais camadas

Ganhos:

```text
separação
testabilidade
limites
```

Custos:

```text
mais arquivos
mais indireção
mais código
```

---

## Mais abstrações

Ganhos:

```text
substituição
isolamento
contratos
```

Custos:

```text
complexidade
navegação
manutenção
```

---

## Domínio mais rico

Ganhos:

```text
regras próximas do conceito
invariantes protegidas
```

Custos:

```text
maior esforço de modelagem
```

---

## Arquitetura mais simples

Ganhos:

```text
velocidade
menos código
facilidade inicial
```

Custos:

```text
limites mais fracos
maior risco de crescimento desorganizado
```

---

# 23. Erros comuns

## 23.1 "Clean Architecture é criar quatro pastas"

Não.

É principalmente sobre dependências e limites.

---

## 23.2 "Toda regra deve ficar em Entity"

Não.

Algumas regras pertencem a casos de uso, serviços de domínio ou políticas.

---

## 23.3 "Service resolve tudo"

Não.

Um `Service` genérico pode virar um lugar onde qualquer lógica é colocada.

---

## 23.4 "Repository é só uma classe do banco"

Não.

A abstração Repository pode representar uma fronteira de persistência.

---

## 23.5 "Arquitetura limpa não pode depender de framework"

Na prática, frameworks existem na aplicação.

A ideia é impedir que detalhes do framework dominem o núcleo das regras.

---

## 23.6 "Mais abstrações = arquitetura melhor"

Não.

Abstração tem custo.

---

## 23.7 "Microservices são arquitetura melhor"

Não existe uma resposta universal.

Microservices introduzem custos de:

```text
rede
deploy
observabilidade
consistência
operação
```

Para muitos sistemas, um monólito modular é uma solução adequada.

---

# 24. Exercícios

## Exercício 1 — Identificar camadas

Classifique:

```text
Fastify route
Use Case
PostgreSQL
Drizzle Repository
Student
HTTP DTO
```

em:

```text
Presentation
Application
Domain
Infrastructure
Adapter
```

---

## Exercício 2 — Dependências

Explique por que:

```text
UseCase → Drizzle
```

é diferente de:

```text
UseCase → Repository
Repository ← Drizzle
```

---

## Exercício 3 — Regra de negócio

Considere:

> Uma ausência com antecedência suficiente pode gerar crédito de reposição.

Onde você colocaria:

```text
regra
acesso HTTP
persistência
```

Explique.

---

## Exercício 4 — Refatoração

Pegue uma rota com:

```text
validação
SQL
regra
resposta HTTP
```

e divida em componentes.

---

## Exercício 5 — Beach Tennis Manager

Escolha:

```text
Ciclo
```

e liste:

```text
estado
comportamentos
invariantes
dependências externas
```

---

## Exercício 6 — Arquitetura

Desenhe:

```text
HTTP
 ↓
Controller
 ↓
Use Case
 ↓
Domain / Port
 ↓
Adapter
 ↓
PostgreSQL
```

Depois explique cada seta.

---

# 25. Perguntas de entrevista

## O que é arquitetura de software?

É a organização estrutural das responsabilidades, limites e dependências importantes de um sistema.

---

## Qual a diferença entre arquitetura e estrutura de pastas?

Pastas são uma organização física.

Arquitetura envolve responsabilidades e direção das dependências.

---

## O que é Clean Architecture?

Uma abordagem que busca proteger regras centrais de detalhes externos, organizando responsabilidades e direcionando dependências para o núcleo.

---

## O que é Hexagonal Architecture?

Uma arquitetura baseada na ideia de Ports and Adapters, isolando o núcleo de tecnologias externas por meio de contratos.

---

## O que é um Port?

Um contrato que representa uma interação do núcleo com o exterior.

---

## O que é um Adapter?

Uma implementação que conecta uma tecnologia externa a um contrato esperado pelo núcleo.

---

## Onde fica a regra de negócio?

Nas partes responsáveis pelo domínio/aplicação, e não em controllers ou detalhes de infraestrutura.

A localização exata depende da natureza da regra.

---

## O que é entidade anêmica?

Um modelo que contém principalmente dados, enquanto o comportamento relacionado fica excessivamente espalhado em serviços externos.

---

## O que é alta coesão?

É quando as responsabilidades de um componente estão fortemente relacionadas.

---

## O que é baixo acoplamento?

É reduzir dependências desnecessárias entre componentes, especialmente dependências sobre detalhes.

---

# 26. Perguntas de aprofundamento

### 1. Clean Architecture é a única arquitetura correta?

Não.

É uma abordagem entre várias.

---

### 2. Clean Architecture exige muitas interfaces?

Não.

Interfaces devem existir onde representam fronteiras e abstrações úteis.

---

### 3. Hexagonal e Clean Architecture são iguais?

Não são idênticas, mas compartilham ideias importantes de isolamento do núcleo e controle das dependências.

---

### 4. Um monólito pode ter boa arquitetura?

Sim.

Monólito descreve principalmente uma estratégia de implantação. Não significa necessariamente código desorganizado.

---

### 5. Microservices resolvem acoplamento?

Podem separar processos e equipes, mas também introduzem novos acoplamentos de rede e operação.

Não são uma solução automática.

---

### 6. O domínio precisa conhecer o banco?

Idealmente, o núcleo das regras não precisa conhecer detalhes específicos de persistência.

---

### 7. Toda regra precisa estar em uma entidade?

Não.

Pode pertencer ao caso de uso, serviço de domínio ou outra abstração apropriada.

---

### 8. O que é uma arquitetura acidental?

É aquela que emerge sem decisões estruturais conscientes.

---

### 9. O que é uma arquitetura evolutiva?

É aquela que pode ser refinada conforme o sistema cresce, evitando antecipar complexidade desnecessária.

---

### 10. Qual é o maior objetivo da arquitetura?

Controlar a complexidade e tornar mudanças importantes mais previsíveis e localizadas.

---

# 27. Checklist de domínio

- [ ] Sei definir arquitetura de software.
- [ ] Sei diferenciar arquitetura de estrutura de pastas.
- [ ] Sei explicar responsabilidade.
- [ ] Sei explicar limites arquiteturais.
- [ ] Sei explicar coesão.
- [ ] Sei explicar acoplamento.
- [ ] Sei explicar direção das dependências.
- [ ] Sei explicar arquitetura em camadas.
- [ ] Sei explicar arquitetura em três camadas.
- [ ] Sei explicar Clean Architecture.
- [ ] Sei explicar Hexagonal Architecture.
- [ ] Sei explicar Onion Architecture.
- [ ] Sei explicar Domain.
- [ ] Sei explicar Application.
- [ ] Sei explicar Infrastructure.
- [ ] Sei explicar Interface Adapters.
- [ ] Sei explicar DTO.
- [ ] Sei explicar Port.
- [ ] Sei explicar Adapter.
- [ ] Sei explicar entidade anêmica.
- [ ] Sei explicar domínio rico.
- [ ] Sei discutir trade-offs arquiteturais.
- [ ] Sei identificar quando uma arquitetura está excessivamente complexa.
- [ ] Consigo explicar onde ficam as regras do Beach Tennis Manager.
- [ ] Consigo justificar a direção das dependências do projeto.

---

# Conclusão

Arquitetura não é sobre criar a maior quantidade possível de camadas.

É sobre responder bem a perguntas importantes:

```text
Quem é responsável por quê?
Quem depende de quem?
O que deve permanecer independente?
Onde estão as regras de negócio?
Quais detalhes podem mudar?
Como isolamos esses detalhes?
```

Os conceitos estudados até aqui formam uma cadeia:

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
DI
      ↓
Design Patterns
      ↓
Arquitetura
```

No Beach Tennis Manager, isso se traduz em uma preocupação concreta:

```text
Fastify
Drizzle
PostgreSQL
JWT
APIs externas
```

são tecnologias e detalhes.

Enquanto:

```text
Aluno
Matrícula
Ciclo
Aula
Ausência
Crédito
Reposição
Pagamento
```

representam conceitos e regras do negócio.

A arquitetura deve ajudar a manter essas duas dimensões separadas o suficiente para que uma mudança tecnológica não obrigue o negócio a ser reescrito.

E existe uma última ideia importante:

> **Uma arquitetura boa não é aquela que parece sofisticada no diagrama. É aquela que torna o sistema mais fácil de entender, testar, modificar e explicar.**

O próximo estudo será **08 — Bancos de Dados**, entrando em modelagem relacional, chaves, relacionamentos, normalização, índices, transações, concorrência, SQL, PostgreSQL e como essas decisões aparecem no Beach Tennis Manager.
