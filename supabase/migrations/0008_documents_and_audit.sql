-- 0008_documents_and_audit.sql
-- Document generation + staff audit trail. These follow a different access
-- pattern than the case-data tables in 0007, so they get their own policies.

-- Arizona court form templates, maintained by staff. merge_field_map records
-- how template placeholders like {{client.first_name}} map to the
-- structured columns above (e.g. {"client.first_name": "party_client.first_name"}).
create table public.document_templates (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  description       text,
  storage_path      text not null,          -- path in the Supabase Storage bucket
  merge_field_map   jsonb not null default '{}'::jsonb,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger document_templates_touch_updated_at
  before update on public.document_templates
  for each row execute function public.touch_updated_at();

alter table public.document_templates enable row level security;

create policy "document_templates_staff_all"
  on public.document_templates for all
  using (public.is_staff())
  with check (public.is_staff());

-- Files generated for a specific case from a specific template.
create table public.generated_documents (
  id             uuid primary key default gen_random_uuid(),
  case_id        uuid not null references public.cases (id) on delete cascade,
  template_id    uuid not null references public.document_templates (id) on delete restrict,
  storage_path   text not null,
  generated_by   uuid references public.profiles (id),
  generated_at   timestamptz not null default now()
);

create index generated_documents_case_id_idx on public.generated_documents (case_id);

alter table public.generated_documents enable row level security;

-- Staff generate and manage documents; clients may only read documents
-- generated for their own case (e.g. to download a copy), never write them.
create policy "generated_documents_staff_all"
  on public.generated_documents for all
  using (public.is_staff())
  with check (public.is_staff());

create policy "generated_documents_client_read_own"
  on public.generated_documents for select
  using (public.is_case_owner(case_id));

-- Append-only audit trail of staff edits to client-submitted data.
create table public.audit_log (
  id           uuid primary key default gen_random_uuid(),
  case_id      uuid references public.cases (id) on delete cascade,
  changed_by   uuid references public.profiles (id),
  table_name   text not null,
  record_id    uuid,
  action       text not null check (action in ('insert', 'update', 'delete')),
  old_data     jsonb,
  new_data     jsonb,
  changed_at   timestamptz not null default now()
);

create index audit_log_case_id_idx on public.audit_log (case_id);

alter table public.audit_log enable row level security;

-- Nobody writes to audit_log directly from the client — only the trigger
-- function below (security definer) inserts rows.
create policy "audit_log_staff_read"
  on public.audit_log for select
  using (public.is_staff());

-- Generic audit trigger: logs every insert/update/delete on the tables it's
-- attached to. Attached below to the case-data tables that matter most for
-- compliance review.
create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_case_id uuid;
  v_row     jsonb;
begin
  -- Field access via dot notation (old.case_id) won't compile for a
  -- generic trigger attached to tables that don't all share that column
  -- (e.g. public.cases has no case_id, only id) — PL/pgSQL trigger
  -- functions are compiled per row-type. Going through jsonb sidesteps that.
  v_row := case when TG_OP = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  v_case_id := case
    when TG_TABLE_NAME = 'cases' then (v_row ->> 'id')::uuid
    else (v_row ->> 'case_id')::uuid
  end;

  insert into public.audit_log (case_id, changed_by, table_name, record_id, action, old_data, new_data)
  values (
    v_case_id,
    auth.uid(),
    TG_TABLE_NAME,
    -- Most audited tables use a surrogate `id`; the singleton section
    -- tables (party_client, marriage, ...) use `case_id` as their PK.
    coalesce((v_row ->> 'id')::uuid, (v_row ->> 'case_id')::uuid),
    lower(TG_OP),
    case when TG_OP in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when TG_OP in ('UPDATE', 'INSERT') then to_jsonb(new) else null end
  );

  return coalesce(new, old);
end;
$$;

do $$
declare
  t text;
  audited_tables text[] := array[
    'cases', 'party_client', 'party_spouse', 'marriage', 'employment',
    'domestic_violence', 'parenting', 'tax_information', 'children',
    'real_estate', 'vehicles', 'retirement_accounts', 'community_debts',
    'personal_property', 'separate_property', 'separate_debts'
  ];
begin
  foreach t in array audited_tables loop
    execute format(
      'create trigger %1$s_audit
         after insert or update or delete on public.%1$s
         for each row execute function public.audit_row_change();',
      t
    );
  end loop;
end $$;
