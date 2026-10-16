-- Gender is required on the preliminary injunction (Male / Female).

alter table public.party_client
  add column if not exists gender text;

alter table public.party_client
  drop constraint if exists party_client_gender_check;
alter table public.party_client
  add constraint party_client_gender_check
  check (gender is null or gender in ('male', 'female'));

alter table public.party_spouse
  add column if not exists gender text;

alter table public.party_spouse
  drop constraint if exists party_spouse_gender_check;
alter table public.party_spouse
  add constraint party_spouse_gender_check
  check (gender is null or gender in ('male', 'female'));
