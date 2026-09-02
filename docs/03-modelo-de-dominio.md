# Beach Tennis Manager — Modelo de Domínio

## 1. Objetivo e escopo

Este documento descreve uma proposta conceitual do modelo de domínio do Beach Tennis Manager com base em:

- `docs/01-visao-e-requisitos.md`;
- `docs/02-regras-de-negocio.md`.

A proposta identifica entidades, responsabilidades, atributos principais, relacionamentos e regras que devem ser respeitadas. Ela não define tabelas, migrations, APIs ou outros detalhes de persistência.

As cardinalidades abaixo representam o que está definido na documentação. Quando a documentação não determina uma cardinalidade, isso é indicado como ponto em aberto.

## 2. Visão geral das relações

```text
Usuário 1 ─── 1 Professor

Aluno 1 ─── N Matrícula N ─── 1 Turma
                         │       │
                         │       └── 1 Professor
                         │
                         └── N Ciclo de cobrança
                                  │
                                  ├── N Registros de participação ─── 1 Aula
                                  ├── Pagamentos
                                  └── N Créditos de reposição

Turma 1 ─── N Aula

Configuração Global ── fallback ── Configuração por Professor
                                      │
                                      └── snapshot no Ciclo
```

Um aluno é cadastrado uma única vez. A relação do aluno com um professor e uma turma é representada pela matrícula. Os ciclos pertencem à matrícula, e os registros de participação conectam o ciclo, a aula e a matrícula do aluno.

## 3. Usuário

### Responsabilidade no domínio

Representar a identidade que acessa o sistema e seu papel de autorização.

### Principais atributos

- identificador do usuário;
- credenciais de autenticação;
- papel de acesso: `PROFESSOR` ou `ADMIN`;
- situação de acesso, quando aplicável.

### Relacionamentos e cardinalidades

- um usuário com papel `PROFESSOR` está associado a um professor;
- um usuário administrador possui acesso global e pode não estar associado a um professor;
- cada professor possui seu próprio usuário de acesso.

A cardinalidade exata entre usuário e professor, fora a exigência de usuário próprio para cada professor, não é detalhada na documentação.

### Responsabilidades e regras

- autenticar o acesso;
- participar do controle de acesso baseado em papéis;
- respeitar a autorização validada no backend;
- permitir que administradores tenham visão global;
- impedir que professores acessem dados operacionais de outros professores sem relação que permita esse acesso.

## 4. Professor

### Responsabilidade no domínio

Representar o profissional responsável por uma operação de aulas, seus alunos relacionados, turmas e regras específicas.

### Principais atributos

- identificador do professor;
- dados cadastrais do professor;
- situação do professor;
- configurações específicas de regras operacionais.

### Relacionamentos e cardinalidades

- um professor possui um usuário próprio;
- um professor possui zero ou muitas turmas;
- um professor possui zero ou muitas matrículas por meio das relações com alunos e turmas;
- um professor pode relacionar-se com muitos alunos por meio de matrículas;
- um professor pode possuir zero ou muitas configurações específicas.

### Responsabilidades e regras

- administrar suas turmas, matrículas, aulas, presenças, ausências, reposições e pagamentos;
- consultar informações financeiras da própria operação;
- definir configurações próprias quando permitido;
- utilizar a configuração global quando não houver configuração específica;
- respeitar o isolamento de dados aplicado pelo backend.

## 5. Aluno

### Responsabilidade no domínio

Representar a pessoa que participa das aulas e possui relações operacionais com professores e turmas.

### Principais atributos

- identificador interno único;
- nome;
- CPF;
- telefone;
- demais informações cadastrais;
- situação cadastral, incluindo a possibilidade de desativação.

### Relacionamentos e cardinalidades

- um aluno possui zero ou muitas matrículas;
- uma matrícula pertence a um aluno;
- um aluno pode possuir matrículas com vários professores;
- um aluno pode possuir mais de uma matrícula simultaneamente.

### Responsabilidades e regras

