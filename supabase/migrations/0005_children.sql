-- 0005_children.sql
-- Section 6: Children (repeatable). Hidden entirely in the UI when
-- cases.has_common_children = false.

create table public.children (
  id             uuid primary key default gen_random_uuid(),
  case_id        uuid not null references public.cases (id) on delete cascade,
  first_name     text,
  last_name      text,
  date_of_birth  date,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index children_case_id_idx on public.children (case_id);

-- Residence history per child (developer notes: "child_residences — multiple
-- records linked to child_id"). case_id is denormalized onto this table too
-- so its RLS policy can be generated the same generic way as every other
-- case-linked table in 0007.
create table public.child_residences (
  id                   uuid primary key default gen_random_uuid(),
  case_id              uuid not null references public.cases (id) on delete cascade,
  child_id             uuid not null references public.children (id) on delete cascade,
  address              text,
  start_date           date,
  end_date             date,
  is_primary_residence boolean default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index child_residences_case_id_idx on public.child_residences (case_id);
create index child_residences_child_id_idx on public.child_residences (child_id);

create trigger children_touch_updated_at before update on public.children for each row execute function public.touch_updated_at();
create trigger child_residences_touch_updated_at before update on public.child_residences for each row execute function public.touch_updated_at();

alter table public.children enable row level security;
alter table public.child_residences enable row level security;

-- Keep child_residences.case_id in sync with its parent child, so a client
-- can never attach a residence record to a child on a different case.
create or replace function public.sync_child_residence_case_id()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  select case_id into new.case_id from public.children where id = new.child_id;
  return new;
end;
$$;

create trigger child_residences_sync_case_id
  before insert or update of child_id on public.child_residences
  for each row execute function public.sync_child_residence_case_id();
