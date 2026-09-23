-- 0011_sprint5_community_property_tax.sql
-- §8 community-property umbrella gate + tax claim frequency.

alter table public.cases
  add column if not exists has_community_property boolean;

alter table public.tax_information
  add column if not exists claim_frequency text;

alter table public.tax_information
  drop constraint if exists tax_information_claim_frequency_check;

alter table public.tax_information
  add constraint tax_information_claim_frequency_check
  check (
    claim_frequency is null
    or claim_frequency in ('every_year', 'alternate_years')
  );
