# 13 — Git e Colaboração

> Git não é apenas um lugar para guardar código. É uma ferramenta para controlar mudanças, preservar histórico e permitir que pessoas trabalhem juntas com segurança.

## Sumário

1. O que é controle de versão?
2. O que é Git?
3. Git × GitHub
4. Repositório
5. Working tree, staging area e commit
6. Commit
7. Branch
8. Merge
9. Pull Request
10. Conflitos
11. Rebase
12. Merge × Rebase
13. Remote
14. Fetch, Pull e Push
15. HEAD
16. Histórico
17. Revert × Reset
18. Stash
19. Tags e versões
20. Conventional Commits
21. Commits pequenos e coesos
22. Branch strategy
23. Code Review
24. CI e Git
25. Git em equipe
26. Segurança no Git
27. Git no Beach Tennis Manager
28. Fluxo recomendado para o projeto
29. Erros comuns
30. Trade-offs
31. Exercícios
32. Perguntas de entrevista
33. Perguntas de aprofundamento
34. Checklist

---

# 1. O que é controle de versão?

Controle de versão é uma forma de registrar a evolução de arquivos ao longo do tempo.

Imagine:

```text
projeto-final
projeto-final-2
projeto-final-corrigido
projeto-final-corrigido-agora-vai
```

Esse processo rapidamente fica difícil de controlar.

Um sistema de controle de versão permite registrar:

```text
versão
autor
data
alterações
histórico
```

---

# 2. O que é Git?

**Git** é um sistema distribuído de controle de versão.

Ele permite:

- registrar mudanças;
- criar branches;
- comparar versões;
- recuperar estados anteriores;
- colaborar com outras pessoas.

O Git funciona localmente.

Isso significa que podemos ter:

```text
seu computador
   ↓
repositório Git
```

sem depender da internet para cada operação.

---

# 3. Git × GitHub

Essa distinção é muito importante.

## Git

É a ferramenta de controle de versão.

## GitHub

É uma plataforma que hospeda repositórios Git e fornece recursos de colaboração.

Exemplo:

```text
Git
→ controla histórico

GitHub
→ hospeda
→ Pull Requests
→ Issues
→ Actions
→ colaboração
```

Portanto:

> Git não é GitHub.

---

# 4. Repositório

Um **repositório** é o projeto gerenciado pelo Git, incluindo seu histórico.

No Beach Tennis Manager:

```text
beach-tennis-manager
```

é o repositório.

Localmente temos:

```text
projeto
+
.git
```

A pasta `.git` contém informações necessárias para o histórico e funcionamento do repositório.

---

# 5. Working tree, staging area e commit

O Git possui uma ideia importante de três estados.

```text
Working Tree
     ↓
Staging Area
     ↓
Commit
```

## Working Tree

É o estado dos arquivos que você está editando.

Exemplo:

```text
src/auth/login.ts
```

foi alterado.

## Staging Area

É onde você seleciona o que fará parte do próximo commit.

Com:

```bash
git add
```

uma alteração entra no staging.

## Commit

É o registro permanente daquela mudança no histórico.

```bash
git commit
```

---

# 6. Commit

Um commit representa um conjunto de alterações registradas como uma unidade lógica.

Exemplo:

```text
feat: adiciona autenticação JWT
```

Um bom commit responde:

> O que mudou?

## Por que existe?

Porque precisamos conseguir entender e recuperar a evolução do projeto.

Um histórico bom facilita:

- debugging;
- revisão;
- rollback;
- entendimento arquitetural.

---

# 7. Branch

Uma **branch** é uma linha de desenvolvimento.

Podemos imaginar:

```text
main
 |
 A
 |
 B
 |
 C
```

Criamos outra linha:

```text
main
 |
 A
 |
 B
 ├──── feature/auth
 |          |
 |          C
 |          D
 |
```

Isso permite trabalhar em uma funcionalidade sem alterar imediatamente a linha principal.

