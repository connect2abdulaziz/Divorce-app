-- 0012_fix_case_delete_audit.sql
-- Deleting a case cascades related audit_log rows, then the cases AFTER DELETE
-- trigger tried to insert a new audit row with that same case_id. The FK on
-- audit_log.case_id rejects the insert and the whole delete fails.

create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_case_id uuid;
  v_row     jsonb;
begin
  -- Field access via dot notation (old.case_id) won't compile for a
  -- generic trigger attached to tables that don't all share that column
  -- (e.g. public.cases has no case_id, only id) — PL/pgSQL trigger
  -- functions are compiled per row-type. Going through jsonb sidesteps that.
  v_row := case when TG_OP = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  v_case_id := case
    when TG_TABLE_NAME = 'cases' then (v_row ->> 'id')::uuid
    else (v_row ->> 'case_id')::uuid
  end;

  -- Case delete already cascade-removes audit_log rows for that case.
  -- Re-inserting with the deleted case_id would violate the FK.
  if TG_OP = 'DELETE' and TG_TABLE_NAME = 'cases' then
    return old;
  end if;

  insert into public.audit_log (case_id, changed_by, table_name, record_id, action, old_data, new_data)
  values (
    v_case_id,
    auth.uid(),
    TG_TABLE_NAME,
    -- Most audited tables use a surrogate `id`; the singleton section
    -- tables (party_client, marriage, ...) use `case_id` as their PK.
    coalesce((v_row ->> 'id')::uuid, (v_row ->> 'case_id')::uuid),
    lower(TG_OP),
    case when TG_OP in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when TG_OP in ('UPDATE', 'INSERT') then to_jsonb(new) else null end
  );

  return coalesce(new, old);
end;
$$;
