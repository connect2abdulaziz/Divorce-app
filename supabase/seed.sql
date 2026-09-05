-- supabase/seed.sql
-- Runs automatically after migrations on `supabase db reset`.
-- Local development only — do not rely on this for production.

-- There is no admin yet, and the profiles_prevent_role_escalation trigger
-- blocks self-promotion, so the very first admin must be created with the
-- trigger disabled. Do this once, locally, after signing up your own admin
-- account through the app so its auth.users row (and matching profile) exist:
--
--   alter table public.profiles disable trigger profiles_prevent_role_escalation;
--   update public.profiles set role = 'admin' where email = 'you@yourfirm.com';
--   alter table public.profiles enable trigger profiles_prevent_role_escalation;
--
-- From then on, all further role changes go through that admin account,
-- which is_admin() will authorize normally.

insert into public.document_templates (name, description, storage_path, merge_field_map, is_active)
values (
  'Petition for Dissolution of Marriage (sample)',
  'Placeholder template row — replace storage_path once the real .docx is uploaded to Storage.',
  'templates/petition-for-dissolution.docx',
  '{
    "client.first_name": "party_client.first_name",
    "client.last_name": "party_client.last_name",
    "spouse.first_name": "party_spouse.first_name",
    "spouse.last_name": "party_spouse.last_name",
    "marriage.date": "marriage.marriage_date"
  }'::jsonb,
  true
)
on conflict do nothing;
