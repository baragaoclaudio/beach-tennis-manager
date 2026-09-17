# 09 — HTTP e APIs

> Uma API não é apenas um conjunto de endpoints. Ela é um contrato entre sistemas, e HTTP é o protocolo que define como esses sistemas conversam.

## Sumário

1. Fundamentos da comunicação HTTP
   - 1.1 Cliente e servidor
   - 1.2 Request e Response
   - 1.3 Método, URL, headers e body
   - 1.4 Stateless
2. Métodos HTTP
   - 2.1 GET
   - 2.2 POST
   - 2.3 PUT
   - 2.4 PATCH
   - 2.5 DELETE
   - 2.6 Idempotência
3. Status codes
   - 3.1 2xx
   - 3.2 3xx
   - 3.3 4xx
   - 3.4 5xx
4. Dados enviados em uma requisição
   - 4.1 Path parameters
   - 4.2 Query parameters
   - 4.3 Headers
   - 4.4 Body
   - 4.5 Cookies
5. APIs
   - 5.1 O que é uma API?
   - 5.2 Contrato de API
   - 5.3 REST
   - 5.4 Recursos e endpoints
   - 5.5 REST não é CRUD
6. Autenticação e autorização
   - 6.1 Autenticação
   - 6.2 Autorização
   - 6.3 Cookies de autenticação
   - 6.4 Access Token e Refresh Token
7. Validação e tratamento de erros
   - 7.1 Entrada não confiável
   - 7.2 Validação com Zod
   - 7.3 Respostas de erro
   - 7.4 Não expor informações internas
8. CORS
   - 8.1 Same-Origin Policy
   - 8.2 O que CORS resolve?
   - 8.3 O que CORS não resolve?
9. Paginação, filtros e ordenação
   - 9.1 Paginação
   - 9.2 Filtros
   - 9.3 Ordenação
10. HTTP/1.1 e HTTP/2
11. Reverse Proxy
12. Processamento assíncrono
13. Versionamento de API
14. OpenAPI
15. API no Beach Tennis Manager
16. Erros comuns
17. Trade-offs
18. Exercícios
19. Perguntas de entrevista
20. Perguntas de aprofundamento
21. Checklist
22. Conclusão

---

# 1. Fundamentos da comunicação HTTP

## O que é?

HTTP significa **Hypertext Transfer Protocol**.

É um protocolo utilizado para comunicação entre aplicações.

Em uma aplicação web, podemos ter:

```text
Browser
   ↓
HTTP
   ↓
API
```

O navegador envia uma requisição e o servidor devolve uma resposta.

---

## 1.1 Cliente e servidor

### Cliente

É quem inicia a comunicação.

Pode ser:

- navegador;
- aplicativo mobile;
- frontend React;
- outro servidor;
- ferramenta como curl ou Postman.

### Servidor

Recebe a requisição, processa e responde.

No Beach Tennis Manager:

```text
React
  ↓
Fastify
  ↓
PostgreSQL
```

O React é o cliente da API.

O Fastify executa o papel de servidor HTTP.

---

## 1.2 Request e Response

Uma comunicação HTTP possui dois lados principais.

### Request

É a requisição enviada pelo cliente.

```text
Request
 ↓
GET /students
```

### Response

É a resposta enviada pelo servidor.

```text
Response
 ↓
200 OK
```

Podemos visualizar:

```text
Cliente
   │
   │ HTTP Request
   ↓
Servidor
   │
   │ HTTP Response
   ↓
Cliente
```

---

## 1.3 Método, URL, headers e body

Uma requisição pode conter:

```text
Método
URL
Headers
Body
```

Exemplo:

```http
POST /auth/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "..."
}
```

### Método

Indica a intenção da operação.

Neste caso:

```text
POST
```

### URL

Identifica o recurso/endpoint.

```text
/auth/admin/login
```

### Headers

São metadados da requisição.

Exemplo:

```http
Content-Type: application/json
```

### Body

Carrega os dados enviados.

```json
{
  "email": "admin@example.com"
}
```

---

## 1.4 Stateless

HTTP é frequentemente descrito como **stateless**.

Isso significa que cada requisição deve carregar as informações necessárias para que o servidor consiga processá-la, sem depender de uma memória implícita da requisição HTTP anterior.

