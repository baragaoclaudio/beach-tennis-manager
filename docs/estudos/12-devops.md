# 12 — DevOps

> DevOps não é apenas Docker, CI/CD ou colocar uma aplicação em produção. É o conjunto de práticas que aproxima desenvolvimento, operação, automação, entrega e observabilidade.

## Sumário

1. O que é DevOps?
2. Por que DevOps existe?
3. Desenvolvimento × operação
4. Ambientes
5. Configuração por ambiente
6. Build
7. Deploy
8. CI e CD
9. Pipeline
10. Git como parte do fluxo
11. Docker
12. Imagem × container
13. Docker Compose
14. Redes e portas
15. Volumes
16. Banco de dados em ambiente de desenvolvimento
17. Migrations
18. Health check
19. Logs
20. Observabilidade
21. Monitoramento
22. Rollback
23. Secrets
24. Infraestrutura
25. Reverse proxy
26. Escalabilidade
27. Alta disponibilidade
28. Backup e recuperação
29. Segurança no DevOps
30. DevOps no Beach Tennis Manager
31. Pipeline sugerido para o projeto
32. Erros comuns
33. Trade-offs
34. Exercícios
35. Perguntas de entrevista
36. Perguntas de aprofundamento
37. Checklist

---

# 1. O que é DevOps?

**DevOps** é uma forma de trabalhar que aproxima desenvolvimento de software e operação de sistemas.

A palavra vem de:

```text
Development
+
Operations
=
DevOps
```

Mas DevOps não significa simplesmente:

```text
"o desenvolvedor agora também é o administrador do servidor"
```

A ideia é criar um processo confiável para:

```text
Código
 ↓
Teste
 ↓
Build
 ↓
Entrega
 ↓
Deploy
 ↓
Execução
 ↓
Monitoramento
 ↓
Feedback
```

---

# 2. Por que DevOps existe?

Imagine um processo manual:

```text
desenvolvedor termina código
        ↓
copia arquivos
        ↓
entra no servidor
        ↓
executa comandos manualmente
        ↓
configura coisas
        ↓
reinicia aplicação
```

Quanto mais manual o processo, maior a possibilidade de erro.

DevOps busca automatizar partes repetitivas e tornar o processo reproduzível.

## Qual problema resolve?

Principalmente:

- deploys inconsistentes;
- configuração manual;
- dificuldade de reproduzir ambientes;
- demora para entregar mudanças;
- falta de visibilidade sobre falhas;
- dependência de conhecimento concentrado em uma pessoa.

---

# 3. Desenvolvimento × operação

Tradicionalmente, desenvolvimento e operação podem possuir objetivos diferentes.

```text
Desenvolvimento
→ entregar mudanças

Operação
→ manter estabilidade
```

Isso pode gerar conflito.

DevOps tenta aproximar essas responsabilidades:

```text
entregar mudanças
+
manter estabilidade
+
automatizar
+
observar
```

A equipe passa a pensar no ciclo completo.

---

# 4. Ambientes

Uma aplicação normalmente possui mais de um ambiente.

Os mais comuns:

```text
development
staging
production
```

## Development

Ambiente usado durante desenvolvimento.

Exemplo:

```text
localhost
```

## Staging

Ambiente semelhante à produção usado para validação antes da publicação.

## Production

Ambiente real utilizado pelos usuários.

## Por que separar?

Porque não queremos testar mudanças experimentais diretamente no ambiente real.

---

# 5. Configuração por ambiente

O código deve ser capaz de funcionar em ambientes diferentes sem precisar ser reescrito.

Por exemplo:

```text
DATABASE_URL
JWT_SECRET
API_URL
```

podem mudar entre ambientes.

```text
Development
DATABASE_URL → banco local

Production
DATABASE_URL → banco de produção
```

O código continua sendo essencialmente o mesmo.

## Configuração × código

Uma boa separação é:

```text
Código
→ comportamento da aplicação

Configuração
→ valores específicos do ambiente
```

---

# 6. Build

**Build** é o processo de transformar o código-fonte em algo executável/distribuível.

No frontend React, por exemplo:

```text
TypeScript + React
       ↓
Vite build
       ↓
arquivos estáticos
```

No backend:

```text
TypeScript
   ↓
compilação
   ↓
JavaScript executável
```

## Por que existe?

Porque o código utilizado durante desenvolvimento pode não ser exatamente o formato utilizado em produção.

