# CloudRMM - Multi-Tenant Cloud-Native RMM Platform

A modern, cloud-native Remote Monitoring and Management (RMM) platform built with Next.js, Node.js, and Go.

## Architecture Overview

CloudRMM is built as a monorepo using Turborepo, with the following structure:

### Multi-Tenancy Hierarchy
```
Platform
  └── Partners (MSPs)
       └── Organizations (Customers)
            └── Sites (Locations)
                 └── Devices (Agents)
```

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend API**: Node.js with Fastify
- **Agent Gateway**: Node.js with Fastify + WebSocket
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Queue**: Redis, BullMQ (planned)
- **Message Broker**: NATS (planned)
- **Auth**: Clerk
- **Agent**: Go (to be implemented)

## Project Structure

```
rmm/
├── apps/
│   ├── web/                 # Next.js frontend application
│   ├── api/                 # Fastify REST API server
│   ├── agent-gateway/       # WebSocket gateway for agents
│   └── agent/               # Go agent (to be implemented)
├── packages/
│   ├── db/                  # Prisma schema and database client
│   ├── ui/                  # Shared React UI components
│   ├── types/               # Shared TypeScript types
│   ├── utils/               # Shared utility functions
│   ├── tsconfig/            # Shared TypeScript configurations
│   └── eslint-config/       # Shared ESLint configurations
└── infrastructure/
    ├── docker/              # Docker configurations
    ├── kubernetes/          # Kubernetes manifests (planned)
    └── terraform/           # Terraform IaC (planned)
```

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- PostgreSQL 16+
- Redis 7+
- NATS 2+ (optional for development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rmm
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the infrastructure (PostgreSQL, Redis, NATS):
```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

5. Set up the database:
```bash
cd packages/db
pnpm db:push
pnpm db:seed
```

6. Generate Prisma client:
```bash
cd packages/db
pnpm db:generate
```

### Development

Start all applications in development mode:
```bash
pnpm dev
```

Or start individual applications:

```bash
# Web frontend (http://localhost:3000)
cd apps/web
pnpm dev

# API server (http://localhost:3001)
cd apps/api
pnpm dev

# Agent Gateway (ws://localhost:3002)
cd apps/agent-gateway
pnpm dev
```

### Building for Production

Build all packages and applications:
```bash
pnpm build
```

### Available Scripts

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all packages and apps
- `pnpm lint` - Lint all packages and apps
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Run TypeScript type checking
- `pnpm clean` - Remove all build artifacts and node_modules

## Applications

### Web App (`apps/web`)

Next.js 15 application with App Router, providing the user interface for the RMM platform.

- **URL**: http://localhost:3000
- **Features**:
  - Multi-tenant dashboard
  - Device management
  - User authentication with Clerk
  - Responsive UI with Tailwind CSS

### API Server (`apps/api`)

Fastify-based REST API providing backend services.

- **URL**: http://localhost:3001
- **Docs**: http://localhost:3001/docs (Swagger UI)
- **Features**:
  - RESTful API with OpenAPI documentation
  - Multi-tenant data isolation
  - JWT authentication (planned)

### Agent Gateway (`apps/agent-gateway`)

WebSocket gateway for managing persistent connections with agents.

- **URL**: ws://localhost:3002
- **WebSocket Endpoint**: ws://localhost:3002/agent/connect
- **Features**:
  - WebSocket communication with agents
  - Real-time command execution
  - Connection management

## Packages

### Database (`packages/db`)

Prisma schema and client for PostgreSQL database.

**Key Scripts**:
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema changes to database
- `pnpm db:migrate` - Create and apply migrations
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:seed` - Seed database with demo data

**Core Models**:
- Partners (MSPs)
- Organizations (Customers)
- Sites (Locations)
- Devices (Endpoints)
- Users & Roles
- Audit Logs

### UI Components (`packages/ui`)

Shared React components built with Tailwind CSS, inspired by shadcn/ui.

### Types (`packages/types`)

Shared TypeScript type definitions used across the monorepo.

### Utils (`packages/utils`)

Shared utility functions and helpers.

## Database Schema

The database uses a multi-tenant architecture with the following core entities:

- **Partner**: MSP accounts with branding and billing
- **Organization**: Customer tenants (isolated data per org)
- **Site**: Physical locations within organizations
- **Device**: Endpoints with agents installed
- **User**: Platform users with role-based access
- **Role**: Permission sets scoped to different levels
- **AuditLog**: Compliance and activity tracking

See `packages/db/prisma/schema.prisma` for the complete schema.

## Environment Variables

Key environment variables (see `.env.example` for complete list):

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cloudrmm"

# Redis
REDIS_URL="redis://localhost:6379"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
CLERK_SECRET_KEY="..."

# API Configuration
API_URL="http://localhost:3001"
AGENT_GATEWAY_URL="ws://localhost:3002"
```

## Development Workflow

1. Create a new feature branch
2. Make your changes in the relevant package/app
3. Run `pnpm lint` and `pnpm type-check` to ensure code quality
4. Test your changes locally
5. Create a pull request

## Roadmap

### Phase 1: Foundation ✅
- [x] Project scaffolding (Turborepo monorepo)
- [x] Database schema and models
- [x] Basic Next.js frontend
- [x] Fastify API server
- [x] WebSocket gateway
- [ ] Authentication system with multi-tenant context
- [ ] Basic CRUD for Partners, Organizations, Sites

### Phase 2: Agent & Connectivity
- [ ] Go agent implementation
- [ ] Agent registration flow
- [ ] WebSocket communication protocol
- [ ] Basic command execution (ping, sysinfo)
- [ ] Device list in frontend

### Phase 3: Core RMM Features
- [ ] System monitoring and metrics
- [ ] Alert rules and notifications
- [ ] Remote terminal
- [ ] Script execution
- [ ] Software inventory

### Phase 4: Advanced Features
- [ ] Patch management
- [ ] Policy engine
- [ ] Reporting system
- [ ] Billing integration (Stripe)

## Contributing

Please read the [PROJECT_SPEC.md](./PROJECT_SPEC.md) for detailed requirements and architecture decisions.

## License

Proprietary - All rights reserved