Isso não significa que a aplicação não possa possuir estado.

Por exemplo:

```text
HTTP
→ stateless

Aplicação
→ pode possuir banco
→ pode possuir sessões
→ pode possuir refresh tokens
```

Essa distinção é importante.

---

# 2. Métodos HTTP

Os métodos HTTP expressam a intenção da requisição.

---

## 2.1 GET

Usado normalmente para obter dados.

```http
GET /students
```

ou:

```http
GET /students/123
```

Conceitualmente:

```text
GET
→ quero consultar
```

GET não deve ser utilizado para executar operações que alteram estado como efeito principal.

---

## 2.2 POST

Normalmente utilizado para criar recursos ou executar operações que não são adequadamente representadas como leitura/atualização idempotente.

Exemplo:

```http
POST /students
```

```json
{
  "name": "João"
}
```

Outro exemplo:

```http
POST /auth/refresh
```

Aqui não estamos simplesmente criando um recurso de negócio. Estamos executando uma operação relacionada à autenticação.

Isso mostra por que REST não deve ser confundido com CRUD.

---

## 2.3 PUT

PUT normalmente representa substituição completa de uma representação do recurso.

Exemplo:

```http
PUT /students/123
```

```json
{
  "name": "João",
  "email": "joao@example.com"
}
```

A semântica exata depende do contrato da API.

---

## 2.4 PATCH

PATCH é usado para alteração parcial.

Exemplo:

```http
PATCH /students/123
```

```json
{
  "email": "novo@example.com"
}
```

A ideia é:

```text
PUT
→ representação completa

PATCH
→ alteração parcial
```

Na prática, APIs podem adotar convenções próprias, mas o contrato precisa ser claro.

---

## 2.5 DELETE

Usado normalmente para remoção de recurso.

```http
DELETE /students/123
```

A resposta pode ser:

```text
204 No Content
```

quando não há conteúdo para retornar.

---

## 2.6 Idempotência

Uma operação é **idempotente** quando repetir a mesma operação produz o mesmo efeito final.

Exemplo conceitual:

```text
PUT /students/123
```

executado uma vez:

```text
nome = João
```

executado novamente com o mesmo conteúdo:

```text
nome = João
```

O estado final continua igual.

Isso não significa necessariamente que a resposta ou efeitos secundários sejam absolutamente idênticos em todos os aspectos.

### Por que importa?

Idempotência é importante em:

- retries;
- redes instáveis;
- pagamentos;
- processamento distribuído.

No BTM, operações que possam ser repetidas precisam ter sua semântica analisada cuidadosamente.

---

# 3. Status codes

Status codes informam o resultado geral da requisição.

---

## 3.1 2xx — sucesso

### 200 OK

Operação executada com sucesso.

```http
GET /students
→ 200
```

### 201 Created

Recurso criado.

```http
POST /students
→ 201
```

### 204 No Content

Sucesso sem conteúdo de resposta.

```http
DELETE /students/123
→ 204
```

---

## 3.2 3xx — redirecionamento

Exemplos:

```text
301
302
304
```

No contexto de APIs, `304 Not Modified` pode aparecer em mecanismos relacionados a cache.

Não devemos decorar 3xx sem entender o contexto.

---

## 3.3 4xx — erro do cliente

Significa que a requisição não pode ser processada como enviada.

### 400 Bad Request

Requisição inválida.

### 401 Unauthorized

O cliente não possui autenticação válida.

É comum em:

```text
token ausente
token inválido
credencial inválida
```

### 403 Forbidden

O servidor entendeu quem é o cliente, mas ele não possui autorização para aquela operação.

Diferença conceitual:

```text
401
→ identidade/autenticação não válida

403
→ autenticado, mas sem permissão
```

### 404 Not Found

Recurso não encontrado, ou o servidor escolheu não revelar sua existência nesse contexto.

### 409 Conflict

Conflito com o estado atual do recurso.

No BTM, reutilização de refresh token foi definida para retornar `409`.

### 422 Unprocessable Content

Pode ser utilizado para indicar que o conteúdo foi compreendido, mas não atende às regras semânticas do processamento.

A escolha entre `400` e `422` depende do contrato da API.

---

## 3.4 5xx — erro do servidor

Representam falhas do lado servidor.

