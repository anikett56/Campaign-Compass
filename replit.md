# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## AdMojo Campaign Generator

**Product**: Multi-stage AI campaign generator at `artifacts/campaign-generator/`.
**API**: Express 5 server at `artifacts/api-server/`.

### Architecture
- Form inputs → POST `/api/generate` → smart logic engine → structured `CampaignResult`
- Frontend uses `useGenerateCampaign` React Query mutation (from `@workspace/api-client-react`)
- Backend: `artifacts/api-server/src/lib/campaignEngine.ts` — rule-based scoring engine
- Route: `artifacts/api-server/src/routes/campaign.ts` — registered in `routes/index.ts`
- Zod schemas in `@workspace/api-zod` (generated via `codegen`)

### Stages
1. Campaign Ideas — 3 scored + prioritised campaign concepts
2. Ad Copies — 4 platform-specific copy variants (social, search, email)
3. Channel Mix — budget allocation with visual bar chart, ₹ spend estimates
4. A/B Test Plan — 3 structured experiments with hypothesis + variants

### Budget tiers (₹)
under-10k | 10k-50k | 50k-1l | 1l-5l | 5l-10l | 10l+ | custom

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
