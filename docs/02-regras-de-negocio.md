# Beach Tennis Manager — Regras de Negócio

## 1. Objetivo**

Este documento define as regras que determinam o comportamento do Beach Tennis Manager.

As regras aqui descritas representam decisões de negócio e deverão orientar:

\* o modelo de dados;

\* a implementação do backend;

\* a implementação do frontend;

\* os testes automatizados;

\* os relatórios;

\* as decisões futuras relacionadas ao sistema.

Quando uma regra de negócio for alterada, este documento deverá ser atualizado.

**---**

# 2. Professores e usuários**

**## RN-001 — Múltiplos professores**

O sistema deverá permitir que vários professores utilizem a mesma aplicação.

Cada professor deverá possuir seu próprio usuário de acesso.

**---**

**## RN-002 — Isolamento dos dados dos professores**

Um professor deverá visualizar e administrar somente os dados relacionados à sua própria operação.

Isso inclui, inicialmente:

\* suas turmas;

\* seus alunos relacionados;

\* suas matrículas;

\* suas aulas;

\* suas presenças;

\* seus pagamentos;

\* suas reposições;

\* seus relatórios.

O backend deverá garantir esse isolamento.

O frontend não será responsável por garantir a segurança sozinho.

**---**

**## RN-003 — Administrador**

Usuários com papel de administrador possuirão acesso global aos dados do sistema.

O administrador poderá consultar informações de diferentes professores e gerar relatórios consolidados.

**## RN-XXX — Configuração global de regras**

O sistema deverá possuir configurações globais para as regras operacionais que podem ser personalizadas.

As configurações globais funcionarão como valores padrão para os professores que não possuírem uma configuração específica.

**---**

**## RN-XXX — Configuração por professor**

Cada professor poderá possuir configurações próprias para determinadas regras operacionais.

Quando uma configuração específica do professor estiver definida, ela deverá ter prioridade sobre a configuração global correspondente.

**---**

**## RN-XXX — Fallback para configuração global**

Quando um professor não possuir uma configuração específica para determinada regra, o sistema deverá utilizar a configuração global correspondente.

Exemplo:

```text

Configuração global:

Máximo de reposições por ciclo = 1

Professor Claudio:

Máximo de reposições por ciclo = 2

Professor Carlos:

Máximo de reposições por ciclo = não configurado

```

**---**

# 3. Alunos**

**## RN-004 — Cadastro único do aluno**

Um aluno deverá possuir apenas um cadastro no sistema.

O cadastro será identificado internamente por um identificador único.

**---**

**## RN-005 — CPF único**

O CPF deverá ser único entre os alunos cadastrados.

O sistema não deverá permitir dois cadastros de alunos com o mesmo CPF.

**---**

**## RN-006 — Aluno relacionado a múltiplos professores**

Um mesmo aluno poderá realizar aulas com mais de um professor.

Isso não deverá gerar novos cadastros do aluno.

Exemplo:

```text

Aluno João

    │

    ├── Professor Claudio

    │

    └── Professor Carlos

```

Continua existindo apenas um cadastro de João.

**---**

# 4. Turmas**

**## RN-007 — Capacidade máxima**

Uma turma poderá possuir no máximo quatro alunos ativos simultaneamente.

**---**

**## RN-008 — Turma com vagas**

Uma turma poderá possuir menos de quatro alunos.

Exemplo:

```text

Capacidade: 4

Alunos ativos: 3

Vagas disponíveis: 1

```

**---**

**## RN-009 — Valor padrão da turma**

Cada turma deverá possuir um valor padrão para seu ciclo de quatro aulas.

Esse valor poderá variar conforme as características da turma.

Exemplo:

```text

Turma D → R$ 100

Turma C → R$ 120

Turma B → R$ 150

```

Os valores acima são apenas exemplos e não representam preços definidos para o sistema.

**---**

# 5. Matrículas**

**## RN-010 — Relação entre aluno e turma**

A matrícula representa a participação de um aluno em uma determinada turma.

Conceitualmente:

```text

Aluno

  │

  └── Matrícula

         │

         └── Turma

```

**---**

**## RN-011 — Múltiplas matrículas**

Um aluno poderá possuir mais de uma matrícula simultaneamente.

Exemplo:

```text

João

│

├── Matrícula → Terça-feira 19h

│

└── Matrícula → Quinta-feira 19h

```

**---**

**## RN-012 — Condição comercial individual**

Cada matrícula poderá possuir uma condição comercial própria.

O valor efetivamente cobrado de um aluno não precisa ser igual ao valor padrão da turma.

**---**

**## RN-013 — Valores diferentes para o mesmo aluno**

