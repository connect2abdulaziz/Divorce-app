# Questionnaire UI update — files to copy into your existing project

This adds the full Sections 1–17 questionnaire flow, styled with Tailwind,
on top of your existing schema + auth. Copy this folder's contents into
your project root, preserving paths.

## 1. Install two new dev dependencies first
```bash
npm install -D tailwindcss@3 postcss autoprefixer
```
(package.json isn't included in this zip so it doesn't clobber yours —
just run the install above.)

## 2. New config files (copy as-is)
- `tailwind.config.js`
- `postcss.config.js`
- `app/globals.css`

## 3. Files that REPLACE existing ones
- `app/layout.tsx` — now loads Google Fonts (Source Serif 4 + IBM Plex
  Sans) and the Tailwind stylesheet
- `app/login/page.tsx`, `app/signup/page.tsx`, `app/signup/check-email/page.tsx`,
  `app/error/page.tsx` — restyled to match, logic unchanged
- `app/page.tsx` — unchanged from before, included for completeness
- `app/questionnaire/page.tsx` — now redirects to wherever the client left
  off (or `/questionnaire/submitted` if already submitted), instead of the
  old placeholder "your case ID" page

## 4. New: the questionnaire itself
- `app/questionnaire/layout.tsx` — the shell: progress rail, top bar
  (email, last-saved time, sign out)
- `app/questionnaire/{client-info,spouse-info,marriage,employment,
  domestic-violence,children,parenting,tax-information,real-estate,
  vehicles,retirement,community-debts,household-property,
  separate-property,separate-debts,review,submit,submitted}/` — one folder
  per section (Sections 1–17 from the spec)
- `components/questionnaire/` — shared building blocks (form fields, the
  progress rail, the generic repeatable-record list, step chrome)
- `lib/questionnaire/` — step order + conditional visibility rules
  (`steps.ts`), data loading (`data.ts`), and every server action that
  reads/writes the database (`actions.ts`)

## Verified before sending
`npm run build` passes clean — every route compiles, full TypeScript
check included. (Google Fonts couldn't be fetched from my sandboxed
environment to prove that specific step, but `next/font/google` is the
standard, well-supported way to do this and will fetch normally wherever
you build with real internet access.)

## What's implemented
- All 17 sections, in order, with the exact conditional-logic rules from
  the spec (children hide Parenting; each yes/no gate hides/shows its own
  repeatable records)
- Dynamic repeatable records for children (with nested residence history),
  real estate, vehicles, retirement accounts, community debts, household
  property, separate property, and separate debts — no fixed field caps
- Autosave on every "Save & continue" (updates `last_saved_at` and
  `last_completed_section`)
- Progress rail that excludes hidden sections from the percentage and
  from the clickable step list (you can't jump ahead past what you've
  completed, but can always go back)
- Review page with all sections grouped and Edit links back to each one
- Submit flow with the attestation checkbox → sets case status to
  `submitted` → confirmation page

## Known simplification (documented in code)
Community Debts doesn't hard-block if "you pay" + "spouse pays" don't add
up to the total — the spec calls this a soft/normal-case validation, not a
hard rule, so it's a hint in the UI rather than a blocking error.

## Not built yet
- Admin dashboard (staff view/edit of any case)
- Document generation engine (merge-field mapping into Arizona forms)
