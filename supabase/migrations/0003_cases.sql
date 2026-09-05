-- 0003_cases.sql
-- The root record. Every other table below hangs off case_id.

create type public.case_status as enum ('in_progress', 'submitted', 'completed');

create table public.cases (
  id                          uuid primary key default gen_random_uuid(),
  client_id                   uuid not null references public.profiles (id) on delete restrict,

  questionnaire_status        public.case_status not null default 'in_progress',
  last_completed_section      text,              -- e.g. 'children' — drives resume + progress %
  submitted_at                timestamptz,
  completed_at                timestamptz,
  last_saved_at               timestamptz not null default now(),

  -- "Gate" answers: the yes/no questions that decide whether a whole
  -- section (and its repeatable records) is shown at all. Nullable = not
  -- yet answered, which the UI also treats as "hidden until answered".
  has_common_children         boolean,
  is_spouse_pregnant          boolean,
  has_real_estate             boolean,
  has_vehicles                boolean,
  has_retirement_accounts     boolean,
  has_community_debts         boolean,
  has_household_property      boolean,
  has_separate_property       boolean,
  has_separate_debts          boolean,

  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index cases_client_id_idx on public.cases (client_id);
create index cases_status_idx on public.cases (questionnaire_status);

create trigger cases_touch_updated_at
  before update on public.cases
  for each row execute function public.touch_updated_at();

-- Helper used by every downstream table's RLS policies.
create or replace function public.is_case_owner(p_case_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.cases
    where id = p_case_id and client_id = auth.uid()
  );
$$;

alter table public.cases enable row level security;

create policy "cases_select_own_or_staff"
  on public.cases for select
  using (client_id = auth.uid() or public.is_staff());

create policy "cases_insert_own_or_staff"
  on public.cases for insert
  with check (client_id = auth.uid() or public.is_staff());

create policy "cases_update_own_or_staff"
  on public.cases for update
  using (client_id = auth.uid() or public.is_staff())
  with check (client_id = auth.uid() or public.is_staff());

create policy "cases_delete_staff_only"
  on public.cases for delete
  using (public.is_staff());