---

# 7. Deploy

**Deploy** é colocar uma versão da aplicação em um ambiente onde ela possa ser executada.

Exemplo:

```text
Git
 ↓
CI
 ↓
Build
 ↓
Artefato
 ↓
Servidor
 ↓
Deploy
```

**Artefato** é o resultado produzido pelo processo de build que será entregue.

---

# 8. CI e CD

## CI

**Continuous Integration** — Integração Contínua.

A ideia é integrar alterações frequentemente e verificar automaticamente se continuam funcionando.

Exemplo:

```text
git push
 ↓
CI
 ↓
lint
 ↓
typecheck
 ↓
testes
 ↓
build
```

Se algo falhar:

```text
pipeline → falha
```

## CD

CD pode significar:

- Continuous Delivery;
- Continuous Deployment.

### Continuous Delivery

A aplicação fica pronta para ser publicada, mas uma etapa pode exigir aprovação.

### Continuous Deployment

Uma alteração aprovada automaticamente pode chegar à produção sem uma aprovação manual adicional, dependendo do fluxo.

---

# 9. Pipeline

**Pipeline** é uma sequência automatizada de etapas.

Exemplo:

```text
Push
 ↓
Install
 ↓
Lint
 ↓
Typecheck
 ↓
Tests
 ↓
Build
 ↓
Deploy
```

Cada etapa produz uma evidência ou resultado.

Se:

```text
Tests → FAIL
```

podemos impedir:

```text
Deploy
```

Isso é uma barreira importante.

---

# 10. Git como parte do fluxo

Git não serve apenas para armazenar versões.

Ele pode ser parte da automação:

```text
git push
   ↓
GitHub
   ↓
CI
   ↓
testes
   ↓
build
```

Por isso commits organizados e branches claras ajudam também no processo operacional.

No Beach Tennis Manager, o histórico Git já funciona como registro das decisões e evoluções do projeto.

---

# 11. Docker

**Docker** permite empacotar uma aplicação e suas dependências em uma unidade executável chamada container.

Conceitualmente:

```text
Aplicação
+
dependências
+
configuração necessária
        ↓
Container
```

## Por que existe?

Para reduzir problemas como:

> "Na minha máquina funciona."

Um ambiente containerizado pode tornar a execução mais previsível.

---

# 12. Imagem × container

Essa diferença é fundamental.

## Imagem

É um modelo/imagem imutável a partir do qual containers podem ser criados.

```text
Docker image
```

## Container

É uma instância em execução de uma imagem.

```text
Image
 ↓
Container
```

Uma mesma imagem pode gerar vários containers.

---

# 13. Docker Compose

Docker Compose permite definir vários serviços em um arquivo de configuração.

Exemplo conceitual:

```text
compose.yaml

services:
  postgres:
    ...
  redis:
    ...
```

No Beach Tennis Manager, atualmente o Compose é utilizado principalmente para executar o PostgreSQL.

A API e o frontend continuam sendo executados no host durante o desenvolvimento.

Isso é uma escolha deliberada para manter o ciclo local simples nesta fase.

---

# 14. Redes e portas

Quando um serviço está executando:

```text
PostgreSQL
→ 5432
```

a porta permite comunicação com o serviço.

No BTM:

```text
Web
→ 5173

API
→ 3333

PostgreSQL
→ 5432
```

Essas portas fazem parte da configuração do ambiente local.

## Importante

Porta não é sinônimo de segurança.

Abrir uma porta não significa que um serviço está autorizado a receber qualquer requisição.

---

# 15. Volumes

Containers podem ser destruídos e recriados.

Se os dados estiverem somente dentro do filesystem efêmero do container, eles podem ser perdidos.

Um **volume** permite persistir dados fora do ciclo de vida do container.

Exemplo:

```text
PostgreSQL container
       ↓
volume
       ↓
dados persistentes
```

No desenvolvimento, isso é importante para não perder o banco toda vez que o container for recriado.

---

# 16. Banco de dados em desenvolvimento

No BTM:

```text
API
 ↓
Drizzle
 ↓
PostgreSQL
```

O PostgreSQL roda via Docker Compose.

Isso cria um ambiente local relativamente próximo do que teríamos em produção:

```text
aplicação
→ banco PostgreSQL
```

## Benefício

Todos os desenvolvedores podem utilizar uma configuração semelhante.

---

# 17. Migrations