---

# 8. Merge

**Merge** combina históricos.

Exemplo:

```text
main
  \
   feature
```

Depois:

```text
main
  \
   feature
       \
        merge
```

A branch de funcionalidade pode ser integrada à `main`.

---

# 9. Pull Request

Um **Pull Request (PR)** é uma proposta para integrar alterações de uma branch em outra.

Exemplo:

```text
feature/auth
      ↓
Pull Request
      ↓
main
```

O PR permite:

- revisão;
- discussão;
- CI;
- aprovação;
- registro da decisão.

Em equipe, PR é uma importante ferramenta de comunicação técnica.

---

# 10. Conflitos

Um conflito ocorre quando o Git não consegue determinar automaticamente como combinar alterações.

Exemplo:

Pessoa A:

```ts
const timeout = 10;
```

Pessoa B:

```ts
const timeout = 30;
```

Se ambas alteraram a mesma região, pode surgir:

```text
<<<<<<< HEAD
const timeout = 10;
=======
const timeout = 30;
>>>>>>> branch
```

O desenvolvedor precisa decidir qual conteúdo deve permanecer.

## Importante

Conflito de Git não é necessariamente conflito de negócio.

Git só sabe comparar alterações textuais.

A decisão sobre qual comportamento é correto pertence aos desenvolvedores e aos requisitos do sistema.

---

# 11. Rebase

**Rebase** reorganiza commits para que uma branch seja reaplicada sobre outra base.

Exemplo:

```text
main
 A
 |
 B
 |
 C

feature
      D
      |
      E
```

Depois de atualizar a base com rebase:

```text
main
 A
 |
 B
 |
 C
 |
 D'
 |
 E'
```

Os commits podem receber novos IDs porque foram recriados sobre outra base.

## Por que usar?

Pode deixar o histórico linear e facilitar a compreensão.

## Atenção

Rebase altera histórico.

Por isso devemos ter cuidado com branches compartilhadas.

---

# 12. Merge × Rebase

## Merge

Preserva a estrutura de ramificações.

```text
A
 \
  B
   \
    M
```

## Rebase

Reaplica commits sobre uma nova base.

```text
A
 |
B
 |
C
 |
D'
 |
E'
```

Nenhum dos dois é universalmente "melhor".

A escolha depende da política do projeto.

---

# 13. Remote

Um **remote** é uma referência para outro repositório Git.

No projeto:

```text
origin
```

aponta para o repositório remoto no GitHub.

Conceitualmente:

```text
Computador
    ↕
GitHub
```

---

# 14. Fetch, Pull e Push

## git fetch

Baixa informações do remoto sem integrar automaticamente as alterações na branch atual.

```bash
git fetch
```

Podemos pensar:

```text
GitHub
 ↓
informações locais
```

## git pull

Normalmente combina:

```text
fetch
+
integração
```

O comportamento exato pode envolver merge ou rebase conforme a configuração.

## git push

Envia commits locais para o remoto.

```bash
git push
```

Fluxo:

```text
local
 ↓
GitHub
```

---

# 15. HEAD

`HEAD` representa a referência para o commit/branch atualmente checkoutado.

Exemplo:

```bash
git status
```

pode mostrar:

```text
On branch main
```

Nesse caso, o HEAD está associado à branch atual.

Podemos também apontar diretamente para um commit específico, situação conhecida como **detached HEAD**.

---

# 16. Histórico

Com:

```bash
git log
```

podemos visualizar commits.

Um histórico pode ser:

```text
A
B
C
D
```

Cada commit possui informações como:

- hash;
- autor;
- data;
- mensagem;
- relação com commits anteriores.

## Por que isso é importante?

O histórico conta a evolução técnica do projeto.

No BTM, por exemplo, podemos identificar quando a autenticação foi migrada de sessões para JWT + refresh token.

---

# 17. Revert × Reset

Essa diferença é importante.

## Revert