Um mesmo aluno poderá pagar valores diferentes em matrículas diferentes.

Exemplo:

```text

João

│

├── Terça-feira → R$ 100

│

└── Quinta-feira → R$ 50

```

**---**

**## RN-014 — Alteração de valor**

Uma alteração no valor de uma matrícula não deverá modificar o histórico de ciclos já registrados.

Exemplo:

```text

Ciclo antigo → R$ 50

Ciclo atual  → R$ 100

```

O ciclo antigo deverá continuar registrando R$ 50.

**---**

# 6. Ciclos de aulas

## RN-015 — Quantidade de aulas

Cada ciclo de cobrança corresponde a quatro aulas.

---

## RN-016 — Pagamento antecipado

O pagamento de um ciclo deverá ocorrer antecipadamente às aulas daquele ciclo.

O pagamento representa o direito às próximas quatro aulas.

---

## RN-017 — Ciclo independente do calendário

Um ciclo não será necessariamente equivalente a um mês do calendário.

Um ciclo poderá começar em um mês e terminar em outro.

### Exemplo

```text
Pagamento: 05/09

Aula 1 → 10/09
Aula 2 → 17/09
Aula 3 → 24/09
Aula 4 → 01/10
```

Todas as quatro aulas pertencem ao mesmo ciclo.

---

## RN-018 — Ciclos independentes por matrícula

Cada matrícula possuirá seus próprios ciclos.

O ciclo de uma matrícula não deverá depender do ciclo de outra matrícula do mesmo aluno.

### Exemplo

```text
João

Matrícula A
└── Ciclo: aulas de terça

Matrícula B
└── Ciclo: aulas de quinta
```

---

## RN-019 — Valor histórico do ciclo

O ciclo deverá armazenar o valor efetivamente cobrado naquele momento.

A alteração posterior do preço da matrícula não deverá alterar ciclos históricos.

---

## RN-XXX — Política aplicada ao ciclo

As regras operacionais aplicáveis a um ciclo deverão ser determinadas no início de sua execução.

As configurações utilizadas deverão permanecer associadas ao ciclo durante sua execução.

Alterações posteriores nas configurações globais ou nas configurações específicas do professor não deverão modificar retroativamente ciclos já iniciados.

---

## RN-XXX — Imutabilidade do ciclo encerrado

Um ciclo encerrado deverá ser tratado como um registro histórico.

Alterações posteriores em preços, configurações ou regras de negócio não deverão modificar automaticamente as informações ou regras aplicadas ao ciclo encerrado.

Eventuais correções manuais deverão possuir controle adequado e preservar a rastreabilidade da alteração.

---

## RN-XXX — Conclusão do ciclo

O ciclo será concluído quando o aluno tiver recebido as quatro aulas correspondentes ao ciclo, considerando reposições e extensões aplicáveis.

O ciclo poderá ultrapassar o período originalmente previsto quando houver feriados ou reposições válidas.

O limite máximo de reposições aplicável ao ciclo não encerrará o ciclo por si só. Após atingir esse limite, novas ausências que normalmente poderiam gerar reposição não deverão gerar novos créditos, e as respectivas aulas serão consideradas perdidas.

---

# 7. Turma e aula**

**## RN-020 — Turma representa recorrência**

A turma representa uma configuração recorrente de aulas.

Exemplo:

```text

Turma:

Terça-feira

19h

Nível D

Professor Claudio

Capacidade 4

```

**---**

**## RN-021 — Aula representa ocorrência**

Uma aula representa uma ocorrência concreta de uma turma em uma determinada data.

Exemplo:

```text

Turma:

Terça-feira 19h

Aula:

08/09/2026 às 19h

```

**---**

**## RN-022 — Histórico de aulas**

Cada ocorrência de aula deverá permanecer registrada para permitir histórico de:

\* aulas realizadas;

\* aulas canceladas;

\* presença;

\* ausência;

\* reposição;

\* demais situações definidas posteriormente.

**---**

# 8. Presença e ausência**

**## RN-023 — Registro individual de presença**

A presença deverá ser registrada individualmente para cada aluno relacionado à aula.

**---**

**## RN-024 — Ausência**

Uma ausência deverá ser registrada para o aluno quando ele não participar da aula.

A ausência poderá ou não gerar direito a reposição, conforme as regras específicas definidas para reposição.

**---**

# 9. Reposição

## RN-025 — Crédito de reposição

Uma ausência ou cancelamento que atenda aos critérios definidos pelo sistema poderá gerar um crédito de reposição.

O crédito deverá ser tratado separadamente do registro original da ausência ou do cancelamento.

