-- ====================================
-- CRM + SaaS - Schema Final Consolidado
-- ====================================
--
-- Este arquivo consolida a estrutura principal e os patches
-- aplicados para seguranca, controle de acesso e follow-up.
-- Nao contem segredos e pode ser versionado.

create extension if not exists pgcrypto;
create extension if not exists unaccent;

-- ====================================
-- PROFILES
-- ====================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  plano text not null default 'trial',
  trial_inicio timestamptz not null default now(),
  trial_fim timestamptz not null default (now() + interval '7 days'),
  stripe_customer_id text,
  stripe_subscription_id text,
  proxima_cobranca timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles
  drop constraint if exists profiles_plano_check;

alter table public.profiles
  add constraint profiles_plano_check
  check (plano in ('trial', 'pro', 'basic'));

alter table public.profiles enable row level security;

drop policy if exists "Profiles select" on public.profiles;
create policy "Profiles select"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Profiles insert" on public.profiles;
drop policy if exists "Profiles update" on public.profiles;
drop policy if exists "Profiles delete" on public.profiles;

-- ====================================
-- CLIENTES
-- ====================================

create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  empresa text,
  email text,
  telefone text,
  cidade text,
  status text not null default 'PROSPECT',
  classificacao text not null default 'MORNO',
  proxima_acao text,
  proxima_visita date,
  ultimo_contato date,
  created_at timestamptz not null default now()
);

alter table public.clientes
  drop constraint if exists clientes_status_check;

alter table public.clientes
  add constraint clientes_status_check
  check (status in ('PROSPECT', 'NEGOCIACAO', 'CLIENTE', 'INATIVO'));

alter table public.clientes
  drop constraint if exists clientes_classificacao_check;

alter table public.clientes
  add constraint clientes_classificacao_check
  check (classificacao in ('QUENTE', 'MORNO', 'FRIO'));

alter table public.clientes enable row level security;

drop policy if exists "Clientes select" on public.clientes;
create policy "Clientes select"
on public.clientes
for select
using (
  auth.uid() = user_id
  and public.usuario_ativo() = true
);

drop policy if exists "Clientes insert" on public.clientes;
create policy "Clientes insert"
on public.clientes
for insert
with check (
  auth.uid() = user_id
  and public.usuario_ativo() = true
);

drop policy if exists "Clientes update" on public.clientes;
create policy "Clientes update"
on public.clientes
for update
using (
  auth.uid() = user_id
  and public.usuario_ativo() = true
)
with check (
  auth.uid() = user_id
  and public.usuario_ativo() = true
);

drop policy if exists "Clientes delete" on public.clientes;
create policy "Clientes delete"
on public.clientes
for delete
using (
  auth.uid() = user_id
  and public.usuario_ativo() = true
);

create index if not exists idx_clientes_user_id on public.clientes(user_id);
create index if not exists idx_clientes_status on public.clientes(status);

-- ====================================
-- TAREFAS
-- ====================================

create table if not exists public.tarefas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  titulo text not null,
  tipo text not null,
  data date not null,
  prioridade text not null default 'MEDIA',
  concluida boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tarefas
  drop constraint if exists tarefas_prioridade_check;

alter table public.tarefas
  add constraint tarefas_prioridade_check
  check (prioridade in ('BAIXA', 'MEDIA', 'ALTA'));

alter table public.tarefas enable row level security;

drop policy if exists "Tarefas select" on public.tarefas;
create policy "Tarefas select"
on public.tarefas
for select
using (
  auth.uid() = user_id
  and public.usuario_ativo() = true
);

drop policy if exists "Tarefas insert" on public.tarefas;
create policy "Tarefas insert"
on public.tarefas
for insert
with check (
  auth.uid() = user_id
  and public.usuario_ativo() = true
);

drop policy if exists "Tarefas update" on public.tarefas;
create policy "Tarefas update"
on public.tarefas
for update
using (
  auth.uid() = user_id
  and public.usuario_ativo() = true
)
with check (
  auth.uid() = user_id
  and public.usuario_ativo() = true
);

drop policy if exists "Tarefas delete" on public.tarefas;
create policy "Tarefas delete"
on public.tarefas
for delete
using (
  auth.uid() = user_id
  and public.usuario_ativo() = true
);

create index if not exists idx_tarefas_user_id on public.tarefas(user_id);
create index if not exists idx_tarefas_cliente_id on public.tarefas(cliente_id);
create index if not exists idx_tarefas_data on public.tarefas(data);
create index if not exists idx_tarefas_concluida on public.tarefas(concluida);

-- ====================================
-- CONTATOS
-- ====================================

create table if not exists public.contatos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  data_contato date not null,
  observacao text,
  created_at timestamptz not null default now()
);

alter table public.contatos enable row level security;