### 500 Internal Server Error

Erro interno não tratado adequadamente para o cliente.

### 502 Bad Gateway

Um servidor intermediário recebeu resposta inválida de outro servidor.

### 503 Service Unavailable

Serviço temporariamente indisponível.

---

# 4. Dados enviados em uma requisição

Existem diferentes lugares para transportar informações.

---

## 4.1 Path parameters

Fazem parte do caminho.

```http
GET /students/123
```

Aqui:

```text
123
```

é um path parameter.

Normalmente representa identificação de recurso.

---

## 4.2 Query parameters

Ficam depois de `?`.

```http
GET /students?page=2&limit=20
```

Podem representar:

- filtros;
- paginação;
- ordenação;
- opções de consulta.

---

## 4.3 Headers

São metadados.

Exemplos:

```http
Content-Type
Accept
Origin
Cookie
Authorization
```

Cada header possui uma finalidade específica.

---

## 4.4 Body

Transporta o conteúdo principal da requisição.

Exemplo:

```http
POST /students
Content-Type: application/json

{
  "name": "João",
  "cpf": "..."
}
```

---

## 4.5 Cookies

Cookies são pequenos dados enviados pelo navegador em requisições correspondentes.

No BTM, são utilizados para autenticação:

```text
btm_access
btm_refresh
```

O frontend não precisa ler o conteúdo desses cookies quando eles são `HttpOnly`.

---

# 5. APIs

## 5.1 O que é uma API?

API significa **Application Programming Interface**.

É uma interface que define como uma aplicação pode interagir com outra.

No contexto web:

```text
React
 ↓
HTTP API
 ↓
Backend
```

A API estabelece um contrato.

---

## 5.2 Contrato de API

Contrato define coisas como:

```text
endpoint
método
entrada
saída
erros
autenticação
```

Exemplo:

```http
POST /students
```

Entrada:

```json
{
  "name": "João"
}
```

Saída:

```json
{
  "id": "...",
  "name": "João"
}
```

Um contrato bem definido reduz ambiguidades entre frontend e backend.

---

## 5.3 REST

REST significa **Representational State Transfer**.

É um estilo arquitetural para sistemas distribuídos.

Alguns princípios associados incluem:

- uso de recursos;
- interface uniforme;
- statelessness;
- utilização das capacidades do protocolo HTTP.

Uma API REST normalmente utiliza URLs orientadas a recursos.

Exemplo:

```text
/students
/students/:id
/classes
/classes/:id
```

---

## 5.4 Recursos e endpoints

Um recurso representa uma entidade ou conceito exposto pela API.

Exemplo:

```text
students
```

Endpoint é uma combinação prática de método + caminho.

```text
GET /students
POST /students
GET /students/:id
```

Esses endpoints podem representar diferentes operações sobre o recurso.

---

## 5.5 REST não é CRUD

CRUD significa:

```text
Create
Read
Update
Delete
```

REST é mais amplo.

Uma API pode possuir operações que não são simplesmente CRUD:

```http
POST /auth/refresh
POST /classes/:id/cancel
POST /makeup-credits/:id/use
```

O objetivo é modelar a API de maneira clara, não forçar toda operação a parecer uma tabela de banco.

---

# 6. Autenticação e autorização

## 6.1 Autenticação

Responde:

> Quem é você?

Exemplo:

```text
email + senha
 ↓
usuário identificado
```

---

## 6.2 Autorização

Responde:

> O que você pode fazer?

No BTM:

```text
ADMIN
→ escopo administrativo

PROFESSOR
→ escopo relacionado à sua operação
```

A API deve verificar autorização no backend.

---

## 6.3 Cookies de autenticação

No BTM, a autenticação é transportada através de cookies:

```text
btm_access
btm_refresh
```

Com atributos de segurança apropriados.

A aplicação utiliza:

```text
HttpOnly
SameSite=Lax
Secure em produção
```

---

## 6.4 Access Token e Refresh Token

O access token é curto:

```text
10 minutos
```

O refresh token:

```text
8 horas
```

Fluxo:

```text
Login
 ↓
Access + Refresh
 ↓
Access expira
 ↓
Refresh
 ↓
novo Access + novo Refresh
```

O refresh token é rotacionado.

Isso se conecta diretamente ao módulo de segurança.