Cria um novo commit que desfaz os efeitos de outro.

```text
A
B
C
D

revert C

A
B
C
D
E
```

O histórico continua preservado.

## Reset

Move uma referência para outro ponto do histórico.

Pode alterar o histórico da branch.

Exemplo:

```bash
git reset --hard HEAD~1
```

Isso pode remover o commit da linha atual e também descartar alterações dependendo do modo utilizado.

## Regra prática

Em histórico compartilhado, `revert` normalmente é mais seguro.

`reset` exige atenção.

---

# 18. Stash

`git stash` guarda temporariamente alterações não commitadas.

Imagine:

```text
estou trabalhando
↓
aparece uma tarefa urgente
```

Você ainda não quer fazer commit.

Pode usar:

```bash
git stash
```

Depois recuperar:

```bash
git stash pop
```

## Importante

Stash é útil, mas não deve virar sistema permanente de armazenamento de trabalho.

Se uma alteração é importante, um commit apropriado costuma ser melhor.

---

# 19. Tags e versões

Tags podem marcar pontos específicos do histórico.

Exemplo:

```text
v1.0.0
v1.1.0
v2.0.0
```

Isso é útil para identificar versões.

Pode ser combinado com **Semantic Versioning (SemVer)**:

```text
MAJOR.MINOR.PATCH
```

Exemplo:

```text
2.4.1
```

A interpretação exata depende da política adotada pelo projeto.

---

# 20. Conventional Commits

Conventional Commits é uma convenção para mensagens de commit.

Exemplos:

```text
feat: adiciona cadastro de alunos

fix: corrige renovação do refresh token

docs: atualiza regras de reposição

test: adiciona testes de autorização

refactor: reorganiza repository de usuários

chore: atualiza dependências
```

Tipos comuns:

```text
feat
fix
docs
test
refactor
chore
```

## Por que usar?

Facilita leitura e automação do histórico.

No BTM já estamos utilizando esse estilo.

---

# 21. Commits pequenos e coesos

Um commit deve representar uma alteração lógica.

Bom:

```text
feat: adiciona refresh token
```

com tudo necessário para aquela mudança.

Menos ideal:

```text
feat: adiciona refresh token, muda frontend,
corrige CSS, atualiza README e reorganiza banco
```

O segundo commit mistura assuntos diferentes.

## Coesão

Um commit coeso possui alterações relacionadas ao mesmo objetivo.

Isso facilita:

- revisão;
- rollback;
- investigação;
- compreensão.

---

# 22. Branch strategy

Existem várias estratégias.

Uma simples:

```text
main
 ↓
feature/nome-da-funcionalidade
```

Outra pode possuir:

```text
main
develop
feature/*
release/*
hotfix/*
```

Não devemos adotar uma estratégia complexa sem necessidade.

Para um projeto pequeno, uma estrutura simples pode ser suficiente.

---

# 23. Code Review

Code Review é a revisão de código feita por outra pessoa antes da integração.

O objetivo não é procurar erros de formatação.

É avaliar:

- comportamento;
- arquitetura;
- segurança;
- legibilidade;
- testes;
- impacto.

Uma boa revisão pergunta:

> "Esse código está correto e sustentável?"

e não apenas:

> "Eu escreveria dessa maneira?"

---

# 24. CI e Git

Git e CI trabalham muito bem juntos.

Exemplo:

```text
Pull Request
    ↓
GitHub Actions
    ↓
lint
    ↓
typecheck
    ↓
tests
    ↓
build
```

Se falhar:

```text
PR → precisa de correção
```

Isso cria uma barreira automática contra alterações quebradas.

---

# 25. Git em equipe

Em equipe, Git exige disciplina.

Antes de começar:

```bash
git status
git pull
```

Depois:

```text
alteração
↓
teste
↓
commit
↓
push
↓
PR
```

## Comunicação

Git registra alterações.

Mas não substitui comunicação.

