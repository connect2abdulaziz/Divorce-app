// Placeholder until generated types exist. `Record<string, unknown>` makes
// every `supabase.from(...)` resolve to `never` and fails `next build`.
// Generate the real types once local Supabase is running:
//
//   npm run supabase:start
//   npm run supabase:types
//
// That overwrites this file with fully-typed Row/Insert/Update types.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;
