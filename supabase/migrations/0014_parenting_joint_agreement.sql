 -- 0014_parenting_joint_agreement.sql
-- Distinguish joint legal decision-making by agreement vs requested by one parent.

alter table public.parenting
  add column if not exists joint_by_agreement boolean;
