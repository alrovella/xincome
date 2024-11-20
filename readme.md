# Web Application

This project is a modern web application built using **Next.js** in a monorepo structure with **Turborepo**. It features a **PostgreSQL** database managed through **Prisma** and utilizes **shadcn** for the UI components.

## Features

- **Next.js** for server-side rendering and static site generation.
- **Turborepo** for efficient monorepo management.
- **PostgreSQL** database with **Prisma** ORM for database interactions.
- **shadcn** for UI components.
- **TailwindCSS** for styling.
- **React Query** for state management and server-side data fetching.
- **Zustand** for client-side state management.
- Integration with third-party services such as **MercadoPago** for payments and **Clerk** for authentication.
- Optimized for developer experience with **TypeScript** and **ESLint**.

## Tech Stack

- **Framework**: Next.js
- **Monorepo Management**: Turborepo
- **Database**: PostgreSQL with Prisma
- **Styling**: TailwindCSS, shadcn UI
- **Authentication**: Clerk
- **Payment Gateway**: MercadoPago
- **State Management**: React Query, Zustand
- **Forms**: React Hook Form with Zod validation

## Setup

### Prerequisites
- Node.js (>= 18)
- PostgreSQL (configured and running)

### Installation

# 1. Clone the repository
git clone <repository-url>
cd <repository-root>

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create a `.env` file with the following content:
"DATABASE_URL=postgresql://user:password@localhost:5432/database_name" > .env

# 4. Run database migrations
npx prisma migrate dev

# 5. Start the development server
npm run dev
# App will run at: http://localhost:3000

# Production Build and Start:
# Build the application
npm run build

# Start the application in production mode
npm run start

# Lint the codebase
npm run lint

# Turborepo Structure:
# - `apps/web`: Main web application.
# - `packages/ui`: Shared UI components.
# - `packages/database`: Database and Prisma schema.
# - `packages/eslint-config`: Shared ESLint configuration.
# - `packages/typescript-config`: Shared TypeScript configuration.

# Troubleshooting:
# - Ensure PostgreSQL is running and the `DATABASE_URL` in `.env` is correct.
# - If issues persist with `@repo/*` packages, verify their linkage in the monorepo.

# Contribution:
# Fork the repository and submit a pull request.

# License:
# This project is under the MIT License.