-- Allow clients to continue without SSN last-4 or DL last-4 when unavailable.

alter table public.party_client
  add column if not exists ssn_unknown boolean not null default false,
  add column if not exists driver_license_unknown boolean not null default false;
