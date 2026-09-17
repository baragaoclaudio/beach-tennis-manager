# 10 — Segurança de Aplicações

> Segurança não é uma funcionalidade isolada. É uma propriedade do sistema inteiro.

## Sumário

1. Como pensar em segurança
2. Ameaças, riscos e threat model
3. Autenticação × autorização
4. Senhas e armazenamento seguro
5. Sessões, JWT e tokens
6. Access Token × Refresh Token
7. Cookies seguros
8. CSRF
9. XSS
10. SQL Injection
11. Validação de entrada
12. CORS
13. Segredos e variáveis de ambiente
14. Rate limiting e ataques de força bruta
15. Princípio do menor privilégio
16. Isolamento de dados
17. HTTPS/TLS
18. Security Headers
19. Logs, auditoria e informações sensíveis
20. Dependências e cadeia de suprimentos
21. OWASP Top 10
22. Segurança no Beach Tennis Manager
23. Erros comuns
24. Trade-offs
25. Testes de segurança
26. Exercícios
27. Perguntas de entrevista
28. Perguntas de aprofundamento
29. Checklist

---

# 1. Como pensar em segurança

Segurança de software não significa simplesmente colocar login.

Um sistema seguro precisa responder perguntas como:

- Quem pode acessar?
- Como sabemos quem é essa pessoa?
- O que ela pode fazer?
- Quais dados ela pode visualizar?
- O que acontece se uma credencial for roubada?
- O que acontece se uma requisição for manipulada?
- O que acontece se alguém enviar dados inesperados?
- Como detectamos um comportamento suspeito?
- Como reduzimos o impacto de uma falha?

Uma forma útil de pensar é:

```text
Identidade
    ↓
Autenticação
    ↓
Autorização
    ↓
Validação
    ↓
Processamento seguro
    ↓
Persistência segura
    ↓
Auditoria
```

Segurança precisa existir em todas essas etapas.

---

# 2. Ameaças, riscos e threat model

## O que é?

**Ameaça** é algo que pode causar um problema de segurança.

Exemplos:

- roubo de senha;
- token roubado;
- SQL Injection;
- acesso indevido aos dados de outro professor;
- tentativa automatizada de login.

**Risco** combina a possibilidade de um problema acontecer com seu impacto.

**Threat model** (modelo de ameaças) é uma análise estruturada de:

- o que estamos protegendo;
- contra quem;
- quais são os possíveis ataques;
- quais consequências teriam;
- quais controles reduzem esses riscos.

## Por que existe?

Porque é impossível proteger tudo da mesma maneira.

Precisamos identificar o que é realmente importante.

## Qual problema resolve?

Evita desenvolver segurança baseada apenas em "boas práticas" genéricas.

Por exemplo:

```text
Aluno A
Professor A
Professor B
Administrador
```

Uma ameaça importante no Beach Tennis Manager é:

> Professor A conseguir consultar alunos ou informações financeiras pertencentes ao Professor B.

Não é suficiente ter autenticação. É necessário ter **autorização e isolamento de dados**.

## Como funciona?

Uma análise simples pode seguir:

```text
Ativo
 ↓
Ameaça
 ↓
Vulnerabilidade
 ↓
Impacto
 ↓
Mitigação
```

Exemplo:

```text
Ativo: dados financeiros

Ameaça: usuário acessar dados de outro professor

Vulnerabilidade:
endpoint aceita professorId enviado pelo cliente
sem validar se o usuário possui acesso

Impacto:
exposição de informações

Mitigação:
determinar escopo no backend a partir
do usuário autenticado
```

## Quando eu usaria?

Sempre que estiver projetando uma funcionalidade que:

- manipula dados sensíveis;
- possui diferentes níveis de acesso;
- aceita entrada externa;
- integra serviços externos;
- executa ações importantes.

## Quando eu evitaria?

Não faz sentido criar um processo gigantesco de threat modeling para cada campo trivial.

O objetivo é identificar riscos relevantes de forma proporcional.

## Exemplo