**Migration** representa uma alteração controlada na estrutura do banco.

Exemplo:

```text
v1
users

↓ migration

v2
users
refresh_tokens
```

A migration registra a transformação.

No BTM usamos Drizzle para gerenciar esse processo.

Atualmente existem migrations relacionadas à criação inicial do schema e à migração da autenticação para refresh tokens.

## Por que não editar o banco manualmente?

Porque uma migration transforma uma alteração local em algo reproduzível.

```text
desenvolvedor A
→ executa migration

servidor
→ executa a mesma migration
```

---

# 18. Health check

Um **health check** é uma verificação que indica se um serviço está funcionando de maneira básica.

No BTM:

```http
GET /health
```

retorna:

```json
{
  "status": "ok"
}
```

Isso permite verificar rapidamente se a API está respondendo.

## Importante

Health check pode ser simples ou profundo.

Um check simples pode perguntar:

```text
processo está respondendo?
```

Um check mais profundo pode verificar dependências.

Devemos evitar tornar o health check tão complexo que ele próprio se torne uma fonte de falhas.

---

# 19. Logs

Logs registram acontecimentos relevantes da aplicação.

Exemplo:

```text
server started
request received
authentication failed
database error
```

Logs ajudam a responder:

> O que aconteceu?

Mas logging precisa ser estruturado e seguro.

Nunca devemos registrar:

```text
senha
refresh token
access token
```

sem uma razão extremamente específica e controles apropriados.

---

# 20. Observabilidade

Observabilidade é a capacidade de entender o estado interno de um sistema a partir das informações que ele produz.

Três pilares são frequentemente citados:

```text
Logs
Métricas
Traces
```

## Logs

Respondem:

> O que aconteceu?

## Métricas

Respondem:

> Quanto? Com que frequência?

Exemplo:

```text
requests/minuto
erros/minuto
latência
```

## Traces

Ajudam a acompanhar uma requisição através de diferentes componentes.

```text
Browser
 ↓
API
 ↓
Use Case
 ↓
Database
```

---

# 21. Monitoramento

Monitoramento é observar indicadores do sistema e detectar situações relevantes.

Exemplos:

```text
CPU
memória
latência
erros HTTP
disponibilidade
```

Para o BTM, no início, métricas simples podem ser suficientes.

À medida que o sistema cresce, podemos adicionar observabilidade mais completa.

---

# 22. Rollback

Rollback significa retornar para uma versão anterior quando uma alteração causa problema.

Exemplo:

```text
v1 → funcionando

deploy v2
→ problema

rollback
→ v1
```

Um processo de deploy profissional deve considerar:

> Como voltamos atrás?

Não basta pensar:

> Como publicamos?

---

# 23. Secrets

Secrets são informações que precisam permanecer confidenciais.

Exemplos:

```text
JWT_SECRET
DATABASE_PASSWORD
API_KEY
```

Não devemos colocá-los:

```text
no Git
no código
em logs
```

No desenvolvimento local, usamos `.env`.

Em produção, normalmente utilizamos algum mecanismo específico de gerenciamento de secrets da infraestrutura.

---

# 24. Infraestrutura

Infraestrutura inclui os recursos necessários para executar o sistema.

Por exemplo:

```text
Servidor
Banco
Rede
DNS
TLS
Storage
Backups
Monitoramento
```

Dependendo da arquitetura, esses recursos podem ser:

- servidores virtuais;
- containers;
- serviços gerenciados;
- cloud;
- infraestrutura própria.

---

# 25. Reverse proxy

Um **reverse proxy** é um servidor que recebe requisições dos clientes e encaminha para serviços internos.

Exemplo:

```text
Internet
   ↓
Reverse Proxy
   ↓
API
```

Ele pode cuidar de:

- TLS;
- roteamento;
- headers;
- compressão;
- rate limiting;
- distribuição de tráfego.

Exemplos de tecnologias comuns:

- Nginx;
- Caddy;
- Traefik.

O reverse proxy não é obrigatório em toda arquitetura, mas é muito comum em produção.

---

# 26. Escalabilidade

Escalabilidade é a capacidade de um sistema lidar com crescimento de demanda.

## Escala vertical

Aumentar recursos de uma máquina:

```text
2 CPU
→
8 CPU
```

## Escala horizontal

Adicionar mais instâncias:

```text
API 1
API 2
API 3
```

atrás de um balanceador.

## Importante

