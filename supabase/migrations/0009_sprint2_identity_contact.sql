-- 0009_sprint2_identity_contact.sql
-- Sprint 2: identity, residency, phones, SSN last-4, spouse unknowns, employment details.

alter table public.party_client
  add column if not exists middle_name text,
  add column if not exists height text,
  add column if not exists weight_lbs numeric(6, 1),
  add column if not exists az_years integer,
  add column if not exists az_months integer,
  add column if not exists home_phone text,
  add column if not exists cell_phone text,
  add column if not exists ssn_last4 text;

alter table public.party_client
  drop constraint if exists party_client_ssn_last4_check;
alter table public.party_client
  add constraint party_client_ssn_last4_check
  check (ssn_last4 is null or ssn_last4 ~ '^\d{4}$');

alter table public.party_spouse
  add column if not exists middle_name text,
  add column if not exists height text,
  add column if not exists weight_lbs numeric(6, 1),
  add column if not exists az_years integer,
  add column if not exists az_months integer,
  add column if not exists home_phone text,
  add column if not exists cell_phone text,
  add column if not exists ssn_last4 text,
  add column if not exists address_unknown boolean not null default false,
  add column if not exists phone_unknown boolean not null default false,
  add column if not exists ssn_unknown boolean not null default false;

alter table public.party_spouse
  drop constraint if exists party_spouse_ssn_last4_check;
alter table public.party_spouse
  add constraint party_spouse_ssn_last4_check
  check (ssn_last4 is null or ssn_last4 ~ '^\d{4}$');

alter table public.employment
  add column if not exists client_position text,
  add column if not exists client_employer_phone text,
  add column if not exists client_monthly_income numeric(14, 2),
  add column if not exists client_employer_city text,
  add column if not exists client_employer_state text,
  add column if not exists client_employer_zip text,
  add column if not exists spouse_position text,
  add column if not exists spouse_employer_phone text,
  add column if not exists spouse_monthly_income numeric(14, 2),
  add column if not exists spouse_employer_city text,
  add column if not exists spouse_employer_state text,
  add column if not exists spouse_employer_zip text;
