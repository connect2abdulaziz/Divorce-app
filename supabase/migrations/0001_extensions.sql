-- 0001_extensions.sql
-- Extensions and generic helpers used by every later migration.

create extension if not exists pgcrypto; -- gives us gen_random_uuid()

-- Generic "touch updated_at" trigger function, reused by every table below.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
