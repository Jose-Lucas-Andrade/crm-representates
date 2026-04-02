# Operacao do Sistema

## Objetivo

Este documento concentra os procedimentos operacionais do CRM para facilitar manutencao, suporte e continuidade do projeto.

## Stack operacional

- Frontend: React + Vite
- Banco e autenticacao: Supabase
- Deploy: Vercel

## Fluxos principais

### Cadastro de usuario

1. O usuario cria a conta na tela de registro.
2. O Supabase envia email de confirmacao.
3. O usuario confirma o email.
4. No primeiro login, o sistema valida a conta e o acesso.
5. A trigger do banco cria o `profile` do usuario.

### Login

1. O usuario informa email e senha.
2. O Supabase autentica.
3. O app valida o `profile`.
4. Se o plano estiver vencido, o usuario vai para a tela de bloqueio.
5. Se estiver ativo, o acesso segue normalmente.

### Cadastro de cliente

1. O usuario cria o cliente.
2. O sistema salva:
   - nome
   - empresa
   - telefone
   - email
   - cidade
   - status
   - classificacao
3. O banco aplica RLS e valida `status` e `classificacao`.

### Registro de contato

1. O usuario acessa um cliente.
2. Registra um novo contato.
3. O banco atualiza `ultimo_contato` via trigger.
4. O cliente sai da fila de follow-up conforme a regra de dias.

### Tarefas

1. O usuario cria tarefa vinculada ao cliente.
2. A tarefa aparece nas listas e dashboard.
3. Ao concluir, o status vai para `concluida = true`.

## Acesso e bloqueio

O sistema usa:

- `profiles`
- `usuario_ativo()`
- RLS nas tabelas principais
- RPCs protegidas

Um usuario bloqueado nao deve conseguir:

- acessar o sistema normalmente
- consultar clientes, tarefas ou contatos pela API
- usar RPCs de dashboard e follow-up

## Procedimentos operacionais

### Liberar usuario manualmente

Atualize o `profile` no Supabase:

```sql
update public.profiles
set
  plano = 'pro',
  proxima_cobranca = now() + interval '30 days'
where id = 'USER_ID_AQUI';
```

### Reativar trial manualmente

```sql
update public.profiles
set
  plano = 'trial',
  trial_inicio = now(),
  trial_fim = now() + interval '7 days',
  proxima_cobranca = null
where id = 'USER_ID_AQUI';
```

### Consultar profile de um usuario

```sql
select *
from public.profiles
where id = 'USER_ID_AQUI';
```

### Consultar usuario por email

```sql
select id, email
from auth.users
where email = 'email@exemplo.com';
```

## Validacoes depois de atualizacoes

Sempre testar:

1. cadastro com confirmacao de email
2. login e logout
3. criacao de cliente
4. registro de contato
5. criacao e conclusao de tarefa
6. dashboard
7. alertas de follow-up
8. tela de bloqueio

## Variaveis de ambiente

Usar apenas:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Nunca versionar:

- `.env`
- chaves privadas
- `service_role`

## Arquivos importantes do projeto

- `src/routes/PrivateRoute.jsx`
- `src/services/clientes.js`
- `src/services/contatos.js`
- `src/services/tarefas.js`
- `src/services/dashboard.js`
- `src/services/followup.js`
- `src/pages/Login.jsx`
- `src/pages/Register.jsx`

## Riscos conhecidos

- Billing ainda depende de ajuste manual ou fluxo externo
- Ainda nao existe painel administrativo dedicado
- Nao ha monitoramento automatizado de erros em producao

## Recomendacoes futuras

- criar painel admin para gestao de planos
- integrar billing real
- adicionar logs e observabilidade
- versionar migrations do Supabase de forma mais formal