- possuir um único cadastro no sistema;
- possuir CPF único entre os alunos;
- não ser duplicado quando se relacionar com outro professor;
- participar das aulas por meio de suas matrículas.

## 6. Turma

### Responsabilidade no domínio

Representar uma configuração recorrente de aulas, como dia, horário e demais características da recorrência.

A turma não representa uma ocorrência individual. A ocorrência concreta é representada pela aula.

### Principais atributos

- identificador da turma;
- professor responsável;
- dia e horário recorrentes;
- nível ou outras características da turma;
- capacidade;
- preço padrão para o ciclo de quatro aulas;
- situação da turma, incluindo ativa ou desativada.

### Relacionamentos e cardinalidades

- cada turma pertence a um professor;
- uma turma possui zero ou muitas aulas;
- uma turma possui zero ou muitas matrículas;
- uma turma pode receber uma reposição originada por matrícula do mesmo professor, se houver vaga.

### Responsabilidades e regras

- representar a recorrência das aulas;
- permitir identificar vagas disponíveis;
- possuir capacidade máxima de quatro alunos ativos simultaneamente;
- permitir quantidade de alunos ativos inferior à capacidade;
- fornecer um preço padrão que não substitui a condição comercial individual da matrícula;
- não exigir compatibilidade de nível para uma reposição, pois o crédito pode ser utilizado em qualquer turma do mesmo professor, desde que exista vaga.

## 7. Matrícula

### Responsabilidade no domínio

Representar a relação operacional entre um aluno, um professor e uma turma, incluindo as condições comerciais específicas dessa relação.

### Principais atributos

- identificador da matrícula;
- aluno relacionado;
- professor relacionado;
- turma relacionada;
- condições comerciais individuais;
- valor vigente da matrícula;
- situação da matrícula;
- informações de início e encerramento, quando aplicáveis.

A documentação exige a possibilidade de gerenciar e encerrar matrículas, mas não define todos os atributos temporais da matrícula.

### Relacionamentos e cardinalidades

- cada matrícula pertence a um aluno;
- cada matrícula pertence a um professor;
- cada matrícula pertence a uma turma;
- uma matrícula possui zero ou muitos ciclos de cobrança;
- uma matrícula pode originar créditos de reposição;
- os registros de participação do aluno relacionam-se à matrícula.

### Responsabilidades e regras

- manter a participação do aluno naquela turma e operação do professor;
- permitir múltiplas matrículas para o mesmo aluno;
- manter condições comerciais diferentes para matrículas diferentes do mesmo aluno;
- permitir valor diferente do preço padrão da turma;
- não alterar ciclos históricos quando seu valor vigente for alterado;
- após encerrada, não iniciar novo ciclo;
- não obrigar o abandono de ciclo já iniciado e previamente pago;
- permitir que o aluno conclua o ciclo ou opte por encerrá-lo sem utilizar aulas ou créditos restantes.

## 8. Aula

### Responsabilidade no domínio

Representar uma ocorrência concreta de uma turma em uma determinada data e horário, mantendo seu histórico.

### Principais atributos

- identificador da aula;
- turma relacionada;
- data e horário da ocorrência;
- situação da aula;
- motivo de cancelamento, quando aplicável;
- indicação das informações necessárias para registrar realização, cancelamento ou uso em reposição.

Os valores exatos dos estados e motivos não são definidos como uma estrutura técnica pela documentação.

### Relacionamentos e cardinalidades

- cada aula pertence a uma turma;
- uma turma possui zero ou muitas aulas;
- uma aula possui zero ou muitos registros de participação;
- uma aula pode ser a aula originalmente prevista de um ciclo ou ser utilizada como reposição;
- uma aula cancelada pode gerar créditos para os alunos afetados, respeitando o limite do ciclo.

### Responsabilidades e regras

