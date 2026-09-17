# 11 — Testes

> Testar não é apenas procurar bugs. É criar evidência de que o sistema se comporta como foi projetado.

## Sumário

1. O que são testes
2. Por que testar?
3. O que um teste realmente verifica?
4. Testes unitários
5. Testes de integração
6. Testes end-to-end
7. Pirâmide de testes
8. Arrange, Act, Assert
9. Test Doubles
10. Mock, Stub, Spy e Fake
11. O que testar?
12. O que não testar?
13. Testabilidade
14. Dependências e testes
15. Testes de regras de negócio
16. Testes de API
17. Testes de autenticação
18. Testes de autorização
19. Testes de banco de dados
20. Testes de frontend
21. Testes determinísticos
22. Flaky tests
23. Cobertura de código
24. TDD
25. BDD
26. Testes no Beach Tennis Manager
27. Estratégia de testes do projeto
28. Erros comuns
29. Trade-offs
30. Exercícios
31. Perguntas de entrevista
32. Perguntas de aprofundamento
33. Checklist

---

# 1. O que são testes?

Um teste automatizado executa uma parte do sistema e verifica se o resultado corresponde ao comportamento esperado.

Exemplo:

```text
entrada
  ↓
código
  ↓
resultado
  ↓
assertion
```

**Assertion** é uma verificação que declara o que esperamos que aconteça.

Exemplo conceitual:

```ts
expect(result).toBe(4);
```

Estamos dizendo:

> Espero que `result` seja igual a 4.

---

# 2. Por que testar?

Imagine uma regra do Beach Tennis Manager:

> Uma ausência com aviso dentro do prazo pode gerar crédito de reposição.

Se essa regra estiver somente na cabeça do desenvolvedor, ela pode ser quebrada durante uma refatoração.

Um teste transforma a regra em uma proteção executável.

```text
Regra
 ↓
Teste
 ↓
Implementação
```

Quando alguém altera o código:

```text
teste passa
→ comportamento continua compatível

teste falha
→ alguma coisa mudou
```

## Benefícios

Testes ajudam a:

- detectar regressões;
- documentar comportamento;
- permitir refatorações;
- aumentar confiança;
- identificar bugs cedo;
- tornar decisões técnicas verificáveis.

**Regressão** significa uma funcionalidade que funcionava anteriormente deixar de funcionar após uma alteração.

---

# 3. O que um teste realmente verifica?

Um teste bom não deveria simplesmente perguntar:

> "O código executou?"

Ele deveria verificar comportamento.

Exemplo ruim:

```text
chamei função X
→ não lançou erro
```

Isso pode ser insuficiente.

Melhor:

```text
dada uma ausência válida
→ quando registrar a ausência
→ então deve existir crédito de reposição
```

O foco está no comportamento observável.

---

# 4. Testes unitários

## O que são?

Testes unitários verificam uma unidade pequena do código isoladamente.

Uma unidade pode ser:

- função;
- classe;
- serviço;
- use case.

Exemplo:

```text
calculateCycleProgress()
```

pode ser testada sem subir a aplicação inteira.

## Por que existem?

Para verificar rapidamente regras pequenas.

## Exemplo

```ts
describe("calculateCycleProgress", () => {
  it("returns four when four classes were completed", () => {
    const result = calculateCycleProgress(4);

    expect(result).toBe(4);
  });
});
```

## Quando usar?

Principalmente para:

- regras de negócio;
- funções puras;
- transformações;
- validações;
- casos de erro.

## Vantagem

Normalmente são:

- rápidos;
- baratos;
- fáceis de executar.

## Limitação

Um teste unitário pode passar mesmo quando a integração real entre componentes está quebrada.

---

# 5. Testes de integração

## O que são?

Testes de integração verificam a interação entre componentes reais.

Exemplo:

```text
Use Case
   ↓
Repository
   ↓
PostgreSQL
```

Podemos testar essa integração usando um banco de teste.

## Problema que resolvem

Um mock pode dizer:

```text
repository.save()
→ funcionou
```

mas isso não prova que:

```text
SQL
→ banco
```

está correto.

Testes de integração ajudam a encontrar esse tipo de problema.

## Exemplo no BTM

Testar:

```text
criação de aluno
 ↓
repository
 ↓
Drizzle
 ↓
PostgreSQL
```

---