Imagine:

```http
GET /students/123
```

O fato de o usuário estar autenticado não significa que ele possa acessar o aluno `123`.

O backend precisa perguntar:

```text
Esse usuário pode acessar esse aluno?
```

## Como aparece no Beach Tennis Manager?

Principalmente em:

- autenticação;
- autorização;
- isolamento entre professores;
- dados financeiros;
- pagamentos;
- refresh tokens;
- administração global;
- logs;
- integrações futuras.

---

# 3. Autenticação × autorização

Essa é uma distinção fundamental.

## Autenticação

Responde:

> Quem é você?

Exemplo:

```text
email + senha
        ↓
identidade confirmada
        ↓
usuário autenticado
```

## Autorização

Responde:

> O que você pode fazer?

Exemplo:

```text
Usuário autenticado
        ↓
role = PROFESSOR
        ↓
pode acessar seus próprios alunos
```

Enquanto:

```text
role = ADMIN
        ↓
pode acessar dados administrativos
```

## Por que existe?

Porque saber quem é o usuário não determina automaticamente o que ele pode fazer.

## Erro clássico

```text
if (user) {
    return allStudents;
}
```

Isso implementa autenticação, mas não autorização.

O correto é algo conceitualmente parecido com:

```text
usuário autenticado
        +
permissão adequada
        +
escopo correto
```

## Como aparece no Beach Tennis Manager?

O sistema possui:

```text
PROFESSOR
ADMIN
```

O backend precisa aplicar essas regras.

O frontend não pode ser considerado mecanismo de segurança.

---

# 4. Senhas e armazenamento seguro

## O que é hashing?

Hashing transforma uma informação em outra representação de tamanho definido.

Para senhas, usamos algoritmos específicos de password hashing.

No projeto usamos **Argon2**.

A ideia é:

```text
senha
  ↓
Argon2
  ↓
hash
```

Na autenticação:

```text
senha informada
      ↓
Argon2 verifica
      ↓
hash armazenado
      ↓
válida / inválida
```

## Por que não guardar a senha diretamente?

Porque uma senha armazenada em texto puro pode ser imediatamente exposta se o banco vazar.

O banco deve armazenar o resultado do algoritmo de hashing, não a senha original.

## Salt

**Salt** é um valor aleatório utilizado no processo de hashing.

Ele ajuda a impedir que senhas iguais produzam simplesmente o mesmo resultado e dificulta ataques baseados em tabelas pré-computadas.

Bibliotecas modernas de password hashing normalmente cuidam disso.

## Pepper

**Pepper** é um segredo adicional mantido fora do banco.

É diferente do salt.

```text
Salt
→ pode ser armazenado junto ao hash

Pepper
→ deve permanecer secreto
```

Não devemos adicionar mecanismos complexos sem uma necessidade concreta. A escolha deve considerar o modelo de ameaça e a operação do sistema.

## Como aparece no Beach Tennis Manager?

O login administrativo usa Argon2 para verificar a senha.

O sistema não deve retornar ou registrar a senha.

---

# 5. Sessões, JWT e tokens

## Sessão tradicional

Uma sessão pode funcionar assim:

```text
login
 ↓
servidor cria sessão
 ↓
session_id
 ↓
cookie
```

O servidor mantém o estado da sessão.

## JWT

JWT significa **JSON Web Token**.

É um formato de token assinado que pode carregar claims, como:

```text
sub
email
role
iat
exp
```

O servidor consegue verificar se o token foi assinado pelo sistema e se não expirou.

## Importante

JWT assinado não significa automaticamente:

- criptografado;
- impossível de roubar;
- revogável instantaneamente.

Assinatura garante integridade/autenticidade do token, não confidencialidade.

## Como aparece no projeto?

O Beach Tennis Manager utiliza:

```text
Access Token
→ JWT
→ 10 minutos
→ HttpOnly cookie
```

E:

```text
Refresh Token
→ token opaco aleatório
→ 8 horas
→ HttpOnly cookie
→ hash armazenado no banco
```

