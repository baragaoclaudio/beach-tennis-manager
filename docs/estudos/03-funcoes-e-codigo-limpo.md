# 03 — Funções e Código Limpo

> Material de estudo do Beach Tennis Manager.
>
> Este documento aprofunda funções, efeitos colaterais, mutabilidade, complexidade e princípios práticos de código limpo.
>
> O objetivo não é criar uma lista de regras estéticas. É aprender a reconhecer código difícil de entender, explicar por que ele é difícil e refatorá-lo preservando o comportamento.

---

## Sumário

1. [Como estudar este documento](#1-como-estudar-este-documento)
2. [O que é uma função](#2-o-que-é-uma-função)
3. [Entrada, saída e contrato](#3-entrada-saída-e-contrato)
4. [Funções puras](#4-funções-puras)
5. [Funções impuras e efeitos colaterais](#5-funções-impuras-e-efeitos-colaterais)
6. [Responsabilidade de uma função](#6-responsabilidade-de-uma-função)
7. [Tamanho e complexidade](#7-tamanho-e-complexidade)
8. [Nomes](#8-nomes)
9. [Parâmetros](#9-parâmetros)
10. [Retorno](#10-retorno)
11. [Early return](#11-early-return)
12. [Condicionais](#12-condicionais)
13. [Complexidade ciclomática](#13-complexidade-ciclomática)
14. [Aninhamento](#14-aninhamento)
15. [Duplicação](#15-duplicação)
16. [Expressividade](#16-expressividade)
17. [Comentários](#17-comentários)
18. [Mutabilidade](#18-mutabilidade)
19. [Código limpo](#19-código-limpo)
20. [Código ruim → análise → refatoração](#20-código-ruim--análise--refatoração)
21. [Testabilidade](#21-testabilidade)
22. [Aplicação no Beach Tennis Manager](#22-aplicação-no-beach-tennis-manager)
23. [Exercícios](#23-exercícios)
24. [Perguntas de entrevista](#24-perguntas-de-entrevista)
25. [Perguntas de aprofundamento](#25-perguntas-de-aprofundamento)
26. [Checklist de domínio](#26-checklist-de-domínio)

---

# 1. Como estudar este documento

Código limpo não significa código "bonito" no sentido visual.

Também não existe uma lista universal que determine se um código é limpo.

Código limpo é uma forma de pensar sobre características como:

```text
clareza
coerência
responsabilidade
previsibilidade
manutenibilidade
testabilidade
```

O objetivo é reduzir a quantidade de esforço mental necessária para entender e modificar o software.

Uma boa pergunta durante uma revisão de código é:

> Se eu voltar neste código daqui a seis meses, vou conseguir entender rapidamente o que ele está fazendo e por quê?

---

# 2. O que é uma função?

## 2.1 O que é?

Uma função é uma unidade de código que recebe zero ou mais entradas, executa uma operação e pode produzir uma saída.

Exemplo:

```ts
function somar(a: number, b: number): number {
  return a + b;
}
```

Entradas:

```text
a
b
```

Saída:

```text
a + b
```

---

## 2.2 Por que existe?

Funções permitem organizar operações em unidades reutilizáveis e nomeáveis.

Em vez de repetir:

```ts
const total = preco * quantidade;
```

podemos criar:

```ts
function calcularTotal(preco: number, quantidade: number) {
  return preco * quantidade;
}
```

O nome passa a comunicar intenção.

---

## 2.3 Qual problema resolve?

Funções ajudam a:

- evitar duplicação;
- organizar lógica;
- dar nomes a operações;
- facilitar testes;
- controlar responsabilidades;
- reduzir complexidade local.

---

## 2.4 Como funciona?

Uma função pode ser vista como:

```text
entrada
  ↓
processamento
  ↓
saída
```

Exemplo:

```ts
function calcularDesconto(
  valor: number,
  percentual: number,
): number {
  return valor * (percentual / 100);
}
```

---

## 2.5 Quando eu usaria?

Praticamente sempre que uma operação:

- possui uma intenção identificável;
- pode ser nomeada;
- precisa ser reutilizada;
- merece ser isolada para teste;
- ficaria mais clara separada do fluxo principal.

---

## 2.6 Quando eu evitaria?

Não extraia uma função apenas porque existem três linhas.

Isto:

```ts
function adicionarUm(valor: number) {
  return valor + 1;
}
```

pode ser desnecessário se o nome não acrescentar significado.

Extração deve melhorar a compreensão ou o design.

---

## 2.7 Exemplo

Sem função:

```ts
const total = preco * quantidade;
const desconto = total * 0.1;
const final = total - desconto;
```

Com função:

```ts
function calcularValorComDesconto(
  preco: number,
  quantidade: number,
  desconto: number,
) {
  const total = preco * quantidade;
  return total - total * desconto;
}
```

A segunda versão pode expressar melhor a intenção quando essa operação possui significado no domínio.

---

## 2.8 Como aparece no Beach Tennis Manager?

Podemos ter funções como:

```text
calcular valor
verificar condição
validar entrada
transformar dados
formatar resposta
```

Já regras de negócio mais complexas podem pertencer a objetos, casos de uso ou outros componentes.

---

# 3. Entrada, saída e contrato

## 3.1 O que é?

O contrato de uma função descreve, de forma prática, o que ela espera receber e o que oferece como resultado.

Exemplo:

```ts
function dividir(
  a: number,
  b: number,
): number
```

Podemos entender:

```text
Entrada:
a: number
b: number

Saída:
number
```

Mas o contrato pode envolver mais coisas:

```text
b não pode ser zero
```

---

## 3.2 Por que existe?

Porque consumidores precisam saber como utilizar uma função sem conhecer todos os detalhes internos.

---

## 3.3 Qual problema resolve?

Um contrato claro reduz ambiguidade.

Considere:

```ts
function processar(data: any) {
  // ...
}
```

É difícil saber:

```text
o que data representa?
qual formato?
o que retorna?
quais erros podem acontecer?
```

---

## 3.4 Como funciona?

Tipos ajudam a tornar contratos explícitos:

```ts
type Student = {
  id: string;
  name: string;
};

function findStudent(id: string): Promise<Student | null> {
  // ...
}
```

Agora temos uma expectativa mais clara.

---

## 3.5 Quando eu usaria?

Sempre.

Quanto mais importante a função, mais importante é que seu contrato seja compreensível.

---

## 3.6 Quando eu evitaria?

Não precisamos transformar toda função simples em uma especificação enorme.

O nível de formalidade deve ser proporcional à complexidade.

---

## 3.7 Exemplo

Contrato ruim:

```ts
function processar(data: any): any {}
```

Contrato melhor:

```ts
function calcularValorCiclo(
  quantidadeAulas: number,
  valorPorAula: number,
): number {
  return quantidadeAulas * valorPorAula;
}
```

---

## 3.8 Como aparece no Beach Tennis Manager?

Casos de uso e serviços terão contratos importantes.

Exemplo conceitual:

```ts
type RegisterAbsenceInput = {
  enrollmentId: string;
  lessonId: string;
  occurredAt: Date;
};
```

O contrato deixa explícito o que a operação precisa.

As regras específicas devem continuar vindo da documentação do projeto.

---

# 4. Funções puras

## 4.1 O que é?

Uma função pura possui duas características fundamentais:

1. para as mesmas entradas, produz sempre a mesma saída;
2. não produz efeitos colaterais observáveis fora dela.

Exemplo:

```ts
function somar(a: number, b: number) {
  return a + b;
}
```

---

## 4.2 Por que existe?

Funções puras são mais fáceis de:

- entender;
- testar;
- reutilizar;
- combinar;
- raciocinar.

---

## 4.3 Qual problema resolve?

Elas reduzem incerteza.

Considere:

```ts
function calcularTotal(a: number, b: number) {
  return a + b;
}
```

Se:

```text
a = 10
b = 20
```

sabemos que o resultado será:

```text
30
```

Já:

```ts
function calcularTotal() {
  return database.getCurrentValue() * Math.random();
}
```

possui dependências externas e comportamento menos previsível.

---

## 4.4 Como funciona?

Uma função pura depende somente de seus parâmetros e de operações sem efeitos externos.

Exemplo:

```ts
function aplicarDesconto(
  valor: number,
  percentual: number,
) {
  return valor - valor * percentual;
}
```

---

## 4.5 Quando eu usaria?

São especialmente úteis para:

- cálculos;
- transformações;
- validações;
- mapeamentos;
- regras determinísticas.

---

## 4.6 Quando eu evitaria?

Não existe obrigação de tornar toda função pura.

Operações como:

```text
salvar no banco
enviar HTTP
gravar arquivo
emitir evento
```

normalmente precisam produzir efeitos externos.

O objetivo é controlar esses efeitos, não fingir que eles não existem.

---

## 4.7 Exemplo

Pura:

```ts
function calcularTotal(
  valores: number[],
): number {
  return valores.reduce(
    (total, valor) => total + valor,
    0,
  );
}
```

Impura:

```ts
let total = 0;

function adicionar(valor: number) {
  total += valor;
}
```

A segunda modifica uma variável externa.

---

## 4.8 Como aparece no Beach Tennis Manager?

Cálculos como:

```text
calcular valor
determinar quantidade
transformar dados
```

podem ser funções puras quando não dependem de estado externo.

Já:

```text
salvar ausência
buscar matrícula
criar crédito
```

envolvem efeitos externos ou persistência.

---

# 5. Funções impuras e efeitos colaterais

## 5.1 O que é?

Uma função impura é uma função cujo resultado ou comportamento depende de fatores externos ou que produz efeitos observáveis fora de seu escopo.

Um **efeito colateral** é uma alteração ou ação que vai além de simplesmente calcular e retornar um valor.

Exemplos:

```text
alterar banco
alterar arquivo
modificar variável externa
enviar HTTP
emitir evento
escrever log
alterar interface
```

---

## 5.2 Por que existe?

Sistemas reais precisam interagir com o mundo externo.

Uma aplicação que nunca produz efeitos colaterais não consegue:

```text
salvar dados
enviar mensagens
receber pagamentos
consultar banco
```

---

## 5.3 Qual problema resolve?

O conceito ajuda a reconhecer onde o software deixa de ser puramente computacional e passa a interagir com o ambiente.

---

## 5.4 Como funciona?

Considere:

```ts
function salvarAluno(aluno: Aluno) {
  return repository.save(aluno);
}
```

A função possui um efeito externo:

```text
banco de dados
```

Isso não é automaticamente ruim.

O importante é que a fronteira esteja clara.

---

## 5.5 Quando eu usaria?

Quando precisamos:

- persistir;
- comunicar;
- integrar;
- registrar;
- alterar algum recurso externo.

---

## 5.6 Quando eu evitaria?

Evite esconder efeitos colaterais em funções que parecem puramente calculacionais.

Exemplo perigoso:

```ts
function calcularTotal(items: Item[]) {
  database.save(...);
  return ...;
}
```

O nome sugere cálculo, mas a função também grava no banco.

---

## 5.7 Exemplo

Ruim:

```ts
function calcularValor(ciclo: Ciclo) {
  repository.save(ciclo);
  return ciclo.valor;
}
```

O nome não comunica a persistência.

Melhor:

```ts
function calcularValor(ciclo: Ciclo) {
  return ciclo.valor;
}

async function salvarCiclo(ciclo: Ciclo) {
  await repository.save(ciclo);
}
```

---

## 5.8 Como aparece no Beach Tennis Manager?

Uma operação de negócio pode combinar:

```text
regra pura
+
persistência
+
notificação
```

É importante conseguir distinguir essas partes.

Isso facilita testes e evolução.

---

# 6. Responsabilidade de uma função

## 6.1 O que é?

Responsabilidade de uma função é o trabalho que ela deve realizar dentro do sistema.

Uma função deve possuir uma intenção clara.

---

## 6.2 Por que existe?

Porque funções que fazem muitas coisas se tornam difíceis de entender e modificar.

---

## 6.3 Qual problema resolve?

Ajuda a evitar funções como:

```ts
processarTudo();
```

que:

```text
valida
consulta banco
calcula
salva
envia email
gera relatório
```

---

## 6.4 Como funciona?

Pergunte:

> Consigo descrever esta função em uma frase clara?

Se a resposta for:

```text
Ela registra uma ausência.
```

é um bom começo.

Se a resposta for:

```text
Ela valida o aluno, consulta a turma, calcula pagamento,
envia WhatsApp, atualiza o banco e gera um relatório.
```

provavelmente existem várias responsabilidades.

---

## 6.5 Quando eu usaria?

Sempre que estiver criando ou revisando funções.

---

## 6.6 Quando eu evitaria?

Não devemos interpretar "uma responsabilidade" como:

```text
uma única instrução
```

Uma função pode possuir várias operações internas e ainda representar uma única responsabilidade de negócio.

---

## 6.7 Exemplo

```ts
function registrarAusencia(...) {
  validarAusencia(...);
  criarCredito(...);
  salvar(...);
}
```

Pode continuar representando uma única operação de aplicação:

```text
registrar ausência
```

A implementação interna pode possuir etapas diferentes.

---

## 6.8 Como aparece no Beach Tennis Manager?

Um caso de uso como:

```text
RegistrarAusencia
```

pode coordenar várias operações.

Isso não significa necessariamente que todas as regras devem ficar dentro de uma única função.

---

# 7. Tamanho e complexidade

## 7.1 O que é?

Tamanho é a quantidade de código.

Complexidade é a dificuldade necessária para entender ou modificar o comportamento.

Eles são relacionados, mas não são a mesma coisa.

---

## 7.2 Por que existe?

Porque uma função de 100 linhas pode ser simples em alguns contextos, enquanto uma função de 15 linhas pode possuir lógica extremamente difícil.

---

## 7.3 Qual problema resolve?

Pensar em complexidade evita regras simplistas como:

> "Toda função deve ter no máximo X linhas."

Linhas são apenas um sinal.

---

## 7.4 Como funciona?

Podemos analisar:

```text
quantidade de decisões
nível de aninhamento
dependências
responsabilidades
duplicação
nomes
efeitos colaterais
```

---

## 7.5 Quando eu usaria?

Durante:

- code review;
- refatoração;
- análise de código legado;
- criação de funções.

---

## 7.6 Quando eu evitaria?

Não use números rígidos como substituto de julgamento.

---

## 7.7 Exemplo

Função curta e difícil:

```ts
return a ? b ? c ? d : e : f : g;
```

Poucas linhas.

Alta dificuldade de leitura.

---

## 7.8 Como aparece no Beach Tennis Manager?

Regras de ausência e reposição podem produzir funções naturalmente complexas.

O objetivo será separar conceitos e decisões sem destruir a visão do processo.

---

# 8. Nomes

## 8.1 O que é?

Nomes são uma forma de comunicação.

Variáveis, funções, classes e módulos devem comunicar intenção.

---

## 8.2 Por que existe?

Porque grande parte do tempo de desenvolvimento é gasto lendo código, não escrevendo.

---

## 8.3 Qual problema resolve?

Nomes bons reduzem a necessidade de interpretar detalhes da implementação.

---

## 8.4 Como funciona?

Compare:

```ts
function calc(x: number, y: number) {}
```

com:

```ts
function calcularValorComDesconto(
  valor: number,
  percentualDesconto: number,
) {}
```

A segunda versão comunica intenção.

---

## 8.5 Quando eu usaria?

Sempre.

---

## 8.6 Quando eu evitaria?

Não tente criar nomes gigantes apenas para explicar tudo.

Um nome deve ser preciso e proporcional.

---

## 8.7 Exemplo

Ruim:

```ts
const d = 6;
```

Se representa prazo em horas:

```ts
const minimumNoticeHours = 6;
```

No projeto, porém, 6 horas não deve ser tratado como regra fixa; o prazo é configurável por professor.

---

## 8.8 Como aparece no Beach Tennis Manager?

Prefira nomes que expressem domínio:

```text
enrollment
makeupCredit
lesson
cycle
minimumNoticeHours
```

em vez de:

```text
data
obj
x
value
temp
```

quando estes últimos esconderem significado.

---

# 9. Parâmetros

## 9.1 O que é?

Parâmetros são entradas declaradas por uma função.

```ts
function calcular(a: number, b: number) {}
```

Temos:

```text
a
b
```

---

## 9.2 Por que existe?

Permitem que funções recebam informações de fora.

---

## 9.3 Qual problema resolve?

Tornam funções reutilizáveis e explícitas.

---

## 9.4 Como funciona?

Poucos parâmetros:

```ts
function criarAluno(
  name: string,
  cpf: string,
) {}
```

Muitos parâmetros:

```ts
function criarAluno(
  name,
  cpf,
  phone,
  email,
  address,
  city,
  state,
  zipCode,
) {}
```

A segunda pode ser difícil de utilizar corretamente.

Uma alternativa:

```ts
type CreateStudentInput = {
  name: string;
  cpf: string;
  phone: string;
  email: string;
};
```

---

## 9.5 Quando eu usaria?

Use parâmetros explícitos quando representam informações realmente necessárias.

---

## 9.6 Quando eu evitaria?

Evite listas enormes de parâmetros.

Também evite objetos genéricos:

```ts
data: any
```

apenas para esconder uma assinatura difícil.

---

## 9.7 Exemplo

```ts
type CreateStudentInput = {
  name: string;
  cpf: string;
};

function createStudent(input: CreateStudentInput) {
  // ...
}
```

---

## 9.8 Como aparece no Beach Tennis Manager?

Casos de uso podem receber objetos de entrada:

```ts
type RegisterAbsenceInput = {
  enrollmentId: string;
  lessonId: string;
};
```

Isso torna o contrato mais explícito.

---

# 10. Retorno

## 10.1 O que é?

Retorno é o resultado produzido por uma função.

```ts
function somar(a: number, b: number) {
  return a + b;
}
```

---

## 10.2 Por que existe?

Para comunicar o resultado de uma operação ao consumidor.

---

## 10.3 Qual problema resolve?

Permite composição:

```ts
const total = somar(10, 20);
```

---

## 10.4 Como funciona?

Uma função pode retornar:

```text
valor
objeto
lista
null
undefined
Promise
```

O importante é que o contrato seja compreensível.

---

## 10.5 Quando eu usaria?

Sempre que o consumidor precisar de um resultado.

---

## 10.6 Quando eu evitaria?

Evite retornos ambíguos.

Exemplo:

```ts
function processar(): any {}
```

Não comunica o contrato.

---

## 10.7 Exemplo

Melhor:

```ts
async function findStudent(
  id: string,
): Promise<Student | null> {
  // ...
}
```

---

## 10.8 Como aparece no Beach Tennis Manager?

Repositórios e casos de uso devem possuir contratos claros.

Exemplo:

```text
buscar matrícula
-> Matrícula ou null

registrar ausência
-> resultado da operação ou erro
```

O formato exato será definido pela arquitetura do projeto.

---

# 11. Early return

## 11.1 O que é?

Early return significa retornar cedo quando uma condição impede a continuação da função.

Exemplo:

```ts
function processar(aluno: Aluno) {
  if (!aluno.ativo) {
    return;
  }

  // restante
}
```

---

## 11.2 Por que existe?

Pode reduzir aninhamento e deixar o fluxo principal mais fácil de enxergar.

---

## 11.3 Qual problema resolve?

Compare:

```ts
function processar(aluno: Aluno) {
  if (aluno.ativo) {
    if (aluno.temMatricula) {
      if (aluno.temCredito) {
        realizar();
      }
    }
  }
}
```

com:

```ts
function processar(aluno: Aluno) {
  if (!aluno.ativo) {
    return;
  }

  if (!aluno.temMatricula) {
    return;
  }

  if (!aluno.temCredito) {
    return;
  }

  realizar();
}
```

A segunda versão apresenta o caminho principal com menos níveis de indentação.

---

## 11.4 Como funciona?

Validações ou condições de saída aparecem antes do fluxo principal.

---

## 11.5 Quando eu usaria?

Quando:

- existe condição de saída clara;
- o retorno reduz aninhamento;
- melhora a leitura.

---

## 11.6 Quando eu evitaria?

Não use early return de forma que esconda uma sequência importante ou torne o fluxo fragmentado.

---

## 11.7 Exemplo

```ts
function utilizarCredito(credito: Credit | null) {
  if (!credito) {
    return;
  }

  if (credito.used) {
    return;
  }

  credito.used = true;
}
```

---

## 11.8 Como aparece no Beach Tennis Manager?

Pode ser útil em validações:

```text
matrícula inexistente
ciclo fechado
crédito indisponível
```

Mas a regra real deve ser implementada conforme a documentação.

---

# 12. Condicionais

## 12.1 O que é?

Condicionais permitem executar diferentes caminhos dependendo de uma condição.

Exemplo:

```ts
if (aluno.ativo) {
  // ...
}
```

---

## 12.2 Por que existe?

Porque sistemas precisam tomar decisões.

---

## 12.3 Qual problema resolve?

Permite representar regras condicionais.

---

## 12.4 Como funciona?

```ts
if (condicao) {
  // caminho A
} else {
  // caminho B
}
```

Podemos também ter:

```ts
switch (status) {
  case "AGENDADA":
    break;
  case "REALIZADA":
    break;
}
```

---

## 12.5 Quando eu usaria?

Use condicionais quando representam claramente uma decisão.

---

## 12.6 Quando eu evitaria?

Evite cadeias gigantes de condições quando elas representam variações que poderiam ser modeladas de forma mais apropriada.

Mas não substitua todo `if` por design patterns.

---

## 12.7 Exemplo

```ts
if (lesson.status === "CANCELADA") {
  return "não realizada";
}
```

Simples e claro.

---

## 12.8 Como aparece no Beach Tennis Manager?

As regras de ausência possuem decisões como:

```text
houve aviso?
respeitou prazo?
foi cancelamento do professor?
foi chuva?
```

Essas condições fazem parte da regra de negócio.

O desafio de design é manter a lógica compreensível.

---

# 13. Complexidade ciclomática

## 13.1 O que é?

Complexidade ciclomática é uma métrica que estima a quantidade de caminhos independentes de execução de uma função ou trecho de código.

De forma simplificada:

> Quanto mais decisões independentes existem, mais caminhos diferentes precisam ser considerados.

---

## 13.2 Por que existe?

Porque quantidade de caminhos influencia:

- entendimento;
- testes;
- manutenção;
- possibilidade de combinações inesperadas.

---

## 13.3 Qual problema resolve?

Ajuda a identificar funções que concentram muitas decisões.

---

## 13.4 Como funciona?

Considere:

```ts
if (a) {
  // ...
}
```

Existe pelo menos uma decisão.

Com:

```ts
if (a) {
  // ...
}

if (b) {
  // ...
}
```

temos mais caminhos possíveis.

Uma fórmula simplificada frequentemente usada é:

```text
M = E - N + 2P
```

onde:

```text
M = complexidade ciclomática
E = quantidade de arestas
N = quantidade de nós
P = quantidade de componentes conectados
```

Na prática cotidiana, não é necessário calcular manualmente a fórmula para perceber o problema.

Ferramentas de análise estática podem calcular a métrica automaticamente.

---

## 13.5 Quando eu usaria?

Use como indicador durante:

- revisão;
- análise de código;
- refatoração;
- definição de limites para qualidade.

---

## 13.6 Quando eu evitaria?

Não trate um número isolado como prova de que o código é bom ou ruim.

Uma métrica é um sinal, não uma decisão automática.

---

## 13.7 Exemplo

```ts
function processar(
  a: boolean,
  b: boolean,
  c: boolean,
) {
  if (a) {
    if (b) {
      if (c) {
        return "A";
      }

      return "B";
    }

    return "C";
  }

  return "D";
}
```

A quantidade de decisões torna o comportamento mais difícil de visualizar.

---

## 13.8 Como aparece no Beach Tennis Manager?

Regras de reposição podem combinar:

```text
tipo de ausência
aviso
prazo
limite
estado do ciclo
existência de vaga
```

Isso pode aumentar a complexidade.

Devemos decompor o raciocínio de forma que cada decisão continue compreensível.

---

# 14. Aninhamento

## 14.1 O que é?

Aninhamento acontece quando uma estrutura é colocada dentro de outra.

Exemplo:

```ts
if (a) {
  if (b) {
    if (c) {
      executar();
    }
  }
}
```

---

## 14.2 Por que existe?

Alguns problemas realmente exigem estruturas aninhadas.

---

## 14.3 Qual problema resolve?

Permite expressar dependência entre condições.

---

## 14.4 Como funciona?

Cada nível adiciona contexto:

```text
se A
  se B
    se C
      executar
```

---

## 14.5 Quando eu usaria?

Quando o aninhamento representa uma relação lógica clara e pequena.

---

## 14.6 Quando eu evitaria?

Evite muitos níveis porque aumentam a carga mental.

Carga mental significa a quantidade de informação que o leitor precisa manter na cabeça para compreender o fluxo.

---

## 14.7 Exemplo

Mais simples:

```ts
if (!a) {
  return;
}

if (!b) {
  return;
}

executar();
```

---

## 14.8 Como aparece no Beach Tennis Manager?

Ao implementar regras complexas, podemos decompor:

```text
validar matrícula
validar ciclo
avaliar ausência
avaliar crédito
```

em vez de criar uma única árvore enorme de `if`.

---

# 15. Duplicação

## 15.1 O que é?

Duplicação acontece quando a mesma regra ou conhecimento é repetido em vários lugares.

Exemplo:

```ts
if (hours >= 6) {
  // ...
}
```

aparecendo em vários arquivos.

---

## 15.2 Por que existe?

Porque é fácil copiar e colar.

O problema aparece quando a regra muda.

---

## 15.3 Qual problema resolve?

Reduzir duplicação evita que uma alteração precise ser feita em vários lugares e reduz o risco de versões divergentes da mesma regra.

---

## 15.4 Como funciona?

Considere:

```text
Controller
    -> regra de prazo

Service
    -> mesma regra

Job
    -> mesma regra
```

Se a regra mudar, precisamos lembrar dos três.

---

## 15.5 Quando eu usaria?

Sempre procure duplicação de conhecimento importante.

---

## 15.6 Quando eu evitaria?

Nem toda repetição textual é duplicação problemática.

Duas linhas iguais podem representar conceitos diferentes.

Não devemos abstrair apenas porque o código é parecido.

---

## 15.7 Exemplo

Duplicação de regra:

```ts
if (noticeHours >= minimumNoticeHours) {
  // ...
}
```

copiada em vários casos de uso.

Pode existir uma função ou componente responsável por essa decisão.

---

## 15.8 Como aparece no Beach Tennis Manager?

O prazo mínimo de aviso é configurável por professor, com fallback global.

Essa regra não deve ser copiada de forma inconsistente em várias partes.

Além disso, como configurações aplicáveis ao ciclo ficam congeladas quando o ciclo inicia, a lógica precisa respeitar o momento correto da decisão.

---

# 16. Expressividade

## 16.1 O que é?

Código expressivo é código que comunica sua intenção de maneira clara.

Compare:

```ts
if (x > 0 && y === false && z !== null) {
  // ...
}
```

com:

```ts
if (hasAvailableMakeupCredit) {
  // ...
}
```

Quando o segundo nome representa corretamente o conceito, a leitura melhora.

---

## 16.2 Por que existe?

Porque o código é lido muito mais vezes do que é escrito.

---

## 16.3 Qual problema resolve?

Reduz o esforço necessário para compreender a intenção.

---

## 16.4 Como funciona?

Podemos usar:

- bons nomes;
- tipos claros;
- funções pequenas;
- abstrações justificadas;
- estruturas que expressem o domínio.

---

## 16.5 Quando eu usaria?

Sempre.

---

## 16.6 Quando eu evitaria?

Evite transformar expressões triviais em abstrações desnecessárias.

---

## 16.7 Exemplo

Menos expressivo:

```ts
if (cycle.lessonsCount === 4) {
  // ...
}
```

Mais expressivo, se existir essa regra encapsulada:

```ts
if (cycle.isComplete()) {
  // ...
}
```

---

## 16.8 Como aparece no Beach Tennis Manager?

Nomes de domínio podem tornar regras complexas muito mais fáceis de ler:

```text
hasMakeupCredit
minimumNoticeHours
isCycleOpen
canUseCredit
```

Esses nomes devem refletir regras reais.

---

# 17. Comentários

## 17.1 O que é?

Comentário é uma informação escrita no código para explicar algo ao leitor.

---

## 17.2 Por que existe?

Porque algumas informações não conseguem ser expressas adequadamente apenas através do código.

---

## 17.3 Qual problema resolve?

Comentários podem explicar:

- motivo de uma decisão;
- restrição externa;
- comportamento não óbvio;
- contexto histórico;
- workaround.

Um **workaround** é uma solução criada para contornar uma limitação ou problema conhecido.

---

## 17.4 Como funciona?

Bom comentário:

```ts
// O provedor exige uma nova tentativa após timeout,
// mas apenas para erros transitórios.
```

Comentário pouco útil:

```ts
// soma 1
count++;
```

O código já mostra isso.

---

## 17.5 Quando eu usaria?

Quando o "por quê" é difícil de descobrir apenas lendo o código.

---

## 17.6 Quando eu evitaria?

Evite comentários que apenas traduzem literalmente o código.

Também evite usar comentário para justificar código confuso quando seria possível torná-lo claro através de uma refatoração.

---

## 17.7 Exemplo

Ruim:

```ts
// verifica se o aluno está ativo
if (student.active) {}
```

Melhor:

```ts
// Matrículas encerradas não podem iniciar um novo ciclo.
if (enrollment.isClosed()) {}
```

---

## 17.8 Como aparece no Beach Tennis Manager?

As regras de negócio possuem decisões que podem parecer incomuns para quem não conhece o contexto.

Exemplo:

```text
o ciclo não começa simplesmente porque houve pagamento;
ele inicia quando ocorre a primeira aula efetivamente realizada
ou utilizada como parte daquele ciclo.
```

Uma decisão desse tipo pode merecer documentação próxima ao código se não for óbvia pela implementação.

---

# 18. Mutabilidade

## 18.1 O que é?

Mutabilidade é a capacidade de alterar o estado de uma estrutura depois que ela foi criada.

Exemplo:

```ts
const aluno = {
  nome: "João",
};

aluno.nome = "Maria";
```

O objeto é mutável.

---

## 18.2 Por que existe?

Porque sistemas frequentemente precisam representar mudanças.

---

## 18.3 Qual problema resolve?

Mutabilidade permite atualizar estado sem criar necessariamente uma nova estrutura.

---

## 18.4 Como funciona?

Mutável:

```ts
aluno.nome = "Maria";
```

Imutável por substituição:

```ts
const atualizado = {
  ...aluno,
  nome: "Maria",
};
```

No segundo caso, criamos outro objeto em vez de alterar o anterior.

---

## 18.5 Quando eu usaria?

Mutabilidade pode ser apropriada quando:

- o estado possui um dono claro;
- as alterações são controladas;
- o objeto encapsula as mudanças;
- desempenho ou simplicidade justificam.

---

## 18.6 Quando eu evitaria?

Evite mutabilidade compartilhada e descontrolada.

**Mutabilidade compartilhada** significa que várias partes do sistema possuem acesso ao mesmo estado e podem alterá-lo.

Isso pode produzir bugs difíceis de rastrear.

---

## 18.7 Exemplo

Perigoso:

```ts
const cycle = getCycle();

serviceA.alterar(cycle);
serviceB.alterar(cycle);
serviceC.alterar(cycle);
```

Não fica claro quem alterou o quê.

Uma abordagem mais controlada pode encapsular as alterações.

---

## 18.8 Como aparece no Beach Tennis Manager?

Estado como:

```text
créditos
status
aulas efetivamente utilizadas
```

precisa ser alterado de maneira consistente.

Não devemos permitir que diferentes partes da aplicação modifiquem o mesmo estado sem respeitar as regras do domínio.

---

# 19. Código limpo

## 19.1 O que é?

Código limpo é código que reduz o esforço necessário para entender, testar, modificar e evoluir o sistema.

Não é uma estética universal.

---

## 19.2 Por que existe?

Porque software muda.

Uma solução que funciona hoje precisa continuar sendo modificável amanhã.

---

## 19.3 Qual problema resolve?

Ajuda a controlar o custo de manutenção.

Quanto mais difícil compreender o código:

```text
mais tempo para modificar
mais risco de regressão
mais dificuldade para testar
```

---

## 19.4 Como funciona?

Alguns sinais de código saudável:

```text
nomes claros
responsabilidades coerentes
baixo conhecimento desnecessário
pouca duplicação de regras
funções compreensíveis
efeitos colaterais claros
testes úteis
```

---

## 19.5 Quando eu usaria?

Sempre que estiver desenvolvendo software que precisará evoluir.

---

## 19.6 Quando eu evitaria?

Não existe motivo para buscar "perfeição".

Código limpo não significa código sem trade-offs.

---

## 19.7 Exemplo

Código difícil:

```ts
function p(a: any) {
  if (a.x && !a.y) {
    if (a.z >= 4) {
      return false;
    }

    return true;
  }

  return false;
}
```

Uma refatoração pode começar pelos nomes:

```ts
function podeContinuarCiclo(ciclo: Ciclo) {
  if (!ciclo.estaAberto()) {
    return false;
  }

  if (ciclo.quantidadeDeAulas() >= 4) {
    return false;
  }

  return true;
}
```

Ainda pode haver decisões arquiteturais a fazer, mas a intenção está mais clara.

---

## 19.8 Como aparece no Beach Tennis Manager?

O projeto possui regras de negócio relevantes.

Por isso, clareza é especialmente importante em:

```text
ciclos
faltas
reposições
créditos
configurações por professor
```

Essas regras devem permanecer rastreáveis e testáveis.

---

# 20. Código ruim → análise → refatoração

Considere:

```ts
async function processar(
  studentId: string,
  lessonId: string,
  hours: number,
) {
  const student = await db.student.findById(studentId);

  if (student) {
    if (student.active) {
      const lesson = await db.lesson.findById(lessonId);

      if (lesson) {
        if (lesson.status === "REALIZADA") {
          if (hours >= 6) {
            student.makeupCredits++;
            await db.student.save(student);
            await whatsapp.send(
              student.phone,
              "Você ganhou uma reposição",
            );
            return true;
          }

          return false;
        }
      }
    }
  }

  return false;
}
```

O código pode até funcionar, mas apresenta vários problemas.

## 20.1 Problema — aninhamento

Temos:

```text
if
  if
    if
      if
```

Isso aumenta a carga mental.

---

## 20.2 Problema — responsabilidade

A função:

```text
busca aluno
valida aluno
busca aula
valida aula
interpreta regra
altera estado
salva banco
envia WhatsApp
```

faz muitas coisas.

---

## 20.3 Problema — regra fixa

```ts
hours >= 6
```

No Beach Tennis Manager, esse valor não é uma regra fixa.

O prazo mínimo de aviso é configurável por professor, com possibilidade de fallback para configuração global.

---

## 20.4 Problema — efeito colateral escondido

A função chamada `processar`:

```text
modifica banco
envia WhatsApp
```

O nome não deixa isso claro.

---

## 20.5 Refatoração inicial

Podemos reduzir aninhamento:

```ts
async function processar(
  studentId: string,
  lessonId: string,
  hours: number,
) {
  const student = await db.student.findById(studentId);

  if (!student || !student.active) {
    return false;
  }

  const lesson = await db.lesson.findById(lessonId);

  if (!lesson || lesson.status !== "REALIZADA") {
    return false;
  }

  if (hours < 6) {
    return false;
  }

  student.makeupCredits++;

  await db.student.save(student);

  await whatsapp.send(
    student.phone,
    "Você ganhou uma reposição",
  );

  return true;
}
```

A leitura melhorou.

Mas ainda existe um problema de domínio: a regra foi simplificada demais.

No sistema real, precisamos considerar a documentação de ausência e reposição, inclusive:

```text
professor
configuração aplicável
limite de reposições
ciclo
tipo de ausência
crédito
```

---

## 20.6 Próximo nível

Uma arquitetura mais madura poderia separar:

```text
carregamento de dados
        ↓
regra de negócio
        ↓
persistência
        ↓
notificação
```

Por exemplo:

```text
RegisterAbsence
├── EnrollmentRepository
├── LessonRepository
├── CycleRepository
├── RulesProvider
└── NotificationProvider
```

A estrutura concreta será definida posteriormente.

---

# 21. Testabilidade

## 21.1 O que é?

Testabilidade é o grau em que um código pode ser verificado de maneira fácil e confiável.

---

## 21.2 Por que existe?

Código difícil de testar geralmente possui características que também dificultam manutenção.

---

## 21.3 Qual problema resolve?

Boa testabilidade ajuda a:

- verificar regras;
- detectar regressões;
- refatorar com segurança;
- entender contratos.

---

## 21.4 Como funciona?

Uma função pura:

```ts
function calcularTotal(
  valores: number[],
) {
  return valores.reduce(
    (total, valor) => total + valor,
    0,
  );
}
```

é fácil de testar:

```ts
expect(calcularTotal([10, 20, 30]))
  .toBe(60);
```

Já uma função que:

```text
consulta banco
gera data atual
chama API
altera estado global
```

é mais difícil de testar isoladamente.

---

## 21.5 Quando eu usaria?

Sempre que existir lógica importante.

---

## 21.6 Quando eu evitaria?

Não é necessário testar cada linha.

Teste comportamento relevante.

---

## 21.7 Exemplo

Uma regra:

```text
aviso dentro do prazo
```

pode ser testada isoladamente.

---

## 21.8 Como aparece no Beach Tennis Manager?

Os testes devem cobrir especialmente:

```text
ausência válida
ausência sem aviso
prazo mínimo configurável
limite de reposições
uso de crédito
fechamento de ciclo
```

Sempre seguindo as regras documentadas.

---

# 22. Aplicação integrada no Beach Tennis Manager

Imagine o fluxo:

```text
Registrar ausência
      ↓
buscar matrícula
      ↓
buscar aula
      ↓
identificar professor
      ↓
obter configuração aplicável
      ↓
avaliar regra
      ↓
criar crédito, se aplicável
      ↓
persistir
```

Podemos separar mentalmente:

### Funções puras

```text
avaliar prazo
calcular alguma quantidade
verificar condição
```

### Funções com efeitos colaterais

```text
buscar banco
salvar banco
enviar notificação
```

### Responsabilidade

```text
caso de uso
```

coordena o processo.

### Encapsulamento

```text
entidade/regra
```

protege estado quando apropriado.

### Nomes

Devem comunicar conceitos reais:

```text
minimumNoticeHours
makeupCredit
enrollment
cycle
```

### Testabilidade

As decisões importantes devem poder ser verificadas sem depender de toda a infraestrutura sempre que possível.

---

# 23. Exercícios

## Exercício 1 — Função pura

Crie:

```ts
calcularValorComDesconto(valor, percentual)
```

Requisitos:

- não alterar dados externos;
- receber tudo que precisa por parâmetro;
- retornar o resultado.

Explique por que ela é pura.

---

## Exercício 2 — Função impura

Crie uma função conceitual que:

```text
salve um aluno no banco
```

Explique por que ela não é pura.

---

## Exercício 3 — Refatoração

Refatore:

```ts
function validar(aluno: any) {
  if (aluno) {
    if (aluno.active) {
      if (aluno.cpf) {
        return true;
      }
    }
  }

  return false;
}
```

Melhore:

```text
nomes
aninhamento
tipagem
intenção
```

---

## Exercício 4 — Complexidade

Analise:

```ts
function decidir(
  a: boolean,
  b: boolean,
  c: boolean,
) {
  if (a) {
    if (b) {
      if (c) {
        return 1;
      }

      return 2;
    }

    return 3;
  }

  return 4;
}
```

Responda:

1. Quantas decisões existem?
2. Por que a função é mais difícil de testar?
3. Como você poderia torná-la mais expressiva?

---

## Exercício 5 — Duplicação

Imagine que a regra:

```text
prazo mínimo de aviso
```

está implementada em quatro casos de uso.

Explique:

1. qual é o problema;
2. o que acontece quando a regra muda;
3. como você poderia centralizar a decisão.

---

## Exercício 6 — Beach Tennis Manager

Desenhe em texto o fluxo de:

```text
Registrar ausência
```

Separando:

```text
entrada
regra
efeito colateral
persistência
notificação
```

Depois indique quais partes poderiam ser funções puras.

---

# 24. Perguntas de entrevista

## O que é uma função pura?

É uma função que, para as mesmas entradas, produz sempre a mesma saída e não produz efeitos colaterais observáveis fora dela.

---

## O que é efeito colateral?

É uma ação ou alteração observável além do simples cálculo e retorno de um valor, como modificar estado externo, gravar no banco ou enviar uma requisição.

---

## Toda função deveria ser pura?

Não.

Sistemas reais precisam interagir com recursos externos.

O objetivo é manter efeitos colaterais claros e controlados.

---

## O que é código limpo?

É código que facilita compreensão, teste, manutenção e evolução.

Não é simplesmente código curto ou visualmente bonito.

---

## Como você decide se uma função está grande demais?

Não uso apenas número de linhas.

Analiso:

```text
responsabilidades
complexidade
aninhamento
decisões
efeitos colaterais
dependências
clareza
```

---

## O que é early return?

É retornar antecipadamente quando uma condição impede ou encerra a continuação do fluxo, frequentemente reduzindo aninhamento.

---

## O que é complexidade ciclomática?

É uma métrica que estima a quantidade de caminhos independentes de execução de uma função.

Quanto mais decisões, maior tende a ser a quantidade de cenários que precisam ser considerados.

---

## Toda duplicação deve ser eliminada?

Não.

Precisamos diferenciar repetição textual de duplicação de conhecimento.

Abstrair conceitos diferentes apenas porque possuem código parecido pode piorar o design.

---

## Comentários são bons ou ruins?

Podem ser bons quando explicam contexto, motivo ou restrições que não são evidentes no código.

Comentários que apenas repetem a implementação geralmente acrescentam pouco valor.

---

## O que é mutabilidade?

É a capacidade de alterar o estado de uma estrutura depois que ela foi criada.

---

## Imutabilidade é sempre melhor?

Não.

Ela pode simplificar raciocínio em determinados contextos, mas também possui custos.

A escolha depende do problema.

---

# 25. Perguntas de aprofundamento

### 1. Uma função com 5 linhas pode ser ruim?

Sim.

Tamanho não determina qualidade.

Uma função curta pode possuir nome ruim, alta complexidade ou efeitos colaterais escondidos.

---

### 2. Uma função com 100 linhas pode ser boa?

Pode.

Mas deve ser analisada quanto a responsabilidade, complexidade e clareza.

O tamanho pode ser um sinal de problema, não uma prova.

---

### 3. Por que funções puras são mais fáceis de testar?

Porque o resultado depende apenas das entradas e não exige controlar estado externo ou recursos externos.

---

### 4. Se uma função grava no banco, ela é ruim?

Não.

Ela apenas possui um efeito colateral.

O problema é esconder ou misturar esse efeito com uma responsabilidade que aparenta ser puramente calculacional.

---

### 5. Early return sempre melhora o código?

Não.

Ele pode melhorar o fluxo, mas muitos retornos espalhados também podem dificultar a compreensão em alguns casos.

---

### 6. Por que `any` prejudica funções?

Porque remove informações do contrato que o TypeScript poderia verificar em tempo de compilação.

---

### 7. Qual a relação entre código limpo e testes?

Código com responsabilidades claras, dependências controladas e efeitos explícitos tende a ser mais fácil de testar.

Mas testabilidade não é o único objetivo do design.

---

### 8. Código limpo significa usar mais abstrações?

Não.

Uma abstração desnecessária pode aumentar complexidade.

---

### 9. O que é mais importante: função pequena ou função compreensível?

Função compreensível.

Tamanho é apenas um dos sinais utilizados para avaliar o design.

---

### 10. Como saber se uma refatoração melhorou o código?

Compare:

```text
clareza
responsabilidades
complexidade
testabilidade
duplicação
acoplamento
risco de mudança
```

e, principalmente, confirme que o comportamento esperado continua preservado através dos testes.

---

# 26. Checklist de domínio

### Funções

- [ ] Sei explicar o que é uma função.
- [ ] Sei explicar entrada, saída e contrato.
- [ ] Sei identificar a responsabilidade de uma função.
- [ ] Sei reconhecer uma função que está fazendo coisas demais.
- [ ] Sei decidir quando extrair uma função.

### Funções puras

- [ ] Sei definir função pura.
- [ ] Sei explicar por que ela é mais previsível.
- [ ] Sei diferenciar função pura de impura.
- [ ] Sei identificar efeitos colaterais.

### Código limpo

- [ ] Sei explicar o que significa código limpo.
- [ ] Sei escolher nomes melhores.
- [ ] Sei analisar quantidade de parâmetros.
- [ ] Sei avaliar retornos.
- [ ] Sei usar early return com critério.
- [ ] Sei identificar aninhamento excessivo.
- [ ] Sei reconhecer duplicação de conhecimento.
- [ ] Sei avaliar comentários.

### Complexidade

- [ ] Sei explicar complexidade ciclomática.
- [ ] Sei explicar por que muitas decisões dificultam testes.
- [ ] Sei reconhecer complexidade mesmo em funções curtas.
- [ ] Sei diferenciar métrica de julgamento.

### Mutabilidade

- [ ] Sei explicar mutabilidade.
- [ ] Sei diferenciar mutabilidade local de mutabilidade compartilhada.
- [ ] Sei explicar por que estado compartilhado pode ser perigoso.
- [ ] Sei reconhecer quando encapsulamento pode ajudar.

### Prática

- [ ] Consigo refatorar uma função sem alterar seu comportamento.
- [ ] Consigo separar regra de negócio de efeito colateral.
- [ ] Consigo identificar código difícil de testar.
- [ ] Consigo aplicar esses conceitos ao Beach Tennis Manager.
- [ ] Consigo explicar minhas decisões em uma entrevista.

---

# Conclusão

Funções e código limpo não são sobre seguir regras mecânicas.

O objetivo é reduzir a dificuldade de raciocinar sobre o software.

Ao analisar uma função, procure pensar:

```text
O que ela faz?
      ↓
Qual é sua responsabilidade?
      ↓
Quais são suas entradas?
      ↓
Qual é seu contrato?
      ↓
Qual é sua saída?
      ↓
Ela depende de algo externo?
      ↓
Possui efeitos colaterais?
      ↓
Possui decisões demais?
      ↓
Existe aninhamento desnecessário?
      ↓
Existe duplicação?
      ↓
Os nomes comunicam intenção?
      ↓
É fácil testá-la?
```

No Beach Tennis Manager isso será especialmente importante porque as regras de negócio possuem várias condições e exceções.

Uma implementação madura não significa eliminar toda complexidade.

Significa **organizar a complexidade inevitável de maneira que ela possa ser entendida, testada e modificada**.

Nos próximos módulos, esses fundamentos serão conectados a princípios mais estruturados de design, especialmente **SOLID** e **Injeção de Dependência**.
