-- 0004_case_singleton_sections.sql
-- Sections that occur exactly once per case. case_id IS the primary key,
-- so there is never more than one row per case (1:1 with public.cases).
-- RLS policies for these tables are added centrally in 0007.

-- Section 1: Your Information (client)
create table public.party_client (
  case_id         uuid primary key references public.cases (id) on delete cascade,
  first_name      text,
  last_name       text,
  date_of_birth   date,
  address_line1   text,
  address_line2   text,
  city            text,
  state           text,
  zip             text,
  phone           text,
  email           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Section 2: Spouse Information
create table public.party_spouse (
  case_id         uuid primary key references public.cases (id) on delete cascade,
  first_name      text,
  last_name       text,
  date_of_birth   date,
  address_line1   text,
  address_line2   text,
  city            text,
  state           text,
  zip             text,
  phone           text,
  email           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Section 3: Marriage / Separation (also carries the pregnancy follow-up,
-- gated by cases.is_spouse_pregnant)
create table public.marriage (
  case_id           uuid primary key references public.cases (id) on delete cascade,
  marriage_date     date,
  separation_date   date,
  marriage_location text,
  grounds           text,
  due_date          date,   -- only meaningful if cases.is_spouse_pregnant = true
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Section 4: Employment & Income
create table public.employment (
  case_id                 uuid primary key references public.cases (id) on delete cascade,
  client_status           text check (client_status in ('employed', 'not_employed')),
  client_employer_name    text,   -- hidden in UI when client_status = 'not_employed'
  client_employer_address text,
  client_annual_income    numeric(14, 2),
  spouse_status           text check (spouse_status in ('employed', 'not_employed', 'unknown')),
  spouse_employer_name    text,   -- hidden in UI when spouse_status in ('not_employed','unknown')
  spouse_employer_address text,
  spouse_annual_income    numeric(14, 2),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Section 5: Domestic Violence / Order of Protection
create table public.domestic_violence (
  case_id                    uuid primary key references public.cases (id) on delete cascade,
  has_domestic_violence      boolean not null default false,
  order_of_protection_exists boolean,   -- hidden in UI unless has_domestic_violence = true
  filed_by                   text check (filed_by in ('client', 'spouse')),
  date_issued                date,
  details                    text,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

-- Section 7: Custody / Parenting (hidden in UI when cases.has_common_children = false)
create table public.parenting (
  case_id                 uuid primary key references public.cases (id) on delete cascade,
  custody_arrangement     text,
  decision_making         text,
  parenting_time_schedule text,
  notes                   text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Section 8: Tax Information
create table public.tax_information (
  case_id               uuid primary key references public.cases (id) on delete cascade,
  filing_status         text,
  dependents_claimed_by text check (dependents_claimed_by in ('client', 'spouse', 'split', 'alternate')),
  notes                 text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create trigger party_client_touch_updated_at before update on public.party_client for each row execute function public.touch_updated_at();
create trigger party_spouse_touch_updated_at before update on public.party_spouse for each row execute function public.touch_updated_at();
create trigger marriage_touch_updated_at before update on public.marriage for each row execute function public.touch_updated_at();
create trigger employment_touch_updated_at before update on public.employment for each row execute function public.touch_updated_at();
create trigger domestic_violence_touch_updated_at before update on public.domestic_violence for each row execute function public.touch_updated_at();
create trigger parenting_touch_updated_at before update on public.parenting for each row execute function public.touch_updated_at();
create trigger tax_information_touch_updated_at before update on public.tax_information for each row execute function public.touch_updated_at();

alter table public.party_client enable row level security;
alter table public.party_spouse enable row level security;
alter table public.marriage enable row level security;
alter table public.employment enable row level security;
alter table public.domestic_violence enable row level security;
alter table public.parenting enable row level security;
alter table public.tax_information enable row level security;

-- Auto-create one blank row per singleton section the moment a case is
-- created, so the app only ever does UPDATEs on these tables, never
-- "insert-if-not-exists" logic.
create or replace function public.create_case_singletons()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.party_client (case_id) values (new.id);
  insert into public.party_spouse (case_id) values (new.id);
  insert into public.marriage (case_id) values (new.id);
  insert into public.employment (case_id) values (new.id);
  insert into public.domestic_violence (case_id) values (new.id);
  insert into public.parenting (case_id) values (new.id);
  insert into public.tax_information (case_id) values (new.id);
  return new;
end;
$$;

create trigger cases_create_singletons
  after insert on public.cases
  for each row execute function public.create_case_singletons();