---

# 6. Access Token × Refresh Token

Essa separação é importante.

## Access Token

É usado para representar uma autenticação válida durante um período curto.

No projeto:

```text
TTL = 10 minutos
```

## Refresh Token

É usado para obter uma nova sessão de acesso sem exigir novo login imediatamente.

No projeto:

```text
TTL = 8 horas
```

## Por que separar?

Porque um access token curto reduz a janela de utilização caso seja comprometido.

O refresh token permite renovar o acesso sem manter um JWT de longa duração.

## Rotação

Na rotação:

```text
Refresh A
   ↓
Refresh B
```

O token A é invalidado.

O banco registra a relação:

```text
A → B
```

## Reuse detection

Se alguém tentar usar novamente o token A:

```text
Refresh A
   ↓
já foi utilizado/revogado
   ↓
possível reutilização indevida
   ↓
409
```

O sistema não emite novos tokens nessa situação.

## Como aparece no projeto?

Essa estratégia já está implementada no Beach Tennis Manager.

O banco possui `refresh_tokens` com informações como:

- `token_hash`;
- `expires_at`;
- `family_id`;
- `replaced_by_id`;
- `revoked_at`.

---

# 7. Cookies seguros

Cookies são frequentemente utilizados para transportar credenciais de sessão.

## HttpOnly

Impede que JavaScript no navegador leia diretamente o cookie.

Isso reduz o impacto de determinados cenários de XSS.

```text
HttpOnly
→ JavaScript não acessa o valor
```

Não significa que XSS deixa de ser perigoso.

## Secure

Faz o navegador enviar o cookie apenas através de HTTPS.

Em desenvolvimento local isso pode ser diferente, mas em produção deve ser utilizado.

## SameSite

Controla o comportamento do cookie em requisições envolvendo diferentes sites.

Pode ajudar na proteção contra CSRF.

No projeto usamos:

```text
SameSite=Lax
```

## Path

Define em quais caminhos o cookie é enviado.

No projeto:

```text
Path=/
```

## Como aparece no Beach Tennis Manager?

Os cookies de autenticação são:

```text
btm_access
btm_refresh
```

Eles são configurados como HttpOnly e usam atributos apropriados para o ambiente.

---

# 8. CSRF

CSRF significa **Cross-Site Request Forgery**.

É um ataque em que um site malicioso tenta fazer o navegador da vítima enviar uma requisição autenticada para outro sistema.

Isso é especialmente relevante quando autenticação utiliza cookies, porque o navegador pode enviar cookies automaticamente.

## Exemplo conceitual

A vítima está autenticada no sistema.

Um site malicioso tenta induzir o navegador a executar:

```http
POST /payments
Cookie: btm_access=...
```

Se o servidor aceitar essa requisição sem controles adequados, pode existir um problema.

## Como reduzir o risco?

Dependendo da arquitetura:

- SameSite;
- tokens anti-CSRF;
- verificação de Origin/Referer quando apropriado;
- desenho cuidadoso da API;
- evitar operações sensíveis através de mecanismos vulneráveis a CSRF.

## Importante

CORS e CSRF são conceitos diferentes.

CORS controla quais origens podem fazer determinadas requisições cross-origin a partir do navegador.

CSRF trata de requisições autenticadas que podem ser forjadas.

Não devemos tratar CORS como substituto universal para proteção contra CSRF.

## Como aparece no projeto?

Como os tokens de autenticação são transportados em cookies, CSRF deve fazer parte da análise de segurança da aplicação.

---

# 9. XSS

XSS significa **Cross-Site Scripting**.

O atacante consegue fazer conteúdo controlado por ele ser interpretado como código pelo navegador.

## Exemplo perigoso

Imagine que um sistema renderize diretamente:

```html
<div>
  {nomeDoAluno}
</div>
```

Se o sistema inserir HTML não confiável sem tratamento adequado, pode surgir uma vulnerabilidade.

## Tipos

Os principais tipos são:

- Stored XSS;
- Reflected XSS;
- DOM-based XSS.

