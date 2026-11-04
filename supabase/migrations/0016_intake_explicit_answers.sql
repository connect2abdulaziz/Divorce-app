-- Explicit intake answers for petition / parenting-plan fields that used to default.

-- Marriage eligibility
alter table public.marriage
  add column if not exists is_covenant_marriage boolean,
  add column if not exists conciliation_attempted boolean;

-- Domestic violence: unanswered is distinct from "No"
alter table public.domestic_violence
  alter column has_domestic_violence drop not null,
  alter column has_domestic_violence drop default;

-- Spousal maintenance, existing child support, DUI / drug convictions
alter table public.marriage
  add column if not exists spousal_maintenance_requested boolean,
  add column if not exists spousal_maintenance_for text;

alter table public.parenting
  add column if not exists child_support_payer text
    check (child_support_payer is null or child_support_payer in ('client', 'spouse')),
  add column if not exists has_existing_child_support_order boolean,
  add column if not exists has_dui_or_drug_conviction boolean,
  add column if not exists transportation_provider text
    check (
      transportation_provider is null
      or transportation_provider in ('client', 'spouse', 'shared')
    ),
  add column if not exists advance_notice_days integer,
  add column if not exists vacation_weeks integer,
  add column if not exists vacation_notice_days integer,
  add column if not exists summer_schedule_same boolean,
  add column if not exists summer_schedule_notes text;

-- Tax: who claims in even vs odd years when alternating
alter table public.tax_information
  add column if not exists even_year_claimant text
    check (even_year_claimant is null or even_year_claimant in ('client', 'spouse'));

-- Real estate deed description; vehicle VIN / lienholder
alter table public.real_estate
  add column if not exists legal_description text;

alter table public.vehicles
  add column if not exists vin text,
  add column if not exists lienholder text;