- registrar aulas realizadas e canceladas;
- preservar o histórico da ocorrência;
- permitir o registro individual da situação de cada aluno;
- tratar cancelamentos pelo professor, por chuva ou condições climáticas e por indisponibilidade da quadra como situações que geram direito a reposição, respeitando o limite aplicável ao ciclo;
- não consumir uma das quatro aulas do ciclo quando for uma aula programada em feriado;
- não iniciar um ciclo por ser um feriado.

## 9. Registro de Participação

### Responsabilidade no domínio

Representar o fato ocorrido com um aluno em uma aula específica, diferenciando presença e ausência. O direito à reposição é representado pelo Crédito de Reposição.

### Principais atributos

- identificador do registro;
- aula relacionada;
- matrícula relacionada;
- ciclo relacionado, quando a participação estiver vinculada a um ciclo;
- situação individual do fato ocorrido, como `PRESENTE` ou `AUSENTE`;
- comunicação da ausência, quando houver;
- indicação de uso da aula como reposição, quando aplicável;
- crédito de reposição originado ou utilizado, quando aplicável.

A documentação não define o formato técnico desses dados.

### Relacionamentos e cardinalidades

- cada registro pertence a uma aula;
- cada registro representa um aluno por meio de uma matrícula;
- uma aula possui registros individuais para os alunos relacionados;
- um ciclo relaciona-se aos registros que representam as aulas efetivamente recebidas pelo aluno;
- um registro de ausência pode originar zero ou um crédito de reposição, conforme as regras aplicáveis.

### Responsabilidades e regras

- registrar individualmente a presença ou ausência do aluno;
- determinar se uma ausência comunicada respeitou o prazo mínimo congelado no ciclo;
- avaliar se a ausência comunicada dentro do prazo aplicável gera um Crédito de Reposição;
- não conceder reposição quando a comunicação ocorrer abaixo do prazo, quando não houver aviso ou quando o limite do ciclo já tiver sido atingido;
- não gerar automaticamente novo crédito quando a ausência ocorrer em aula utilizada como reposição.

## 10. Ciclo de cobrança

### Responsabilidade no domínio

Representar o direito do aluno às próximas quatro aulas de uma matrícula e preservar o histórico financeiro e operacional desse período.

Cada matrícula possui seus próprios ciclos. Um ciclo não depende do ciclo de outra matrícula do mesmo aluno.

### Principais atributos

- identificador do ciclo;
- matrícula relacionada;
- valor efetivamente cobrado;
- quantidade de aulas do ciclo: quatro;
- situação do ciclo;
- momento de início;
- momento de conclusão ou encerramento;
- configurações operacionais aplicáveis congeladas no início do ciclo.

### Início, pagamento e duração

- o ciclo inicia quando ocorre a primeira aula efetivamente realizada ou utilizada como parte daquele ciclo;
- o pagamento pode ocorrer antes do início do ciclo e ocorre antecipadamente às aulas daquele ciclo;
- o pagamento representa o direito às próximas quatro aulas;
- feriados não iniciam um ciclo;
- feriados não consomem uma das quatro aulas;
- o ciclo pode atravessar meses do calendário;
- reposições e feriados podem fazer o ciclo ultrapassar o período originalmente previsto.

### Snapshot das configurações aplicáveis

No momento em que o ciclo inicia, as configurações operacionais aplicáveis devem ser determinadas e congeladas. O ciclo deve manter os valores efetivamente aplicados durante sua execução.

O snapshot conceitual inclui, no mínimo:

- limite máximo de reposições por ciclo;
- prazo mínimo de antecedência para comunicação de ausência, expresso em horas;
- demais configurações operacionais que venham a ser aplicáveis ao ciclo segundo as regras documentadas.

A resolução da configuração ocorre assim:

1. utilizar a configuração específica do professor quando ela estiver definida;
2. utilizar a configuração global correspondente quando não houver configuração específica;
3. associar ao ciclo o valor aplicável no momento de seu início;
4. utilizar o valor associado ao ciclo durante sua execução.

Alterações posteriores nas configurações globais ou específicas do professor não afetam ciclos já iniciados. O documento exige essa preservação histórica, mas não define uma entidade técnica separada para o snapshot.