# 6. Testes end-to-end

**End-to-end**, ou E2E, significa testar o sistema de ponta a ponta.

Exemplo:

```text
Browser
 ↓
Frontend
 ↓
HTTP
 ↓
API
 ↓
Banco
```

Um teste poderia:

1. abrir login;
2. informar credenciais;
3. autenticar;
4. acessar uma página protegida;
5. consultar dados.

## Vantagem

Valida o fluxo completo.

## Desvantagem

Normalmente é:

- mais lento;
- mais complexo;
- mais sujeito a problemas de ambiente.

Por isso não devemos transformar todos os testes em E2E.

---

# 7. Pirâmide de testes

Uma estratégia comum é:

```text
             E2E
            /   \
        Integração
       /           \
    Unitários
```

A base possui muitos testes unitários.

No meio:

```text
integração
```

No topo:

```text
E2E
```

A ideia é ter:

```text
muitos testes rápidos
+
menos testes caros
```

Não é uma lei absoluta. A distribuição ideal depende do sistema.

---

# 8. Arrange, Act, Assert

Um padrão simples para organizar testes:

```text
Arrange
Act
Assert
```

## Arrange

Preparar o cenário.

```ts
const user = makeUser();
```

## Act

Executar a ação.

```ts
const result = service.execute(user);
```

## Assert

Verificar o resultado.

```ts
expect(result.active).toBe(true);
```

Visualmente:

```text
Arrange
  ↓
Act
  ↓
Assert
```

Esse padrão torna o teste mais fácil de ler.

---

# 9. Test Doubles

**Test double** é um substituto de uma dependência real durante um teste.

Imagine:

```text
LoginUseCase
    ↓
UserRepository
```

Para testar o use case sem banco, podemos substituir o repository.

```text
LoginUseCase
    ↓
Fake Repository
```

Isso permite controlar o cenário.

---

# 10. Mock, Stub, Spy e Fake

Esses termos frequentemente aparecem juntos.

## Stub

Fornece respostas controladas.

```text
findByEmail()
→ retorna usuário específico
```

## Spy

Registra informações sobre uma chamada.

Por exemplo:

```text
sendEmail()
→ foi chamado?
→ quantas vezes?
→ com quais argumentos?
```

## Mock

Normalmente é um substituto configurado com expectativas sobre chamadas.

O significado exato varia entre bibliotecas.

## Fake

É uma implementação simplificada, mas funcional.

Exemplo:

```text
InMemoryUserRepository
```

em vez de:

```text
PostgresUserRepository
```

### Resumo

```text
Stub
→ controla resposta

Spy
→ observa chamadas

Mock
→ verifica expectativas

Fake
→ implementação alternativa simplificada
```

Não trate essas definições como universais: ferramentas diferentes usam a terminologia de maneiras ligeiramente diferentes.

---

# 11. O que testar?

A prioridade deve ser comportamento importante.

Principalmente:

- regras de negócio;
- casos de sucesso;
- casos de erro;
- limites;
- permissões;
- integrações críticas;
- fluxos financeiros;
- autenticação.

Exemplo:

```text
ciclo possui 4 aulas
→ deve encerrar

ausência válida
→ pode gerar crédito

ausência sem direito
→ não gera crédito
```

---

# 12. O que não testar?

Não precisamos testar absolutamente tudo.

Testar:

```text
const x = 1;
```

isoladamente geralmente não agrega valor.

Também devemos evitar testes excessivamente acoplados à implementação.

Um teste não deveria quebrar simplesmente porque mudamos:

```text
nome de uma variável privada
```

se o comportamento externo permaneceu igual.

---

# 13. Testabilidade

**Testabilidade** é o quanto um código facilita ser testado.

Compare:

```ts
function calculateTotal(price: number, quantity: number) {
  return price * quantity;
}
```

com uma função que:

- acessa banco;
- consulta relógio;
- chama API;
- lê arquivo;
- modifica estado global.

A primeira é naturalmente mais simples de testar.

Isso não significa que devemos transformar tudo em funções puras.

Significa que arquitetura e design podem facilitar testes.

---

# 14. Dependências e testes

Considere:

```text
CreateStudentUseCase
       ↓
StudentRepository
       ↓
PostgreSQL
```

Se o objetivo é testar somente a regra do use case, podemos fornecer uma implementação falsa do repository.