O crédito de reposição deverá estar vinculado à matrícula que originou o direito.

---

## RN-026 — Crédito não representa aula extra obrigatória

A existência de um crédito de reposição não obrigará o professor a criar uma aula adicional exclusivamente para aquele aluno.

---

## RN-027 — Utilização em vaga disponível

Um crédito de reposição poderá ser utilizado em qualquer turma do mesmo professor da matrícula que originou o crédito, desde que exista vaga disponível.

Não será necessária compatibilidade de nível entre a turma original e a turma utilizada para reposição.

O crédito não poderá ser transferido para outra matrícula do mesmo aluno.

---

## RN-028 — Reposição por continuidade do ciclo

Caso não exista uma oportunidade de reposição antes da próxima aula originalmente prevista, poderá ocorrer a utilização da próxima aula como reposição.

Nesse cenário, o ciclo será estendido para que o aluno possa completar as quatro aulas às quais possui direito.

### Exemplo

```text
Aula 1 → presente
Aula 2 → presente
Aula 3 → ausência com direito a reposição
Aula 4 → utilizada como reposição da aula 3
```

A aula originalmente prevista como aula 4 deverá ser realizada posteriormente.

---

## RN-029 — Limite de reposições por ciclo

Cada professor poderá definir a quantidade máxima de reposições que um aluno poderá utilizar dentro de um mesmo ciclo.

Caso o professor não possua uma configuração específica, deverá ser utilizado o limite definido na configuração global.

O limite aplicável ao ciclo deverá ser determinado no início de sua execução.

Alterações posteriores nas configurações não deverão modificar retroativamente ciclos já iniciados.

Após atingir o limite máximo de reposições aplicável ao ciclo, novas ausências que normalmente poderiam gerar reposição não deverão gerar novos créditos. Nesses casos, a aula será considerada perdida.

### Exemplo

```text
Ciclo: 4 aulas
Limite: 2 reposições

Aula 1 → participou
Aula 2 → participou
Aula 3 → faltou → 1ª reposição
Aula 4 → faltou → 2ª reposição
Aula 5 → faltou → sem reposição
Aula 6 → faltou → sem reposição
```

O ciclo será encerrado quando não houver mais aulas ou reposições aplicáveis a serem realizadas para sua conclusão.

---

## RN-XXX — Prazo mínimo para comunicação de ausência

O prazo mínimo de antecedência para que o aluno comunique uma ausência e obtenha direito a reposição é uma configuração operacional.

Cada professor poderá possuir uma configuração específica para esse prazo, expressa em horas.

Caso o professor não possua uma configuração específica, deverá ser utilizado o prazo definido na configuração global do sistema.

O prazo aplicável deverá ser determinado no início de cada novo ciclo de cobrança.

Alterações posteriores na configuração global ou na configuração específica do professor não deverão modificar retroativamente o prazo aplicado a ciclos já iniciados.

O sistema deverá validar se a comunicação de uma ausência ocorreu dentro do prazo mínimo estabelecido para o ciclo em questão, determinando assim se a ausência gerará direito a reposição.

---

## RN-XXX — Falta em aula de reposição

A ausência do aluno em uma aula utilizada como reposição não deverá gerar automaticamente um novo crédito de reposição.

A ausência deverá ser tratada de acordo com as regras de ausência aplicáveis e com o limite de reposições ainda disponível no ciclo.

---

## RN-XXX — Validade do crédito

O crédito de reposição não possuirá prazo de validade independente.

O crédito permanecerá vinculado ao ciclo em que foi gerado e poderá ser utilizado enquanto o ciclo estiver aberto, respeitando as regras aplicáveis e o limite máximo de reposições do ciclo.

Quando o ciclo for encerrado, eventuais créditos não utilizados deixarão de estar disponíveis.

---

## RN-XXX — Situações que geram reposição

As seguintes situações deverão gerar direito a reposição, observadas as regras e limites aplicáveis ao ciclo:

* ausência comunicada pelo aluno com antecedência igual ou superior ao prazo mínimo definido na configuração aplicável ao ciclo (conforme RN-XXX — Prazo mínimo para comunicação de ausência);
* cancelamento da aula pelo professor;
* cancelamento da aula por chuva ou condições climáticas que impeçam sua realização;
* cancelamento da aula por indisponibilidade da quadra.

---

## RN-XXX — Situações que não geram reposição

As seguintes situações não deverão gerar direito a reposição:

* ausência comunicada pelo aluno com antecedência inferior ao prazo mínimo definido na configuração aplicável ao ciclo (conforme RN-XXX — Prazo mínimo para comunicação de ausência);
* ausência sem aviso prévio;
* novas ausências após o limite máximo de reposições do ciclo ter sido atingido.