### Relacionamentos e cardinalidades

- cada ciclo pertence a uma matrícula;
- uma matrícula possui zero ou muitos ciclos ao longo de sua vida;
- um ciclo relaciona-se aos registros de participação das aulas efetivamente recebidas;
- um ciclo pode possuir créditos de reposição gerados por ausências ou cancelamentos;
- um ciclo possui pagamentos relacionados, conforme os registros realizados.

A quantidade máxima de pagamentos relacionados a um ciclo não é definida na documentação.

### Aulas efetivamente recebidas

O ciclo é concluído quando o aluno recebe as quatro aulas correspondentes, considerando reposições e extensões aplicáveis. A contagem deve considerar os registros de participação que representem aulas efetivamente recebidas pelo aluno, e não simplesmente a quantidade de aulas previstas no calendário.

Quando uma aula originalmente prevista for utilizada como reposição, a aula originalmente prevista para aquele momento deverá ser realizada posteriormente, permitindo completar as quatro aulas do ciclo.

Após o limite máximo de reposições ser atingido, novas ausências que normalmente poderiam gerar reposição não geram novos créditos e as aulas correspondentes são consideradas perdidas. O limite, por si só, não encerra o ciclo.

### Conclusão e histórico

- o ciclo pode ser concluído após quatro aulas recebidas;
- pode ser encerrado por opção do aluno após o encerramento da matrícula;
- um ciclo encerrado é registro histórico;
- alterações posteriores de preços, configurações ou regras não modificam automaticamente as informações ou regras aplicadas ao ciclo;
- correções manuais devem preservar controle e rastreabilidade.

## 11. Pagamento

### Responsabilidade no domínio

Representar o registro de um pagamento realizado e sua relação com um ciclo de cobrança.

### Principais atributos

- identificador do pagamento;
- valor;
- data;
- método de pagamento;
- situação do pagamento;
- comprovante, quando aplicável;
- ciclo relacionado.

PIX é um dos principais métodos considerados. A integração automática com serviços de PIX está fora do escopo inicial.

### Relacionamentos e cardinalidades

- cada pagamento está relacionado a um ciclo de cobrança;
- um ciclo pode possuir pagamentos registrados;
- a quantidade máxima de pagamentos por ciclo não está definida na documentação.

### Responsabilidades e regras

- manter o histórico dos pagamentos realizados;
- registrar pagamento antecipado relacionado ao direito às próximas quatro aulas;
- preservar o valor efetivamente cobrado também no ciclo;
- permitir consultas financeiras conforme o nível de acesso;
- não pressupor regras de conciliação, estorno, parcelamento ou inadimplência que ainda não foram definidas.

## 12. Crédito de Reposição

### Responsabilidade no domínio

Representar, separadamente do registro de ausência ou cancelamento, o direito de utilizar uma reposição.

### Principais atributos

- identificador do crédito;
- matrícula que originou o direito;
- ciclo em que foi gerado;
- origem do crédito;
- situação de disponibilidade, utilização ou encerramento;
- aula em que foi utilizado, quando aplicável;
- informações de geração e utilização.

A documentação define o conceito e o vínculo do crédito, mas não define nomes ou estados técnicos.

### Relacionamentos e cardinalidades

- cada crédito pertence à matrícula que originou o direito;
- cada crédito permanece vinculado ao ciclo em que foi gerado;
- um crédito pode ser utilizado em uma aula de reposição;
- o crédito não pode ser transferido para outra matrícula do mesmo aluno;
- créditos não utilizados deixam de estar disponíveis quando o ciclo é encerrado.

### Responsabilidades e regras

Um crédito pode ser gerado por:

- ausência comunicada com antecedência igual ou superior ao prazo mínimo congelado no ciclo;
- cancelamento pelo professor;
- cancelamento por chuva ou condições climáticas;
- cancelamento por indisponibilidade da quadra.

A utilização deve respeitar:

