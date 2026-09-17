# 01 — Fundamentos de Engenharia de Software

> Material de estudo do Beach Tennis Manager.
>
> Este documento apresenta os fundamentos que serão usados como base para os módulos posteriores de Orientação a Objetos, Código Limpo, SOLID, Injeção de Dependência, Design Patterns e Arquitetura.
>
> O objetivo não é decorar definições. O objetivo é aprender a analisar problemas de software, reconhecer alternativas, entender trade-offs e justificar decisões técnicas.

---

## Sumário

1. [Como estudar este documento](#1-como-estudar-este-documento)
2. [Estado](#2-estado)
3. [Comportamento](#3-comportamento)
4. [Responsabilidade](#4-responsabilidade)
5. [Coesão](#5-coesão)
6. [Acoplamento](#6-acoplamento)
7. [Dependência](#7-dependência)
8. [Abstração](#8-abstração)
9. [Encapsulamento](#9-encapsulamento)
10. [Composição](#10-composição)
11. [Como os conceitos se conectam](#11-como-os-conceitos-se-conectam)
12. [Aplicação integrada no Beach Tennis Manager](#12-aplicação-integrada-no-beach-tennis-manager)
13. [Exercícios](#13-exercícios)
14. [Perguntas de entrevista](#14-perguntas-de-entrevista)
15. [Checklist de domínio](#15-checklist-de-domínio)

---

# 1. Como estudar este documento

Este documento foi construído para servir como material de referência de longo prazo.

Não é necessário memorizar cada frase.

O objetivo é conseguir raciocinar sobre o código.

Para cada conceito, procure responder:

1. O que é?
2. Por que existe?
3. Qual problema resolve?
4. Como funciona?
5. Quando eu usaria?
6. Quando eu evitaria?
7. Consigo dar um exemplo?
8. Como isso apareceria no Beach Tennis Manager?

Além disso, para conceitos mais importantes, procure responder:

- quais são os trade-offs?
- quais são os erros comuns?
- como identificar o problema em código existente?
- como refatorar?
- como testar?
- como explicar a decisão em uma entrevista?

> **Regra de estudo:** quando um termo técnico aparecer, ele deve ser compreendido antes de ser usado para justificar outro conceito.

---

# 2. Estado

## 2.1 O que é?

Estado é o conjunto de informações que representa a situação atual de alguma coisa em determinado momento.

Essa definição possui três ideias importantes:

- existe alguma coisa sendo representada;
- existem informações sobre sua situação;
- essa situação pode ser observada em determinado momento.

Considere:

```ts
const aluno = {
  nome: "João",
  ativo: true,
  faltas: 2,
};
```

Podemos dizer que, naquele momento, parte do estado do aluno é:

```text
nome   = João
ativo  = true
faltas = 2
```

Se uma nova falta for registrada:

```ts
aluno.faltas = 3;
```

o estado mudou.

Antes:

```text
faltas = 2
```

Depois:

```text
faltas = 3
```

---

## 2.2 Por que o conceito de estado existe?

Porque sistemas precisam representar situações que mudam ao longo do tempo.

Uma aplicação de gestão precisa saber mais do que simplesmente quais entidades existem.

Ela precisa saber a situação atual delas.

No Beach Tennis Manager, por exemplo:

```text
Aluno
- está ativo?
- está matriculado?
- em qual turma?
- possui crédito de reposição?

Ciclo
- está aberto?
- quantas aulas foram efetivamente realizadas?
- possui créditos relacionados?

Aula
- está agendada?
- foi realizada?
- foi cancelada?
```

Essas informações permitem que a aplicação tome decisões.

---

## 2.3 Qual problema resolve?

Estado permite representar a situação atual de uma entidade ou processo e tomar decisões baseadas nessa situação.

Sem estado, seria difícil diferenciar:

```text
Aula ainda não aconteceu.
```

de:

```text
Aula aconteceu.
```

ou:

```text
Aula foi cancelada.
```

Se representarmos:

```text
AGENDADA
REALIZADA
CANCELADA
```

podemos aplicar comportamentos diferentes a cada situação.

---

## 2.4 Como funciona?

Uma forma útil de estudar estado é pensar em:

```text
Estado atual
     |
   evento
     |
 regra
     |
novo estado
```

Exemplo:

```text
AGENDADA
    |
    | aula acontece
    v
REALIZADA
```

Outro:

```text
AGENDADA
    |
    | professor cancela
    v
CANCELADA
```

A mudança não deveria ser apenas uma alteração arbitrária de valor.

Ela deve respeitar as regras do domínio.

---

## 2.5 Estado e transição

Uma **transição de estado** é a mudança de uma situação para outra.

Por exemplo:

```text
AGENDADA -> REALIZADA
```

é uma transição.

Já:

```text
CANCELADA -> REALIZADA
```

pode exigir um tratamento diferente, dependendo das regras do sistema.

Essa ideia se torna importante quando um sistema possui workflows.

Um workflow é uma sequência organizada de estados e transições.

Exemplo:

```text
AGENDADA
    |
    +----> REALIZADA
    |
    +----> CANCELADA
```

---

## 2.6 Quando eu usaria?

O conceito de estado está presente sempre que precisamos representar uma situação que pode mudar.

Exemplos:

- status de uma aula;
- status de uma matrícula;
- ciclo de pagamento;
- presença;
- crédito de reposição;
- autenticação;
- processamento de pagamento;
- pedido;
- tarefa;
- processo de aprovação.

---

## 2.7 Quando eu evitaria?

Não devemos evitar o conceito de estado em si.

Devemos evitar formas desnecessariamente complicadas ou duplicadas de representar estado.

Por exemplo, se uma informação pode ser derivada de outra e armazená-la cria risco de inconsistência, devemos avaliar se realmente precisamos persistir as duas.

Também devemos evitar estado global quando não existe uma necessidade real.

---

## 2.8 Exemplo

Um estado simples:

```ts
type StatusAula = "AGENDADA" | "REALIZADA" | "CANCELADA";
```

Uma estrutura contendo estado:

```ts
type Aula = {
  id: string;
  status: StatusAula;
};
```

Uso:

```ts
if (aula.status === "CANCELADA") {
  // tratar cancelamento
}
```

---

## 2.9 Como aparece no Beach Tennis Manager?

O conceito aparece em praticamente todo o domínio.

Exemplos:

```text
Aula
-> agendada, realizada ou cancelada

Matrícula
-> ativa ou encerrada

Ciclo
-> aberto ou concluído

Crédito de reposição
-> disponível ou utilizado
```

É importante não inventar estados apenas porque eles parecem convenientes.

Os estados do sistema devem representar o domínio documentado.

---

## 2.10 Invariantes

Uma **invariante** é uma condição que deve permanecer verdadeira enquanto uma estrutura estiver em um estado válido.

Exemplo:

```text
quantidade de alunos <= capacidade da turma
```

Se a capacidade é 4:

```text
3 alunos -> válido
4 alunos -> válido
5 alunos -> inválido
```

Outra possível condição:

```text
créditos de reposição >= 0
```

A existência de invariantes mostra por que simplesmente expor e permitir alterações livres no estado pode ser perigoso.

---

# 3. Comportamento

## 3.1 O que é?

Comportamento é aquilo que uma entidade, objeto, módulo ou componente pode fazer.

Em um objeto orientado a objetos, comportamento normalmente aparece através de métodos.

Exemplo:

```ts
class Aluno {
  ativar() {
    // ...
  }

  desativar() {
    // ...
  }
}
```

Os métodos representam comportamentos.

---

## 3.2 Por que o conceito de comportamento existe?

Porque software não serve apenas para armazenar informações.

Ele precisa executar operações.

Um sistema de gestão precisa:

```text
criar aluno
matricular aluno
registrar presença
registrar ausência
gerar crédito
utilizar crédito
registrar pagamento
```

Essas ações representam comportamentos do sistema.

---

## 3.3 Qual problema resolve?

O comportamento permite transformar uma aplicação de um simples conjunto de dados em um sistema capaz de executar regras e processos.

Dados dizem:

```text
créditos = 1
```

Comportamento pode responder:

```text
o crédito pode ser utilizado?
```

e executar:

```text
utilizar crédito
```

---

## 3.4 Como funciona?

Um comportamento normalmente:

1. recebe informações;
2. consulta estado;
3. aplica alguma lógica;
4. produz um resultado;
5. eventualmente altera estado.

Exemplo:

```ts
class Conta {
  saldo = 0;

  depositar(valor: number) {
    if (valor <= 0) {
      throw new Error("Valor inválido");
    }

    this.saldo += valor;
  }
}
```

O método:

```text
recebe valor
   |
valida
   |
altera saldo
```

---

## 3.5 Estado + comportamento

Uma forma clássica de pensar em objetos é:

```text
Objeto
├── estado
└── comportamento
```

Exemplo:

```ts
class Turma {
  private alunos: string[] = [];

  adicionarAluno(nome: string) {
    // ...
  }

  possuiVaga() {
    // ...
  }
}
```

Estado:

```text
alunos
```

Comportamento:

```text
adicionarAluno()
possuiVaga()
```

---

## 3.6 Quando eu usaria?

Comportamentos são necessários quando o sistema precisa:

- executar regras;
- transformar dados;
- validar operações;
- controlar mudanças;
- coordenar processos;
- produzir efeitos externos.

---

## 3.7 Quando eu evitaria?

Não devemos transformar todo cálculo em método de objeto só porque estamos usando Orientação a Objetos.

Uma função simples pode ser melhor quando existe uma transformação independente de estado.

Exemplo:

```ts
function calcularTotal(
  valores: number[],
): number {
  return valores.reduce((total, valor) => total + valor, 0);
}
```

Não existe necessidade automática de criar uma classe para isso.

---

## 3.8 Exemplo

```ts
class Turma {
  private alunos: string[] = [];

  possuiVaga(capacidade: number) {
    return this.alunos.length < capacidade;
  }

  adicionarAluno(nome: string, capacidade: number) {
    if (!this.possuiVaga(capacidade)) {
      throw new Error("Turma sem vaga");
    }

    this.alunos.push(nome);
  }
}
```

O comportamento controla uma mudança de estado.

---

## 3.9 Como aparece no Beach Tennis Manager?

Exemplos de comportamentos possíveis:

```text
Turma
-> adicionar aluno
-> remover aluno
-> verificar vaga

Ciclo
-> iniciar
-> registrar aula efetivamente utilizada
-> concluir

Crédito
-> criar
-> utilizar
```

Os comportamentos exatos devem seguir as regras documentadas do projeto.

---

# 4. Responsabilidade

## 4.1 O que é?

Responsabilidade é aquilo pelo qual uma parte do sistema deve responder.

Uma classe, função, módulo ou componente possui uma responsabilidade quando é um lugar apropriado para realizar determinado trabalho ou proteger determinada regra.

A pergunta central é:

> **Quem deveria fazer isso?**

---

## 4.2 Por que o conceito existe?

Porque sistemas podem funcionar mesmo quando suas responsabilidades estão mal distribuídas.

Esse é um dos problemas mais perigosos do software legado.

O código pode:

```text
compilar
passar nos testes
funcionar em produção
```

e ainda assim ser difícil de modificar.

Uma boa distribuição de responsabilidades facilita entender:

```text
onde uma regra está
quem pode alterá-la
qual parte deve ser modificada quando o requisito mudar
```

---

## 4.3 Qual problema resolve?

Responsabilidades bem distribuídas ajudam a evitar:

- classes gigantes;
- funções que fazem coisas demais;
- regras espalhadas;
- duplicação de lógica;
- mudanças difíceis de localizar;
- módulos que conhecem detalhes demais.

---

## 4.4 Como funciona?

Imagine:

```ts
class AlunoService {
  criarAluno() {}
  enviarWhatsApp() {}
  gerarPdf() {}
  calcularPagamento() {}
  salvarNoBanco() {}
}
```

Podemos perguntar:

```text
O que essa classe representa?
```

Ela possui responsabilidades muito diferentes.

Uma possível separação poderia ser:

```text
AlunoService
NotificationService
ReportService
PaymentService
AlunoRepository
```

A divisão exata depende do contexto.

Não existe uma regra universal de que cada método precisa virar uma classe.

---

## 4.5 Quando eu usaria?

O conceito de responsabilidade deve ser usado sempre que estivermos decidindo:

- onde colocar uma regra;
- onde colocar um comportamento;
- como dividir módulos;
- como organizar classes;
- como separar camadas;
- como estruturar casos de uso.

---

## 4.6 Quando eu evitaria?

Não devemos transformar responsabilidade em fragmentação excessiva.

Por exemplo:

```text
AdicionarAlunoValidator
AdicionarAlunoLogger
AdicionarAlunoCalculator
AdicionarAlunoMapper
AdicionarAlunoChecker
```

para uma operação extremamente simples pode criar mais complexidade do que resolver.

A pergunta deve ser:

> A separação melhora a compreensão e a evolução do sistema?

---

## 4.7 Exemplo

Considere:

```ts
class Turma {
  adicionarAluno(aluno: Aluno) {
    if (this.alunos.length >= this.capacidade) {
      throw new Error("Turma sem vaga");
    }

    this.alunos.push(aluno);
  }
}
```

A turma está assumindo uma responsabilidade coerente:

> manter a regra relacionada à capacidade e aos alunos que fazem parte dela.

---

## 4.8 Como aparece no Beach Tennis Manager?

Podemos ter responsabilidades relacionadas a:

```text
Aluno
-> informações e comportamentos próprios do aluno

Turma
-> composição e capacidade da turma

Matrícula
-> relação aluno/professor/turma e condições comerciais

Ciclo
-> evolução do ciclo de aulas

Pagamento
-> registro e informações do pagamento
```

Essas fronteiras serão refinadas quando estudarmos domínio e arquitetura.

---

# 5. Coesão

## 5.1 O que é?

**Coesão** é o grau de relacionamento entre as responsabilidades agrupadas em uma unidade de software.

Uma unidade pode ser:

- função;
- classe;
- módulo;
- pacote;
- componente;
- serviço.

Alta coesão significa que as responsabilidades agrupadas possuem uma relação forte.

Baixa coesão significa que responsabilidades diferentes foram colocadas juntas sem uma relação clara.

---

## 5.2 Por que existe?

Coesão é uma forma de pensar sobre organização.

Quando responsabilidades relacionadas ficam juntas:

```text
é mais fácil encontrar a regra
é mais fácil entender o código
é mais fácil testar
é mais fácil alterar
```

Quando responsabilidades não relacionadas ficam juntas:

```text
fica difícil saber onde mexer
uma mudança pode afetar coisas inesperadas
a classe cresce sem uma direção clara
```

---

## 5.3 Qual problema resolve?

Coesão ajuda a reduzir a dispersão de responsabilidades.

Imagine uma classe:

```ts
class Sistema {
  criarAluno() {}
  enviarEmail() {}
  gerarRelatorio() {}
  calcularPagamento() {}
  conectarBanco() {}
}
```

Ela possui baixa coesão porque não existe uma ideia central suficientemente forte conectando todas essas responsabilidades.

---

## 5.4 Como funciona?

Uma pergunta prática é:

> **Essas responsabilidades fazem sentido juntas?**

Outra pergunta poderosa é:

> **Elas tendem a mudar juntas?**

Considere:

```ts
class AlunoService {
  calcularPagamento() {}
  enviarWhatsApp() {}
}
```

Se a regra financeira mudar:

```text
calcularPagamento()
```

pode mudar.

Se o fornecedor de WhatsApp mudar:

```text
enviarWhatsApp()
```

pode mudar.

Os motivos de mudança são diferentes.

Isso pode ser um sinal de baixa coesão.

---

## 5.5 Quando eu usaria?

Coesão é útil ao:

- criar classes;
- dividir módulos;
- avaliar serviços;
- revisar código;
- decidir limites de componentes;
- organizar arquitetura.

---

## 5.6 Quando eu evitaria?

Não devemos buscar uma separação artificial apenas para aumentar a quantidade de classes.

Uma classe com 30 métodos relacionados pode ser mais coesa do que dez classes com três métodos cada, quando a divisão não possui significado.

O objetivo não é minimizar tamanho.

O objetivo é criar agrupamentos coerentes.

---

## 5.7 Exemplo

Alta coesão:

```ts
class Turma {
  adicionarAluno() {}
  removerAluno() {}
  possuiVaga() {}
  quantidadeDeAlunos() {}
}
```

Baixa coesão:

```ts
class Sistema {
  adicionarAluno() {}
  removerAluno() {}
  gerarPdf() {}
  enviarWhatsApp() {}
  fazerBackup() {}
}
```

---

## 5.8 Como aparece no Beach Tennis Manager?

Um possível objetivo arquitetural é manter juntas as responsabilidades que pertencem ao mesmo conceito.

Por exemplo:

```text
Regras relacionadas ao ciclo
        |
        v
modelo/use case de ciclo

Regras relacionadas à reposição
        |
        v
modelo/use case de reposição
```

A estrutura final dependerá da arquitetura adotada.

---

# 6. Acoplamento

## 6.1 O que é?

**Acoplamento** representa o grau de dependência entre partes de um sistema.

Em termos práticos:

> Quanto uma parte precisa conhecer, utilizar ou depender de outra parte para funcionar?

Considere:

```ts
class PaymentService {
  private gateway = new PixGateway();

  pagar(valor: number) {
    return this.gateway.pay(valor);
  }
}
```

Existe uma dependência direta entre:

```text
PaymentService
      |
 PixGateway
```

---

## 6.2 Por que existe?

Acoplamento existe porque partes de um sistema precisam colaborar.

Uma aplicação real precisa conectar:

```text
API
 |
casos de uso
 |
domínio
 |
banco
```

Não queremos eliminar todas as relações.

Queremos controlar as relações.

---

## 6.3 Qual problema resolve?

O estudo de acoplamento ajuda a identificar dependências que tornam mudanças mais difíceis.

Imagine que:

```text
PaymentService -> PixGateway
```

e que o sistema passe a utilizar outro meio de pagamento.

Se `PaymentService` conhecer detalhes específicos do Pix, a mudança pode exigir alterações em vários lugares.

---

## 6.4 Como funciona?

Podemos analisar acoplamento perguntando:

1. Quem depende de quem?
2. O que exatamente é conhecido?
3. A dependência é concreta ou abstrata?
4. Se uma parte mudar, quais outras partes precisam mudar?
5. A dependência é necessária?
6. Ela pode ser isolada?

Exemplo:

```ts
class PaymentService {
  constructor(
    private gateway: PixGateway
  ) {}
}
```

O serviço conhece uma implementação concreta.

Outra opção:

```ts
interface PaymentGateway {
  pay(value: number): Promise<void>;
}

class PaymentService {
  constructor(
    private gateway: PaymentGateway
  ) {}
}
```

Agora o serviço conhece um contrato.

Isso não elimina a dependência.

Ele continua dependendo de `PaymentGateway`.

Mas muda a forma da dependência.

---

## 6.5 Quando eu usaria?

O conceito de acoplamento deve ser considerado sempre que:

- módulos precisam colaborar;
- uma classe recebe outra classe;
- uma camada acessa outra;
- uma integração externa é adicionada;
- uma decisão técnica pode se espalhar pelo sistema.

---

## 6.6 Quando eu evitaria?

Não existe motivo para tentar eliminar todo acoplamento.

Isso é impossível em um sistema real.

Devemos evitar principalmente:

- dependências desnecessárias;
- dependências difíceis de substituir;
- conhecimento de detalhes que não são necessários;
- dependências circulares;
- acoplamento que espalha uma decisão técnica por várias partes.

---

## 6.7 Exemplo

Acoplamento mais direto:

```ts
class NotificationService {
  private whatsapp = new WhatsAppProvider();

  enviar(mensagem: string) {
    return this.whatsapp.send(mensagem);
  }
}
```

O serviço conhece diretamente o fornecedor.

Uma abstração pode mudar a relação:

```ts
interface NotificationProvider {
  send(message: string): Promise<void>;
}

class NotificationService {
  constructor(
    private provider: NotificationProvider
  ) {}

  enviar(mensagem: string) {
    return this.provider.send(mensagem);
  }
}
```

Agora podemos fornecer diferentes implementações.

---

## 6.8 Como aparece no Beach Tennis Manager?

Imagine uma futura integração com WhatsApp.

Não queremos que regras de negócio como:

```text
registrar ausência
criar crédito
fechar ciclo
```

precisem conhecer detalhes da API do WhatsApp.

Uma possível estrutura seria:

```text
Regra de negócio
      |
NotificationPort
      |
WhatsAppAdapter
      |
API externa
```

O nome exato das abstrações e camadas será decidido na arquitetura do projeto.

---

# 7. Dependência

## 7.1 O que é?

Uma parte do software possui uma dependência quando precisa de outra parte para realizar determinada tarefa.

Exemplo:

```ts
class PaymentService {
  constructor(
    private gateway: PaymentGateway
  ) {}
}
```

`PaymentService` depende de `PaymentGateway`.

---

## 7.2 Por que existe?

Software é construído por partes que colaboram.

Um caso de uso precisa acessar um repositório.

Um controlador precisa chamar um caso de uso.

Uma integração precisa de um cliente HTTP.

Essas relações são naturais.

---

## 7.3 Qual problema resolve?

O conceito de dependência ajuda a tornar explícito:

```text
quem precisa de quem
```

Isso permite analisar:

- direção das dependências;
- quantidade de dependências;
- tipo das dependências;
- facilidade de substituição;
- impacto de mudanças.

---

## 7.4 Como funciona?

Uma dependência pode ser:

### Concreta

```ts
class PaymentService {
  constructor(
    private gateway: PixGateway
  ) {}
}
```

### Abstrata

```ts
interface PaymentGateway {
  pay(value: number): Promise<void>;
}

class PaymentService {
  constructor(
    private gateway: PaymentGateway
  ) {}
}
```

A segunda opção não significa automaticamente que o design é melhor.

A abstração precisa ter um propósito.

---

## 7.5 Quando eu usaria?

Sempre que uma parte do sistema precisar colaborar com outra.

O objetivo não é eliminar dependências, mas torná-las:

- claras;
- controláveis;
- coerentes;
- testáveis quando necessário.

---

## 7.6 Quando eu evitaria?

Devemos questionar dependências quando:

- uma classe conhece detalhes demais;
- uma camada depende diretamente de infraestrutura sem necessidade;
- existe dependência circular;
- uma dependência torna testes excessivamente difíceis;
- uma mudança simples exige alterações em muitas partes.

---

## 7.7 Exemplo

```ts
interface PaymentGateway {
  pay(value: number): Promise<void>;
}

class PaymentService {
  constructor(
    private readonly gateway: PaymentGateway
  ) {}

  pagar(valor: number) {
    return this.gateway.pay(valor);
  }
}
```

O serviço depende do contrato.

Uma implementação pode ser:

```ts
class PixGateway implements PaymentGateway {
  async pay(value: number) {
    // ...
  }
}
```

---

## 7.8 Como aparece no Beach Tennis Manager?

Um caso de uso de matrícula pode depender de algo como:

```text
EnrollmentRepository
```

Um caso de uso financeiro pode depender de:

```text
PaymentRepository
```

Uma integração futura pode depender de:

```text
NotificationProvider
```

Essas dependências serão estruturadas quando estudarmos Injeção de Dependência e Arquitetura.

---

# 8. Abstração

## 8.1 O que é?

Abstração é representar algo por meio dos aspectos relevantes para determinado contexto, escondendo detalhes que não precisam ser conhecidos por quem utiliza aquela representação.

Exemplo cotidiano:

Ao utilizar um caixa eletrônico, você interage com operações como:

```text
sacar
depositar
consultar saldo
```

Você não precisa conhecer todos os detalhes internos do sistema bancário.

---

## 8.2 Por que existe?

Porque detalhes aumentam a complexidade.

Se todas as partes de um sistema precisassem conhecer todos os detalhes internos umas das outras, a quantidade de conhecimento espalhado aumentaria rapidamente.

A abstração permite estabelecer uma fronteira:

```text
O consumidor precisa saber isto.
O consumidor não precisa saber aquilo.
```

---

## 8.3 Qual problema resolve?

Abstração ajuda a controlar complexidade e reduzir conhecimento desnecessário.

Considere:

```ts
interface PaymentGateway {
  pay(value: number): Promise<void>;
}
```

O consumidor precisa saber:

```text
pay()
```

Não precisa saber necessariamente:

```text
HTTP
headers
JSON
OAuth
endpoint
retry
timeout
logs
```

---

## 8.4 Como funciona?

Uma abstração apresenta uma visão simplificada de algo mais complexo.

Podemos ter:

```text
Aplicação
    |
PaymentGateway
    |
PixGateway
    |
API externa
```

A aplicação trabalha com o conceito:

```text
realizar pagamento
```

Enquanto a implementação conhece os detalhes técnicos.

---

## 8.5 Quando eu usaria?

Abstrações são úteis quando:

- existe complexidade que não deve se espalhar;
- existe uma fronteira arquitetural;
- uma implementação pode variar;
- uma integração externa precisa ser isolada;
- um contrato é mais importante do que a implementação.

---

## 8.6 Quando eu evitaria?

Não devemos criar interfaces e abstrações automaticamente para tudo.

Isto:

```ts
interface StringFormatter {
  format(value: string): string;
}
```

pode ser desnecessário se existir apenas uma implementação, nenhum limite arquitetural relevante e nenhuma necessidade de substituição.

Abstração também possui custo:

- mais tipos;
- mais arquivos;
- mais indireção;
- maior dificuldade inicial de navegação.

A pergunta deve ser:

> **Qual complexidade esta abstração está isolando?**

Se a resposta for "nenhuma", talvez ela não seja necessária.

---

## 8.7 Exemplo

Sem abstração:

```ts
class NotificationService {
  enviar() {
    // detalhes do WhatsApp
  }
}
```

Com uma fronteira:

```ts
interface NotificationProvider {
  send(message: string): Promise<void>;
}
```

O serviço utiliza o contrato.

---

## 8.8 Como aparece no Beach Tennis Manager?

Uma futura integração de notificações poderia ser representada por:

```text
Caso de uso
    |
NotificationProvider
    |
WhatsAppProvider
```

O caso de uso não precisa conhecer os detalhes da API externa.

---

# 9. Encapsulamento

## 9.1 O que é?

Encapsulamento é o princípio de controlar o acesso ao estado e aos detalhes internos de uma estrutura.

Considere:

```ts
class Conta {
  saldo = 0;
}
```

Qualquer código pode fazer:

```ts
conta.saldo = -50000;
```

Agora:

```ts
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

A classe passa a controlar como seu estado é alterado.

---

## 9.2 Por que existe?

Porque permitir acesso irrestrito ao estado pode permitir que qualquer parte do sistema quebre regras.

O encapsulamento cria uma fronteira de controle.

```text
Código externo
      |
      v
comportamento público
      |
      v
estado interno
```

---

## 9.3 Qual problema resolve?

Encapsulamento pode proteger:

- invariantes;
- regras;
- detalhes de implementação;
- consistência interna;
- liberdade para alterar a implementação.

---

## 9.4 Como funciona?

Em TypeScript:

```ts
class Turma {
  private alunos: string[] = [];

  adicionarAluno(nome: string) {
    if (this.alunos.length >= 4) {
      throw new Error("Turma sem vaga");
    }

    this.alunos.push(nome);
  }
}
```

O estado:

```text
alunos
```

é interno.

A operação:

```text
adicionarAluno()
```

controla como ele pode mudar.

---

## 9.5 Encapsulamento não é apenas `private`

Colocar:

```ts
private valor: number;
```

é uma ferramenta da linguagem.

Mas encapsulamento, como conceito de design, é mais amplo.

A pergunta importante é:

> **Quem controla as regras de alteração desse estado?**

Uma propriedade privada sem comportamento coerente não cria automaticamente um bom encapsulamento.

---

## 9.6 Quando eu usaria?

Especialmente quando:

- existem invariantes;
- existe estado que não deveria ser alterado arbitrariamente;
- detalhes internos podem mudar;
- uma entidade possui regras próprias.

---

## 9.7 Quando eu evitaria?

Não existe necessidade de esconder tudo indiscriminadamente.

Se um objeto for apenas uma estrutura simples de dados e não possuir regras próprias, adicionar camadas de encapsulamento pode ser desnecessário.

O design deve refletir o papel daquele objeto.

---

## 9.8 Exemplo

Ruim:

```ts
class Turma {
  alunos: Aluno[] = [];
}
```

Qualquer código pode fazer:

```ts
turma.alunos.push(aluno);
```

sem passar por nenhuma regra.

Uma alternativa:

```ts
class Turma {
  private alunos: Aluno[] = [];

  adicionarAluno(aluno: Aluno) {
    if (this.alunos.length >= 4) {
      throw new Error("Turma sem vaga");
    }

    this.alunos.push(aluno);
  }
}
```

---

## 9.9 Como aparece no Beach Tennis Manager?

Encapsulamento pode ser relevante em conceitos que possuem regras próprias, como:

```text
Turma
Ciclo
Crédito de reposição
```

Por exemplo, uma regra como:

```text
máximo de reposições por ciclo
```

não deveria ser quebrada simplesmente porque alguma parte da aplicação alterou um contador diretamente.

A modelagem definitiva será feita conforme refinarmos o domínio.

---

# 10. Composição

## 10.1 O que é?

Composição é uma forma de construir uma estrutura utilizando outras estruturas menores.

Em software, um objeto pode colaborar com outros objetos para realizar seu trabalho.

Exemplo:

```ts
class Checkout {
  constructor(
    private payment: PaymentService,
    private notification: NotificationService
  ) {}
}
```

`Checkout` utiliza outros componentes.

---

## 10.2 Por que existe?

Porque sistemas complexos podem ser construídos a partir de partes menores.

Em vez de uma classe gigantesca:

```text
Sistema inteiro
```

podemos ter:

```text
Checkout
├── PaymentService
└── NotificationService
```

Cada parte possui uma responsabilidade mais específica.

---

## 10.3 Qual problema resolve?

Composição ajuda a:

- reutilizar componentes;
- combinar comportamentos;
- trocar implementações;
- evitar hierarquias excessivamente rígidas;
- manter responsabilidades separadas.

---

## 10.4 Como funciona?

Podemos combinar objetos através de suas dependências:

```ts
interface NotificationService {
  send(message: string): Promise<void>;
}

class Checkout {
  constructor(
    private notification: NotificationService
  ) {}

  async finalizar() {
    await this.notification.send("Pedido finalizado");
  }
}
```

`Checkout` não precisa implementar todo o comportamento de notificação.

Ele utiliza um componente especializado.

---

## 10.5 Quando eu usaria?

Composição é útil quando:

- um objeto precisa de outros colaboradores;
- queremos combinar comportamentos;
- existem estratégias substituíveis;
- queremos reduzir hierarquias de herança;
- queremos separar responsabilidades.

---

## 10.6 Quando eu evitaria?

Não devemos transformar uma classe simples em uma árvore enorme de componentes sem necessidade.

Por exemplo:

```text
Service
 -> Manager
    -> Coordinator
       -> Helper
          -> Utility
```

pode ser apenas complexidade acidental.

Composição é uma ferramenta, não um objetivo.

---

## 10.7 Composição vs herança

Herança frequentemente representa:

```text
"é um"
```

Exemplo:

```text
Animal
  |
Cachorro
```

Composição frequentemente representa:

```text
"possui"
```

ou:

```text
"utiliza"
```

Exemplo:

```text
Checkout
  |
  +-- PaymentService
  +-- NotificationService
```

Checkout não é PaymentService.

Ele utiliza PaymentService.

---

## 10.8 Como aparece no Beach Tennis Manager?

Podemos imaginar um caso de uso como:

```text
RegistrarAusencia
├── EnrollmentRepository
├── LessonRepository
├── MakeupCreditRepository
└── RulesProvider
```

Isso é um exemplo conceitual de composição de dependências.

A arquitetura final determinará exatamente quais componentes existirão.

---

# 11. Como os conceitos se conectam

Agora podemos juntar as ideias.

```text
Estado
  |
  v
representa a situação atual
  |
  v
Comportamento
  |
  v
define operações sobre essa situação
  |
  v
Responsabilidade
  |
  v
define quem deve realizar cada operação
  |
  v
Coesão
  |
  v
mantém responsabilidades relacionadas juntas
  |
  v
Dependência
  |
  v
define colaboração entre partes
  |
  v
Acoplamento
  |
  v
permite analisar o quanto essas partes estão ligadas
  |
  v
Abstração
  |
  v
controla o conhecimento necessário entre as partes
  |
  v
Encapsulamento
  |
  v
protege estado e regras internas
  |
  v
Composição
  |
  v
combina partes menores para formar comportamentos maiores
```

Essa sequência não é uma receita rígida.

É uma forma de organizar o raciocínio.

---

# 12. Aplicação integrada no Beach Tennis Manager

Considere uma situação:

> Um aluno possui uma matrícula em uma turma e falta a uma aula.

A aplicação precisa analisar:

```text
Qual matrícula?
Qual aula?
Qual professor?
O ciclo está aberto?
Houve aviso?
O aviso respeitou o prazo configurado?
O limite de reposições foi atingido?
A ausência gera crédito?
```

Observe quantos conceitos aparecem.

## Estado

Precisamos conhecer:

```text
estado da matrícula
estado do ciclo
estado da aula
estado do crédito
```

## Comportamento

Precisamos executar algo como:

```text
registrar ausência
```

## Responsabilidade

Precisamos decidir:

```text
quem aplica a regra?
```

## Coesão

Precisamos evitar colocar:

```text
regra de ausência
geração de PDF
envio de WhatsApp
persistência
```

na mesma unidade sem justificativa.

## Dependência

O comportamento pode precisar consultar:

```text
matrícula
aula
ciclo
configuração
```

## Acoplamento

Precisamos controlar quanto esse comportamento conhece das implementações concretas.

## Abstração

Podemos criar limites para infraestrutura ou serviços externos quando houver uma justificativa.

## Encapsulamento

Regras importantes não devem ser facilmente quebradas por alterações arbitrárias.

## Composição

O comportamento pode ser construído utilizando componentes menores.

---

# 13. Exercícios

## Exercício 1 — Estado

Considere:

```ts
class Aluno {
  nome: string;
  ativo: boolean;
  faltas: number;
  creditosReposicao: number;
}
```

Responda:

1. O que representa o estado?
2. Quais valores podem ser inválidos?
3. Quais invariantes poderiam existir?
4. Quais eventos poderiam alterar esse estado?

---

## Exercício 2 — Comportamento

Considere:

```ts
class Turma {
  alunos: Aluno[] = [];
}
```

Quais comportamentos deveriam existir para controlar corretamente:

```text
adicionar aluno
remover aluno
verificar vaga
```

Explique primeiro a responsabilidade de cada comportamento antes de escrever código.

---

## Exercício 3 — Responsabilidade

Considere:

```ts
class Sistema {
  registrarAusencia() {}
  enviarWhatsApp() {}
  salvarNoBanco() {}
  gerarRelatorioFinanceiro() {}
  calcularCiclo() {}
}
```

Identifique as responsabilidades existentes.

Depois proponha uma possível divisão.

Não existe necessariamente uma única resposta correta.

Explique seu raciocínio.

---

## Exercício 4 — Coesão

Compare:

```ts
class Turma {
  adicionarAluno() {}
  removerAluno() {}
  possuiVaga() {}
}
```

com:

```ts
class Sistema {
  adicionarAluno() {}
  removerAluno() {}
  enviarWhatsApp() {}
  gerarPdf() {}
  fazerBackup() {}
}
```

Explique:

1. qual possui maior coesão;
2. por quê;
3. quais responsabilidades poderiam ser separadas.

---

## Exercício 5 — Acoplamento

Considere:

```ts
class NotificationService {
  private whatsapp = new WhatsAppProvider();

  enviar(message: string) {
    return this.whatsapp.send(message);
  }
}
```

Responda:

1. Qual é a dependência?
2. Onde está o acoplamento?
3. O que aconteceria se o provedor mudasse?
4. Uma abstração ajudaria?
5. Qual seria o custo de introduzir essa abstração?

---

## Exercício 6 — Encapsulamento

Considere:

```ts
class Turma {
  alunos: Aluno[] = [];
}
```

Explique:

1. qual estado está exposto;
2. qual regra pode ser quebrada;
3. como o encapsulamento ajudaria;
4. se `private` sozinho resolve o problema.

---

## Exercício 7 — Composição

Imagine um caso de uso:

```text
RegistrarPagamento
```

Quais componentes ele poderia precisar utilizar?

Liste possíveis dependências e explique a responsabilidade de cada uma.

---

# 14. Perguntas de entrevista

## 14.1 Estado

### O que é estado?

Estado é o conjunto de informações que representa a situação atual de uma entidade, objeto, processo ou sistema em determinado momento.

### Qual a diferença entre estado e variável?

Uma variável é um mecanismo para armazenar um valor. Estado representa uma situação, normalmente composta por uma ou mais informações relacionadas.

### O que é uma transição de estado?

É a mudança de uma situação para outra provocada por um evento ou comportamento, respeitando as regras aplicáveis.

---

## 14.2 Comportamento

### O que é comportamento?

É aquilo que uma entidade, objeto ou componente é capaz de fazer.

### Todo comportamento precisa pertencer a uma classe?

Não.

Funções independentes podem representar comportamentos muito bem quando não existe necessidade de estado ou identidade de objeto.

---

## 14.3 Responsabilidade

### O que significa responsabilidade em design de software?

É aquilo pelo qual determinada parte do sistema deve responder.

Uma pergunta útil é:

> Quem deveria fazer isso?

### Uma classe deve possuir apenas uma responsabilidade?

A frase pode ser enganosa.

O objetivo não é contar responsabilidades numericamente.

O objetivo é manter responsabilidades relacionadas e coerentes.

---

## 14.4 Coesão

### O que é coesão?

É o grau de relacionamento entre as responsabilidades agrupadas em uma unidade de software.

### Classes pequenas possuem necessariamente alta coesão?

Não.

Tamanho e coesão são conceitos diferentes.

---

## 14.5 Acoplamento

### O que é acoplamento?

É o grau de dependência entre partes de um sistema.

### Acoplamento é sempre ruim?

Não.

Sistemas reais precisam de dependências.

O objetivo é evitar dependências desnecessárias e controlar as necessárias.

### Como reduzir acoplamento?

Algumas estratégias possíveis incluem:

- abstrações;
- composição;
- separação de responsabilidades;
- inversão de dependências;
- isolamento de infraestrutura.

A estratégia adequada depende do problema.

---

## 14.6 Dependência

### O que é uma dependência?

É uma relação em que uma parte do software precisa de outra para realizar determinada tarefa.

### Qual a diferença entre depender de uma implementação e depender de uma abstração?

Ao depender diretamente de uma implementação, o consumidor conhece detalhes específicos daquela implementação.

Ao depender de uma abstração, o consumidor conhece apenas o contrato necessário para realizar seu trabalho.

---

## 14.7 Abstração

### Abstração e interface são a mesma coisa?

Não.

Interface é um mecanismo da linguagem que pode ser utilizado para expressar contratos.

Abstração é um conceito mais amplo de modelar algo através dos aspectos relevantes e esconder detalhes desnecessários.

---

## 14.8 Encapsulamento

### Encapsulamento é apenas colocar propriedades como `private`?

Não.

`private` é uma ferramenta.

Encapsulamento como princípio envolve controlar o acesso ao estado e aos detalhes internos, especialmente para proteger regras e invariantes.

---

## 14.9 Composição

### O que é composição?

É a construção de estruturas maiores utilizando objetos ou componentes menores que colaboram entre si.

### Composição é sempre melhor que herança?

Não.

São mecanismos diferentes e possuem contextos diferentes.

A composição é frequentemente útil quando queremos combinar comportamentos sem criar uma hierarquia rígida, mas isso não significa que herança seja sempre inadequada.

---

# 15. Checklist de domínio

Antes de considerar este módulo dominado, você deveria conseguir explicar com suas próprias palavras:

### Estado

- [ ] O que é estado?
- [ ] Por que sistemas precisam representar estado?
- [ ] O que é uma transição?
- [ ] O que é uma invariante?
- [ ] Qual a diferença entre estado e variável?

### Comportamento

- [ ] O que é comportamento?
- [ ] Como comportamento pode modificar estado?
- [ ] Quando uma função simples é suficiente?

### Responsabilidade

- [ ] O que é responsabilidade?
- [ ] Como decidir quem deve executar uma regra?
- [ ] Como identificar responsabilidades mal distribuídas?

### Coesão

- [ ] O que é coesão?
- [ ] O que caracteriza alta coesão?
- [ ] O que caracteriza baixa coesão?
- [ ] Por que tamanho de classe não determina coesão?

### Acoplamento

- [ ] O que é acoplamento?
- [ ] Por que ele existe?
- [ ] Por que não devemos tentar eliminá-lo completamente?
- [ ] Como identificar uma dependência problemática?
- [ ] Como abstração pode alterar a forma do acoplamento?

### Dependência

- [ ] O que é uma dependência?
- [ ] Qual a diferença entre dependência concreta e abstrata?
- [ ] Por que a direção das dependências importa?

### Abstração

- [ ] O que é abstração?
- [ ] Qual problema ela resolve?
- [ ] Qual o custo de uma abstração?
- [ ] Quando uma abstração pode ser desnecessária?

### Encapsulamento

- [ ] O que é encapsulamento?
- [ ] Como ele protege invariantes?
- [ ] Por que `private` sozinho não representa todo o conceito?

### Composição

- [ ] O que é composição?
- [ ] Como ela se diferencia de herança?
- [ ] Quando composição pode simplificar o design?
- [ ] Quando composição pode gerar complexidade desnecessária?

### Integração dos conceitos

- [ ] Consigo explicar como estado e comportamento se relacionam?
- [ ] Consigo explicar como responsabilidade leva à coesão?
- [ ] Consigo explicar a diferença entre dependência e acoplamento?
- [ ] Consigo explicar como abstração pode controlar acoplamento?
- [ ] Consigo explicar como encapsulamento protege estado?
- [ ] Consigo explicar como composição utiliza dependências?
- [ ] Consigo identificar esses conceitos em código real?
- [ ] Consigo relacioná-los ao Beach Tennis Manager?
- [ ] Consigo defender minhas decisões em uma entrevista técnica?

---

# Conclusão

Os nove conceitos estudados neste módulo não são regras isoladas.

Eles formam uma base para raciocinar sobre design de software:

```text
Estado
    ↓
Comportamento
    ↓
Responsabilidade
    ↓
Coesão
    ↓
Dependência
    ↓
Acoplamento
    ↓
Abstração
    ↓
Encapsulamento
    ↓
Composição
```

O objetivo é chegar a uma situação em que, ao analisar um código, você consiga fazer perguntas como:

> Qual estado este objeto representa?

> Quem é responsável por alterá-lo?

> Quais regras precisam ser preservadas?

> As responsabilidades estão relacionadas?

> Quem depende de quem?

> Essa dependência é necessária?

> Se essa implementação mudar, quantas partes serão afetadas?

> Existe uma abstração que realmente isole uma complexidade?

> O estado pode ser alterado de maneira inválida?

> Podemos compor componentes menores em vez de concentrar tudo em uma estrutura?

Essas perguntas serão a base para os próximos módulos.

A partir daqui, conceitos como Orientação a Objetos, SOLID, Injeção de Dependência, Design Patterns e Arquitetura deixam de ser assuntos isolados e passam a ser respostas para problemas que já conseguimos identificar.
