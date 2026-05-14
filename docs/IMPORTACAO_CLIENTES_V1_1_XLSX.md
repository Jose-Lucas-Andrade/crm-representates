# Atualizacao Complementar
## Importacao de Clientes V1.1
## CSV + Excel (.xlsx)

## Objetivo

Evoluir a importacao atual de clientes para aceitar, alem de `CSV`, arquivos
`Excel (.xlsx)`, reduzindo ainda mais o atrito de entrada para leads e clientes
que hoje usam planilhas como base principal de controle.

Essa atualizacao nasce de uma observacao real de mercado:

- os leads consultados usam Excel como ferramenta principal
- a conversao para CSV gera friccao desnecessaria
- a importacao atual funciona bem, mas ainda exige um passo extra

Em resumo:

**o objetivo nao e criar uma nova importacao, e sim ampliar a importacao atual
para o formato que o mercado ja usa no dia a dia.**

## Decisao oficial

A importacao por Excel sera tratada como a evolucao natural da importacao atual.

O caminho escolhido e:

- manter suporte a `CSV`
- adicionar suporte a `Excel (.xlsx)`
- reaproveitar a mesma validacao
- reaproveitar a mesma regra de duplicidade
- reaproveitar a mesma importacao em lote

## Resultado esperado

Ao final dessa evolucao, o usuario deve conseguir:

- importar clientes por `CSV`
- importar clientes por `Excel (.xlsx)`
- usar o mesmo modelo de colunas
- receber a mesma previa de validacao
- importar apenas linhas validas

## Escopo da V1.1

### Formatos aceitos

- `.csv`
- `.xlsx`

### Formato nao incluido nesta etapa

- `.xls`

### Aba da planilha

Na V1.1, o sistema deve ler apenas:

- a **primeira aba** do arquivo Excel

### Colunas aceitas

As colunas continuam iguais a V1:

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

## Regra principal da evolucao

O formato muda.
A logica nao.

Ou seja:

- Excel e apenas mais uma entrada
- depois da leitura do arquivo, tudo deve seguir para o mesmo fluxo de:
  - normalizacao
  - validacao
  - duplicidade
  - importacao

## Experiencia planejada

### Modal de importacao

O modal atual deve passar a comunicar:

- `CSV ou Excel (.xlsx)`

### Modelo para download

O sistema deve oferecer:

- `Baixar modelo Excel`
- `Baixar modelo CSV`

### Recomendacao de UX

Dar destaque principal para:

- `modelo Excel`

e manter o CSV como alternativa.

### Upload

O campo de upload deve aceitar:

- `.csv`
- `.xlsx`

### Mensagem de apoio

Exemplo de copy:

`Envie um arquivo CSV ou Excel (.xlsx) no modelo padrao para adicionar varios clientes de uma vez.`

## Regras tecnicas

### CSV

Continua funcionando com o fluxo ja existente.

### Excel

Ao receber `.xlsx`, o sistema deve:

1. ler a primeira aba
2. transformar a planilha em linhas
3. converter essas linhas para a mesma estrutura usada pelo CSV
4. enviar o resultado para a validacao atual

## O que nao deve mudar

Estas partes devem continuar iguais:

- colunas aceitas
- campo obrigatorio `nome`
- `status` vazio vira `PROSPECT`
- `classificacao` vazia vira `MORNO`
- alerta de duplicidade
- importacao parcial
- feedback final ao usuario

## Fora do escopo da V1.1

Nao entram nessa etapa:

- suporte a `.xls`
- multiplas abas
- escolha manual de aba
- mapeamento customizado de colunas
- leitura inteligente de cabecalho fora do modelo
- atualizacao em lote de clientes existentes

## Arquivos mais provaveis da implementacao

### Interface

- [Clientes.jsx](C:/Users/rapha/crm-saas/src/pages/Clientes.jsx)
- [ImportarClientesModal.jsx](C:/Users/rapha/crm-saas/src/components/clientes/ImportarClientesModal.jsx)

### Utilitarios

- [importacaoClientes.js](C:/Users/rapha/crm-saas/src/utils/importacaoClientes.js)
- novo utilitario sugerido:
  [importacaoClientesExcel.js](C:/Users/rapha/crm-saas/src/utils/importacaoClientesExcel.js)

### Dependencia nova esperada

Biblioteca para leitura de `.xlsx`, por exemplo:

- `xlsx`

## Ordem recomendada de implementacao

1. aceitar `.xlsx` no upload
2. adicionar opcao de modelo Excel
3. ler a primeira aba da planilha
4. converter linhas do Excel para o mesmo formato interno do CSV
5. reaproveitar validacao atual
6. testar com planilhas reais de leads
7. manter feedback final igual ao da V1

## Criterios minimos de qualidade da V1.1

- planilha Excel invalida nao pode quebrar a tela
- a leitura deve considerar apenas a primeira aba
- o cabecalho precisa seguir o mesmo modelo da V1
- a validacao de Excel deve produzir a mesma experiencia do CSV
- o usuario precisa entender claramente que pode subir Excel sem converter

## Justificativa estrategica

Essa evolucao aumenta o valor da importacao por 3 motivos:

- aproxima o produto do comportamento real do mercado
- reduz friccao de implantacao
- fortalece o argumento comercial de entrada

Em resumo:

**CSV resolveu a dor tecnica. Excel ajuda a resolver a dor comercial.**
