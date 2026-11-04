-- WOC petition: tax-return choices and written property/debt agreement.

alter table public.marriage
  add column if not exists has_written_agreement boolean;

alter table public.tax_information
  add column if not exists going_forward_filing text
    check (
      going_forward_filing is null
      or going_forward_filing in ('separate', 'joint')
    ),
  add column if not exists previous_years_filing text
    check (
      previous_years_filing is null
      or previous_years_filing in ('separate', 'joint', 'not_applicable')
    );
