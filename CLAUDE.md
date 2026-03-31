# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured. Environment requires `.env.local` with:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Architecture Overview

This is a **Warehouse Management System (WMS)** frontend built with Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS v4.

### Routing & Layouts

Route groups organize pages by access level and layout:
- `(auth)/` — Public pages (login, register, reset-password)
- `(dashboard)/` — Protected pages with sidebar/header layout; requires JWT cookie
- `(admin)/` — Additional admin pages (charts, forms, notifications, fault orders)
- `(full-width-pages)/` — Full-width layout variant

Auth protection is handled in `src/proxy.ts` (Next.js middleware): checks for JWT in cookies, redirects unauthenticated users to `/login`.

The `(dashboard)/layout.tsx` is a Server Component that fetches the current user via `UserManagementService.getById()` and renders `AppSidebar` + `AppHeader`.

### Data Layer

**API Client** (`src/lib/api-mask.ts`): Wraps `fetch` with automatic JWT injection from cookies, error normalization via `ApiError`, and base URL from `NEXT_PUBLIC_API_URL`. Methods: `get`, `post`, `put`, `patch`, `delete`.

**Service Layer** (`src/services/`): Typed service objects per domain:
- `UserManagementService` — users, roles, permissions
- `InventoryManagementService` — products, categories, units, variants
- `InboundOutboundService` — import/export sheets and details
- `WarehouseManagementService` — warehouses, inventory checks, locations

Services call `apiClient` methods and return typed responses from `src/interfaces/`.

### State Management

| Layer | Tool | Purpose |
|---|---|---|
| Server state | TanStack React Query | Fetching, caching, mutations |
| Form state | React Hook Form | Form validation and submission |
| UI state | React Context (`SidebarContext`, `ThemeContext`) | Sidebar toggle, dark/light mode |
| Workflow state | React Context (`ImportContext`, `ExportContext`, `ProcessContext`, etc.) | Multi-step import/export flows |

React Query is provided globally via `TanstackQueryContext.tsx`.

### Key Domain Workflows

**Import/Export Sheets** have multi-step flows with dedicated Context providers (`ImportContext`, `ExportContext`) and route pattern: `/import/process/[type]/[id]/[step]`.

**Inventory Check** and **Quality Control** also have dedicated Context providers (`QualityCheckContext`).

### Component Organization

- `src/components/` — Custom project components (layout, tables, modals, forms, `InboundOutboundClient/`, `TA_common/`)
- `src/default_components/` — Base template components (charts, auth forms, ecommerce widgets)
- `src/icons/` — SVG icon library imported via `@svgr/webpack`
- `src/hooks/` — Shared hooks: `useConfirmModal`, `useModal`, `useGoBack`
- `src/constants/` — Enums and constants
- `src/interfaces/` — All TypeScript type definitions

### SVG Imports

SVGs are loaded via `@svgr/webpack` (configured in `next.config.ts`). Import SVGs as React components:
```typescript
import MyIcon from "@/icons/my-icon.svg";
```

### Path Aliases

`@/*` maps to `src/*` (configured in `tsconfig.json`).
