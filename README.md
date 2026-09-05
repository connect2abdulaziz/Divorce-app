# Divorce Questionnaire — DB Schema & Supabase Setup

This is phase 1 of the build: the Postgres schema, migrations, and RLS
policies, plus a minimal Next.js scaffold wired up to Supabase. The
questionnaire UI (Sections 1–17), admin dashboard, and document generation
engine are the next phases, built on top of this foundation.

**All 8 migrations were tested end-to-end against a real Postgres instance**
(signup trigger → profile creation → case creation → singleton section
auto-population → repeatable records → denormalized FK sync → audit
logging → RLS isolation between clients and staff visibility) before being
handed off here.

## What's in here

```
supabase/
  config.toml              Local Supabase CLI config
  seed.sql                 Dev seed data + first-admin bootstrap note
  migrations/
    0001_extensions.sql               extensions + generic touch_updated_at()
    0002_profiles.sql                 profiles, roles, is_staff()/is_admin(), signup trigger
    0003_cases.sql                    the root `cases` table + is_case_owner()
    0004_case_singleton_sections.sql  client/spouse/marriage/employment/DV/parenting/tax
    0005_children.sql                 children + child_residences
    0006_assets_and_debts.sql         real estate, vehicles, retirement, debts, property
    0007_case_data_rls_policies.sql   generates RLS policies for every case-linked table
    0008_documents_and_audit.sql      document_templates, generated_documents, audit_log
lib/supabase/
  client.ts        browser Supabase client
  server.ts         server Supabase client (Server Components/Actions)
  admin.ts          service-role client for trusted staff-only server code
  middleware.ts     session-refresh helper
  database.types.ts placeholder — regenerate after running migrations
middleware.ts       wires up session refresh
app/                minimal placeholder page (not the real questionnaire yet)
```

## Schema overview

| Table | Purpose | Shape |
|---|---|---|
| `profiles` | One row per Supabase auth user; `role` = client / staff / admin | 1:1 with `auth.users` |
| `cases` | The root record. Holds status, save/resume pointer, and the yes/no "gate" answers that decide which sections show | 1 per case |
| `party_client`, `party_spouse`, `marriage`, `employment`, `domestic_violence`, `parenting`, `tax_information` | Sections that occur exactly once per case | `case_id` **is** the primary key — auto-created the moment a case is created, so the app only ever does `UPDATE`s here |
| `children`, `child_residences` | Repeatable | `child_residences.case_id` is kept in sync with its parent child by trigger |
| `real_estate`, `vehicles`, `retirement_accounts`, `community_debts`, `personal_property`, `separate_property`, `separate_debts` | Repeatable | unlimited rows per case, no fixed field caps |
| `document_templates` | Arizona form templates + merge-field map (`{{client.first_name}}` → `party_client.first_name`) | staff/admin managed |
| `generated_documents` | Generated file record per case per template | staff write, client read-only |
| `audit_log` | Append-only trail of every insert/update/delete on case data | staff read-only, system-written |

Every questionnaire answer has its own column — nothing is stored as one
large text blob — so the document-generation phase can map fields directly.

### Conditional-logic "gates"

The yes/no questions that hide/show whole sections live as nullable columns
directly on `cases` (`has_common_children`, `is_spouse_pregnant`,
`has_real_estate`, `has_vehicles`, `has_retirement_accounts`,
`has_community_debts`, `has_household_property`, `has_separate_property`,
`has_separate_debts`), plus `client_status`/`spouse_status` on `employment`
and `has_domestic_violence` on `domestic_violence`. The frontend reads these
to decide what to render; `null` means "not yet answered," which the UI
should also treat as hidden until the client answers.

## RLS design

Two helper functions, defined once and reused everywhere:

- `public.is_staff()` — true if the caller's profile role is `staff` or `admin`.
- `public.is_case_owner(case_id)` — true if the caller is the `client_id` on that case.

Every case-linked table gets the same four policies (generated once in
`0007_case_data_rls_policies.sql` via a loop, rather than hand-written 28
times, so the rule can't drift table-to-table):

- **select/insert/update/delete**: allowed if `is_case_owner(case_id)` OR `is_staff()`.

`document_templates` and `generated_documents` follow a different rule
(staff manage them; clients can only read their own case's generated docs).
`audit_log` is staff-read-only and written solely by the `audit_row_change()`
trigger, which is `security definer` so a client can never fake an entry.

**Bootstrapping the first admin:** no admin exists yet to authorize the very
first promotion (the `prevent_role_escalation` trigger blocks self-promotion
on purpose). See the comment at the top of `supabase/seed.sql` for the
one-time, local, trigger-disabled bootstrap step.

## Setup

```bash
npm install
npx supabase start          # spins up local Postgres + Auth + Storage + Studio
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
# from the output of `supabase start` (or `supabase status`)
npm run supabase:types      # generates lib/supabase/database.types.ts
npm run dev
```

To push this schema to a hosted Supabase project instead of local dev:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

## Next phases (not built yet)

1. **Questionnaire UI** — multi-step form for Sections 1–17, reading/writing
   the tables above, with the autosave + progress-indicator behavior from
   the SOW.
2. **Admin dashboard** — staff view/edit of any case, using `is_staff()`-gated
   pages.
3. **Document generation** — server-side job that reads a case's structured
   data plus a `document_templates.merge_field_map` and produces a filled
   Arizona court form into `generated_documents`.
