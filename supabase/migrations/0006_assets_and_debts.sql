-- 0006_assets_and_debts.sql
-- Repeatable records for Sections 9-15. Each is hidden in the UI by its
-- matching gate column on public.cases (has_real_estate, has_vehicles, ...).

create table public.real_estate (
  id               uuid primary key default gen_random_uuid(),
  case_id          uuid not null references public.cases (id) on delete cascade,
  address          text,
  estimated_value  numeric(14, 2),
  amount_owed      numeric(14, 2),
  assigned_to      text check (assigned_to in ('client', 'spouse', 'sell', 'joint')),
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table public.vehicles (
  id               uuid primary key default gen_random_uuid(),
  case_id          uuid not null references public.cases (id) on delete cascade,
  make             text,
  model            text,
  year             integer,
  estimated_value  numeric(14, 2),
  amount_owed      numeric(14, 2),
  assigned_to      text check (assigned_to in ('client', 'spouse')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table public.retirement_accounts (
  id                uuid primary key default gen_random_uuid(),
  case_id           uuid not null references public.cases (id) on delete cascade,
  plan_type         text,
  owner_party       text check (owner_party in ('client', 'spouse')),
  approximate_value numeric(14, 2),
  division_method   text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table public.community_debts (
  id                     uuid primary key default gen_random_uuid(),
  case_id                uuid not null references public.cases (id) on delete cascade,
  creditor               text,
  debt_type              text,
  currency               text not null default 'USD',
  amount_owed            numeric(14, 2),
  amount_client_pays     numeric(14, 2) default 0,
  amount_spouse_pays     numeric(14, 2) default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
  -- Note: "amount_client_pays + amount_spouse_pays should normally equal
  -- amount_owed" is a soft validation surfaced in the UI, not a hard DB
  -- constraint, since clients may save a section before it's fully split.
);

create table public.personal_property (
  id               uuid primary key default gen_random_uuid(),
  case_id          uuid not null references public.cases (id) on delete cascade,
  description      text,
  estimated_value  numeric(14, 2),
  assigned_to      text check (assigned_to in ('client', 'spouse')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table public.separate_property (
  id               uuid primary key default gen_random_uuid(),
  case_id          uuid not null references public.cases (id) on delete cascade,
  description      text,
  estimated_value  numeric(14, 2),
  owner_party      text check (owner_party in ('client', 'spouse')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table public.separate_debts (
  id           uuid primary key default gen_random_uuid(),
  case_id      uuid not null references public.cases (id) on delete cascade,
  description  text,
  creditor     text,
  amount_owed  numeric(14, 2),
  owner_party  text check (owner_party in ('client', 'spouse')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index real_estate_case_id_idx on public.real_estate (case_id);
create index vehicles_case_id_idx on public.vehicles (case_id);
create index retirement_accounts_case_id_idx on public.retirement_accounts (case_id);
create index community_debts_case_id_idx on public.community_debts (case_id);
create index personal_property_case_id_idx on public.personal_property (case_id);
create index separate_property_case_id_idx on public.separate_property (case_id);
create index separate_debts_case_id_idx on public.separate_debts (case_id);

create trigger real_estate_touch_updated_at before update on public.real_estate for each row execute function public.touch_updated_at();
create trigger vehicles_touch_updated_at before update on public.vehicles for each row execute function public.touch_updated_at();
create trigger retirement_accounts_touch_updated_at before update on public.retirement_accounts for each row execute function public.touch_updated_at();
create trigger community_debts_touch_updated_at before update on public.community_debts for each row execute function public.touch_updated_at();
create trigger personal_property_touch_updated_at before update on public.personal_property for each row execute function public.touch_updated_at();
create trigger separate_property_touch_updated_at before update on public.separate_property for each row execute function public.touch_updated_at();
create trigger separate_debts_touch_updated_at before update on public.separate_debts for each row execute function public.touch_updated_at();

alter table public.real_estate enable row level security;
alter table public.vehicles enable row level security;
alter table public.retirement_accounts enable row level security;
alter table public.community_debts enable row level security;
alter table public.personal_property enable row level security;
alter table public.separate_property enable row level security;
alter table public.separate_debts enable row level security;