## Como evitar?

- escapar conteúdo na saída;
- utilizar mecanismos seguros de renderização;
- evitar inserir HTML arbitrário;
- sanitizar HTML quando realmente necessário;
- utilizar Content Security Policy quando apropriado.

## React ajuda?

React, por padrão, escapa valores interpolados.

Mas existem APIs perigosas, como:

```tsx
dangerouslySetInnerHTML
```

O nome é bastante apropriado: deve ser utilizado com extremo cuidado.

## Como aparece no projeto?

Campos como:

- nome;
- observações;
- descrição;
- mensagens;
- dados de alunos

devem ser tratados como entrada não confiável.

---

# 10. SQL Injection

SQL Injection acontece quando entrada controlada pelo usuário altera indevidamente uma consulta SQL.

## Exemplo conceitual perigoso

```ts
const sql = `
  SELECT *
  FROM users
  WHERE email = '${email}'
`;
```

Se `email` possuir conteúdo malicioso, a consulta pode ser alterada.

## Abordagem segura

Utilizar queries parametrizadas ou um ORM/query builder que faça binding apropriado.

No projeto:

```text
Drizzle ORM
```

é utilizado para acesso ao banco.

Isso reduz significativamente o risco de construir SQL dessa forma.

## Atenção

Usar ORM não significa que SQL Injection seja impossível.

Ainda é necessário cuidado com:

- SQL bruto;
- interpolação;
- consultas dinâmicas;
- filtros construídos manualmente.

---

# 11. Validação de entrada

## O que é?

Validação verifica se os dados recebidos estão dentro do formato esperado.

Exemplo:

```text
email
senha
```

podem ter requisitos diferentes.

## Por que existe?

Porque tudo que vem do cliente deve ser considerado não confiável.

Mesmo que o frontend valide:

```text
Frontend
   ↓
Backend
```

o backend precisa validar novamente.

Um atacante pode simplesmente ignorar o frontend e chamar a API diretamente.

## Zod

O projeto utiliza Zod para validação.

Conceitualmente:

```text
request
 ↓
schema
 ↓
válido?
 ├── sim → continua
 └── não → erro 4xx
```

## Validação × sanitização

São conceitos diferentes.

**Validação** pergunta:

> Isso possui o formato permitido?

**Sanitização** modifica ou remove conteúdo para torná-lo seguro.

Não devemos usar sanitização como desculpa para aceitar qualquer entrada.

---

# 12. CORS

CORS significa **Cross-Origin Resource Sharing**.

É um mecanismo do navegador para controlar requisições feitas entre diferentes origens.

Uma origem considera:

```text
scheme + host + port
```

Por exemplo:

```text
http://localhost:5173
http://localhost:3333
```

possuem portas diferentes e, portanto, são origens diferentes.

## Por que existe?

Porque o navegador aplica políticas de segurança para requisições entre origens.

## CORS não é autenticação

Uma configuração:

```text
Access-Control-Allow-Origin
```

não diz quem está autenticado.

Também não substitui autorização.

## Como aparece no projeto?

Durante desenvolvimento:

```text
Web
localhost:5173
     ↓
API
localhost:3333
```

A API precisa permitir a origem adequada.

Em produção, a lista deve ser restrita às origens realmente necessárias.

---

# 13. Segredos e variáveis de ambiente

Segredos incluem:

- JWT secret;
- credenciais de banco;
- chaves de API;
- tokens de serviços externos.

Eles não devem ser colocados diretamente no código.

Evitar:

```ts
const jwtSecret = "minha-senha-super-secreta";
```

Preferir:

```text
process.env.JWT_SECRET
```

## Por que?

Porque o código pode:

- ir para Git;
- aparecer em pull requests;
- ser compartilhado;
- ser copiado para outros ambientes.

## `.env`

Arquivos `.env` normalmente devem ser ignorados pelo Git quando contêm segredos reais.

O projeto utiliza um `.env` local para configuração de desenvolvimento.

## Atenção

