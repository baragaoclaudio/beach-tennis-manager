# 08 — Bancos de Dados

> Material de estudo do Beach Tennis Manager.
>
> Este documento reconstrói os fundamentos de bancos de dados relacionais e aprofunda os conceitos necessários para trabalhar profissionalmente com PostgreSQL.
>
> O objetivo não é apenas aprender SQL. É entender como modelar dados, preservar integridade, consultar com eficiência e tomar decisões conscientes sobre persistência.

---

# Sumário

1. [Como estudar bancos de dados](#1-como-estudar-bancos-de-dados)
2. [O que é um banco de dados](#2-o-que-é-um-banco-de-dados)
3. [Banco relacional](#3-banco-relacional)
4. [Tabela, linha e coluna](#4-tabela-linha-e-coluna)
5. [Chave primária](#5-chave-primária)
6. [Chave estrangeira](#6-chave-estrangeira)
7. [Relacionamentos](#7-relacionamentos)
8. [Cardinalidade](#8-cardinalidade)
9. [Integridade referencial](#9-integridade-referencial)
10. [Normalização](#10-normalização)
11. [Denormalização](#11-denormalização)
12. [Tipos de dados](#12-tipos-de-dados)
13. [NULL](#13-null)
14. [Índices](#14-índices)
15. [SELECT, INSERT, UPDATE e DELETE](#15-select-insert-update-e-delete)
16. [WHERE, ORDER BY, GROUP BY e HAVING](#16-where-order-by-group-by-e-having)
17. [JOIN](#17-join)
18. [Subqueries](#18-subqueries)
19. [Transações](#19-transações)
20. [ACID](#20-acid)
21. [Concorrência](#21-concorrência)
22. [Locks](#22-locks)
23. [Isolamento de transações](#23-isolamento-de-transações)
24. [Constraints](#24-constraints)
25. [Views](#25-views)
26. [Stored Procedures e Functions](#26-stored-procedures-e-functions)
27. [PostgreSQL](#27-postgresql)
28. [ORM × SQL](#28-orm--sql)
29. [Migrations](#29-migrations)
30. [Código ruim → análise → refatoração](#30-código-ruim--análise--refatoração)
31. [Aplicação no Beach Tennis Manager](#31-aplicação-no-beach-tennis-manager)
32. [Trade-offs](#32-trade-offs)
33. [Erros comuns](#33-erros-comuns)
34. [Exercícios](#34-exercícios)
35. [Perguntas de entrevista](#35-perguntas-de-entrevista)
36. [Perguntas de aprofundamento](#36-perguntas-de-aprofundamento)
37. [Checklist de domínio](#37-checklist-de-domínio)

---

# 1. Como estudar bancos de dados

Não comece decorando comandos SQL.

Comece entendendo:

```text
qual informação preciso guardar?
qual relação existe entre as informações?
quais regras precisam ser sempre verdadeiras?
como vou consultar?
como várias operações acontecem ao mesmo tempo?
```

A sequência:

```text
Domínio
   ↓
Modelo de dados
   ↓
Tabelas
   ↓
Relacionamentos
   ↓
Constraints
   ↓
Índices
   ↓
Consultas
   ↓
Transações
   ↓
Performance
```

---

# 2. O que é um banco de dados?

## 2.1 O que é?

Banco de dados é um sistema organizado para armazenar, consultar, modificar e proteger informações.

No projeto usamos:

```text
PostgreSQL
```

---

## 2.2 Por que existe?

Aplicações precisam manter informações mesmo depois que o processo da aplicação termina.

Por exemplo:

```text
alunos
professores
turmas
aulas
pagamentos
```

---

## 2.3 Qual problema resolve?

Persistência.

Sem persistência:

```text
reiniciou aplicação
↓
perdeu os dados
```

---

## 2.4 Como funciona?

A aplicação envia operações ao banco:

```text
API
 ↓
PostgreSQL
```

---

## 2.5 Quando eu usaria?

Sempre que dados precisarem sobreviver ao ciclo de vida da aplicação.

---

## 2.6 Quando eu evitaria?

Dados temporários podem ficar apenas em memória ou cache, dependendo do caso.

---

## 2.7 Exemplo

```text
Aluno
id
nome
cpf
```

---

## 2.8 Como aparece no Beach Tennis Manager?

O banco é responsável por persistir informações operacionais e históricas do sistema.

---

# 3. Banco relacional

## 3.1 O que é?

Banco relacional organiza dados em relações, normalmente representadas por tabelas.

Exemplo:

```text
students
professors
groups
lessons
enrollments
```

---

## 3.2 Por que existe?

Para representar entidades e relações entre dados de forma estruturada.

---

## 3.3 Qual problema resolve?

Permite:

```text
integridade
consultas relacionais
transações
restrições
```

---

## 3.4 Como funciona?

Uma tabela pode referenciar outra:

```text
students
   ↑
   |
enrollments
   |
   ↓
groups
```

---

## 3.5 Quando eu usaria?

É uma ótima escolha quando:

```text
relações são importantes
integridade é importante
transações são importantes
```

---

## 3.6 Quando eu evitaria?

Existem cenários em que bancos não relacionais podem ser adequados.

A escolha depende do problema.

---

## 3.7 Exemplo

```text
students
---------
id
name
cpf
```

---

## 3.8 Como aparece no Beach Tennis Manager?

O domínio possui muitas relações:

```text
Professor
Aluno
Turma
Matrícula
Aula
Ciclo
Pagamento
```

Por isso o modelo relacional se encaixa naturalmente.

---

# 4. Tabela, linha e coluna

## 4.1 O que é?

### Tabela

Representa um conjunto estruturado de dados.

### Linha

Representa um registro.

### Coluna

Representa um atributo.

---

## 4.2 Exemplo

```text
students

id | name  | cpf
---|-------|----------
1  | João  | ...
2  | Maria | ...
```

Tabela:

```text
students
```

Linha:

```text
1 | João | ...
```

Coluna:

```text
name
```

---

# 5. Chave primária

## 5.1 O que é?

Primary Key (PK) identifica unicamente uma linha.

---

## 5.2 Por que existe?

Precisamos conseguir distinguir registros.

---

## 5.3 Qual problema resolve?

Evita ambiguidade.

---

## 5.4 Como funciona?

Exemplo:

```sql
CREATE TABLE students (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL
);
```

---

## 5.5 Quando eu usaria?

Toda tabela que representa entidades persistentes normalmente precisa de uma identificação estável.

---

## 5.6 Quando eu evitaria?

Existem tabelas associativas em que uma chave composta pode ser apropriada.

---

## 5.7 Exemplo

No projeto:

```text
student.id = UUID
```

---

## 5.8 Como aparece no Beach Tennis Manager?

O aluno possui UUID como chave técnica.

O CPF possui outra responsabilidade:

```text
UNIQUE
```

para impedir duplicidade.

Isso é importante:

```text
PK ≠ identificador de negócio necessariamente
```

---

# 6. Chave estrangeira

## 6.1 O que é?

Foreign Key (FK) é uma referência entre registros de tabelas.

---

## 6.2 Por que existe?

Para representar relacionamentos.

---

## 6.3 Qual problema resolve?

Ajuda a impedir referências inválidas.

---

## 6.4 Como funciona?

```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id)
);
```

---

## 6.5 Quando eu usaria?

Quando uma tabela depende de outra.

---

## 6.6 Quando eu evitaria?

Não remova FKs apenas para "deixar o banco mais rápido".

Elas representam integridade importante.

---

## 6.7 Exemplo

```text
enrollments.student_id
        ↓
students.id
```

---

## 6.8 Como aparece no Beach Tennis Manager?

Uma matrícula pertence a um aluno.

A FK mantém essa relação no banco.

---

# 7. Relacionamentos

## 7.1 O que é?

Relacionamento representa como entidades se associam.

Exemplo:

```text
Aluno → Matrícula
```

---

## 7.2 Por que existe?

Porque o domínio possui relações.

---

## 7.3 Qual problema resolve?

Permite representar o modelo real no banco.

---

## 7.4 Como funciona?

Uma FK conecta registros.

---

## 7.5 Quando eu usaria?

Sempre que duas entidades possuírem relação persistente.

---

## 7.6 Exemplo

```text
Professor
   ↓
Turma
```

---

## 7.7 Como aparece no Beach Tennis Manager?

Um aluno pode possuir várias matrículas.

Uma matrícula representa a relação comercial/operacional com uma turma/professor.

---

# 8. Cardinalidade

## 8.1 O que é?

Cardinalidade descreve quantos registros de uma entidade podem se relacionar com outra.

---

## 8.2 Tipos comuns

```text
1 : 1
1 : N
N : N
```

---

## 8.3 1:N

Um professor:

```text
1
```

pode possuir várias turmas:

```text
N
```

---

## 8.4 N:N

Um aluno pode participar de várias turmas e uma turma possui vários alunos.

No banco isso normalmente vira uma tabela associativa:

```text
students
    ↕
enrollments
    ↕
groups
```

---

## 8.5 Por que existe?

Para representar corretamente as relações.

---

## 8.6 Como aparece no Beach Tennis Manager?

A matrícula é importante porque a relação entre aluno e turma não é apenas um "sim/não".

Ela possui informações próprias, como:

```text
professor
condições comerciais
preço efetivo
estado da matrícula
```

---

# 9. Integridade referencial

## 9.1 O que é?

É a garantia de que referências entre tabelas permaneçam válidas.

---

## 9.2 Por que existe?

Evita dados órfãos ou referências inexistentes.

---

## 9.3 Qual problema resolve?

Exemplo inválido:

```text
enrollment.student_id
→ estudante que não existe
```

---

## 9.4 Como funciona?

Por meio de Foreign Keys e regras de integridade.

---

## 9.5 Quando eu usaria?

Sempre que relações forem importantes.

---

## 9.6 Exemplo

```sql
REFERENCES students(id)
```

---

## 9.7 Como aparece no Beach Tennis Manager?

Uma matrícula não deve apontar para um aluno inexistente.

---

# 10. Normalização

## 10.1 O que é?

Normalização é o processo de organizar dados para reduzir redundância inadequada e problemas de atualização.

---

## 10.2 Por que existe?

Imagine:

```text
enrollment
student_name
student_cpf
student_phone
```

repetido em centenas de registros.

Se o telefone mudar, precisamos atualizar muitos lugares.

---

## 10.3 Qual problema resolve?

Ajuda a evitar:

```text
duplicação
inconsistência
anomalias de atualização
```

---

## 10.4 Como funciona?

Separando conceitos relacionados em estruturas adequadas.

```text
students
enrollments
```

---

## 10.5 Quando eu usaria?

Como ponto de partida para modelagem relacional.

---

## 10.6 Quando eu evitaria?

Normalização excessiva pode gerar consultas e complexidade desnecessárias.

---

## 10.7 Exemplo

Em vez de:

```text
enrollments
student_name
student_cpf
group_name
```

preferir referências:

```text
enrollments
student_id
group_id
```

---

## 10.8 Como aparece no Beach Tennis Manager?

O aluno deve existir uma vez, identificado por UUID, com CPF único.

Suas matrículas representam relações diferentes.

---

# 11. Denormalização

## 11.1 O que é?

Denormalização é duplicar ou reorganizar dados deliberadamente para melhorar determinados acessos.

---

## 11.2 Por que existe?

Algumas consultas podem ser muito frequentes ou caras.

---

## 11.3 Qual problema resolve?

Pode melhorar leitura em situações específicas.

---

## 11.4 Como funciona?

Mantendo informação derivada ou duplicada.

---

## 11.5 Quando eu usaria?

Somente com uma necessidade identificada.

---

## 11.6 Quando eu evitaria?

Não denormalize antecipadamente.

Duplicação cria custo de consistência.

---

# 12. Tipos de dados

## 12.1 O que é?

Cada coluna possui um tipo.

Exemplos PostgreSQL:

```text
UUID
TEXT
INTEGER
NUMERIC
BOOLEAN
TIMESTAMP
DATE
JSONB
```

---

## 12.2 Por que existe?

O banco precisa saber como armazenar e validar os valores.

---

## 12.3 Qual problema resolve?

Evita armazenar qualquer coisa em qualquer coluna.

---

## 12.4 Exemplo

```sql
price NUMERIC(10,2)
active BOOLEAN
created_at TIMESTAMP
```

---

## 12.5 Como aparece no Beach Tennis Manager?

Valores financeiros devem ser modelados cuidadosamente.

Não devemos tratar dinheiro como um detalhe irrelevante de ponto flutuante.

---

# 13. NULL

## 13.1 O que é?

`NULL` representa ausência de valor conhecido.

Não significa:

```text
0
```

nem:

```text
""
```

---

## 13.2 Por que existe?

Alguns campos realmente podem não possuir valor.

---

## 13.3 Qual problema resolve?

Representa opcionalidade.

---

## 13.4 Exemplo

```sql
replaced_by_id UUID NULL
```

No projeto, um refresh token ainda não substituído pode ter:

```text
replaced_by_id = NULL
```

---

## 13.5 Cuidado

SQL possui lógica envolvendo `NULL`.

Por exemplo:

```sql
WHERE column = NULL
```

não é a forma correta de testar NULL.

Use:

```sql
WHERE column IS NULL
```

---

# 14. Índices

## 14.1 O que é?

Índice é uma estrutura auxiliar que permite localizar dados com mais eficiência.

---

## 14.2 Por que existe?

Sem índice, o banco pode precisar verificar muitas linhas.

---

## 14.3 Qual problema resolve?

Pode melhorar consultas seletivas.

---

## 14.4 Como funciona?

Exemplo:

```sql
CREATE INDEX students_cpf_idx
ON students(cpf);
```

---

## 14.5 Quando eu usaria?

Colunas frequentemente usadas em:

```text
WHERE
JOIN
ORDER BY
```

dependendo do padrão de consulta.

---

## 14.6 Quando eu evitaria?

Índice tem custo:

```text
espaço
INSERT
UPDATE
DELETE
manutenção
```

Não indexe tudo.

---

## 14.7 Exemplo

Se consultamos frequentemente:

```sql
SELECT *
FROM students
WHERE cpf = $1;
```

um índice em CPF pode ser importante.

---

## 14.8 Como aparece no Beach Tennis Manager?

Índices existem em pontos relevantes, incluindo:

```text
CPF
FKs
refresh token
family_id
```

A necessidade de cada índice deve ser baseada no acesso real.

---

# 15. SELECT, INSERT, UPDATE e DELETE

## SELECT

Consulta dados:

```sql
SELECT *
FROM students;
```

## INSERT

Cria dados:

```sql
INSERT INTO students (id, name)
VALUES ($1, $2);
```

## UPDATE

Altera dados:

```sql
UPDATE students
SET name = $1
WHERE id = $2;
```

## DELETE

Remove dados:

```sql
DELETE FROM students
WHERE id = $1;
```

---

# 16. WHERE, ORDER BY, GROUP BY e HAVING

## WHERE

Filtra linhas:

```sql
SELECT *
FROM students
WHERE active = true;
```

---

## ORDER BY

Ordena:

```sql
SELECT *
FROM students
ORDER BY name;
```

---

## GROUP BY

Agrupa:

```sql
SELECT professor_id, COUNT(*)
FROM enrollments
GROUP BY professor_id;
```

---

## HAVING

Filtra grupos:

```sql
SELECT professor_id, COUNT(*)
FROM enrollments
GROUP BY professor_id
HAVING COUNT(*) > 5;
```

Diferença importante:

```text
WHERE  → antes do agrupamento
HAVING → depois do agrupamento
```

---

# 17. JOIN

## 17.1 O que é?

JOIN combina dados relacionados de tabelas.

---

## 17.2 Por que existe?

Dados normalizados ficam separados.

Precisamos combiná-los nas consultas.

---

## 17.3 Qual problema resolve?

Permite obter informações relacionadas.

---

## 17.4 INNER JOIN

Retorna registros com correspondência nas duas tabelas.

```sql
SELECT
  students.name,
  enrollments.id
FROM students
INNER JOIN enrollments
  ON enrollments.student_id = students.id;
```

---

## 17.5 LEFT JOIN

Mantém registros da tabela da esquerda mesmo sem correspondência.

```sql
SELECT
  students.name,
  enrollments.id
FROM students
LEFT JOIN enrollments
  ON enrollments.student_id = students.id;
```

Isso pode encontrar alunos sem matrícula.

---

## 17.6 Quando eu usaria?

Sempre que uma consulta precisar combinar entidades relacionadas.

---

## 17.7 Como aparece no Beach Tennis Manager?

Relatórios podem combinar:

```text
aluno
matrícula
turma
professor
pagamento
```

---

# 18. Subqueries

## 18.1 O que é?

Uma subquery é uma consulta dentro de outra consulta.

Exemplo:

```sql
SELECT *
FROM students
WHERE id IN (
  SELECT student_id
  FROM enrollments
);
```

---

## 18.2 Por que existe?

Permite expressar consultas dependentes de outro resultado.

---

## 18.3 Qual problema resolve?

Algumas consultas ficam mais naturais com subqueries.

---

## 18.4 Quando eu usaria?

Quando uma consulta interna representa claramente uma etapa lógica.

---

## 18.5 Quando eu evitaria?

Se um JOIN ou CTE tornar a consulta mais clara ou eficiente.

---

# 19. Transações

## 19.1 O que é?

Transação agrupa operações que devem ser tratadas como uma unidade lógica.

---

## 19.2 Por que existe?

Imagine:

```text
registrar pagamento
↓
atualizar ciclo
↓
registrar histórico
```

Se a segunda operação falhar, talvez não seja aceitável manter apenas a primeira.

---

## 19.3 Qual problema resolve?

Consistência entre múltiplas alterações.

---

## 19.4 Como funciona?

Conceitualmente:

```sql
BEGIN;

-- operação 1
-- operação 2
-- operação 3

COMMIT;
```

Se algo falhar:

```sql
ROLLBACK;
```

---

## 19.5 Quando eu usaria?

Quando várias operações precisam ser atomicamente consistentes.

---

## 19.6 Quando eu evitaria?

Não coloque uma transação gigante envolvendo operações independentes.

---

## 19.7 Como aparece no Beach Tennis Manager?

Uma operação de negócio que altera várias entidades relacionadas pode exigir transação.

Exemplo conceitual:

```text
registrar pagamento
      ↓
atualizar ciclo
      ↓
registrar histórico
```

---

# 20. ACID

## A — Atomicity

Ou tudo acontece, ou nada acontece.

```text
A + B + C
```

Se C falhar, A e B podem ser revertidos.

---

## C — Consistency

A transação deve preservar as regras de integridade do banco.

---

## I — Isolation

Transações concorrentes devem possuir comportamento controlado.

---

## D — Durability

Depois do commit, os dados devem persistir de acordo com as garantias do banco.

---

# 21. Concorrência

## 21.1 O que é?

Concorrência acontece quando múltiplas operações trabalham sobre dados relacionados ao mesmo tempo.

---

## 21.2 Por que existe?

Em uma API real:

```text
usuário A
usuário B
```

podem executar operações simultaneamente.

---

## 21.3 Qual problema resolve?

Precisamos impedir estados inválidos causados por condições de corrida.

**Race condition** é uma situação em que o resultado depende da ordem imprevisível de operações concorrentes.

---

## 21.4 Exemplo

Duas pessoas tentam ocupar a última vaga:

```text
A consulta → 1 vaga
B consulta → 1 vaga
A ocupa
B ocupa
```

Sem proteção adequada:

```text
1 vaga
↓
2 ocupações
```

---

## 21.5 Como aparece no Beach Tennis Manager?

Regras como:

```text
máximo de 4 alunos
```

podem exigir atenção à concorrência quando duas matrículas são criadas simultaneamente.

---

# 22. Locks

## 22.1 O que é?

Lock é um mecanismo usado para controlar acesso concorrente a determinados dados.

---

## 22.2 Por que existe?

Para evitar determinadas alterações conflitantes.

---

## 22.3 Qual problema resolve?

Pode proteger operações críticas.

---

## 22.4 Como funciona?

Dependendo da estratégia, uma transação pode bloquear determinado registro enquanto trabalha com ele.

---

## 22.5 Quando eu usaria?

Quando houver uma condição de concorrência real que precise de proteção.

---

## 22.6 Quando eu evitaria?

Locks excessivos podem reduzir concorrência e causar espera.

---

# 23. Isolamento de transações

PostgreSQL oferece níveis de isolamento.

O conceito central é:

```text
quanto uma transação consegue observar
das operações de outras transações.
```

Um nível mais forte pode oferecer maior isolamento, mas pode aumentar custos de concorrência.

O nível padrão do PostgreSQL é:

```text
READ COMMITTED
```

---

## Por que isso importa?

Imagine duas operações lendo e alterando o mesmo dado.

Precisamos saber:

```text
o que cada uma pode enxergar?
```

Isso influencia o design das operações concorrentes.

---

# 24. Constraints

## 24.1 O que são?

Constraints são regras impostas pelo banco.

Exemplos:

```text
PRIMARY KEY
FOREIGN KEY
UNIQUE
NOT NULL
CHECK
```

---

## 24.2 Por que existem?

Para impedir estados inválidos.

---

## 24.3 Exemplo

```sql
cpf TEXT NOT NULL UNIQUE
```

Isso expressa:

```text
CPF é obrigatório
CPF não pode se repetir
```

---

## 24.4 Como aparece no Beach Tennis Manager?

CPF é um identificador de negócio importante para evitar duplicidade.

Por isso:

```text
students.id → PK
students.cpf → UNIQUE
```

---

# 25. Views

## 25.1 O que é?

View é uma consulta salva que pode ser usada como uma estrutura consultável.

---

## 25.2 Por que existe?

Pode simplificar consultas recorrentes.

---

## 25.3 Qual problema resolve?

Centraliza uma consulta complexa.

---

## 25.4 Quando eu usaria?

Para relatórios ou consultas reutilizadas, dependendo do caso.

---

## 25.5 Quando eu evitaria?

Não transforme toda consulta em view.

---

# 26. Stored Procedures e Functions

## 26.1 O que são?

São rotinas executadas pelo banco.

---

## 26.2 Por que existem?

Algumas regras ou operações podem fazer sentido dentro do banco.

---

## 26.3 Qual problema resolvem?

Podem centralizar determinadas operações de dados.

---

## 26.4 Quando eu usaria?

Em necessidades específicas de banco, performance ou operações fortemente relacionadas ao próprio banco.

---

## 26.5 Quando eu evitaria?

Não coloque automaticamente toda regra de negócio dentro do PostgreSQL.

Isso pode dificultar testes, evolução e portabilidade.

---

# 27. PostgreSQL

## 27.1 O que é?

PostgreSQL é um sistema gerenciador de banco de dados relacional.

---

## 27.2 Por que existe?

Oferece:

```text
SQL
transações
constraints
índices
concorrência
JSONB
extensibilidade
```

entre muitos outros recursos.

---

## 27.3 Como aparece no Beach Tennis Manager?

O projeto utiliza:

```text
PostgreSQL 16
```

em desenvolvimento via Docker Compose.

---

# 28. ORM × SQL

## ORM

Object-Relational Mapper.

É uma ferramenta que permite trabalhar com dados relacionais através de abstrações da linguagem.

O projeto utiliza:

```text
Drizzle ORM
```

---

## SQL

É a linguagem utilizada para consultar e manipular dados relacionais.

---

## Por que usar ORM?

Pode facilitar:

```text
tipagem
composição
manutenção
integração com TypeScript
```

---

## Por que aprender SQL mesmo usando ORM?

Porque ORM não elimina:

```text
JOIN
índice
transação
cardinalidade
plano de execução
constraints
```

O banco continua sendo relacional.

---

## Como aparece no Beach Tennis Manager?

Usamos:

```text
TypeScript
↓
Drizzle
↓
SQL
↓
PostgreSQL
```

O conhecimento de SQL continua essencial.

---

# 29. Migrations

## 29.1 O que é?

Migration é uma alteração versionada do schema do banco.

---

## 29.2 Por que existe?

O código e o banco precisam evoluir juntos.

---

## 29.3 Qual problema resolve?

Permite registrar:

```text
criação de tabela
alteração de coluna
novo índice
nova constraint
```

de forma rastreável.

---

## 29.4 Como funciona?

Exemplo conceitual:

```text
0000_initial_schema
0001_replace_sessions_with_refresh_tokens
```

---

## 29.5 Quando eu usaria?

Sempre que o schema fizer parte de uma aplicação versionada.

---

## 29.6 Como aparece no Beach Tennis Manager?

O projeto utiliza:

```text
Drizzle migrations
```

e as alterações do banco ficam versionadas no Git.

---

# 30. Código ruim → análise → refatoração

## 30.1 Código inicial

Imagine:

```ts
async function registerPayment(
  studentId: string,
  amount: number,
) {
  await db.insert(payments).values({
    studentId,
    amount,
  });

  await db
    .update(cycles)
    .set({
      paid: true,
    })
    .where(eq(cycles.studentId, studentId));
}
```

---

## 30.2 Problema

São duas operações relacionadas.

Se:

```text
INSERT payment
```

funcionar e:

```text
UPDATE cycle
```

falhar:

```text
pagamento existe
ciclo não foi atualizado
```

Podemos criar inconsistência.

---

## 30.3 Refatoração

Conceitualmente:

```ts
await db.transaction(async (tx) => {
  await tx.insert(payments).values({
    studentId,
    amount,
  });

  await tx
    .update(cycles)
    .set({
      paid: true,
    })
    .where(eq(cycles.studentId, studentId));
});
```

Agora as operações fazem parte de uma transação.

---

## 30.4 Ainda precisamos analisar a regra

Transação não responde:

```text
qual ciclo deve ser atualizado?
```

nem:

```text
qual valor deve ser registrado?
```

Essas são decisões da aplicação/domínio.

Banco garante integridade estrutural.

---

# 31. Aplicação no Beach Tennis Manager

Uma visão simplificada do domínio persistido:

```text
Professor
   ↓
Turma
   ↓
Matrícula
   ↓
Aluno

Turma
   ↓
Aula

Matrícula
   ↓
Ciclo
   ↓
Pagamento

Matrícula
   ↓
Ausência
   ↓
Crédito / Reposição
```

---

## 31.1 Aluno

Características importantes:

```text
UUID
CPF UNIQUE
dados pessoais
```

---

## 31.2 Matrícula

É especialmente importante porque representa uma relação operacional.

Não devemos tratar:

```text
Aluno
```

como se ele fosse a própria matrícula.

Um aluno pode ter:

```text
Matrícula A
Matrícula B
```

---

## 31.3 Turma

Representa uma configuração recorrente:

```text
dia
horário
professor
capacidade
```

---

## 31.4 Aula

Representa uma ocorrência concreta.

Isso diferencia:

```text
Turma = configuração recorrente
Aula = ocorrência
```

---

## 31.5 Ciclo

Representa o ciclo comercial de quatro aulas.

O ciclo:

```text
não depende necessariamente do mês
```

e começa quando ocorre a primeira aula efetivamente realizada ou utilizada como parte daquele ciclo.

---

## 31.6 Configurações

Regras como:

```text
prazo mínimo para aviso
limite de reposições
```

podem possuir:

```text
configuração global
+
override por professor
```

O snapshot aplicável ao ciclo deve ser congelado quando o ciclo começa, conforme as regras do projeto.

---

## 31.7 Histórico

O banco deve preservar informações históricas relevantes.

Por exemplo:

```text
valor efetivamente cobrado
configuração aplicável
estado do ciclo
```

Isso evita que alterações futuras mudem silenciosamente o passado.

---

# 32. Trade-offs

## Normalização

Ganhos:

```text
consistência
menos duplicação
```

Custos:

```text
mais JOINs
```

---

## Denormalização

Ganhos:

```text
leituras específicas
```

Custos:

```text
duplicação
sincronização
complexidade
```

---

## Índices

Ganhos:

```text
consultas mais rápidas
```

Custos:

```text
espaço
escritas mais caras
```

---

## ORM

Ganhos:

```text
produtividade
tipagem
integração
```

Custos:

```text
abstração
possíveis consultas inadequadas
```

---

## Constraints

Ganhos:

```text
integridade
```

Custos:

```text
regras adicionais que precisam ser consideradas nas operações
```

---

# 33. Erros comuns

## 33.1 "ORM elimina SQL"

Não.

Você precisa entender o SQL produzido e o modelo relacional.

---

## 33.2 "Índice sempre melhora"

Não.

Índices também têm custo.

---

## 33.3 "UUID resolve tudo"

UUID resolve identificação técnica.

Não resolve:

```text
duplicidade de CPF
regra de negócio
integridade
```

---

## 33.4 "FK é opcional"

Não necessariamente.

Remover FK pode transferir uma responsabilidade importante para a aplicação.

---

## 33.5 "Banco deve conter toda a regra de negócio"

Não.

Algumas invariantes pertencem ao banco; outras pertencem ao domínio/aplicação.

---

## 33.6 "Transação resolve concorrência"

Não automaticamente.

Transação, isolamento, locks e constraints são ferramentas diferentes.

---

## 33.7 "SELECT * é sempre bom"

Não.

Em consultas reais, selecionar somente as colunas necessárias pode melhorar clareza e reduzir dados transportados.

---

# 34. Exercícios

## Exercício 1 — Modelo

Desenhe:

```text
Aluno
Professor
Turma
Matrícula
Aula
Ciclo
Pagamento
```

e seus relacionamentos.

---

## Exercício 2 — PK × CPF

Explique por que:

```text
student.id = PK
student.cpf = UNIQUE
```

é diferente de usar CPF como chave primária.

---

## Exercício 3 — Cardinalidade

Determine:

```text
Professor → Turma
Aluno → Matrícula
Turma → Aula
Matrícula → Ciclo
```

qual é a cardinalidade de cada relação.

---

## Exercício 4 — SQL

Escreva uma consulta que retorne:

```text
nome do aluno
nome da turma
```

usando JOIN.

---

## Exercício 5 — Índice

Para esta consulta:

```sql
SELECT *
FROM students
WHERE cpf = $1;
```

explique quando um índice em CPF pode ajudar.

---

## Exercício 6 — Transação

Imagine:

```text
registrar pagamento
atualizar ciclo
registrar histórico
```

Explique por que uma transação pode ser necessária.

---

## Exercício 7 — Concorrência

Duas pessoas tentam ocupar a última vaga de uma turma.

Explique como poderia ocorrer uma race condition e quais mecanismos poderiam ser avaliados para proteger a regra.

---

## Exercício 8 — Beach Tennis Manager

Modele as relações:

```text
Aluno
Matrícula
Turma
Professor
```

e explique por que a matrícula não deve simplesmente ser substituída por uma FK direta entre aluno e turma.

---

# 35. Perguntas de entrevista

## O que é banco relacional?

É um banco que organiza dados em relações/tabelas e permite representar relacionamentos entre elas.

---

## O que é Primary Key?

É uma chave que identifica unicamente um registro.

---

## O que é Foreign Key?

É uma referência que relaciona um registro a outro registro de outra tabela.

---

## O que é normalização?

É a organização dos dados para reduzir redundância inadequada e problemas de consistência.

---

## O que é índice?

É uma estrutura auxiliar que pode tornar determinadas consultas mais eficientes.

---

## Índice sempre melhora performance?

Não.

Tem custo de armazenamento e manutenção nas operações de escrita.

---

## O que é transação?

É uma unidade lógica de operações que pode ser confirmada ou revertida de forma controlada.

---

## O que é ACID?

```text
Atomicity
Consistency
Isolation
Durability
```

São propriedades associadas a transações confiáveis.

---

## O que é JOIN?

É uma operação que combina dados relacionados de tabelas.

---

## INNER JOIN × LEFT JOIN?

`INNER JOIN` retorna correspondências.

`LEFT JOIN` mantém todos os registros da tabela esquerda, mesmo sem correspondência.

---

## ORM elimina a necessidade de SQL?

Não.

Conhecer SQL e o comportamento do banco continua importante.

---

# 36. Perguntas de aprofundamento

### 1. Quando usar UUID?

Quando uma identificação técnica desse tipo fizer sentido para o sistema.

---

### 2. Por que não usar CPF como PK?

Porque CPF é um identificador de negócio, enquanto a PK representa a identidade técnica do registro.

Além disso, regras de negócio podem mudar de natureza e sistemas frequentemente precisam de identificadores técnicos independentes.

---

### 3. O que é uma race condition?

É uma condição em que o resultado depende da ordem de operações concorrentes.

---

### 4. Como evitar duas pessoas ocuparem a última vaga?

A solução depende do modelo.

Pode envolver:

```text
constraint
transação
isolamento
lock
operação atômica
```

A escolha depende do fluxo.

---

### 5. Quando normalizar?

Normalização costuma ser o ponto de partida.

Depois podemos avaliar necessidades reais de performance.

---

### 6. Quando denormalizar?

Quando existe uma necessidade concreta e mensurável que justifique o custo de duplicação.

---

### 7. Transaction e Lock são iguais?

Não.

Transaction define uma unidade de trabalho.

Lock é um mecanismo de controle de concorrência.

---

### 8. O que é integridade referencial?

É garantir que relações entre registros permaneçam válidas.

---

### 9. O que é constraint?

É uma regra que o banco aplica aos dados.

---

### 10. Por que entender o banco se usamos Drizzle?

Porque Drizzle é uma abstração.

O comportamento final continua dependendo do PostgreSQL, SQL, índices, transações e modelo relacional.

---

# 37. Checklist de domínio

- [ ] Sei explicar banco de dados.
- [ ] Sei explicar banco relacional.
- [ ] Sei explicar tabela, linha e coluna.
- [ ] Sei explicar PK.
- [ ] Sei explicar FK.
- [ ] Sei explicar relacionamentos.
- [ ] Sei explicar cardinalidade.
- [ ] Sei explicar integridade referencial.
- [ ] Sei explicar normalização.
- [ ] Sei explicar denormalização.
- [ ] Sei escolher tipos de dados básicos.
- [ ] Sei explicar NULL.
- [ ] Sei explicar índices.
- [ ] Sei usar SELECT.
- [ ] Sei usar INSERT.
- [ ] Sei usar UPDATE.
- [ ] Sei usar DELETE.
- [ ] Sei explicar WHERE.
- [ ] Sei explicar GROUP BY.
- [ ] Sei explicar HAVING.
- [ ] Sei explicar JOIN.
- [ ] Sei explicar subquery.
- [ ] Sei explicar transação.
- [ ] Sei explicar ACID.
- [ ] Sei explicar concorrência.
- [ ] Sei explicar race condition.
- [ ] Sei explicar locks.
- [ ] Sei explicar isolamento.
- [ ] Sei explicar constraints.
- [ ] Sei explicar ORM × SQL.
- [ ] Sei explicar migrations.
- [ ] Sei relacionar tudo isso ao PostgreSQL.
- [ ] Consigo explicar o modelo do Beach Tennis Manager.

---

# Conclusão

Trabalhar profissionalmente com banco de dados não significa apenas saber escrever:

```sql
SELECT * FROM students;
```

É entender:

```text
como os dados são modelados
↓
como se relacionam
↓
quais estados são válidos
↓
como garantir integridade
↓
como consultar
↓
como proteger concorrência
↓
como evoluir o schema
↓
como manter performance
```

No Beach Tennis Manager, isso é especialmente importante porque o banco não guarda apenas cadastros.

Ele precisa preservar a história operacional do negócio:

```text
Aluno
 ↓
Matrícula
 ↓
Ciclo
 ↓
Aulas
 ↓
Presença / Ausência
 ↓
Créditos / Reposições
 ↓
Pagamentos
```

Uma decisão errada de modelagem pode gerar problemas muito maiores depois.

Por isso, antes de criar uma tabela, a pergunta não deve ser:

> "Qual tabela eu crio?"

Deve ser:

> "Qual conceito do negócio estou representando e quais regras precisam permanecer verdadeiras?"

Esse raciocínio conecta banco de dados diretamente à arquitetura e ao domínio.

O próximo estudo será **09 — HTTP e APIs**, aprofundando HTTP, métodos, status codes, headers, cookies, autenticação, REST, idempotência, paginação, versionamento, erros de API e como tudo isso se aplica ao backend Fastify do Beach Tennis Manager.
