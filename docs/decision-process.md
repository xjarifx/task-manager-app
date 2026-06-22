# Decision Process

## Tech Stack Choices

### Frontend: Next.js 16 + React 19
- Used Next.js App Router for both frontend and API routes
- Single `page.tsx` with `"use client"` for interactive task management
- Tailwind CSS for styling (already configured in the project)

### Backend: Next.js API Routes
- Single route handler at `/api/tasks/route.ts` handles all CRUD operations
- No separate backend server needed — everything runs in one Next.js process
- Handles GET (list all), POST (create), PUT (update), DELETE (remove)

### Database: Prisma + PostgreSQL
- Prisma as ORM for type-safe database queries
- PostgreSQL for persistent storage
- Schema defines a `Tasks` model with `id`, `title`, `description`, `status`
- `TaskStatus` enum: TODO, IN_PROGRESS, DONE

## What Was Intentionally Left Out

For simplicity, I did not implement:
1. **User authentication** — everyone who accesses the site sees the same shared task list
2. **UUID/time-based ID generation** — auto-incrementing integer IDs are sufficient for this use case
3. **Multi-file/folder architecture** — kept the codebase flat with a single API route and single page component to keep things simple and easy to follow
4. **Pagination or filtering** — the task list is expected to be small; no need for complex query logic
5. **Validation library** — basic input validation is handled inline; no need for zod or similar

## Architecture Overview

```
app/
  page.tsx          # Main UI component (client-side)
  api/tasks/
    route.ts        # API handler for all task CRUD operations
lib/
  prisma.ts         # Prisma client singleton
prisma/
  schema.prisma     # Database schema definition
```

## Key Design Decisions

- **Single API route**: All task operations go through `/api/tasks` with different HTTP methods. This keeps routing simple.
- **Client-side fetching**: The page fetches data from the API using `fetch()`. No hardcoded data — everything comes from the database.
- **Optimistic UI updates**: After each mutation, the full task list is re-fetched to stay in sync with the server.
- **Status groups**: Tasks are grouped by status (In Progress → To Do → Done) in the UI for better visibility.
