# CRM para Representantes

CRM web para representantes comerciais com autenticacao via Supabase, gestao de clientes, contatos, tarefas, pipeline de oportunidades e alertas de follow-up.

## Stack

- React 19
- Vite
- React Router
- Supabase
- Vercel

## Funcionalidades

- Cadastro e login com email
- Controle de acesso por plano
- Cadastro e edicao de clientes
- Registro de contatos e historico por cliente
- Tarefas do dia e tarefas pendentes
- Pipeline de oportunidades
- Alertas de follow-up com regra de 15 dias sem contato

## Requisitos

- Node.js 20 ou superior
- Projeto Supabase configurado

## Variaveis de ambiente

Crie um arquivo `.env` na raiz com base no `.env.example`.

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Como rodar localmente

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: ambiente local
- `npm run lint`: validacao do codigo
- `npm run build`: build de producao
- `npm run preview`: preview local da build

## Banco de dados

O projeto depende de:

- tabelas `profiles`, `clientes`, `tarefas`, `contatos`
- RLS habilitado
- funcoes RPC para dashboard e follow-up
- policies que exigem usuario ativo

Antes de publicar, rode no Supabase:

1. o schema principal do projeto
2. o patch de seguranca das policies
3. o ajuste de follow-up para 15 dias

## Checklist de producao

- Confirmar que o `.env` nao esta mais versionado
- Validar login, logout e cadastro
- Validar criacao de cliente, contato e tarefa
- Validar acesso a dashboard, alertas e oportunidades
- Confirmar que usuarios bloqueados nao conseguem acessar dados via API
- Confirmar deploy com rewrite para SPA

## Deploy

O projeto contem `vercel.json` com rewrite para `index.html`, entao pode ser publicado na Vercel como SPA.

## Status do repositorio

Se o `.env` ja esteve no Git em algum momento, ele foi removido do versionamento nas alteracoes recentes. O arquivo local continua funcionando normalmente.
