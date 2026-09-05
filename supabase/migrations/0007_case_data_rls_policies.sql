-- 0007_case_data_rls_policies.sql
-- Every table below has a `case_id` column and follows the exact same rule:
-- the owning client can select/insert/update/delete rows on their own case;
-- staff/admin can do the same on any case. Rather than hand-write ~28
-- near-identical policies, generate them once here so the rule can never
-- drift table-to-table.

do $$
declare
  t text;
  tables text[] := array[
    'party_client', 'party_spouse', 'marriage', 'employment',
    'domestic_violence', 'parenting', 'tax_information',
    'children', 'child_residences',
    'real_estate', 'vehicles', 'retirement_accounts', 'community_debts',
    'personal_property', 'separate_property', 'separate_debts'
  ];
begin
  foreach t in array tables loop
    execute format(
      'create policy "%1$s_select_owner_or_staff" on public.%1$s
         for select using (public.is_case_owner(case_id) or public.is_staff());',
      t
    );
    execute format(
      'create policy "%1$s_insert_owner_or_staff" on public.%1$s
         for insert with check (public.is_case_owner(case_id) or public.is_staff());',
      t
    );
    execute format(
      'create policy "%1$s_update_owner_or_staff" on public.%1$s
         for update using (public.is_case_owner(case_id) or public.is_staff())
         with check (public.is_case_owner(case_id) or public.is_staff());',
      t
    );
    execute format(
      'create policy "%1$s_delete_owner_or_staff" on public.%1$s
         for delete using (public.is_case_owner(case_id) or public.is_staff());',
      t
    );
  end loop;
end $$;
