-- Court text opt-in, interpreter need/language, and driver license last-4.

alter table public.party_client
  add column if not exists driver_license_last4 text,
  add column if not exists court_texts_opt_in boolean,
  add column if not exists interpreter_needed boolean,
  add column if not exists interpreter_language text;

alter table public.party_client
  drop constraint if exists party_client_driver_license_last4_check;
alter table public.party_client
  add constraint party_client_driver_license_last4_check
  check (driver_license_last4 is null or driver_license_last4 ~ '^\d{4}$');

alter table public.party_spouse
  add column if not exists driver_license_last4 text,
  add column if not exists driver_license_unknown boolean not null default false,
  add column if not exists court_texts_opt_in boolean;

alter table public.party_spouse
  drop constraint if exists party_spouse_driver_license_last4_check;
alter table public.party_spouse
  add constraint party_spouse_driver_license_last4_check
  check (driver_license_last4 is null or driver_license_last4 ~ '^\d{4}$');