Escalar horizontalmente pode exigir que a aplicação não dependa de estado armazenado somente na memória de uma instância.

Esse conceito se relaciona diretamente com sessões, cache e filas.

---

# 27. Alta disponibilidade

Alta disponibilidade significa projetar o sistema para reduzir períodos de indisponibilidade.

Exemplo:

```text
API 1 ─┐
       ├→ Load Balancer
API 2 ─┘
```

Se uma instância falhar, outra pode continuar atendendo.

Mas alta disponibilidade tem custo:

- mais infraestrutura;
- mais complexidade;
- mais monitoramento;
- mais pontos para operar.

Para um projeto pequeno, pode não ser necessário imediatamente.

---

# 28. Backup e recuperação

Backup é uma cópia dos dados para recuperação futura.

Mas:

```text
backup existe
```

não significa:

```text
recuperação garantida
```

É necessário testar restauração.

Um conceito importante é:

```text
Backup
+
Restore testado
=
maior confiança
```

Também precisamos definir:

- frequência;
- retenção;
- onde armazenar;
- criptografia;
- quem pode acessar.

---

# 29. Segurança no DevOps

DevOps também precisa incorporar segurança.

Algumas práticas:

```text
Git
 ↓
dependências verificadas
 ↓
testes
 ↓
secrets protegidos
 ↓
build
 ↓
deploy
```

Podemos automatizar verificações como:

- vulnerabilidades em dependências;
- secrets acidentalmente commitados;
- lint;
- typecheck;
- testes;
- imagens Docker vulneráveis.

Isso se aproxima do conceito de **DevSecOps**.

---

# 30. DevOps no Beach Tennis Manager

Nossa situação atual:

```text
GitHub
   ↓
código
   ↓
npm workspaces
   ↓
API + Web
   ↓
PostgreSQL
```

Durante desenvolvimento:

```text
Docker Compose
→ PostgreSQL

Host
→ API

Host
→ React/Vite
```

## API

```text
localhost:3333
```

## Web

```text
localhost:5173
```

## Banco

```text
PostgreSQL
```

## Health

```http
GET /health
```

## Migrations

```text
Drizzle migrations
```

Esse cenário já fornece uma base para evoluirmos para CI/CD posteriormente.

---

# 31. Pipeline sugerido para o projeto

Uma primeira pipeline profissional pode ser:

```text
git push
   ↓
GitHub
   ↓
Install dependencies
   ↓
Lint
   ↓
Typecheck
   ↓
Tests
   ↓
Build
   ↓
Deploy
```

Para Pull Request:

```text
PR
 ↓
CI
 ├── lint
 ├── typecheck
 ├── tests
 └── build
```

Somente após aprovação:

```text
main
 ↓
deploy
```

## Por que isso é importante?

Porque transforma qualidade em uma etapa automática do processo.

---

# 32. Erros comuns

## "DevOps é Docker"

Não.

Docker é uma ferramenta.

DevOps envolve:

- cultura;
- processos;
- automação;
- entrega;
- operação;
- observabilidade.

---

## "CI/CD é apenas rodar testes"

Não.

Testes podem fazer parte do pipeline, mas CI/CD cobre um processo maior de integração e entrega.

---

## "Produção é igual ao desenvolvimento"

Não necessariamente.

Devemos buscar ambientes consistentes, mas produção possui requisitos próprios:

- segurança;
- escala;
- backups;
- observabilidade;
- disponibilidade.

---

## "Se tenho backup, estou protegido"

Não necessariamente.

Se nunca testamos o restore, não sabemos se o backup realmente pode ser utilizado.

---

## "Mais infraestrutura é sempre melhor"

Não.

Mais infraestrutura também significa:

```text
mais custo
+
mais complexidade
+
mais manutenção
```

---

# 33. Trade-offs

## Docker

### Vantagens

- ambiente reproduzível;
- isolamento;
- facilidade de distribuição.

### Desvantagens

- adiciona conceitos;
- debugging pode ficar mais complexo;
- exige conhecimento adicional.

---

## CI/CD

### Vantagens

- feedback rápido;
- menos erros manuais;
- processo reproduzível.

### Desvantagens

- configuração inicial;
- manutenção;
- custo de execução dependendo da plataforma.

---

## Escala horizontal

### Vantagens

- maior capacidade;
- redundância.

### Desvantagens

- maior complexidade;
- exige pensar em estado compartilhado;
- custos maiores.