Isso se conecta diretamente com **Injeção de Dependência**.

```text
Use Case
   ↓
interface
   ↑
Fake
```

Durante produção:

```text
Use Case
   ↓
interface
   ↑
PostgresRepository
```

Durante teste:

```text
Use Case
   ↓
interface
   ↑
InMemoryRepository
```

---

# 15. Testes de regras de negócio

Essa é uma das áreas mais importantes do BTM.

As regras devem ser transformadas em cenários.

Exemplo:

> Ausência com aviso dentro do prazo pode gerar reposição.

Teste:

```text
Dado:
ciclo aberto
aluno matriculado
aviso dentro do prazo

Quando:
registrar ausência

Então:
crédito de reposição deve ser criado
```

Outro:

```text
Dado:
aluno atingiu o limite de reposições

Quando:
registrar nova ausência qualificável

Então:
não criar novo crédito
```

O teste deve refletir a regra documentada.

---

# 16. Testes de API

Podemos testar endpoints HTTP.

Exemplo:

```http
POST /auth/admin/login
```

Cenário:

```text
email válido
senha válida
```

Esperamos:

```text
200
Set-Cookie
user
```

Outro cenário:

```text
senha inválida
```

Esperamos:

```text
401
```

Também devemos verificar que informações sensíveis não aparecem na resposta.

---

# 17. Testes de autenticação

O fluxo do BTM possui vários casos interessantes.

## Login

```text
credenciais válidas → 200
credenciais inválidas → 401
usuário inativo → 401
usuário sem role adequada → rejeição
```

## `/auth/me`

```text
access token válido → usuário

access token ausente → 401

access token inválido → 401
```

## Refresh

```text
refresh válido
→ novo access
→ novo refresh
```

## Reutilização

```text
Refresh A
→ gera B

Refresh A novamente
→ 409
→ nenhum novo token
```

Essa última regra já possui teste automatizado no projeto.

---

# 18. Testes de autorização

Autorização merece testes próprios.

Exemplo:

```text
Professor A
→ aluno A
→ permitido
```

Mas:

```text
Professor A
→ aluno B
→ proibido
```

Isso é mais importante do que simplesmente testar:

```text
GET /students
→ 200
```

Precisamos testar **quem** pode acessar **qual dado**.

---

# 19. Testes de banco de dados

Podemos testar:

- constraints;
- relacionamentos;
- migrations;
- queries;
- índices;
- regras de persistência.

Exemplo:

```text
CPF UNIQUE
```

Um teste pode garantir que dois alunos não sejam cadastrados com o mesmo CPF.

## Por que isso importa?

Porque uma regra de integridade importante não deveria depender somente da aplicação.

O banco também pode proteger a integridade dos dados.

---

# 20. Testes de frontend

O frontend também possui comportamento.

Exemplos:

```text
usuário não autenticado
→ tela de login
```

```text
login realizado
→ aplicação protegida
```

```text
401
→ tenta refresh
```

```text
refresh simultâneo
→ apenas uma renovação
```

O BTM já possui testes para o comportamento de refresh concorrente.

---

# 21. Testes determinísticos

Um teste determinístico sempre produz o mesmo resultado quando recebe as mesmas condições.

Bom:

```text
input fixo
→ resultado previsível
```

Problemas surgem quando o teste depende de:

- horário real;
- rede;
- serviços externos;
- aleatoriedade;
- estado compartilhado;
- ordem de execução.

Quando necessário, essas dependências devem ser controladas.

---

# 22. Flaky tests

Um **flaky test** é um teste que às vezes passa e às vezes falha sem que o comportamento relevante do sistema tenha mudado.

Exemplo:

```text
rodou 10 vezes
→ 9 passou
→ 1 falhou
```

Isso é perigoso porque a equipe começa a ignorar falhas.

Causas comuns:

- concorrência;
- timing;
- dependência externa;
- estado compartilhado;
- banco não limpo;
- testes dependentes da ordem.

---

# 23. Cobertura de código

Cobertura mede quanto do código foi executado pelos testes.

Exemplo:

```text
100 linhas
80 executadas
→ 80% de cobertura
```

## Mas 100% não significa sistema seguro

Podemos executar todas as linhas e ainda não testar corretamente os comportamentos.

Exemplo:

```ts
if (user.isAdmin) {
  return sensitiveData;
}
```