- o limite máximo de reposições congelado no ciclo;
- a existência de vaga;
- o professor da matrícula que originou o crédito;
- a possibilidade de utilização em qualquer turma desse mesmo professor, sem exigência de compatibilidade de nível;
- a impossibilidade de transferência para outra matrícula do aluno.

O crédito não possui prazo de validade independente. Ele pode ser utilizado enquanto o ciclo estiver aberto e deixa de estar disponível quando o ciclo for encerrado.

O professor não é obrigado a criar uma aula adicional exclusivamente para atender o crédito. Se não houver oportunidade antes da próxima aula originalmente prevista, a próxima aula poderá ser utilizada como reposição e o ciclo será estendido.

## 13. Configuração Global

### Responsabilidade no domínio

Representar os valores padrão das regras operacionais do sistema.

### Principais atributos

- regra operacional configurada;
- valor da configuração;
- situação ou vigência, quando aplicável.

A documentação não define o conjunto fechado de configurações nem um formato técnico para seus valores. Entre os exemplos documentados estão o limite máximo de reposições por ciclo e o prazo mínimo de antecedência para comunicação de ausência.

### Relacionamentos e cardinalidades

- uma configuração global pode servir de padrão para vários professores;
- uma configuração global corresponde ao fallback de uma regra operacional quando o professor não possui configuração específica;
- seu valor pode ser utilizado para criar o snapshot de novos ciclos.

### Responsabilidades e regras

- fornecer valores padrão;
- ser administrada por usuários com papel de administrador;
- não alterar ciclos já iniciados depois que seu valor for modificado;
- participar da resolução da configuração efetiva antes do congelamento no ciclo.

## 14. Configuração por Professor

### Responsabilidade no domínio

Representar a personalização, por professor, de uma regra operacional.

### Principais atributos

- professor relacionado;
- regra operacional configurada;
- valor específico;
- situação ou vigência, quando aplicável.

### Relacionamentos e cardinalidades

- um professor pode possuir zero ou muitas configurações específicas;
- cada configuração específica pertence a um professor;
- uma configuração específica corresponde a uma regra operacional;
- seu valor tem prioridade sobre a configuração global correspondente quando estiver definido.

### Responsabilidades e regras

- permitir que o professor personalize regras operacionais;
- fornecer o valor específico para novos ciclos;
- ceder lugar à configuração global quando não estiver definida;
- não alterar ciclos já iniciados depois que seu valor for modificado.

## 15. Fluxos principais do domínio

### 15.1 Aluno → Matrícula → Professor/Turma

1. O aluno possui um cadastro único, identificado também pelo CPF único.
2. A matrícula relaciona o aluno a um professor e a uma turma.
3. O mesmo aluno pode ter várias matrículas simultâneas, inclusive com professores diferentes.
4. As condições comerciais ficam na matrícula e podem ser diferentes entre matrículas do mesmo aluno.
5. O acesso do professor aos dados deve respeitar sua própria operação.

### 15.2 Matrícula → Ciclo

1. Uma matrícula pode possuir ciclos próprios de cobrança.
2. Cada ciclo corresponde a quatro aulas e é pago antecipadamente.
3. O valor efetivamente cobrado é registrado no ciclo.
4. Alterações posteriores no valor da matrícula não alteram ciclos históricos.
5. O encerramento da matrícula não força o abandono de um ciclo já iniciado e previamente pago.

### 15.3 Ciclo → aulas efetivamente recebidas

1. O pagamento pode existir antes do início do ciclo.
2. O ciclo inicia na primeira aula efetivamente realizada ou utilizada como parte daquele ciclo.
3. Um feriado não inicia o ciclo e não consome uma das quatro aulas.
4. O ciclo contabiliza as quatro aulas efetivamente recebidas, considerando reposições e extensões.
5. O ciclo pode ultrapassar meses e o período originalmente previsto.
6. O ciclo termina quando o aluno recebe as quatro aulas.

### 15.4 Aula → Registro de Participação

