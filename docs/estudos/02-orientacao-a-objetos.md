# 02 — Orientação a Objetos

> Material de estudo do Beach Tennis Manager.
>
> Este documento aprofunda Orientação a Objetos (OO), conectando os conceitos com os fundamentos estudados anteriormente: estado, comportamento, responsabilidade, coesão, acoplamento, dependência, abstração, encapsulamento e composição.
>
> O objetivo não é decorar os quatro pilares de OO. É entender por que eles existem, quais problemas resolvem, quando fazem sentido e como tomar decisões de design usando esses conceitos.

---

## Sumário

1. [Como estudar este documento](#1-como-estudar-este-documento)
2. [O que é Orientação a Objetos](#2-o-que-é-orientação-a-objetos)
3. [Classe](#3-classe)
4. [Objeto](#4-objeto)
5. [Atributos e estado](#5-atributos-e-estado)
6. [Métodos e comportamento](#6-métodos-e-comportamento)
7. [Identidade](#7-identidade)
8. [Encapsulamento](#8-encapsulamento)
9. [Abstração](#9-abstração)
10. [Herança](#10-herança)
11. [Polimorfismo](#11-polimorfismo)
12. [Classe abstrata](#12-classe-abstrata)
13. [Interface](#13-interface)
14. [Classe abstrata × interface](#14-classe-abstrata--interface)
15. [Composição × herança](#15-composição--herança)
16. [Objetos anêmicos](#16-objetos-anêmicos)
17. [Quando usar Orientação a Objetos](#17-quando-usar-orientação-a-objetos)
18. [Quando evitar](#18-quando-evitar)
19. [Erros comuns](#19-erros-comuns)
20. [Código ruim → análise → refatoração](#20-código-ruim--análise--refatoração)
21. [Testes](#21-testes)
22. [Aplicação integrada no Beach Tennis Manager](#22-aplicação-integrada-no-beach-tennis-manager)
23. [Exercícios](#23-exercícios)
24. [Perguntas de entrevista](#24-perguntas-de-entrevista)
25. [Perguntas de aprofundamento](#25-perguntas-de-aprofundamento)
26. [Checklist de domínio](#26-checklist-de-domínio)

---

# 1. Como estudar este documento

Orientação a Objetos costuma ser ensinada através de quatro palavras:

```text
Encapsulamento
Herança
Polimorfismo
Abstração
```

Isso é útil como resumo, mas insuficiente para desenvolver bom design.

Antes desses conceitos, precisamos entender:

```text
Classe
Objeto
Estado
Comportamento
Responsabilidade
Identidade
```

E precisamos relacioná-los com:

```text
Coesão
Acoplamento
Dependência
Composição
```

Portanto, não tente decorar os quatro pilares isoladamente.

A pergunta mais importante é:

> **Que problema de design estou tentando resolver?**

---

# 2. O que é Orientação a Objetos?

## 2.1 O que é?

Orientação a Objetos é uma forma de estruturar software em torno de objetos que representam conceitos, responsabilidades e comportamentos do sistema.

Um objeto pode possuir:

```text
estado
+
comportamento
+
identidade
```

Por exemplo, em um sistema de gestão:

```text
Aluno
Turma
Matrícula
Aula
Ciclo
Pagamento
```

podem ser representados por objetos ou estruturas relacionadas a esses conceitos.

---

## 2.2 Por que existe?

OO surgiu, entre outros motivos, como uma forma de lidar com sistemas grandes e complexos organizando dados e comportamentos relacionados.

Um problema comum em sistemas mal estruturados é:

```text
dados espalhados
+
funções espalhadas
+
regras duplicadas
+
dependências difíceis de controlar
```

OO oferece mecanismos para agrupar responsabilidades e estabelecer fronteiras.

---

## 2.3 Qual problema resolve?

OO pode ajudar a:

- organizar responsabilidades;
- encapsular regras;
- representar conceitos do domínio;
- controlar mudanças de estado;
- reduzir duplicação;
- facilitar substituição de implementações;
- criar estruturas colaborativas.

Mas OO não resolve automaticamente esses problemas.

É possível escrever código orientado a objetos extremamente acoplado e difícil de manter.

---

## 2.4 Como funciona?

Um sistema OO pode ser visto como objetos colaborando:

```text
Objeto A
   |
   v
Objeto B
   |
   v
Objeto C
```

Cada objeto possui determinadas responsabilidades.

Por exemplo:

```text
RegistrarAusencia
       |
       v
Matrícula
       |
       v
Ciclo
```

A arquitetura real pode utilizar casos de uso, serviços, entidades e repositórios. OO é uma ferramenta de modelagem, não uma arquitetura completa.

---

## 2.5 Quando eu usaria?

OO costuma ser útil quando o problema possui:

- conceitos com identidade;
- estado que muda;
- regras associadas ao estado;
- comportamentos relacionados;
- relações entre diferentes conceitos;
- necessidade de proteger invariantes.

---

## 2.6 Quando eu evitaria?

OO não precisa ser usada em tudo.

Uma transformação simples pode ser melhor representada por uma função:

```ts
function calcularTotal(valores: number[]) {
  return valores.reduce((total, valor) => total + valor, 0);
}
```

Não existe benefício automático em criar:

```ts
class CalculadoraDeTotal {
  calcular() {}
}
```

apenas para "seguir OO".

---

## 2.7 Exemplo

Uma entidade conceitual:

```ts
class Turma {
  constructor(
    public readonly id: string,
    public readonly capacidade: number,
  ) {}
}
```

Isso representa uma classe que possui dados.

Podemos evoluí-la para representar também comportamento:

```ts
class Turma {
  private alunos: string[] = [];

  constructor(
    public readonly id: string,
    private readonly capacidade: number,
  ) {}

  possuiVaga() {
    return this.alunos.length < this.capacidade;
  }

  adicionarAluno(alunoId: string) {
    if (!this.possuiVaga()) {
      throw new Error("Turma sem vaga");
    }

    this.alunos.push(alunoId);
  }
}
```

Agora a estrutura controla uma regra relacionada ao próprio estado.

---

## 2.8 Como aparece no Beach Tennis Manager?

OO pode ajudar a representar conceitos como:

```text
Aluno
Professor
Turma
Matrícula
Aula
Ciclo
Crédito de reposição
Pagamento
```

Mas isso não significa que cada conceito necessariamente precisa virar uma classe rica.

A modelagem será definida de acordo com as regras e responsabilidades reais.

---

# 3. Classe

## 3.1 O que é?

Classe é uma definição que descreve a estrutura e os comportamentos que objetos daquele tipo podem possuir.

Exemplo:

```ts
class Aluno {
  constructor(
    public nome: string,
  ) {}

  apresentar() {
    return `Aluno: ${this.nome}`;
  }
}
```

A classe é a definição.

O objeto será uma instância dessa definição.

---

## 3.2 Por que existe?

Classes permitem representar uma estrutura comum para múltiplos objetos.

Em vez de repetir:

```text
nome
ativo
cpf
```

e comportamentos para cada aluno individualmente, podemos definir uma estrutura:

```text
Aluno
```

e criar várias instâncias.

---

## 3.3 Qual problema resolve?

Classes podem ajudar com:

- reutilização de estrutura;
- organização de comportamento;
- encapsulamento;
- criação de múltiplas instâncias;
- modelagem de conceitos.

---

## 3.4 Como funciona?

Exemplo:

```ts
class Aluno {
  constructor(
    public nome: string,
  ) {}
}
```

Podemos criar:

```ts
const joao = new Aluno("João");
const maria = new Aluno("Maria");
```

Temos duas instâncias da mesma classe.

---

## 3.5 Quando eu usaria?

Classes são úteis quando precisamos representar:

- entidades;
- objetos com identidade;
- objetos com estado e comportamento;
- componentes que precisam manter invariantes;
- serviços ou adaptadores, dependendo da arquitetura.

---

## 3.6 Quando eu evitaria?

Evite criar classes apenas porque a linguagem permite.

Se temos:

```ts
type Endereco = {
  rua: string;
  numero: number;
};
```

e não existe comportamento ou identidade relevante, um tipo simples pode ser mais apropriado.

---

## 3.7 Exemplo

```ts
class Aluno {
  constructor(
    public readonly id: string,
    public nome: string,
  ) {}
}
```

Uso:

```ts
const aluno = new Aluno("1", "João");
```

---

## 3.8 Como aparece no Beach Tennis Manager?

Uma classe pode representar um conceito de domínio quando existir uma boa razão para encapsular:

```text
estado
+
comportamento
+
regras
```

Por exemplo, um `Ciclo` pode futuramente possuir comportamentos relacionados à sua evolução.

Não devemos decidir isso apenas pelo nome do conceito. Precisamos analisar suas regras.

---

# 4. Objeto

## 4.1 O que é?

Objeto é uma instância concreta de uma classe ou, de forma mais ampla, uma estrutura que encapsula dados e/ou comportamento.

Exemplo:

```ts
class Aluno {
  constructor(
    public nome: string,
  ) {}
}

const aluno = new Aluno("João");
```

Aqui:

```text
Aluno = classe
aluno = objeto
```

---

## 4.2 Por que existe?

Porque uma definição abstrata não representa uma entidade concreta.

A classe diz:

```text
Como um Aluno pode ser estruturado?
```

O objeto representa:

```text
Este aluno específico.
```

---

## 4.3 Qual problema resolve?

Objetos permitem representar múltiplas instâncias independentes.

```ts
const joao = new Aluno("João");
const maria = new Aluno("Maria");
```

Os dois seguem a mesma estrutura, mas possuem estados diferentes.

---

## 4.4 Como funciona?

Cada objeto possui sua própria identidade e, quando possui estado mutável, seu próprio estado.

```ts
joao.nome = "João";
maria.nome = "Maria";
```

Alterar um não deveria alterar automaticamente o outro.

---

## 4.5 Quando eu usaria?

Objetos são úteis para representar:

- entidades;
- valores;
- serviços;
- componentes;
- colaboradores.

---

## 4.6 Quando eu evitaria?

Não faz sentido criar objetos complexos quando uma estrutura simples de dados ou uma função resolve o problema com mais clareza.

---

## 4.7 Exemplo

```ts
class Turma {
  constructor(
    public readonly id: string,
  ) {}
}

const turmaA = new Turma("turma-a");
const turmaB = new Turma("turma-b");
```

São dois objetos diferentes.

---

## 4.8 Como aparece no Beach Tennis Manager?

Podemos ter:

```text
Aluno João
Aluno Maria

Turma terça 19h
Turma quinta 19h
```

Mesmo pertencendo ao mesmo tipo conceitual, cada objeto representa uma instância específica.

---

# 5. Atributos e estado

## 5.1 O que é?

Atributos são informações associadas a um objeto.

Exemplo:

```ts
class Aluno {
  constructor(
    public nome: string,
    public ativo: boolean,
  ) {}
}
```

Os atributos são:

```text
nome
ativo
```

O conjunto de valores desses atributos forma parte do estado do objeto.

---

## 5.2 Por que existe?

Porque objetos precisam representar informações sobre sua situação.

---

## 5.3 Qual problema resolve?

Permite armazenar informações necessárias para:

- tomar decisões;
- executar comportamentos;
- identificar objetos;
- representar regras.

---

## 5.4 Como funciona?

```ts
const aluno = new Aluno("João", true);
```

Estado:

```text
nome = João
ativo = true
```

---

## 5.5 Quando eu usaria?

Sempre que um objeto precisar manter informações relevantes para sua responsabilidade.

---

## 5.6 Quando eu evitaria?

Evite atributos que:

- não possuem significado;
- duplicam informações;
- podem ser calculados;
- pertencem a outra responsabilidade.

---

## 5.7 Exemplo

```ts
class Ciclo {
  constructor(
    public readonly id: string,
    private aulasRealizadas: number,
  ) {}

  quantidadeDeAulasRealizadas() {
    return this.aulasRealizadas;
  }
}
```

---

## 5.8 Como aparece no Beach Tennis Manager?

Um ciclo pode possuir informações como:

```text
id
matrícula
estado
quantidade de aulas efetivamente realizadas
valor histórico
```

A modelagem final depende das regras do domínio e do modelo persistido.

---

# 6. Métodos e comportamento

## 6.1 O que é?

Método é uma função associada a uma classe ou objeto.

Em OO, métodos frequentemente representam comportamentos.

```ts
class Aluno {
  ativar() {
    // ...
  }
}
```

---

## 6.2 Por que existe?

Para associar operações às responsabilidades do objeto quando isso melhora o design.

---

## 6.3 Qual problema resolve?

Métodos podem concentrar regras junto ao estado que elas protegem.

Exemplo:

```ts
class Turma {
  private alunos: string[] = [];

  adicionarAluno(alunoId: string) {
    if (this.alunos.length >= 4) {
      throw new Error("Turma sem vaga");
    }

    this.alunos.push(alunoId);
  }
}
```

A regra da capacidade está próxima do estado que ela protege.

---

## 6.4 Como funciona?

Um método pode:

```text
receber dados
    ↓
validar
    ↓
consultar estado
    ↓
aplicar regra
    ↓
alterar estado
    ↓
retornar resultado
```

---

## 6.5 Quando eu usaria?

Quando o comportamento pertence claramente à responsabilidade do objeto.

---

## 6.6 Quando eu evitaria?

Não coloque uma função em uma classe apenas para "ter método".

Se a operação não depende do estado ou responsabilidade daquele objeto, uma função independente pode ser mais clara.

---

## 6.7 Exemplo

```ts
class Turma {
  private alunos: string[] = [];

  possuiVaga(capacidade: number) {
    return this.alunos.length < capacidade;
  }
}
```

---

## 6.8 Como aparece no Beach Tennis Manager?

Comportamentos podem representar regras do domínio, por exemplo:

```text
verificar se existe vaga
registrar uma operação permitida
utilizar um crédito
```

A localização exata da regra dependerá da modelagem.

---

# 7. Identidade

## 7.1 O que é?

Identidade é aquilo que permite distinguir uma instância específica de outra.

Considere:

```text
Aluno João
Aluno João
```

Os dois podem ter o mesmo nome, mas ainda serem pessoas diferentes.

Por isso, o sistema precisa de uma identidade própria.

---

## 7.2 Por que existe?

Porque igualdade de dados não significa necessariamente identidade.

Dois alunos podem possuir:

```text
mesmo nome
```

sem serem o mesmo aluno.

---

## 7.3 Qual problema resolve?

Identidade permite:

- referenciar uma entidade;
- atualizar a entidade correta;
- relacionar registros;
- manter histórico.

---

## 7.4 Como funciona?

No sistema, uma entidade pode possuir um UUID:

```ts
type Aluno = {
  id: string;
  nome: string;
};
```

Exemplo:

```text
id = 550e8400-e29b-41d4-a716-446655440000
nome = João
```

No Beach Tennis Manager, o CPF possui uma função importante de unicidade para evitar duplicação de aluno, mas isso não significa que CPF deva ser utilizado como chave técnica primária.

A identidade técnica da entidade continua sendo independente.

---

## 7.5 Quando eu usaria?

Sempre que uma entidade precisar ser distinguida de outras instâncias.

Especialmente em:

- bancos de dados;
- relacionamentos;
- APIs;
- histórico;
- auditoria.

---

## 7.6 Quando eu evitaria?

O conceito de identidade é especialmente importante para entidades.

Nem todo objeto precisa de identidade própria.

Um objeto de valor, por exemplo, pode ser comparado pelos seus valores.

---

## 7.7 Exemplo

```ts
const alunoA = {
  id: "1",
  nome: "João",
};

const alunoB = {
  id: "2",
  nome: "João",
};
```

Mesmo nome.

Identidades diferentes.

---

## 7.8 Como aparece no Beach Tennis Manager?

O aluno possui uma identidade própria.

A matrícula representa uma relação específica envolvendo o aluno e o contexto de ensino.

Essa distinção é importante porque o mesmo aluno pode possuir mais de uma matrícula.

---

# 8. Encapsulamento

## 8.1 O que é?

Encapsulamento é o controle sobre o estado e os detalhes internos de um objeto.

Em vez de permitir:

```ts
objeto.estado = qualquerCoisa;
```

podemos permitir apenas operações válidas.

---

## 8.2 Por que existe?

Para proteger invariantes e reduzir conhecimento indevido sobre a implementação.

---

## 8.3 Qual problema resolve?

Ajuda a evitar que qualquer parte do sistema altere o estado de forma inválida.

---

## 8.4 Como funciona?

```ts
class Ciclo {
  private aulasRealizadas = 0;

  registrarAula() {
    if (this.aulasRealizadas >= 4) {
      throw new Error("Ciclo já possui quatro aulas");
    }

    this.aulasRealizadas++;
  }
}
```

O código externo não altera diretamente:

```ts
ciclo.aulasRealizadas = 999;
```

---

## 8.5 Quando eu usaria?

Quando existem:

- regras de alteração;
- invariantes;
- estado sensível;
- detalhes internos que podem mudar.

---

## 8.6 Quando eu evitaria?

Se o objeto for apenas uma estrutura de transporte de dados, encapsulamento comportamental pode adicionar complexidade desnecessária.

---

## 8.7 Exemplo

Ruim:

```ts
class Ciclo {
  public aulasRealizadas = 0;
}
```

Melhor quando existe regra:

```ts
class Ciclo {
  private aulasRealizadas = 0;

  registrarAula() {
    // regra
  }
}
```

---

## 8.8 Como aparece no Beach Tennis Manager?

O conceito é especialmente relevante em regras que precisam impedir alterações arbitrárias.

Por exemplo:

```text
contagem de aulas efetivamente utilizadas
créditos
estado de ciclo
```

Não devemos permitir que uma camada altere esses valores ignorando as regras do domínio.

---

# 9. Abstração

## 9.1 O que é?

Abstração é representar um conceito através dos aspectos relevantes para o contexto, escondendo detalhes que não precisam ser conhecidos pelo consumidor.

---

## 9.2 Por que existe?

Para controlar complexidade e reduzir conhecimento desnecessário.

---

## 9.3 Qual problema resolve?

Evita que consumidores precisem conhecer detalhes internos de uma implementação.

---

## 9.4 Como funciona?

Uma interface pode expressar uma abstração:

```ts
interface NotificationProvider {
  send(message: string): Promise<void>;
}
```

O consumidor conhece:

```text
send()
```

mas não precisa conhecer todos os detalhes de uma API externa.

---

## 9.5 Quando eu usaria?

Quando existe uma fronteira relevante ou uma complexidade que precisa ser isolada.

---

## 9.6 Quando eu evitaria?

Quando a abstração não protege nenhuma complexidade relevante.

Interfaces criadas apenas para cumprir uma regra dogmática podem piorar o design.

---

## 9.7 Exemplo

```ts
interface PaymentGateway {
  pay(value: number): Promise<void>;
}
```

Implementações:

```ts
class PixGateway implements PaymentGateway {
  async pay(value: number) {
    // ...
  }
}
```

---

## 9.8 Como aparece no Beach Tennis Manager?

Integrações futuras, como notificações ou pagamentos, podem possuir abstrações para impedir que regras de negócio dependam diretamente de detalhes externos.

---

# 10. Herança

## 10.1 O que é?

Herança é um mecanismo pelo qual uma classe deriva de outra, reutilizando ou especializando sua estrutura e comportamento.

Exemplo:

```ts
class Animal {
  comer() {
    // ...
  }
}

class Cachorro extends Animal {
  latir() {
    // ...
  }
}
```

`Cachorro` herda de `Animal`.

---

## 10.2 Por que existe?

Herança pode representar relações hierárquicas quando existe uma verdadeira relação de especialização.

Ela também permite reutilização de implementação.

---

## 10.3 Qual problema resolve?

Pode resolver:

- compartilhamento de comportamento;
- especialização;
- polimorfismo através de uma hierarquia;
- modelagem de relações "é um".

---

## 10.4 Como funciona?

```ts
class Funcionario {
  trabalhar() {
    return "trabalhando";
  }
}

class Professor extends Funcionario {
  darAula() {
    return "dando aula";
  }
}
```

`Professor` herda `trabalhar()`.

---

## 10.5 Quando eu usaria?

Quando existe uma relação conceitual forte de especialização e a substituição entre tipos faz sentido.

Pergunta útil:

> Um objeto do tipo filho pode ser utilizado onde o tipo pai é esperado sem quebrar as expectativas?

Essa pergunta será aprofundada quando estudarmos SOLID e o Princípio da Substituição de Liskov.

---

## 10.6 Quando eu evitaria?

Evite herança quando ela estiver sendo usada apenas para reutilizar código.

Por exemplo:

```text
ClasseA
   ↑
ClasseB
```

apenas porque B quer dois métodos de A.

Composição frequentemente oferece uma relação mais flexível.

---

## 10.7 Exemplo

Herança coerente:

```ts
class Animal {
  respirar() {}
}

class Cachorro extends Animal {
  latir() {}
}
```

Herança questionável:

```ts
class Relatorio extends Arquivo {
  // apenas porque precisa reutilizar salvar()
}
```

Nesse segundo caso, pode não existir uma relação conceitual de especialização.

---

## 10.8 Como aparece no Beach Tennis Manager?

Herança não deve ser introduzida apenas porque temos:

```text
Professor
Admin
```

O fato de ambos serem usuários não determina automaticamente que uma hierarquia de classes seja a melhor modelagem.

O sistema já possui papéis:

```text
PROFESSOR
ADMIN
```

e a autorização é uma preocupação própria.

A decisão entre classes, tipos, composição e outras estratégias deve ser baseada no comportamento real.

---

# 11. Polimorfismo

## 11.1 O que é?

Polimorfismo significa permitir que diferentes tipos sejam tratados através de uma interface comum, enquanto cada implementação fornece seu próprio comportamento.

A ideia central é:

```text
mesmo contrato
+
comportamentos diferentes
```

---

## 11.2 Por que existe?

Para permitir que o código consumidor trabalhe com uma abstração sem precisar conhecer cada implementação concreta.

---

## 11.3 Qual problema resolve?

Polimorfismo ajuda a evitar condicionais espalhadas como:

```ts
if (tipo === "pix") {
  // ...
} else if (tipo === "cartao") {
  // ...
}
```

quando existem comportamentos que podem ser representados por um contrato comum.

---

## 11.4 Como funciona?

```ts
interface PaymentGateway {
  pay(value: number): Promise<void>;
}

class PixGateway implements PaymentGateway {
  async pay(value: number) {
    console.log("Pagando com Pix");
  }
}

class CardGateway implements PaymentGateway {
  async pay(value: number) {
    console.log("Pagando com cartão");
  }
}
```

O consumidor pode depender de:

```ts
PaymentGateway
```

sem precisar conhecer a classe concreta.

---

## 11.5 Quando eu usaria?

Quando:

- existem implementações diferentes;
- existe um contrato comum real;
- o consumidor não precisa conhecer os detalhes;
- a variação faz parte do problema.

---

## 11.6 Quando eu evitaria?

Não crie polimorfismo apenas para eliminar um `if`.

Se existem apenas duas condições simples e estáveis, um `if` pode ser mais claro.

Polimorfismo tem custo de abstração.

---

## 11.7 Exemplo

```ts
async function processarPagamento(
  gateway: PaymentGateway,
  valor: number,
) {
  await gateway.pay(valor);
}
```

Podemos fornecer:

```ts
new PixGateway()
```

ou:

```ts
new CardGateway()
```

O método consumidor não precisa mudar.

---

## 11.8 Como aparece no Beach Tennis Manager?

Uma futura integração pode possuir diferentes provedores:

```text
NotificationProvider
   ├── WhatsAppProvider
   └── OutroProvider
```

O caso de uso depende do contrato.

Isso permite substituir a implementação sem alterar necessariamente a regra principal.

---

# 12. Classe abstrata

## 12.1 O que é?

Classe abstrata é uma classe que serve como base para outras classes e que não pode ser instanciada diretamente.

Ela pode conter:

- estado;
- implementação;
- métodos concretos;
- métodos abstratos.

---

## 12.2 Por que existe?

Quando queremos compartilhar uma estrutura ou implementação entre uma família de classes, mantendo pontos de especialização.

---

## 12.3 Qual problema resolve?

Pode reduzir duplicação dentro de uma hierarquia quando existe uma base conceitual realmente compartilhada.

---

## 12.4 Como funciona?

```ts
abstract class Notification {
  constructor(
    protected readonly recipient: string,
  ) {}

  abstract send(message: string): Promise<void>;

  log() {
    console.log("Enviando notificação");
  }
}
```

Uma classe concreta:

```ts
class WhatsAppNotification extends Notification {
  async send(message: string) {
    // implementação
  }
}
```

---

## 12.5 Quando eu usaria?

Quando:

- existe uma verdadeira hierarquia;
- existe comportamento compartilhado;
- subclasses realmente são especializações;
- parte da implementação pode ser centralizada.

---

## 12.6 Quando eu evitaria?

Evite quando a relação for apenas:

```text
preciso reutilizar código
```

Nesse cenário, composição pode ser mais apropriada.

---

## 12.7 Exemplo

```ts
abstract class Relatorio {
  abstract gerar(): string;

  salvar() {
    // comportamento comum
  }
}
```

---

## 12.8 Como aparece no Beach Tennis Manager?

Não existe atualmente uma necessidade documentada de criar uma hierarquia com classe abstrata no domínio principal.

Ela pode ser usada futuramente em infraestrutura ou integrações se surgir uma família real de comportamentos compartilhados.

---

# 13. Interface

## 13.1 O que é?

Interface é um contrato que descreve quais operações ou estrutura uma implementação deve fornecer.

Exemplo:

```ts
interface NotificationProvider {
  send(message: string): Promise<void>;
}
```

---

## 13.2 Por que existe?

Para estabelecer uma fronteira entre consumidor e implementação.

---

## 13.3 Qual problema resolve?

Pode ajudar a:

- desacoplar consumidor e implementação;
- permitir múltiplas implementações;
- facilitar substituição;
- tornar contratos explícitos;
- apoiar testes.

---

## 13.4 Como funciona?

```ts
interface PaymentGateway {
  pay(value: number): Promise<void>;
}
```

Implementação:

```ts
class PixGateway implements PaymentGateway {
  async pay(value: number) {
    // ...
  }
}
```

O consumidor pode depender de:

```ts
PaymentGateway
```

---

## 13.5 Quando eu usaria?

Use uma interface quando ela representar um contrato útil.

Especialmente em fronteiras como:

```text
domínio/aplicação ↔ infraestrutura
```

ou quando múltiplas implementações realmente existem.

---

## 13.6 Quando eu evitaria?

Evite criar interfaces para todas as classes automaticamente.

Exemplo:

```ts
interface AlunoService {
  criar(): void;
}

class AlunoServiceImpl implements AlunoService {
  criar() {}
}
```

Se existe uma única implementação e nenhuma fronteira relevante, isso pode ser apenas indireção.

---

## 13.7 Exemplo

```ts
interface StudentRepository {
  findById(id: string): Promise<Student | null>;
}
```

Implementação:

```ts
class DrizzleStudentRepository implements StudentRepository {
  async findById(id: string) {
    // consulta PostgreSQL através do Drizzle
  }
}
```

---

## 13.8 Como aparece no Beach Tennis Manager?

O projeto utiliza PostgreSQL e Drizzle.

Uma interface de repositório pode permitir que a regra de aplicação dependa de um contrato, enquanto a infraestrutura conhece Drizzle.

Isso será aprofundado nos módulos de Injeção de Dependência e Arquitetura.

---

# 14. Classe abstrata × interface

## 14.1 O que é?

São mecanismos diferentes para representar abstrações e contratos.

---

## 14.2 Por que existe essa distinção?

Porque precisamos escolher entre:

```text
contrato
```

e:

```text
base compartilhada com implementação
```

---

## 14.3 Qual problema resolve?

A distinção evita usar herança apenas para definir contratos.

---

## 14.4 Como funciona?

### Interface

Normalmente representa:

```text
O que deve ser oferecido?
```

```ts
interface PaymentGateway {
  pay(value: number): Promise<void>;
}
```

### Classe abstrata

Pode representar:

```text
O que é compartilhado entre uma família de classes?
```

```ts
abstract class PaymentProcessor {
  protected log() {}

  abstract process(): Promise<void>;
}
```

---

## 14.5 Quando eu usaria?

### Interface

Quando quero:

- contrato;
- desacoplamento;
- múltiplas implementações;
- fronteira entre componentes.

### Classe abstrata

Quando quero:

- hierarquia;
- comportamento compartilhado;
- estado compartilhado;
- pontos obrigatórios de especialização.

---

## 14.6 Quando eu evitaria?

Evite classe abstrata se não existe uma hierarquia verdadeira.

Evite interface se ela não estiver isolando nenhuma decisão ou contrato relevante.

---

## 14.7 Exemplo

```text
Interface
    |
    +---- PixGateway
    +---- CardGateway
```

Aqui diferentes implementações podem seguir o mesmo contrato.

Já:

```text
BaseNotification
    |
    +---- EmailNotification
    +---- SmsNotification
```

pode justificar uma classe abstrata se houver implementação realmente compartilhada.

---

## 14.8 Como aparece no Beach Tennis Manager?

Interfaces são candidatas naturais para fronteiras com:

```text
repositórios
serviços externos
provedores
```

Classes abstratas não são atualmente uma necessidade documentada do domínio principal.

---

# 15. Composição × herança

## 15.1 O que é?

Composição constrói um objeto utilizando outros objetos.

Herança cria uma relação hierárquica entre classes.

---

## 15.2 Por que essa escolha importa?

Porque a escolha afeta:

- acoplamento;
- flexibilidade;
- reutilização;
- substituição;
- entendimento do modelo.

---

## 15.3 Qual problema resolve?

A composição permite montar comportamentos:

```ts
class Service {
  constructor(
    private repository: Repository,
    private notifier: Notifier,
  ) {}
}
```

Herança permite especialização:

```ts
class Professor extends User {}
```

A segunda só deve existir se a relação fizer sentido no modelo.

---

## 15.4 Como funciona?

### Composição

```text
Service
├── Repository
└── Notifier
```

### Herança

```text
User
  ↑
Professor
```

---

## 15.5 Quando eu usaria?

### Composição

Quando um objeto:

```text
possui
utiliza
coordena
```

outro componente.

### Herança

Quando existe uma relação real de:

```text
é um
```

e a substituição é válida.

---

## 15.6 Quando eu evitaria?

Evite herança apenas para reaproveitar métodos.

Evite composição excessiva quando a solução ficar artificialmente fragmentada.

---

## 15.7 Exemplo

Composição:

```ts
class RegistrarPagamento {
  constructor(
    private repository: PaymentRepository,
  ) {}
}
```

Herança:

```ts
class Cachorro extends Animal {}
```

---

## 15.8 Como aparece no Beach Tennis Manager?

A arquitetura do projeto tende a utilizar composição para conectar:

```text
casos de uso
repositórios
provedores
serviços
```

Isso permite que cada componente possua uma responsabilidade mais específica.

---

# 16. Objetos anêmicos

## 16.1 O que é?

Um objeto anêmico é um objeto que contém principalmente dados, enquanto as regras e comportamentos relacionados a esses dados ficam espalhados em outros lugares.

Exemplo:

```ts
type Ciclo = {
  aulasRealizadas: number;
  status: string;
};
```

E em outro lugar:

```ts
function registrarAula(ciclo: Ciclo) {
  if (ciclo.aulasRealizadas >= 4) {
    throw new Error("Ciclo concluído");
  }

  ciclo.aulasRealizadas++;
}
```

O dado está em um lugar.

A regra está em outro.

---

## 16.2 Por que existe?

Porque nem todo objeto precisa possuir comportamento.

Além disso, aplicações CRUD e sistemas baseados em dados frequentemente começam com estruturas anêmicas.

O problema aparece quando regras importantes ficam espalhadas.

---

## 16.3 Qual problema resolve?

A discussão sobre objetos anêmicos ajuda a identificar quando regras deveriam estar mais próximas dos dados que protegem.

---

## 16.4 Como funciona?

Compare:

### Estrutura anêmica

```ts
type Ciclo = {
  aulasRealizadas: number;
};

function registrarAula(ciclo: Ciclo) {
  // regra externa
}
```

### Objeto com comportamento

```ts
class Ciclo {
  private aulasRealizadas = 0;

  registrarAula() {
    // regra próxima do estado
  }
}
```

A segunda abordagem pode melhorar encapsulamento.

Mas isso não significa que todo DTO deva virar uma entidade rica.

---

## 16.5 Quando eu usaria?

Um modelo mais comportamental pode fazer sentido quando:

- existem regras importantes;
- existem invariantes;
- o estado precisa ser protegido;
- os comportamentos pertencem claramente ao conceito.

---

## 16.6 Quando eu evitaria?

Objetos anêmicos podem ser perfeitamente apropriados para:

- DTOs;
- respostas HTTP;
- registros simples;
- dados de entrada;
- estruturas sem comportamento próprio.

DTO significa **Data Transfer Object**: um objeto utilizado principalmente para transportar dados entre partes do sistema.

---

## 16.7 Exemplo

Um DTO:

```ts
type CreateStudentInput = {
  name: string;
  cpf: string;
};
```

Não precisa necessariamente ser uma entidade rica.

Já uma entidade que protege regras de negócio pode precisar de comportamento.

---

## 16.8 Como aparece no Beach Tennis Manager?

O projeto terá diferentes tipos de objetos:

```text
DTO
Entidade
Modelo de persistência
Objeto de domínio
```

Eles não precisam ter a mesma estrutura nem a mesma responsabilidade.

Não devemos transformar todo objeto retornado pelo banco em uma entidade rica automaticamente.

---

# 17. Quando usar Orientação a Objetos

## 17.1 O que é?

Usar OO significa escolher objetos, classes, composição, encapsulamento e polimorfismo quando esses mecanismos ajudam a resolver o problema.

---

## 17.2 Por que existe?

Porque OO é uma ferramenta de design, não um objetivo.

---

## 17.3 Qual problema resolve?

Pode ser particularmente útil para problemas com:

```text
estado
+
regras
+
identidade
+
comportamentos
```

---

## 17.4 Como funciona?

Uma boa análise começa pelo domínio:

```text
Quais conceitos existem?
Quais possuem identidade?
Quais possuem regras?
Quais comportamentos existem?
Quem deve ser responsável por cada regra?
```

Depois escolhemos as estruturas.

---

## 17.5 Quando eu usaria?

Exemplos:

- domínio com regras complexas;
- entidades com invariantes;
- workflows;
- objetos que colaboram;
- sistemas onde encapsulamento agrega valor.

---

## 17.6 Quando eu evitaria?

Para:

- transformações simples;
- scripts pequenos;
- estruturas puramente declarativas;
- dados sem comportamento;
- operações onde funções tornam o código mais claro.

---

## 17.7 Exemplo

Uma função simples:

```ts
function calcularTotal(items: number[]) {
  return items.reduce((sum, item) => sum + item, 0);
}
```

Não precisa virar uma classe.

---

## 17.8 Como aparece no Beach Tennis Manager?

O projeto é suficientemente rico em regras para que conceitos OO sejam úteis.

Mas devemos utilizar OO onde ela melhora o design, não por obrigação.

---

# 18. Quando evitar Orientação a Objetos

## 18.1 O que é?

Evitar OO significa escolher uma solução mais simples quando objetos, classes e hierarquias não acrescentam valor.

---

## 18.2 Por que existe?

Porque abstração e orientação a objetos também possuem custo.

---

## 18.3 Qual problema resolve?

Evita:

- excesso de classes;
- hierarquias artificiais;
- indireção;
- boilerplate;
- abstrações desnecessárias.

---

## 18.4 Como funciona?

Antes de criar uma classe, pergunte:

```text
Existe estado?
Existe identidade?
Existe comportamento relacionado?
Existe regra a proteger?
Existe colaboração relevante?
```

Se todas as respostas forem "não", uma função ou estrutura simples pode ser melhor.

---

## 18.5 Quando eu usaria?

Use OO quando ela tornar o design mais claro.

---

## 18.6 Quando eu evitaria?

Evite criar:

```text
FactoryFactory
Manager
Helper
Utility
Service
```

sem uma responsabilidade clara apenas para encaixar tudo em classes.

---

## 18.7 Exemplo

Desnecessário:

```ts
class StringHelper {
  uppercase(value: string) {
    return value.toUpperCase();
  }
}
```

Mais simples:

```ts
value.toUpperCase();
```

---

## 18.8 Como aparece no Beach Tennis Manager?

Nem todo código do projeto será OO.

Por exemplo:

```text
mapeamento
validação simples
transformação de dados
formatação
```

podem ser funções.

Já regras complexas podem se beneficiar de objetos e composição.

---

# 19. Erros comuns

## 19.1 "Tudo precisa ser uma classe"

Não.

OO é uma ferramenta.

---

## 19.2 "Herança é melhor porque evita duplicação"

Evitar duplicação é apenas um dos fatores.

Herança cria uma relação estrutural forte.

Composição pode reutilizar comportamento com menos rigidez.

---

## 19.3 "Interface para toda classe"

Não.

Interfaces devem representar contratos úteis.

---

## 19.4 "Getter e setter significam encapsulamento"

Não necessariamente.

Isto:

```ts
get valor() {
  return this._valor;
}

set valor(v) {
  this._valor = v;
}
```

pode continuar permitindo qualquer alteração.

Encapsulamento verdadeiro envolve proteger regras.

---

## 19.5 "Classe grande é sempre ruim"

Não necessariamente.

O problema principal é responsabilidade, coesão e complexidade, não apenas número de linhas.

---

## 19.6 "Classe pequena é sempre boa"

Também não.

Criar dezenas de classes artificiais pode aumentar a complexidade.

---

## 19.7 "Polimorfismo elimina todos os ifs"

Não.

Condicionais simples são perfeitamente válidas.

---

## 19.8 "Domínio precisa conhecer banco"

Não é uma consequência de OO.

A arquitetura deve definir a direção das dependências.

---

# 20. Código ruim → análise → refatoração

Considere:

```ts
class CicloService {
  async registrarAula(ciclo: any) {
    if (ciclo.status === "FECHADO") {
      throw new Error("Ciclo fechado");
    }

    if (ciclo.aulasRealizadas >= 4) {
      ciclo.status = "FECHADO";
      throw new Error("Ciclo concluído");
    }

    ciclo.aulasRealizadas++;

    if (ciclo.aulasRealizadas === 4) {
      ciclo.status = "FECHADO";
    }
  }
}
```

O código pode funcionar.

Mas existem questões.

### Problema 1 — Estado exposto

```ts
ciclo.aulasRealizadas++
```

Qualquer código pode fazer algo semelhante.

### Problema 2 — Regra espalhada

Quem controla a validade do ciclo?

```text
CicloService
```

mas o estado pertence conceitualmente ao ciclo.

### Problema 3 — `any`

```ts
ciclo: any
```

remove boa parte da segurança do TypeScript.

### Problema 4 — Responsabilidade

O serviço pode estar assumindo uma regra que poderia pertencer ao próprio conceito de ciclo.

---

## Possível refatoração

Uma alternativa:

```ts
class Ciclo {
  private status: "ABERTO" | "FECHADO" = "ABERTO";
  private aulasRealizadas = 0;

  registrarAula() {
    if (this.status === "FECHADO") {
      throw new Error("Ciclo fechado");
    }

    this.aulasRealizadas++;

    if (this.aulasRealizadas === 4) {
      this.status = "FECHADO";
    }
  }

  estaFechado() {
    return this.status === "FECHADO";
  }
}
```

Agora:

```text
Ciclo
├── estado
├── comportamento
└── regra
```

estão mais próximos.

### Atenção

Este exemplo é didático.

O Beach Tennis Manager possui regras mais específicas para ciclo, incluindo início do ciclo quando ocorre a primeira aula efetivamente realizada ou utilizada como parte daquele ciclo, pagamentos antecipados, possíveis reposições e congelamento das configurações aplicáveis ao ciclo.

Portanto, não devemos copiar este exemplo literalmente para o domínio real.

---

# 21. Testes

## 21.1 O que é?

Teste é uma forma automatizada ou manual de verificar se o software apresenta o comportamento esperado.

Em OO, testes são especialmente úteis para verificar invariantes e comportamentos.

---

## 21.2 Por que existe?

Porque encapsulamento e regras de negócio só são úteis se conseguirmos verificar que continuam funcionando.

---

## 21.3 Qual problema resolve?

Testes ajudam a detectar regressões.

Regressão significa uma alteração que quebra um comportamento que anteriormente funcionava.

---

## 21.4 Como funciona?

Exemplo conceitual:

```ts
it("não permite adicionar aluno quando a turma está cheia", () => {
  // arrange
  // act
  // assert
});
```

O padrão:

```text
Arrange
Act
Assert
```

significa:

```text
preparar
executar
verificar
```

---

## 21.5 Quando eu usaria?

Especialmente para:

- regras de negócio;
- invariantes;
- transições de estado;
- comportamentos importantes;
- integrações críticas.

---

## 21.6 Quando eu evitaria?

Evite testes que apenas repetem a implementação sem verificar comportamento relevante.

---

## 21.7 Exemplo

```ts
it("deve impedir a quinta entrada em uma turma com capacidade quatro", () => {
  const turma = new Turma("turma-1", 4);

  turma.adicionarAluno("1");
  turma.adicionarAluno("2");
  turma.adicionarAluno("3");
  turma.adicionarAluno("4");

  expect(() => turma.adicionarAluno("5"))
    .toThrow("Turma sem vaga");
});
```

---

## 21.8 Como aparece no Beach Tennis Manager?

As regras de:

```text
ausência
crédito
reposição
limite de reposições
ciclo
```

devem receber testes específicos quando forem implementadas.

Os testes devem validar as regras documentadas, não regras inventadas pelo código.

---

# 22. Aplicação integrada no Beach Tennis Manager

Vamos analisar um cenário conceitual.

> Um aluno está matriculado em uma turma. Ele possui um ciclo aberto e falta a uma aula com antecedência suficiente para que a ausência possa gerar direito à reposição, conforme a configuração aplicável.

Observe os conceitos.

## Classe

Podemos possuir conceitos como:

```text
Aluno
Matrícula
Turma
Aula
Ciclo
```

---

## Objeto

Uma instância específica:

```text
Aluno João
Matrícula X
Turma terça 19h
Ciclo X
```

---

## Estado

Precisamos saber:

```text
estado da aula
estado do ciclo
quantidade de aulas utilizadas
estado do crédito
```

---

## Comportamento

Existe uma operação:

```text
registrar ausência
```

---

## Responsabilidade

Precisamos decidir:

```text
qual componente aplica a regra?
```

Não devemos simplesmente colocar toda a lógica em um `Service` porque esse é o padrão mais conhecido.

---

## Encapsulamento

Regras como:

```text
limite de reposições
```

precisam ser protegidas contra alterações arbitrárias.

---

## Abstração

Infraestrutura como banco e integrações externas não precisa contaminar regras de negócio sem necessidade.

---

## Polimorfismo

Pode aparecer em pontos onde existirem diferentes implementações de uma mesma capacidade.

Não devemos criar polimorfismo onde não existe variação real.

---

## Composição

Um caso de uso pode utilizar:

```text
repositório de matrícula
repositório de aula
repositório de ciclo
provedor de regras
```

dependendo da arquitetura.

---

## Identidade

O aluno possui sua própria identidade.

A matrícula também possui sua própria identidade.

Isso permite que o mesmo aluno possua múltiplas matrículas sem duplicar necessariamente o cadastro do aluno.

---

# 23. Exercícios

## Exercício 1 — Classe e objeto

Crie uma classe:

```text
Aluno
```

com:

```text
id
nome
ativo
```

Depois crie dois objetos.

Explique a diferença entre classe e objeto.

---

## Exercício 2 — Estado e comportamento

Crie uma classe:

```text
Turma
```

que tenha:

```text
capacidade
alunos
```

e comporte-se da seguinte forma:

```text
adicionar aluno
verificar vaga
```

Identifique:

- estado;
- comportamento;
- responsabilidade;
- invariante.

---

## Exercício 3 — Encapsulamento

Pegue:

```ts
class Ciclo {
  aulasRealizadas = 0;
}
```

e transforme em uma versão que impeça alterações arbitrárias.

Explique por que sua solução melhora o encapsulamento.

---

## Exercício 4 — Herança ou composição?

Considere:

```text
Professor
Notificador
```

Você precisa enviar uma notificação quando determinada operação acontecer.

Pergunta:

> `Professor` deveria herdar de `Notificador`?

Explique.

---

## Exercício 5 — Interface

Crie:

```ts
interface StudentRepository
```

com:

```text
buscar por ID
```

Depois imagine uma implementação usando Drizzle.

Explique:

```text
quem conhece a interface?
quem conhece Drizzle?
```

---

## Exercício 6 — Polimorfismo

Crie:

```text
NotificationProvider
```

com duas implementações fictícias.

Explique por que o consumidor pode depender do contrato.

---

## Exercício 7 — Objeto anêmico

Considere:

```ts
type Ciclo = {
  aulasRealizadas: number;
};
```

e:

```ts
function registrarAula(ciclo: Ciclo) {}
```

Explique:

1. por que esse modelo pode ser considerado anêmico;
2. quando isso seria aceitável;
3. quando poderia ser um problema;
4. como uma entidade com comportamento poderia melhorar o design.

---

# 24. Perguntas de entrevista

## O que é Orientação a Objetos?

É uma forma de estruturar software em torno de objetos que representam estado, comportamento, identidade e responsabilidades, permitindo que partes do sistema colaborem através de interfaces e relações bem definidas.

---

## O que é uma classe?

É uma definição que descreve a estrutura e os comportamentos que determinadas instâncias podem possuir.

---

## O que é um objeto?

É uma instância concreta de uma classe ou uma estrutura que encapsula dados e/ou comportamento.

---

## Qual a diferença entre classe e objeto?

A classe é a definição.

O objeto é uma instância concreta dessa definição.

---

## Quais são os quatro pilares de OO?

Tradicionalmente:

```text
Encapsulamento
Abstração
Herança
Polimorfismo
```

Mas decorar os quatro não demonstra domínio.

É necessário saber explicar os problemas que cada conceito resolve.

---

## O que é encapsulamento?

É o controle sobre o estado e os detalhes internos de uma estrutura, permitindo que regras e invariantes sejam protegidos.

---

## O que é abstração?

É representar os aspectos relevantes de um conceito e esconder detalhes que não precisam ser conhecidos pelo consumidor.

---

## O que é herança?

É um mecanismo em que uma classe deriva de outra, formando uma relação hierárquica de especialização.

---

## O que é polimorfismo?

É permitir que diferentes implementações sejam utilizadas através de um contrato comum, cada uma fornecendo seu próprio comportamento.

---

## Composição ou herança?

Composição permite construir objetos através de colaboradores.

Herança representa especialização através de uma hierarquia.

A escolha depende do problema.

---

## Quando você usaria interface?

Quando existe um contrato útil que deve separar consumidor e implementação, especialmente em fronteiras arquiteturais ou quando existem múltiplas implementações.

---

## Quando usaria classe abstrata?

Quando existe uma hierarquia real e queremos compartilhar estado ou implementação entre subclasses.

---

## Interface e classe abstrata são a mesma coisa?

Não.

Interface representa principalmente um contrato.

Classe abstrata pode fornecer contrato, estado e implementação compartilhada.

---

## O que é objeto anêmico?

É um objeto que possui principalmente dados, enquanto comportamentos e regras relacionados ficam espalhados em outros componentes.

Isso pode ser problemático para entidades com regras complexas, mas é perfeitamente aceitável para estruturas como DTOs.

---

# 25. Perguntas de aprofundamento

Estas perguntas são importantes para entrevistas de nível Pleno/Sênior.

### 1. Toda entidade do banco deveria virar uma classe?

Não necessariamente.

Persistência e domínio são preocupações diferentes.

---

### 2. Todo serviço deveria ser uma classe?

Não.

Uma função pode ser suficiente quando não existe estado ou colaboração relevante.

---

### 3. Herança reduz duplicação. Por que não usar sempre?

Porque herança também cria acoplamento estrutural e uma hierarquia difícil de modificar.

---

### 4. Interface sempre reduz acoplamento?

Não automaticamente.

Ela pode reduzir dependência de implementação concreta, mas também pode introduzir abstração desnecessária.

---

### 5. Mais classes significa código melhor?

Não.

O objetivo é melhorar responsabilidades, coesão, acoplamento e compreensão.

---

### 6. Encapsular tudo significa esconder todos os atributos?

Não.

O nível de encapsulamento deve ser adequado ao problema e às responsabilidades do objeto.

---

### 7. OO é obrigatória em aplicações TypeScript?

Não.

TypeScript suporta múltiplos estilos de programação.

---

### 8. O que é mais importante: usar OO ou ter bom design?

Bom design.

OO é uma das ferramentas disponíveis para alcançar esse objetivo.

---

# 26. Checklist de domínio

Antes de avançar, você deveria conseguir explicar:

### Fundamentos

- [ ] O que é Orientação a Objetos?
- [ ] O que é uma classe?
- [ ] O que é um objeto?
- [ ] Qual a diferença entre classe e objeto?
- [ ] O que é identidade?
- [ ] O que é estado?
- [ ] O que é comportamento?

### Encapsulamento e abstração

- [ ] O que é encapsulamento?
- [ ] Por que `private` não é suficiente para explicar encapsulamento?
- [ ] O que é abstração?
- [ ] Interface é sinônimo de abstração?

### Herança e polimorfismo

- [ ] O que é herança?
- [ ] Quando herança faz sentido?
- [ ] Quando herança cria problemas?
- [ ] O que é polimorfismo?
- [ ] Quando polimorfismo ajuda?
- [ ] Quando um `if` é melhor?

### Interface e classe abstrata

- [ ] Qual a diferença?
- [ ] Quando usar interface?
- [ ] Quando usar classe abstrata?
- [ ] Por que não criar interface para tudo?

### Composição

- [ ] O que é composição?
- [ ] Qual a diferença entre "é um" e "utiliza/possui"?
- [ ] Por que composição pode reduzir rigidez?

### Design

- [ ] O que é um objeto anêmico?
- [ ] Quando um objeto anêmico é aceitável?
- [ ] Como responsabilidade influencia o design de classes?
- [ ] Como coesão influencia a divisão de classes?
- [ ] Como acoplamento influencia a escolha entre composição e herança?

### Aplicação prática

- [ ] Consigo identificar classes e objetos em um código real?
- [ ] Consigo identificar estado e comportamento?
- [ ] Consigo encontrar responsabilidades mal distribuídas?
- [ ] Consigo identificar acoplamento?
- [ ] Consigo decidir quando uma interface realmente faz sentido?
- [ ] Consigo justificar composição em vez de herança?
- [ ] Consigo explicar minhas decisões usando exemplos do Beach Tennis Manager?

---

# Conclusão

Orientação a Objetos não deve ser resumida a:

```text
class
extends
interface
private
```

Essas são ferramentas.

O objetivo maior é aprender a modelar responsabilidades e colaboração.

Uma forma madura de pensar é:

```text
Qual conceito estou representando?
        ↓
Ele possui identidade?
        ↓
Qual estado ele possui?
        ↓
Quais comportamentos pertencem a ele?
        ↓
Quais regras precisam ser protegidas?
        ↓
Qual responsabilidade ele possui?
        ↓
Com quem ele precisa colaborar?
        ↓
Quais dependências existem?
        ↓
O acoplamento é aceitável?
        ↓
Preciso de abstração?
        ↓
Composição ou herança?
```

Quando esse raciocínio estiver natural, conceitos posteriores começam a fazer muito mais sentido.

**SOLID**, por exemplo, deixa de parecer uma coleção de siglas.

**Injeção de Dependência** deixa de parecer apenas uma técnica de framework.

**Design Patterns** deixam de ser receitas para decorar.

E **Arquitetura** passa a ser uma consequência de decisões sobre responsabilidades, dependências, limites e evolução do sistema.

Esse é o objetivo dos próximos módulos.
