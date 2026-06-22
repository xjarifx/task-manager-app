# Task Manager

A simple full-stack task manager built with Next.js, React, Prisma, and PostgreSQL.

## Features

- Add tasks with a title, description, and status
- View all tasks grouped by status
- Update task status (To Do, In Progress, Done)
- Edit task title and description
- Delete tasks

## Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g. [Neon](https://neon.tech), Railway, or local)

## Setup

1. Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd task-manager-app
npm install
```

2. Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` and set your `DATABASE_URL`:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
```

3. Generate the Prisma client and push the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

4. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma db push` | Push schema changes to database |
| `npx prisma migrate dev` | Create and apply migrations |

## Architecture

See [docs/decision-process.md](docs/decision-process.md) for tech stack decisions and what was intentionally left out.