1. A aula representa uma ocorrência concreta da turma.
2. Para cada aluno relacionado à aula, registra-se individualmente sua situação.
3. O registro pode indicar presença ou ausência.
4. O registro também permite relacionar a participação ao ciclo e indicar o uso da aula como reposição.
5. Cancelamentos permanecem no histórico da aula e podem gerar créditos conforme as regras aplicáveis.

### 15.5 Falta → Crédito de Reposição

1. A ausência é registrada no registro individual de participação.
2. A elegibilidade para reposição considera o prazo mínimo de comunicação armazenado no ciclo.
3. Ausência comunicada no prazo pode gerar crédito; ausência fora do prazo ou sem aviso não gera.
4. O crédito é separado da ausência original, vinculado à matrícula e ao ciclo de origem.
5. O limite de reposições do ciclo é aplicado e permanece congelado.

### 15.6 Crédito de Reposição → utilização em outra Aula

1. O crédito pode ser utilizado em vaga disponível.
2. A aula utilizada pode pertencer a qualquer turma do mesmo professor da matrícula de origem.
3. Não há exigência de compatibilidade de nível.
4. O crédito não pode ser transferido para outra matrícula do aluno.
5. Se a próxima aula originalmente prevista for usada como reposição, o ciclo é estendido e essa aula originalmente prevista deverá ocorrer depois.
6. A ausência em aula utilizada como reposição não gera automaticamente um novo crédito.
7. O crédito deixa de estar disponível quando o ciclo é encerrado.

### 15.7 Configuração → definição e congelamento no início do ciclo

1. Para cada regra operacional aplicável, verifica-se primeiro a configuração específica do professor.
2. Se ela não existir, utiliza-se a configuração global correspondente.
3. Quando ocorre a primeira aula efetivamente realizada ou utilizada como parte do ciclo, os valores aplicáveis são determinados.
4. Esses valores são congelados e permanecem associados ao ciclo.
5. Mudanças posteriores nas configurações não afetam ciclos já iniciados.
6. O prazo mínimo de comunicação de ausência e o limite máximo de reposições devem ser avaliados com os valores congelados no ciclo.

## 16. Regras já definidas que o modelo deve representar

Embora `docs/01-visao-e-requisitos.md` contenha uma lista inicial de questões em aberto, `docs/02-regras-de-negocio.md` informa que não permanecem pendências sobre:

- ausência sem aviso;
- validade do crédito;
- professor responsável pela reposição;
- compatibilidade de turma;
- falta em aula de reposição;
- cancelamento pelo professor;
- chuva;
- indisponibilidade da quadra;
- feriados;
- encerramento da matrícula.

Assim, o modelo deve representar essas regras como definidas, especialmente:

- crédito sem prazo de validade independente;
- reposição em qualquer turma do mesmo professor, com vaga e sem exigência de compatibilidade de nível;
- cancelamentos especificados gerando direito a reposição, respeitado o limite do ciclo;
- feriados sem crédito individual, sem consumo de aula e sem início de ciclo;
- possibilidade de concluir ou encerrar um ciclo após o encerramento da matrícula.

## 17. Pontos em aberto

Os seguintes pontos continuam sem definição completa na documentação e não são decididos por este modelo:

- cálculo exato do faturamento e dos demais indicadores financeiros;
- relatórios obrigatórios da primeira versão;
- possibilidade de o administrador editar dados financeiros de qualquer professor ou apenas consultá-los;
- existência futura de diferentes níveis de administrador;
- regras detalhadas de cobrança e pagamento além do registro básico, incluindo situações financeiras não especificadas;
- cardinalidade máxima de pagamentos por ciclo;
- conjunto completo de configurações operacionais além das regras explicitamente documentadas;
- momento administrativo exato de criação ou registro de um ciclo antes de sua primeira aula, desde que o início do ciclo continue sendo a primeira aula efetivamente realizada ou utilizada como parte dele.

Esses pontos não impedem a representação das regras já definidas, mas devem ser decididos antes das funcionalidades que dependam deles.