---

# 34. Exercícios

## Exercício 1

Explique com suas palavras:

> Qual é a diferença entre CI e CD?

---

## Exercício 2

Desenhe o fluxo:

```text
git push
→
?
→
?
→
deploy
```

Inclua pelo menos três etapas intermediárias.

---

## Exercício 3

Qual a diferença entre:

```text
Docker image
```

e:

```text
Docker container
```

---

## Exercício 4

Por que migrations são melhores para alterações controladas do banco do que editar tabelas manualmente?

---

## Exercício 5

Imagine que a versão `v2` do BTM cause erro em produção.

Descreva um processo de rollback.

---

## Exercício 6

Você precisa escalar a API para três instâncias.

Quais problemas relacionados a estado você investigaria?

---

# 35. Perguntas de entrevista

### Junior

1. O que é DevOps?
2. O que é Docker?
3. O que é um container?
4. O que é uma imagem Docker?
5. O que é CI?
6. O que é CD?
7. O que é deploy?
8. O que é migration?
9. O que é health check?
10. O que é uma variável de ambiente?

### Pleno

1. Como você estruturaria uma pipeline CI/CD?
2. Qual a diferença entre Continuous Delivery e Continuous Deployment?
3. Como você faria rollback?
4. Qual a diferença entre container e VM?
5. O que é infraestrutura como código?
6. O que é observabilidade?
7. Qual a diferença entre logs, métricas e traces?
8. O que é reverse proxy?
9. Quando escalar verticalmente ou horizontalmente?
10. Quais problemas aparecem ao rodar múltiplas instâncias de uma API?
11. Como armazenar secrets em produção?
12. Como automatizar migrations?
13. Como garantir que um deploy não quebre a aplicação?
14. O que é blue-green deployment?
15. O que é canary deployment?
16. Como você desenharia o ambiente de produção do BTM?

---

# 36. Perguntas de aprofundamento

1. Como garantir zero-downtime deployment?
2. Como lidar com migrations incompatíveis entre versões?
3. Como fazer rollback de uma migration?
4. O que acontece quando uma aplicação possui estado em memória e passa a ter múltiplas instâncias?
5. Como funcionaria um load balancer?
6. Como o reverse proxy participa da arquitetura?
7. Como monitorar uma API em produção?
8. Como detectar aumento de latência?
9. Como projetar backups confiáveis?
10. Qual a diferença entre RPO e RTO?
11. Como reduzir o impacto de uma falha de banco?
12. Como implementar deploy gradual?
13. O que significa infraestrutura como código?
14. Como incorporar segurança ao pipeline?
15. Quando Kubernetes faria sentido e quando seria complexidade desnecessária?

---

# 37. Checklist

### Desenvolvimento

- [ ] Ambiente local reproduzível?
- [ ] Configuração separada do código?
- [ ] Banco inicializável?
- [ ] Migrations versionadas?

### CI

- [ ] Instalação automatizada?
- [ ] Lint?
- [ ] Typecheck?
- [ ] Testes?
- [ ] Build?

### CD

- [ ] Deploy reproduzível?
- [ ] Secrets protegidos?
- [ ] Migration controlada?
- [ ] Rollback definido?

### Operação

- [ ] Health check?
- [ ] Logs?
- [ ] Métricas?
- [ ] Alertas?
- [ ] Backup?
- [ ] Restore testado?

### Segurança

- [ ] HTTPS?
- [ ] Secrets fora do Git?
- [ ] Dependências verificadas?
- [ ] Containers/imagens avaliados?

---

# Conclusão

DevOps é o caminho entre:

```text
"eu escrevi código"
```

e:

```text
"existe um sistema funcionando de maneira confiável"
```

No Beach Tennis Manager, já temos vários blocos importantes:

```text
Git
 ↓
npm Workspaces
 ↓
Node + TypeScript
 ↓
React + Vite
 ↓
Docker Compose
 ↓
PostgreSQL
 ↓
Drizzle migrations
 ↓
Health check
 ↓
Testes
```

O próximo passo natural será transformar essas peças em um processo automatizado:

```text
Commit
 ↓
CI
 ↓
Qualidade
 ↓
Build
 ↓
Deploy
 ↓
Monitoramento
```

Esse é o ponto central do DevOps:

> **não basta conseguir executar o software; precisamos conseguir entregá-lo, operar, observar e recuperar o sistema de forma previsível.**