Variável de ambiente não é automaticamente segura.

Em produção, o segredo precisa ser armazenado de forma adequada pela infraestrutura.

---

# 14. Rate limiting e força bruta

Um atacante pode tentar:

```text
login 1
login 2
login 3
...
login 100000
```

Isso é um ataque de força bruta.

## Rate limiting

Rate limiting limita a quantidade de requisições permitidas em determinado período.

Exemplo conceitual:

```text
10 tentativas
por minuto
```

## Outras estratégias

Dependendo do sistema:

- backoff;
- bloqueios temporários;
- CAPTCHA em cenários específicos;
- detecção de comportamento anômalo;
- proteção na infraestrutura;
- MFA.

## Como aparece no Beach Tennis Manager?

O projeto ainda não possui rate limiting implementado.

Isso é uma dívida de segurança aceitável para a fase atual, mas deve ser considerada antes de uma exposição pública mais ampla da API.

---

# 15. Princípio do menor privilégio

O princípio do menor privilégio diz:

> Cada usuário, processo ou componente deve possuir somente os privilégios necessários para executar sua função.

Exemplo:

```text
Professor
→ não precisa administrar todos os professores
```

Enquanto:

```text
ADMIN
→ possui permissões administrativas
```

O mesmo vale para infraestrutura.

Uma aplicação não deveria usar uma conta de banco com permissões administrativas completas se precisa apenas ler e alterar determinadas tabelas.

---

# 16. Isolamento de dados

No Beach Tennis Manager, esse é um dos pontos mais importantes.

Imagine:

```text
Professor A
   ↓
Aluno A

Professor B
   ↓
Aluno B
```

Professor A não deve conseguir consultar dados de B apenas alterando um ID na URL.

Exemplo de requisição:

```http
GET /students/456
```

Não basta perguntar:

```text
O aluno 456 existe?
```

É necessário verificar:

```text
O aluno 456 está dentro do escopo
que este usuário pode acessar?
```

## Backend como autoridade

Nunca confiar em:

```text
professorId enviado pelo frontend
```

como prova de autorização.

O backend deve derivar o escopo a partir da identidade autenticada e das relações persistidas.

---

# 17. HTTPS/TLS

HTTPS utiliza TLS para proteger a comunicação entre cliente e servidor.

Sem HTTPS, dados podem ficar expostos ou ser alterados durante o trânsito dependendo do ambiente de rede.

Com HTTPS:

```text
Browser
   ↓
TLS
   ↓
Servidor
```

A comunicação é protegida contra determinados ataques de interceptação e alteração.

## Em produção

Autenticação e dados sensíveis devem ser transportados sobre HTTPS.

Isso também é importante para que cookies marcados como `Secure` funcionem como esperado.

---

# 18. Security Headers

Headers HTTP podem ajudar a reduzir determinadas classes de ataques.

Alguns exemplos:

- Content-Security-Policy;
- X-Content-Type-Options;
- Referrer-Policy;
- Permissions-Policy;
- Strict-Transport-Security.

## Content Security Policy

CSP pode restringir quais recursos o navegador pode carregar e executar.

Ela pode ajudar a reduzir o impacto de determinados cenários de XSS.

## HSTS

HTTP Strict Transport Security orienta o navegador a utilizar HTTPS para o domínio.

## Importante

Headers não substituem:

- autenticação;
- autorização;
- validação;
- controle de acesso;
- código seguro.

São camadas adicionais.

---

# 19. Logs, auditoria e informações sensíveis

Logs são fundamentais para diagnosticar problemas e investigar incidentes.

Mas logging excessivo pode criar outro problema.

Nunca devemos registrar casualmente:

```text
senha
JWT
refresh token
cookie de autenticação
```

## Exemplo

Ruim:

```text
User login:
email=admin@example.com
password=change-this-development-password
token=eyJ...
```

Melhor:

```text
Admin login successful
userId=...
timestamp=...
```

## Auditoria

Auditoria responde:

> Quem fez o quê e quando?