---

# 7. Validação e tratamento de erros

## 7.1 Entrada não confiável

Tudo que chega ao servidor deve ser tratado como não confiável.

Incluindo:

```text
body
query
params
headers
cookies
```

Mesmo que o frontend tenha validação.

O cliente pode chamar a API diretamente.

---

## 7.2 Validação com Zod

No BTM utilizamos Zod.

Fluxo:

```text
Request
 ↓
Zod schema
 ↓
válido?
 ├── sim → continua
 └── não → erro
```

Isso cria uma fronteira clara entre:

```text
dados externos
```

e:

```text
dados aceitos pela aplicação
```

---

## 7.3 Respostas de erro

Uma API deve possuir respostas previsíveis.

Exemplo conceitual:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos"
  }
}
```

O formato deve ser consistente.

---

## 7.4 Não expor informações internas

Evite retornar:

```text
stack trace
SQL
senhas
tokens
segredos
```

ao cliente.

O cliente precisa de uma informação útil.

Exemplo:

```text
500
Erro interno do servidor
```

Detalhes técnicos devem ficar nos mecanismos apropriados de observabilidade.

---

# 8. CORS

## 8.1 Same-Origin Policy

Navegadores possuem mecanismos de segurança relacionados à **Same-Origin Policy**.

Duas origens podem ser diferentes por:

```text
scheme
host
port
```

Por exemplo:

```text
http://localhost:5173
http://localhost:3333
```

são origens diferentes.

---

## 8.2 O que CORS resolve?

CORS permite ao servidor informar quais origens podem realizar determinadas interações cross-origin através do navegador.

No BTM:

```text
React :5173
     ↓
API :3333
```

precisa existir configuração adequada.

---

## 8.3 O que CORS não resolve?

CORS não substitui:

```text
autenticação
autorização
validação
isolamento de dados
CSRF protection
```

Uma pessoa pode chamar a API com curl ou outra ferramenta sem passar pelas mesmas restrições do navegador.

---

# 9. Paginação, filtros e ordenação

## 9.1 Paginação

Imagine:

```text
100.000 alunos
```

Não queremos retornar tudo em uma única resposta.

Podemos usar:

```http
GET /students?page=1&limit=20
```

Resultado:

```text
20 registros
```

Além de reduzir o tamanho da resposta, paginação pode reduzir custo de processamento e memória.

---

## 9.2 Filtros

Exemplo:

```http
GET /students?active=true
```

O servidor aplica o filtro.

Filtros devem possuir contrato claro e validação.

---

## 9.3 Ordenação

Exemplo:

```http
GET /students?sort=name&direction=asc
```

Nunca devemos transformar diretamente valores arbitrários fornecidos pelo usuário em SQL sem validação.

Uma abordagem segura é utilizar uma lista permitida:

```text
name
createdAt
```

e rejeitar outros campos.

---

# 10. HTTP/1.1 e HTTP/2

## HTTP/1.1

É amplamente utilizado e possui um modelo textual tradicional de requisições e respostas.

Possui mecanismos como:

- keep-alive;
- pipelining, com limitações práticas;
- múltiplas conexões para melhorar paralelismo em clientes.

## HTTP/2

Introduziu melhorias importantes, incluindo:

- multiplexação;
- compressão de headers;
- representação binária dos frames.

**Multiplexação** permite que múltiplas streams compartilhem uma mesma conexão.

Isso pode reduzir overhead e melhorar eficiência.

## Importante

Migrar de HTTP/1.1 para HTTP/2 não corrige problemas de arquitetura ou segurança da aplicação.

---

# 11. Reverse Proxy

Um reverse proxy fica na frente dos serviços.

```text
Internet
   ↓
Reverse Proxy
   ↓
API
```

Pode cuidar de:

- TLS;
- roteamento;
- compressão;
- headers;
- rate limiting;
- distribuição de tráfego.

Exemplos:

```text
Nginx
Caddy
Traefik
```

Em produção, o reverse proxy pode permitir:

```text
https://app.exemplo.com
        ↓
frontend

https://api.exemplo.com
        ↓
backend
```

---

# 12. Processamento assíncrono

Nem toda operação precisa terminar durante a mesma requisição HTTP.

Imagine:

```text
POST /reports/generate
```

Se gerar o relatório demora 30 segundos, manter a conexão aberta pode não ser a melhor solução.

Podemos utilizar processamento assíncrono:

```text
Request
 ↓
