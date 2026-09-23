-- 0010_sprint3_marriage_children_parenting.sql
-- Sprint 3: name restoration, pregnancy father, DV OOP details,
-- child middle/SSN, structured residences, custody/visitation.

alter table public.marriage
  add column if not exists marriage_city text,
  add column if not exists marriage_state text,
  add column if not exists restore_former_name boolean,
  add column if not exists restored_first_name text,
  add column if not exists restored_middle_name text,
  add column if not exists restored_last_name text,
  add column if not exists spouse_is_father boolean;

alter table public.domestic_violence
  add column if not exists against_whom text,
  add column if not exists oop_city text,
  add column if not exists oop_state text;

alter table public.domestic_violence
  drop constraint if exists domestic_violence_against_whom_check;
alter table public.domestic_violence
  add constraint domestic_violence_against_whom_check
  check (against_whom is null or against_whom in ('client', 'spouse', 'both', 'other'));

alter table public.parenting
  add column if not exists visitation_wanted boolean,
  add column if not exists visitation_denied_reason text;

alter table public.children
  add column if not exists middle_name text,
  add column if not exists ssn_last4 text;

alter table public.children
  drop constraint if exists children_ssn_last4_check;
alter table public.children
  add constraint children_ssn_last4_check
  check (ssn_last4 is null or ssn_last4 ~ '^\d{4}$');

alter table public.child_residences
  add column if not exists street_address text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists zip text,
  add column if not exists lived_with text;

alter table public.child_residences
  drop constraint if exists child_residences_lived_with_check;
alter table public.child_residences
  add constraint child_residences_lived_with_check
  check (lived_with is null or lived_with in ('client', 'spouse', 'both', 'other'));