Pode ser importante para operações administrativas, principalmente em sistemas financeiros.

---

# 20. Dependências e cadeia de suprimentos

Aplicações modernas dependem de muitas bibliotecas.

Exemplo:

```text
Projeto
 ↓
Fastify
 ↓
dependências
 ↓
outras dependências
```

Uma vulnerabilidade pode existir em uma dependência indireta.

Por isso é importante:

- atualizar dependências;
- revisar vulnerabilidades;
- remover dependências desnecessárias;
- utilizar lockfile;
- revisar pacotes antes de adicioná-los;
- automatizar verificações quando possível.

## O problema da cadeia de suprimentos

Nem todo risco está no código escrito diretamente pela equipe.

Uma biblioteca comprometida ou vulnerável também pode afetar a aplicação.

---

# 21. OWASP Top 10

A OWASP é uma organização conhecida por trabalhos relacionados à segurança de aplicações web.

O **OWASP Top 10** reúne categorias de riscos importantes para aplicações web.

O objetivo não é decorar uma lista.

O objetivo é aprender a reconhecer padrões como:

- falhas de controle de acesso;
- falhas criptográficas;
- injeção;
- configuração insegura;
- componentes vulneráveis;
- falhas de autenticação;
- falhas de logging e monitoramento;
- entre outros.

Para entrevistas, é muito mais útil explicar:

> "Qual vulnerabilidade é essa, como aconteceria e qual controle reduziria o risco?"

do que apenas decorar os nomes.

---

# 22. Segurança no Beach Tennis Manager

Agora podemos conectar tudo ao projeto.

## Login

Fluxo atual:

```text
Frontend
   ↓
POST /auth/admin/login
   ↓
Backend valida entrada
   ↓
verifica usuário
   ↓
verifica role
   ↓
Argon2
   ↓
Access JWT
   +
Refresh Token
   ↓
HttpOnly cookies
```

## Access Token

```text
JWT
TTL: 10 minutos
Cookie: btm_access
```

## Refresh Token

```text
token aleatório
TTL: 8 horas
Cookie: btm_refresh
hash no banco
rotação
reuse detection
```

## /auth/me

O backend não confia somente no `role` presente no JWT.

Ele consulta o usuário atual no banco e verifica seu estado.

Isso é importante porque permite considerar alterações posteriores no usuário.

## Logout

O logout:

```text
revoga refresh token
+
limpa cookies
```

O access JWT não é revogado imediatamente.

Isso ocorre porque ele é curto e não é persistido para revogação individual.

## Isolamento

```text
ADMIN
→ visão global

PROFESSOR
→ somente seu escopo
```

Essa regra precisa ser implementada no backend em cada caso de uso relevante.

---

# 23. Dívidas de segurança atuais do projeto

A implementação atual já possui várias proteções importantes, mas não significa que a segurança esteja "terminada".

Alguns pontos conhecidos para evolução:

### Rate limiting

Ainda não implementado.

Principalmente importante para login e endpoints sensíveis.

### `iss` e `aud`

Os JWTs atualmente não utilizam essas claims.

Podem ser adicionadas para restringir emissor e audiência quando houver necessidade arquitetural.

### Logout de todas as famílias

Ainda não existe uma operação específica para revogar todas as famílias de refresh tokens de um usuário.

### Refresh de usuário inativo

Existe um ponto de evolução: quando o usuário está inativo, o refresh retorna `401`, mas a implementação atual não revoga automaticamente o refresh token correspondente.

### Caminho legado de sessão

Ainda existem partes legadas relacionadas ao antigo modelo de sessão que estão sendo mantidas durante a migração incremental.

A dívida deve ser eliminada quando o fluxo antigo não for mais necessário.

### Rate limiting

Deve ser considerado antes de uma exposição pública mais ampla.

---

# 24. Erros comuns

## Erro 1 — Confiar no frontend

```text
Frontend esconde botão
→ usuário não consegue executar?
```

Não.

O usuário pode chamar a API diretamente.

A segurança precisa estar no backend.