Ter cobertura da linha não significa ter testado:

```text
ADMIN → permitido
PROFESSOR → proibido
```

## O que importa?

Cobertura é uma métrica útil, mas comportamento e risco são mais importantes.

---

# 24. TDD

**TDD — Test-Driven Development** significa Desenvolvimento Orientado a Testes.

Fluxo clássico:

```text
Red
 ↓
Green
 ↓
Refactor
```

## Red

Escrevemos um teste que falha.

```text
comportamento ainda não existe
```

## Green

Implementamos o mínimo necessário para passar.

```text
teste passa
```

## Refactor

Melhoramos o código mantendo os testes passando.

```text
código mais limpo
```

## Importante

TDD é uma técnica de desenvolvimento, não uma obrigação para qualquer tarefa.

Pode ser muito útil para regras de negócio bem definidas.

---

# 25. BDD

**BDD — Behavior-Driven Development** significa Desenvolvimento Orientado a Comportamento.

O foco é descrever comportamento de forma próxima à linguagem do negócio.

Exemplo:

```text
Dado um ciclo aberto
E o aluno possui direito a reposição
Quando registrar uma ausência válida
Então deve ser criado um crédito
```

Isso aproxima:

```text
negócio
+
desenvolvimento
+
testes
```

No BTM, esse estilo combina muito bem com as regras de negócio documentadas.

---

# 26. Testes no Beach Tennis Manager

A arquitetura atual permite separar testes por responsabilidade.

## Domain / regras

Testes rápidos para:

- ciclos;
- créditos;
- faltas;
- reposições;
- cálculos;
- estados.

## Application

Testar:

```text
Use Case
→ regras
→ autorização
→ dependências
```

usando doubles quando fizer sentido.

## Infrastructure

Testar:

```text
Drizzle
→ PostgreSQL
```

e integrações reais.

## HTTP

Testar:

```text
request
→ route
→ use case
→ response
```

## Frontend

Testar:

```text
API client
→ autenticação
→ refresh
→ estado da aplicação
```

---

# 27. Estratégia de testes do projeto

Uma estratégia coerente para o BTM é:

```text
                E2E
                 ↑
          Fluxos críticos
                 ↑
          Integração / HTTP
                 ↑
          Application / Infra
                 ↑
          Regras de negócio
```

## Prioridade

### Alta

- autenticação;
- autorização;
- isolamento entre professores;
- ciclos;
- faltas;
- reposições;
- pagamentos;
- fechamento de ciclo.

### Média

- CRUDs;
- filtros;
- paginação;
- validações.

### Baixa

- detalhes puramente visuais;
- getters triviais;
- código sem comportamento relevante.

---

# 28. Erros comuns

## Testar implementação em vez de comportamento

```text
"Essa função chamou exatamente três métodos internos"
```

Pode ser frágil.

Prefira:

```text
"Esse caso de uso produziu o resultado esperado"
```

quando isso for suficiente.

---

## Mockar tudo

Se tudo for mockado:

```text
A → mock
B → mock
C → mock
```

podemos acabar testando somente nossos próprios mocks.

Integrações reais continuam sem cobertura.

---

## Não testar erros

Sistemas reais falham.

Teste:

- dados inválidos;
- ausência de registro;
- conflito;
- acesso proibido;
- dependência indisponível;
- credencial inválida.

---

## Testar apenas o caminho feliz

O chamado **happy path** é o cenário em que tudo funciona.

Ele é importante, mas não suficiente.

---

## Ignorar testes de autorização

Um sistema pode funcionar perfeitamente e ainda ter uma falha grave de segurança.

---

# 29. Trade-offs

## Mais testes unitários

### Vantagens

- rápidos;
- fáceis de isolar;
- feedback rápido.

### Desvantagens

- podem não detectar problemas de integração.

## Mais testes E2E

### Vantagens

- validam o sistema completo.

### Desvantagens

- lentos;
- mais frágeis;
- mais caros de manter.

---

## Mock × dependência real

Mock:

```text
rápido
controlável
```

Dependência real:

```text
mais realista
mais lenta
mais complexa
```

A estratégia madura combina os dois.

---

# 30. Exercícios

## Exercício 1

Crie mentalmente um teste para:

> Um aluno pode utilizar um crédito de reposição em uma turma do mesmo professor que tenha vaga.

