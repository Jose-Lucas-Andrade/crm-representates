# Atualizacao Prioritaria
## Importacao de Clientes

## Objetivo

Implementar a funcionalidade de importacao de clientes por arquivo CSV para reduzir o atrito de entrada no CRM e acelerar a ativacao de usuarios com carteira robusta.

Essa atualizacao foi priorizada porque o sistema ja entrega valor depois que a carteira esta cadastrada, mas ainda enfrenta uma barreira importante na implantacao:

- cadastro manual demorado
- dificuldade para comecar com muitos clientes
- risco de desistir antes de perceber o valor do produto
- resistencia maior em representantes autonomos e pequenas operacoes com base existente

## Decisao oficial

A proxima atualizacao do CRM sera a **Importacao de Clientes**.

Essa atualizacao deve ser tratada como prioridade oficial antes da proxima camada de aprofundamento comercial, incluindo o modulo de pos-venda e recompra.

## Resultado esperado

Ao final dessa atualizacao, o usuario deve conseguir:

- baixar um modelo padrao de importacao
- enviar um arquivo CSV com a carteira inicial
- validar os dados antes de gravar
- importar apenas as linhas validas
- receber um resumo final do resultado

## Escopo da V1

### Nome da funcionalidade

`Importar clientes`

### Local da funcionalidade

Tela [Clientes.jsx](C:/Users/rapha/crm-saas/src/pages/Clientes.jsx), ao lado do botao `Novo cliente`.

### Formato aceito

- CSV

### Campos aceitos

- `nome`
- `empresa`
- `telefone`
- `email`
- `cidade`
- `status`
- `classificacao`
- `proxima_acao`
- `proxima_visita`

### Campo obrigatorio

- `nome`

### Regras default

- `status` vazio vira `PROSPECT`
- `classificacao` vazia vira `MORNO`
- `proxima_acao` vazia vira `null`
- `proxima_visita` vazia vira `null`

## Experiencia planejada

### 1. Entrada na tela

Na tela de clientes, o usuario tera:

- `Novo cliente`
- `Importar clientes`

### 2. Modal de importacao

Ao clicar em `Importar clientes`, sera aberto um modal grande com:

- titulo
- explicacao curta
- botao `Baixar modelo`
- regras rapidas
- area de upload
- botao `Validar arquivo`

### 3. Validacao previa

Antes de importar, o sistema deve mostrar:

- total de linhas
- linhas validas
- linhas invalidas
- possiveis duplicados

### 4. Confirmacao

Se existirem linhas validas, o usuario podera clicar em:

- `Importar clientes validos`

### 5. Resultado final

Ao concluir, o sistema deve mostrar:

- quantos clientes foram importados
- quantas linhas falharam
- quantos possiveis duplicados foram encontrados

## Regras de validacao

### Linha invalida quando

- `nome` estiver vazio
- `status` estiver fora do padrao aceito
- `classificacao` estiver fora do padrao aceito
- `email` estiver preenchido com formato invalido
- `proxima_visita` estiver preenchida com data invalida

### Comportamento da V1

- importar apenas linhas validas
- nao bloquear tudo por causa de poucas falhas
- listar erros de forma clara para o usuario

## Duplicidade

### Regra da V1

Duplicidade sera tratada como **alerta**, nao como bloqueio.

### Critero sugerido

Considerar como possivel duplicado quando existir:

- mesmo `nome`
- e mesmo `telefone`

### Comportamento

- avisar o usuario
- permitir continuar
- nao impedir a importacao das linhas validas

## Fora do escopo da V1

Nao fazem parte desta primeira entrega:

- importacao de `.xlsx`
- mapeamento customizado de colunas
- atualizacao em lote de clientes existentes
- importacao de contatos
- importacao de tarefas
- desfazer importacao
- integracao com ERP
- fila assicrona complexa

## Fluxo tecnico

### Etapa 1. Selecionar arquivo

- validar extensao `.csv`
- guardar arquivo em memoria

### Etapa 2. Ler o arquivo

- interpretar cabecalho
- ler linhas
- montar objetos temporarios

### Etapa 3. Normalizar dados

- remover espacos extras
- padronizar `status`
- padronizar `classificacao`
- tratar campos vazios

### Etapa 4. Validar

- separar em `validas`
- separar em `invalidas`
- separar em `possiveis duplicadas`

### Etapa 5. Exibir previa

- total
- validas
- invalidas
- duplicadas

### Etapa 6. Confirmar importacao

- enviar apenas linhas validas

### Etapa 7. Mostrar resultado final

- importados com sucesso
- erros encontrados
- duplicados alertados

## Arquivos mais provaveis da implementacao

### Interface

- [Clientes.jsx](C:/Users/rapha/crm-saas/src/pages/Clientes.jsx)
- novo componente sugerido: `src/components/clientes/ImportarClientesModal.jsx`

### Servicos

- [clientes.js](C:/Users/rapha/crm-saas/src/services/clientes.js)
- novo utilitario sugerido: `src/utils/importacaoClientes.js`

### Apoio visual e UX

- estado de loading no modal
- mensagens de erro por linha
- feedback final claro

## Ordem recomendada de implementacao

1. criar o modal de importacao na tela de clientes
2. disponibilizar o modelo CSV para download
3. implementar leitura do arquivo
4. implementar normalizacao dos dados
5. implementar validacao por linha
6. montar tela de previa
7. gravar apenas clientes validos
8. mostrar relatorio final
9. validar manualmente antes de publicar

## Critero de pronto

Esta atualizacao sera considerada pronta quando:

- o usuario conseguir baixar o modelo
- o usuario conseguir validar um CSV real
- linhas invalidas nao quebrarem a importacao
- linhas validas forem gravadas corretamente
- o fluxo completo funcionar dentro da tela de clientes
- a experiencia estiver clara para usuario nao tecnico

## Criterios minimos de qualidade da V1

Antes de publicar a primeira versao da importacao, estes pontos precisam estar protegidos:

- CSV invalido nao pode quebrar a tela nem o fluxo de importacao
- telefone deve ser normalizado antes da checagem de duplicidade
- a importacao nao pode gerar duplicacao absurda sem ao menos alertar o usuario
- o insert em lote deve gravar apenas linhas validas com `user_id` correto
- o usuario deve receber feedback claro sobre o que entrou, o que falhou e o que precisa revisar

## Justificativa estrategica

A importacao de clientes nao e apenas uma melhoria tecnica. Ela aprofunda o valor comercial do produto no momento da entrada.

Ela aumenta:

- adotacao
- ativacao
- velocidade de implantacao
- chance de conversao
- percepcao de utilidade imediata

Em resumo:

**antes de sofisticar mais o CRM, precisamos tornar a entrada da carteira simples e viavel.**
