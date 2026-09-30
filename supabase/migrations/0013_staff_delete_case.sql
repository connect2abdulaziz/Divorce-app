-- 0013_staff_delete_case.sql
-- Case delete still fails when child-table CASCADE deletes fire audit inserts
-- that race the audit_log.case_id foreign key. Skip auditing for the duration
-- of an intentional staff case delete, and expose a single RPC for the app.

create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_case_id uuid;
  v_row     jsonb;
begin
  -- Soft flag set by staff_delete_case() for this transaction only.
  if current_setting('app.skip_audit', true) = 'on' then
    return coalesce(new, old);
  end if;

  v_row := case when TG_OP = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  v_case_id := case
    when TG_TABLE_NAME = 'cases' then (v_row ->> 'id')::uuid
    else (v_row ->> 'case_id')::uuid
  end;

  -- Deleting the case row itself cannot be logged against that case_id:
  -- the FK target is already going away (and existing audit rows cascade).
  if TG_OP = 'DELETE' and TG_TABLE_NAME = 'cases' then
    return old;
  end if;

  insert into public.audit_log (case_id, changed_by, table_name, record_id, action, old_data, new_data)
  values (
    v_case_id,
    auth.uid(),
    TG_TABLE_NAME,
    coalesce((v_row ->> 'id')::uuid, (v_row ->> 'case_id')::uuid),
    lower(TG_OP),
    case when TG_OP in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when TG_OP in ('UPDATE', 'INSERT') then to_jsonb(new) else null end
  );

  return coalesce(new, old);
end;
$$;

create or replace function public.staff_delete_case(p_case_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not public.is_staff() then
    raise exception 'not authorized to delete cases';
  end if;

  if p_case_id is null then
    raise exception 'case id is required';
  end if;

  -- Skip audit triggers for this transaction so CASCADE child deletes
  -- do not insert audit_log rows that fight the case_id foreign key.
  perform set_config('app.skip_audit', 'on', true);

  delete from public.cases where id = p_case_id;

  if not found then
    raise exception 'case not found';
  end if;
end;
$$;

revoke all on function public.staff_delete_case(uuid) from public;
grant execute on function public.staff_delete_case(uuid) to authenticated;
