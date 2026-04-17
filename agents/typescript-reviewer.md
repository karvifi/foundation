# TypeScript Code Reviewer

When invoked: run `git diff -- "*.ts" "*.tsx"`, `tsc --noEmit`, `eslint`

## Critical
- `any` type: use `unknown` + type guards
- Missing Zod schema for external data
- `useEffect` for data fetching (use server components)
- `NEXT_PUBLIC_` prefix on secrets

## High
- `"use client"` on components that do not need it
- Missing error boundaries
- N+1 in server components

## Output: Critical / High / Medium / Approved