---

## Erro 2 — Confundir autenticação com autorização

```text
Está logado
→ pode fazer tudo
```

Errado.

---

## Erro 3 — Guardar senha

Nunca armazenar:

```text
password = "123456"
```

no banco.

---

## Erro 4 — Colocar token no localStorage sem analisar o modelo de ameaça

Armazenar credenciais em JavaScript acessível pode aumentar o impacto de XSS.

A escolha do mecanismo deve considerar a arquitetura e os riscos.

No projeto, optamos por cookies HttpOnly.

---

## Erro 5 — Achar que JWT é criptografia

JWT assinado não significa que seu conteúdo seja secreto.

---

## Erro 6 — Usar CORS como autorização

CORS não decide se o professor pode visualizar um aluno.

---

## Erro 7 — Aceitar `userId` ou `professorId` do cliente como autoridade

O cliente fornece dados.

O servidor decide permissões.

---

## Erro 8 — Logar tokens

Logs podem acabar em:

- servidores;
- ferramentas de observabilidade;
- arquivos;
- sistemas de terceiros.

Nunca tratar logs como lugar seguro para credenciais.

---

# 25. Trade-offs

## JWT × sessão tradicional

### JWT

Vantagens:

- fácil transporte;
- não exige persistir cada access token;
- funciona bem em arquiteturas distribuídas.

Desvantagens:

- revogação imediata é mais complexa;
- exige cuidado com expiração;
- pode carregar claims desatualizadas.

### Sessão tradicional

Vantagens:

- revogação simples;
- estado centralizado.

Desvantagens:

- exige persistência/consulta de sessão;
- pode exigir mais cuidado em ambientes distribuídos.

---

## Cookie HttpOnly × armazenamento acessível ao JavaScript

Cookies HttpOnly:

- reduzem acesso direto do JavaScript ao segredo;
- exigem atenção especial a CSRF.

Armazenamento acessível ao JavaScript:

- pode simplificar determinados fluxos;
- aumenta o impacto potencial de XSS sobre a credencial armazenada.

Não existe uma escolha universal sem considerar o modelo de ameaça.

---

# 26. Testes de segurança

Segurança também precisa ser testada.

Exemplos para o Beach Tennis Manager:

## Autorização

```text
Professor A
→ consegue acessar aluno A?

Professor A
→ consegue acessar aluno B?

ADMIN
→ consegue acessar dados globais?
```

## Autenticação

```text
senha correta → login

senha errada → 401
```

## Refresh

```text
refresh válido → novo par

refresh antigo → rejeitado

refresh reutilizado → 409
```

## Cookies

Verificar:

```text
HttpOnly
Secure em produção
SameSite
```

## Validação

Enviar:

```text
email inválido
payload incompleto
tipos errados
campos inesperados
```

e confirmar que o backend não aceita dados fora do contrato.

---

# 27. Exercícios

## Exercício 1 — Autenticação

Explique com suas palavras:

> Qual é a diferença entre autenticação e autorização?

---

## Exercício 2 — JWT

Por que o access token do projeto possui uma duração curta?

---

## Exercício 3 — Refresh

Explique:

```text
A → B
```

no contexto de rotação de refresh tokens.

---

## Exercício 4 — XSS

Imagine que um campo de observação permita HTML arbitrário.

Quais problemas podem aparecer?

---

## Exercício 5 — SQL Injection

Por que isto é perigoso?

```ts
const sql = `SELECT * FROM users WHERE email = '${email}'`;
```

---

## Exercício 6 — autorização

Um professor envia:

```http
GET /students/999
```

O que o backend precisa verificar antes de retornar o aluno?

---

## Exercício 7 — threat model

Escolha uma funcionalidade do Beach Tennis Manager e descreva:

```text
Ativo
Ameaça
Vulnerabilidade
Impacto
Mitigação
```

---

# 28. Perguntas de entrevista

### Junior