drop policy if exists "Contatos select" on public.contatos;
create policy "Contatos select"
on public.contatos
for select
using (
  public.usuario_ativo() = true
  and exists (
    select 1
    from public.clientes c
    where c.id = contatos.cliente_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists "Contatos insert" on public.contatos;
create policy "Contatos insert"
on public.contatos
for insert
with check (
  public.usuario_ativo() = true
  and exists (
    select 1
    from public.clientes c
    where c.id = contatos.cliente_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists "Contatos update" on public.contatos;
create policy "Contatos update"
on public.contatos
for update
using (
  public.usuario_ativo() = true
  and exists (
    select 1
    from public.clientes c
    where c.id = contatos.cliente_id
      and c.user_id = auth.uid()
  )
)
with check (
  public.usuario_ativo() = true
  and exists (
    select 1
    from public.clientes c
    where c.id = contatos.cliente_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists "Contatos delete" on public.contatos;
create policy "Contatos delete"
on public.contatos
for delete
using (
  public.usuario_ativo() = true
  and exists (
    select 1
    from public.clientes c
    where c.id = contatos.cliente_id
      and c.user_id = auth.uid()
  )
);

-- ====================================
-- TRIGGERS
-- ====================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.atualizar_ultimo_contato()
returns trigger
language plpgsql
as $$
begin
  update public.clientes
  set ultimo_contato = new.data_contato
  where id = new.cliente_id
    and (
      ultimo_contato is null
      or new.data_contato > ultimo_contato
    );

  return new;
end;
$$;

create or replace function public.criar_profile()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, nome, trial_inicio, trial_fim)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', 'Usuario'),
    now(),
    now() + interval '7 days'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- ====================================
-- ACESSO
-- ====================================

create or replace function public.usuario_ativo()
returns boolean
language plpgsql
security definer
as $$
declare
  ativo_usuario boolean;
begin
  select
    case
      when plano = 'pro'
       and coalesce(proxima_cobranca, now() + interval '1 day') >= now() then true
      when plano in ('trial', 'basic')
       and coalesce(trial_fim, now() + interval '1 day') >= now() then true
      else false
    end
  into ativo_usuario
  from public.profiles
  where id = auth.uid();

  return coalesce(ativo_usuario, false);
end;
$$;

grant execute on function public.usuario_ativo() to authenticated;

-- ====================================
-- RPCs PRINCIPAIS
-- ====================================

create or replace function public.dashboard_resumo()
returns table (
  prospects bigint,
  negociacao bigint,
  clientes bigint,
  inativos bigint
)
language sql
security definer
as $$
  select
    count(*) filter (where status = 'PROSPECT') as prospects,
    count(*) filter (where status = 'NEGOCIACAO') as negociacao,
    count(*) filter (where status = 'CLIENTE') as clientes,
    count(*) filter (where status = 'INATIVO') as inativos
  from public.clientes
  where user_id = auth.uid()
    and public.usuario_ativo() = true;
$$;

grant execute on function public.dashboard_resumo() to authenticated;

create or replace function public.contatos_hoje()
returns bigint
language sql
security definer
as $$
  select count(*)
  from public.contatos ct
  join public.clientes c on c.id = ct.cliente_id
  where c.user_id = auth.uid()
    and ct.data_contato = current_date
    and public.usuario_ativo() = true;
$$;

grant execute on function public.contatos_hoje() to authenticated;

create or replace function public.tarefas_pendentes()
returns bigint
language sql
security definer
as $$
  select count(*)
  from public.tarefas
  where user_id = auth.uid()
    and concluida = false
    and public.usuario_ativo() = true;
$$;

grant execute on function public.tarefas_pendentes() to authenticated;

create or replace function public.tarefas_vencidas()
returns bigint
language sql
security definer
as $$
  select count(*)
  from public.tarefas
  where user_id = auth.uid()
    and concluida = false
    and data < current_date
    and public.usuario_ativo() = true;
$$;

grant execute on function public.tarefas_vencidas() to authenticated;

create or replace function public.tarefas_do_dia()
returns table (
  id uuid,
  titulo text,
  tipo text,
  cliente_nome text
)
language sql
security definer
as $$
  select
    t.id,
    t.titulo,
    t.tipo,
    c.nome as cliente_nome
  from public.tarefas t
  join public.clientes c on c.id = t.cliente_id
  where t.user_id = auth.uid()
    and t.concluida = false
    and t.data = current_date
    and public.usuario_ativo() = true
  order by t.data asc, t.created_at asc;
$$;

grant execute on function public.tarefas_do_dia() to authenticated;

create or replace function public.clientes_sem_contato(dias_limite integer default 15)
returns table (
  cliente_id uuid,
  nome text,
  empresa text,
  dias integer
)
language sql
security definer
as $$
  select
    c.id as cliente_id,
    c.nome,
    c.empresa,
    (current_date - coalesce(max(ct.data_contato), c.created_at::date))::integer as dias
  from public.clientes c
  left join public.contatos ct on ct.cliente_id = c.id
  where c.user_id = auth.uid()
    and public.usuario_ativo() = true
  group by c.id, c.nome, c.empresa, c.created_at
  having (current_date - coalesce(max(ct.data_contato), c.created_at::date))::integer >= dias_limite
  order by dias desc, c.nome asc;
$$;

grant execute on function public.clientes_sem_contato(integer) to authenticated;

create or replace function public.dias_sem_contato()
returns table (
  cliente_id uuid,
  nome text,
  empresa text,
  dias integer
)
language sql
security definer
as $$
  select *
  from public.clientes_sem_contato(15);
$$;

grant execute on function public.dias_sem_contato() to authenticated;