---

## RN-XXX — Feriado

Aulas programadas em feriados não deverão gerar crédito de reposição individual.

O feriado não deverá ser contabilizado como uma das quatro aulas do ciclo.

O ciclo deverá ser prorrogado para permitir que o aluno complete as quatro aulas previstas.

---

## RN-XXX — Encerramento da matrícula

O encerramento da matrícula não deverá obrigar o aluno a abandonar um ciclo já iniciado e previamente pago.

O aluno poderá optar por concluir o ciclo, utilizando as aulas e reposições ainda disponíveis conforme as regras aplicáveis.

Caso o aluno opte por não concluir o ciclo, o ciclo poderá ser encerrado sem a utilização das aulas ou créditos restantes.

Após a conclusão ou encerramento do ciclo, a matrícula permanecerá encerrada e não deverá iniciar um novo ciclo.

---

# 10. Pagamentos**

**## RN-030 — Pagamento vinculado ao ciclo**

Cada pagamento deverá estar relacionado a um ciclo de cobrança.

**---**

**## RN-031 — Registro do pagamento**

O sistema deverá manter o histórico dos pagamentos realizados.

Inicialmente deverão ser considerados dados como:

\* valor;

\* data;

\* método de pagamento;

\* ciclo relacionado;

\* situação;

\* comprovante, quando aplicável.

**---**

**## RN-032 — PIX**

PIX será considerado um dos principais métodos de pagamento da operação.

A possibilidade de integração automática com serviços de PIX será avaliada futuramente.

**---**

# 11. Cancelamentos e situações especiais

## RN-XXX — Cancelamento pelo professor

Quando uma aula for cancelada pelo professor, o aluno deverá ter direito a reposição, respeitando o limite aplicável ao ciclo.

---

## RN-XXX — Cancelamento por chuva

Quando uma aula for cancelada por chuva ou por condições climáticas que impeçam sua realização, o aluno deverá ter direito a reposição, respeitando o limite aplicável ao ciclo.

---

## RN-XXX — Indisponibilidade da quadra

Quando uma aula for cancelada devido à indisponibilidade da quadra, o aluno deverá ter direito a reposição, respeitando o limite aplicável ao ciclo.

---

## RN-XXX — Feriados

Aulas programadas em feriados não deverão gerar crédito de reposição individual.

O feriado não deverá consumir uma das quatro aulas do ciclo, e o ciclo deverá ser prorrogado para permitir que o aluno complete as quatro aulas previstas.

---

# 12. Regras complementares de reposição

As regras específicas de concessão, utilização, limite, validade e encerramento de créditos de reposição estão definidas na seção 9.

A configuração máxima de reposições por ciclo poderá ser definida globalmente e sobrescrita por professor, conforme as regras da seção 2.

O prazo mínimo de antecedência para comunicação de ausência poderá ser definido globalmente e sobrescrito por professor, conforme a seção 2 e a RN-XXX (Prazo mínimo para comunicação de ausência).

Não permanecem, neste momento, pendências relacionadas a:

* ausência sem aviso;
* validade do crédito;
* professor responsável pela reposição;
* compatibilidade de turma;
* falta em aula de reposição;
* cancelamento pelo professor;
* chuva;
* indisponibilidade da quadra;
* feriados;
* encerramento da matrícula.

---
# 13. Relatórios**

**## RN-033 — Relatórios por professor**

Professores poderão consultar relatórios referentes à sua própria operação.

**---**

**## RN-034 — Relatórios administrativos**

Administradores poderão consultar informações consolidadas de todos os professores.

**---**

**## RN-035 — Isolamento dos relatórios**

Um professor não poderá utilizar relatórios para acessar indiretamente informações pertencentes a outro professor.

O controle de acesso deverá ser aplicado também às consultas e relatórios.

**---**

# 14. Princípios gerais**

**## RN-036 — Histórico**

Informações importantes, principalmente financeiras, deverão preservar seu histórico.

**---**

**## RN-037 — Fonte de verdade**

As regras de negócio documentadas deverão ser utilizadas como referência para a implementação.

**---**

**## RN-038 — Evolução das regras**

As regras de negócio poderão evoluir durante o projeto.

Uma nova regra deverá ser documentada antes ou junto da implementação da funcionalidade correspondente.

**---**

# 15. Status das regras**

As regras deste documento possuem dois estados:

\* **Definida** — regra já decidida para o projeto.

\* **Pendente** — regra que ainda precisa ser discutida e definida.

Nenhuma regra marcada como pendente deverá ser considerada definitivamente implementada sem uma decisão posterior.
