-- Public contact form submissions visible to staff in the admin panel.

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_messages_name_len check (char_length(name) between 1 and 200),
  constraint contact_messages_email_len check (char_length(email) between 3 and 320),
  constraint contact_messages_message_len check (char_length(message) between 1 and 5000)
);

create index contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index contact_messages_status_idx on public.contact_messages (status);

create trigger contact_messages_touch_updated_at
  before update on public.contact_messages
  for each row execute function public.touch_updated_at();

alter table public.contact_messages enable row level security;

-- Visitors (anon or signed-in clients) can submit a message.
create policy "contact_messages_insert_public"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

-- Only staff/admin can read and manage inbox rows.
create policy "contact_messages_select_staff"
  on public.contact_messages
  for select
  to authenticated
  using (public.is_staff());

create policy "contact_messages_update_staff"
  on public.contact_messages
  for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "contact_messages_delete_staff"
  on public.contact_messages
  for delete
  to authenticated
  using (public.is_staff());

grant select, insert, update, delete on public.contact_messages to authenticated;
grant insert on public.contact_messages to anon;