Se uma mudança afeta uma regra de negócio importante, a equipe precisa discutir a decisão.

---

# 26. Segurança no Git

Nunca devemos commitar:

```text
.env
senha
API key
JWT secret
private key
tokens
```

Exemplo perigoso:

```text
JWT_SECRET=uma-chave-real
```

em um arquivo versionado.

## Se um segredo foi commitado?

Apagar o arquivo no commit seguinte não necessariamente resolve.

O segredo pode continuar no histórico.

A resposta adequada normalmente inclui:

1. revogar/rotacionar o segredo;
2. remover exposição;
3. avaliar o histórico;
4. corrigir o processo que permitiu o vazamento.

---

# 27. Git no Beach Tennis Manager

Nosso projeto já utiliza:

```text
Git
+
GitHub
+
main
+
commits organizados
+
SSH
```

O repositório é:

```text
beach-tennis-manager
```

E utilizamos uma organização de commits como:

```text
docs: ...
feat: ...
fix: ...
test: ...
chore: ...
```

Também estamos mantendo:

```text
docs/
```

como fonte de verdade das decisões do projeto.

---

# 28. Fluxo recomendado para o projeto

Para uma funcionalidade nova:

## 1. Verificar documentação

```text
docs/
 ↓
requisitos
 ↓
regras
```

## 2. Criar branch

```bash
git switch -c feature/nome-da-funcionalidade
```

## 3. Implementar

```text
código
+
testes
```

## 4. Verificar

```bash
npm test
npm run build
```

e demais verificações relevantes.

## 5. Commit

```bash
git add .
git commit -m "feat: adiciona ..."
```

## 6. Push

```bash
git push -u origin feature/nome-da-funcionalidade
```

## 7. Pull Request

```text
feature
 ↓
PR
 ↓
CI
 ↓
review
 ↓
main
```

Para alterações simples no projeto individual, podemos trabalhar diretamente na `main` quando isso fizer sentido. O importante é manter o histórico coerente e verificável.

---

# 29. Erros comuns

## `git add .` sem verificar

Pode adicionar arquivos que não deveriam ser versionados.

Antes:

```bash
git status
```

Depois:

```bash
git diff --staged
```

---

## Commit gigante

Dificulta:

- revisão;
- rollback;
- identificação de problemas.

---

## Commit sem mensagem útil

```text
update
fix
teste
mudanças
```

Essas mensagens não explicam o histórico.

---

## Forçar push sem entender

```bash
git push --force
```

pode sobrescrever histórico remoto.

Use somente quando entender exatamente a consequência e quando a política do repositório permitir.

---

## Misturar assuntos

Evite:

```text
feature
+
refactor
+
docs
+
configuração
```

em uma única mudança sem relação.

---

# 30. Trade-offs

## Branch por funcionalidade

### Vantagens

- isolamento;
- revisão;
- CI;
- histórico organizado.

### Desvantagens

- exige disciplina;
- branches antigas podem ficar desatualizadas.

---

## Commits pequenos

### Vantagens

- fácil entender;
- fácil reverter;
- fácil revisar.

### Desvantagens

- commits excessivamente pequenos podem gerar ruído.

O objetivo é encontrar uma unidade lógica, não simplesmente reduzir o número de linhas por commit.

---

## Rebase

### Vantagens

- histórico mais linear;
- pode facilitar leitura.

### Desvantagens

- reescreve histórico;
- pode gerar confusão para branches compartilhadas.

---

# 31. Exercícios

## Exercício 1

Explique a diferença entre:

```text
Git
GitHub
```

---

## Exercício 2

Explique:

```text
working tree
staging
commit
```

---

## Exercício 3

Qual a diferença entre:

```bash
git fetch
git pull
git push
```

?

---

## Exercício 4

Quando você preferiria:

```bash
git revert
```

em vez de:

```bash
git reset
```

?

---

## Exercício 5