1. O que é autenticação?
2. O que é autorização?
3. O que é hashing?
4. Por que não devemos salvar senhas em texto puro?
5. O que é SQL Injection?
6. O que é XSS?
7. O que é HTTPS?
8. O que é CORS?
9. Para que serve `HttpOnly`?
10. O que é uma variável de ambiente?

### Pleno

1. Qual a diferença entre sessão e JWT?
2. Quais são as limitações de JWT?
3. Por que separar access token e refresh token?
4. O que é refresh token rotation?
5. O que é refresh token reuse detection?
6. Como proteger cookies de autenticação?
7. O que é CSRF?
8. CORS protege contra CSRF?
9. Como implementar autorização por escopo?
10. Como você evitaria acesso horizontal indevido entre professores?
11. Como reduzir ataques de força bruta?
12. O que é princípio do menor privilégio?
13. O que você colocaria em logs de autenticação?
14. O que nunca colocaria em logs?
15. Como faria threat modeling de uma API?

---

# 29. Perguntas de aprofundamento

1. Se um JWT for roubado, como limitar seu impacto?
2. Por que um JWT não é imediatamente revogável?
3. Como implementar logout de todos os dispositivos?
4. Como detectar reutilização de refresh token?
5. Como proteger uma API contra credential stuffing?
6. Como diferenciar CSRF de XSS?
7. Por que CORS não deve ser tratado como mecanismo de autorização?
8. Como implementar autorização por objeto?
9. Qual a diferença entre autenticação e controle de acesso?
10. Como você investigaria um possível vazamento de credenciais?
11. Como faria rotação de um segredo de assinatura JWT?
12. Como protegeria um endpoint administrativo?
13. Quais informações de segurança você colocaria em auditoria?
14. Como reduzir o impacto de uma dependência vulnerável?
15. Como projetaria segurança para uma futura integração com WhatsApp e pagamentos?

---

# 30. Checklist

Antes de considerar uma funcionalidade segura, pergunte:

### Identidade

- [ ] Quem é o usuário?
- [ ] Como ele é autenticado?
- [ ] As credenciais são protegidas?

### Autorização

- [ ] O usuário pode executar esta ação?
- [ ] Ele pode acessar este objeto?
- [ ] O backend verifica isso?

### Entrada

- [ ] A entrada é validada?
- [ ] O sistema trata dados externos como não confiáveis?
- [ ] Existe risco de injection?

### Sessão

- [ ] Tokens expiram?
- [ ] Refresh tokens são protegidos?
- [ ] Existe rotação quando necessária?
- [ ] Logout possui comportamento definido?

### Navegador

- [ ] Cookies usam HttpOnly?
- [ ] Secure está configurado em produção?
- [ ] SameSite foi analisado?
- [ ] CSRF foi considerado?
- [ ] XSS foi considerado?

### Infraestrutura

- [ ] HTTPS?
- [ ] Secrets fora do código?
- [ ] Rate limiting?
- [ ] Dependências atualizadas?

### Observabilidade

- [ ] Logs úteis?
- [ ] Nenhuma senha ou token nos logs?
- [ ] Operações sensíveis podem ser auditadas?

---

# Conclusão

Segurança profissional não é decorar OWASP, JWT ou headers.

É aprender a raciocinar sobre o que pode dar errado.

A pergunta principal não é:

> "Qual biblioteca de segurança devo usar?"

É:

> "O que estou protegendo, contra quais ameaças, e quais controles reduzem esses riscos?"

No Beach Tennis Manager, isso aparece diretamente em:

```text
Autenticação
    ↓
JWT + Refresh Token
    ↓
Cookies HttpOnly
    ↓
Rotação
    ↓
Reuse Detection
    ↓
Autorização
    ↓
Isolamento por professor
    ↓
Validação
    ↓
Banco seguro
    ↓
Logs e auditoria
```

Esse raciocínio será importante nos próximos módulos, especialmente quando estudarmos testes, DevOps e Git/colaboração.

> **Segurança é uma propriedade arquitetural: ela precisa estar presente no desenho, no código, no banco, na infraestrutura e na operação.**