Job criado
 ↓
202 Accepted
 ↓
processamento em background
```

Depois o cliente pode consultar o resultado.

Isso normalmente envolve:

```text
fila
worker
job
```

e será estudado com mais profundidade em arquitetura.

---

# 13. Versionamento de API

Quando um contrato muda de maneira incompatível, clientes antigos podem quebrar.

Uma estratégia é versionar a API:

```text
/api/v1/students
/api/v2/students
```

Mas versionamento não deve ser utilizado automaticamente para qualquer alteração.

Antes, devemos avaliar se a mudança é realmente incompatível.

---

# 14. OpenAPI

**OpenAPI** é uma especificação para descrever APIs.

Pode documentar:

- endpoints;
- parâmetros;
- schemas;
- respostas;
- autenticação.

Exemplo conceitual:

```text
OpenAPI
   ↓
documentação
   ↓
frontend
backend
testes
ferramentas
```

Uma especificação bem mantida reduz ambiguidades.

O BTM possui OpenAPI planejado como parte da evolução da API.

---

# 15. API no Beach Tennis Manager

A arquitetura atual:

```text
React + TypeScript
        ↓
HTTP
        ↓
Fastify + TypeScript
        ↓
Use Cases
        ↓
Drizzle
        ↓
PostgreSQL
```

## Autenticação

```http
POST /auth/admin/login
```

Depois:

```http
GET /auth/me
```

Quando o access token expira:

```text
GET /auth/me
 ↓
401
 ↓
POST /auth/refresh
 ↓
novo access token
 ↓
retry
```

O frontend implementa um mecanismo de **single-flight** para evitar múltiplos refreshes concorrentes desnecessários.

---

## Logout

```http
POST /auth/logout
```

O backend:

```text
revoga refresh token
+
limpa cookies
```

O access JWT não é revogado individualmente de forma imediata.

---

## Segurança

A API precisa aplicar:

```text
autenticação
+
autorização
+
isolamento por professor
+
validação
```

Não devemos confiar somente no frontend.

---

# 16. Erros comuns

## Usar GET para alterar dados

Exemplo ruim:

```http
GET /students/123/delete
```

GET deve representar consulta, não uma ação destrutiva.

---

## Confundir 401 e 403

```text
401
→ autenticação inválida/ausente

403
→ autenticado, mas sem autorização
```

---

## Retornar 200 para tudo

Uma API que responde:

```text
200
```

mesmo quando ocorreu erro perde parte do significado do protocolo.

---

## Colocar tudo no body

Nem toda informação deve estar no body.

Use:

```text
path
→ identidade do recurso

query
→ filtros/opções de consulta

headers
→ metadados