Você terminou uma funcionalidade e tem:

```text
3 arquivos da funcionalidade
1 arquivo .env
2 arquivos de teste
```

Como verificaria antes do commit se somente os arquivos corretos entrarão?

---

## Exercício 6

Imagine dois desenvolvedores alterando a mesma regra de negócio.

Como você resolveria um conflito de Git sem simplesmente escolher "o seu código"?

---

# 32. Perguntas de entrevista

### Junior

1. O que é Git?
2. Qual a diferença entre Git e GitHub?
3. O que é commit?
4. O que é branch?
5. O que é merge?
6. O que é Pull Request?
7. O que é conflito?
8. Para que serve `git pull`?
9. Para que serve `git push`?
10. Para que serve `.gitignore`?

### Pleno

1. Qual a diferença entre merge e rebase?
2. Qual a diferença entre revert e reset?
3. O que é staging area?
4. O que é HEAD?
5. Como você resolveria um conflito?
6. Como evitaria commitar secrets?
7. Como estruturaria uma estratégia de branches?
8. O que caracteriza um bom commit?
9. Como integrar Git com CI/CD?
10. Como você faria code review?
11. Quando usaria squash?
12. O que é cherry-pick?
13. Como recuperar um commit perdido?
14. O que significa detached HEAD?
15. Como trabalhar com Git em uma equipe grande?

---

# 33. Perguntas de aprofundamento

1. O que realmente acontece durante um commit?
2. Por que commits possuem hashes?
3. Como o Git identifica alterações?
4. Como o Git resolve conflitos?
5. Por que rebase altera hashes?
6. Qual a diferença entre `HEAD`, branch e commit?
7. O que acontece em um `git reset --hard`?
8. Como recuperar trabalho perdido?
9. Quando usar cherry-pick?
10. Como você organizaria um histórico para facilitar rollback?
11. Como lidar com migrations e Git em paralelo?
12. Como evitar que uma mudança incompatível chegue à main?
13. Como usar tags para releases?
14. Como automatizar changelog?
15. Como proteger a branch principal?

---

# 34. Checklist

### Antes de alterar

- [ ] Li a documentação relevante?
- [ ] Entendi o objetivo da mudança?
- [ ] Sei qual regra estou implementando?

### Durante

- [ ] A alteração está isolada?
- [ ] Testes foram adicionados?
- [ ] Não existem secrets no código?

### Antes do commit

- [ ] `git status`
- [ ] Revisei o diff?
- [ ] O commit contém somente alterações relacionadas?
- [ ] A mensagem descreve o objetivo?

### Antes do push

- [ ] Testes passam?
- [ ] Typecheck passa?
- [ ] Build passa quando aplicável?
- [ ] Não estou enviando arquivos indevidos?

### Pull Request

- [ ] Expliquei o que mudou?
- [ ] Expliquei decisões importantes?
- [ ] CI passou?
- [ ] A documentação precisa ser atualizada?

---

# Conclusão

Git é uma ferramenta técnica, mas seu maior valor aparece quando ele organiza o trabalho humano.

Um bom fluxo é:

```text
Requisito
 ↓
Documentação
 ↓
Branch
 ↓
Implementação
 ↓
Testes
 ↓
Commit
 ↓
Push
 ↓
CI
 ↓
Review
 ↓
Merge
```

No Beach Tennis Manager, isso é particularmente importante porque o projeto está sendo utilizado também como material de estudo e portfólio.

Cada commit pode contar uma pequena parte da história:

```text
docs
 ↓
arquitetura
 ↓
database
 ↓
auth
 ↓
testes
 ↓
infraestrutura
 ↓
novas funcionalidades
```

Um histórico Git bem cuidado permite que outra pessoa não apenas veja **o código atual**, mas também entenda **como o sistema evoluiu e quais decisões foram tomadas**.

> **Git registra mudanças; um bom processo transforma essas mudanças em uma história técnica compreensível.**