Descreva:

```text
Dado
Quando
Então
```

---

## Exercício 2

Qual a diferença entre:

```text
unitário
integração
E2E
```

---

## Exercício 3

Explique por que este teste pode ser insuficiente:

```ts
expect(service).toBeDefined();
```

---

## Exercício 4

Imagine que o repository real utiliza PostgreSQL.

Quando você usaria:

```text
FakeRepository
```

e quando preferiria:

```text
PostgresRepository
```

?

---

## Exercício 5

Projete testes para:

```text
POST /auth/refresh
```

Incluindo pelo menos:

- sucesso;
- token ausente;
- token expirado;
- token revogado;
- reuse detection.

---

# 31. Perguntas de entrevista

### Junior

1. O que é um teste automatizado?
2. Por que testar?
3. O que é teste unitário?
4. O que é teste de integração?
5. O que é teste E2E?
6. O que é assertion?
7. O que significa Arrange, Act, Assert?
8. O que é cobertura?
9. O que é TDD?
10. O que é um teste determinístico?

### Pleno

1. Como decidir o que testar?
2. Quando utilizar mocks?
3. Qual o problema de mockar tudo?
4. Qual a diferença entre mock, stub, spy e fake?
5. Como testar regras de negócio?
6. Como testar autorização?
7. Como testar integração com banco?
8. O que é um flaky test?
9. Por que cobertura de 100% não garante qualidade?
10. Como você estruturaria a estratégia de testes de uma API?
11. Como testar autenticação com access e refresh token?
12. Quando você preferiria teste de integração a teste unitário?
13. Como tornar uma classe mais testável?
14. Qual relação entre injeção de dependência e testabilidade?
15. Como testar uma regra complexa sem criar dezenas de mocks?

---

# 32. Perguntas de aprofundamento

1. Como testar uma regra de negócio que depende de data e hora?
2. Como controlar aleatoriedade nos testes?
3. Como evitar dependência entre testes?
4. Como testar transações de banco?
5. Como testar concorrência?
6. Como testar idempotência de uma API?
7. Como testar refresh token rotation?
8. Como testar uma falha de infraestrutura?
9. Como identificar um flaky test?
10. Como decidir entre fake e mock?
11. Como testar autorização por objeto?
12. Como combinar testes unitários, integração e E2E?
13. Como medir qualidade além de cobertura?
14. Como introduzir testes em um sistema legado?
15. Como usar TDD em uma regra de negócio complexa?

---

# 33. Checklist

Antes de considerar uma funcionalidade bem testada:

### Comportamento

- [ ] O caminho feliz está coberto?
- [ ] Casos de erro estão cobertos?
- [ ] Casos de limite foram considerados?
- [ ] As regras de negócio importantes possuem testes?

### Segurança

- [ ] Autenticação testada?
- [ ] Autorização testada?
- [ ] Isolamento de dados testado?
- [ ] Credenciais inválidas testadas?

### Integração

- [ ] Integrações críticas foram testadas?
- [ ] Banco foi considerado?
- [ ] Contratos HTTP foram considerados?

### Qualidade

- [ ] Testes são determinísticos?
- [ ] Testes são independentes?
- [ ] Não existem mocks desnecessários?
- [ ] Falhas são fáceis de diagnosticar?

### Manutenção

- [ ] Testes verificam comportamento, não detalhes irrelevantes?
- [ ] Nomes explicam o cenário?
- [ ] A suíte continua rápida o suficiente?

---

# Conclusão

Uma boa suíte de testes não existe para produzir um número bonito de cobertura.

Ela existe para aumentar a confiança de que o sistema continua respeitando seus contratos e regras.

No Beach Tennis Manager, isso é especialmente importante porque temos regras que não podem ser tratadas como simples CRUD:

```text
Ciclo
 ↓
Aula
 ↓
Ausência
 ↓
Crédito
 ↓
Reposição
 ↓
Continuidade do ciclo
```

E também:

```text
Usuário
 ↓
Autenticação
 ↓
Autorização
 ↓
Escopo do professor
 ↓
Dados permitidos
```

Esses fluxos representam comportamentos importantes do sistema e merecem testes que protejam suas regras.

A maturidade não está em escrever milhares de testes.

Está em saber:

> **o que precisa ser protegido por testes, em qual nível testar e qual comportamento realmente importa.**