body
→ conteúdo da operação
```

---

## Confiar na validação do frontend

O backend precisa validar novamente.

---

## Usar CORS como segurança de negócio

CORS não substitui autorização.

---

## Expor stack trace

Detalhes internos podem revelar:

- estrutura do sistema;
- caminhos de arquivos;
- SQL;
- bibliotecas;
- informações úteis para ataques.

---

# 17. Trade-offs

## REST simples × API excessivamente sofisticada

Uma API pode ser simples:

```text
GET /students
POST /students
```

Isso geralmente é ótimo no começo.

Não devemos criar:

```text
/graphql
event sourcing
CQRS
microservices
```

sem uma necessidade real.

---

## Paginação offset × cursor

### Offset

```text
?page=10
```

É simples.

### Cursor

```text
?cursor=abc123
```

Pode ser mais eficiente em determinados cenários de grandes volumes e mudanças frequentes.

A escolha depende do caso.

---

## Versionamento × compatibilidade

Criar:

```text
v1
v2
v3
```

pode preservar clientes antigos.

Mas também aumenta:

```text
código
testes
documentação
manutenção
```

Por isso devemos preferir mudanças compatíveis quando possível.

---

# 18. Exercícios

## Exercício 1

Explique a diferença entre:

```text
path parameter
query parameter
header
body
```

---

## Exercício 2

Qual a diferença entre:

```text
401
403
```

?

---

## Exercício 3

Por que `GET /students/123/delete` é uma má modelagem?

---

## Exercício 4

Imagine:

```http
GET /students?page=1&limit=20
```

Por que paginação pode ser necessária?

---

## Exercício 5

Explique:

```text
Access Token
Refresh Token
```

e por que o projeto utiliza os dois.

---

## Exercício 6

Um professor autenticado solicita:

```http
GET /students/999
```

Quais verificações o backend deve fazer antes de retornar os dados?

---

# 19. Perguntas de entrevista

### Junior

1. O que é HTTP?
2. O que é uma API?
3. O que é REST?
4. O que é GET?
5. O que é POST?
6. Qual a diferença entre PUT e PATCH?
7. O que significa DELETE?
8. O que são status codes?
9. Qual a diferença entre 4xx e 5xx?
10. O que são headers?

### Pleno

1. O que significa HTTP ser stateless?
2. O que é idempotência?
3. Qual a diferença entre PUT e PATCH?
4. Quando utilizar 401 e quando utilizar 403?
5. O que é CORS?
6. CORS resolve autorização?
7. O que é REST?
8. REST é a mesma coisa que CRUD?
9. Como você desenharia uma API para um domínio complexo?
10. Como implementar paginação?
11. Offset e cursor: quais diferenças?
12. O que é reverse proxy?
13. Qual a diferença entre HTTP/1.1 e HTTP/2?
14. Como tratar erros de uma API?
15. Como versionar uma API?
16. O que é OpenAPI?
17. Como você projetaria autenticação para uma API?
18. Como evitar acesso horizontal indevido?
19. Como lidar com operações demoradas?
20. Como garantir idempotência em uma operação crítica?

---

# 20. Perguntas de aprofundamento

1. Por que HTTP é stateless?
2. O que significa idempotência na prática?
3. Uma requisição idempotente pode gerar efeitos externos?
4. Qual a diferença entre autenticação e autorização em uma API?
5. Como implementar autorização por recurso?
6. Como evitar enumeration attacks em endpoints?
7. Como desenhar um contrato de erro consistente?
8. Como lidar com breaking changes?
9. Quando utilizar 202 Accepted?
10. Como projetar retries seguros?
11. Como implementar idempotency keys?
12. Como funcionam HTTP/2 streams?
13. Como reverse proxy e load balancer se relacionam?
14. Como proteger APIs públicas contra abuso?
15. Como documentar uma API com OpenAPI?

---

# 21. Checklist

### HTTP

- [ ] Métodos possuem semântica adequada?
- [ ] Status codes representam corretamente o resultado?
- [ ] Path/query/header/body são usados com propósito claro?
- [ ] Idempotência foi considerada quando necessário?

### API

- [ ] Contrato claro?
- [ ] Respostas previsíveis?
- [ ] Erros padronizados?
- [ ] Documentação planejada?

### Segurança

- [ ] Autenticação?
- [ ] Autorização?
- [ ] Validação no backend?
- [ ] CORS configurado?
- [ ] Cookies seguros?
- [ ] CSRF considerado?

### Performance

- [ ] Paginação?
- [ ] Filtros?
- [ ] Ordenação?
- [ ] Operações demoradas tratadas adequadamente?

### Evolução

- [ ] Breaking changes identificados?
- [ ] Versionamento realmente necessário?
- [ ] OpenAPI atualizado?

---

# 22. Conclusão

HTTP é muito mais do que:

```text
GET
POST
PUT
DELETE
```

Uma API profissional precisa ter uma semântica clara.

Precisamos entender:

```text
Request
 ↓
HTTP
 ↓
Endpoint
 ↓
Validação
 ↓
Autorização
 ↓
Regra de negócio
 ↓
Persistência
 ↓
Response
```

No Beach Tennis Manager, essa compreensão aparece diretamente no fluxo:

```text
React
 ↓
HTTP
 ↓
Fastify
 ↓
Autenticação
 ↓
Autorização
 ↓
Use Case
 ↓
Drizzle
 ↓
PostgreSQL
```

Quando entendemos HTTP profundamente, deixamos de simplesmente "criar endpoints" e começamos a projetar **contratos de comunicação confiáveis**.

> **Uma boa API não apenas funciona: ela comunica claramente sua intenção, seus contratos, seus erros e seus limites.**
