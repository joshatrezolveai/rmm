
---

```markdown
# Project: CloudRMM - Multi-Tenant Cloud-Native RMM Platform

Build a cloud-native, multi-tenant Remote Monitoring and Management (RMM) platform.

## Architecture Overview

### Multi-Tenancy Model
- **Platform Level**: Global platform administration
- **MSP/Partner Level**: Managed service providers with their own branding
- **Organization Level**: End-customer organizations (tenants)
- **Site Level**: Physical locations within organizations
- **Device Level**: Individual endpoints (agents)

### Tech Stack
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend API**: Node.js with Fastify OR Go (for performance-critical services)
- **Real-time**: WebSockets via Socket.io or native WS for agent communication
- **Database**: PostgreSQL with row-level security for tenant isolation
- **Cache/Queue**: Redis for caching, BullMQ for job queues
- **Agent Communication**: NATS or RabbitMQ for message broker
- **Infrastructure**: Docker, Kubernetes-ready, Terraform configs
- **Auth**: Clerk or NextAuth with multi-tenant RBAC

## Core Data Models

### Tenant Hierarchy
```
Platform
  └── Partners (MSPs)
       └── Organizations (Customers)
            └── Sites (Locations)
                 └── Devices (Agents)
```

### Key Entities
- **Partner**: MSP account with billing, branding, user management
- **Organization**: Customer tenant with isolated data
- **Site**: Logical grouping (office, datacenter, etc.)
- **Device**: Endpoint with agent installed
- **User**: Platform users with role assignments at various scopes
- **Policy**: Configuration policies (monitoring, patching, scripts)
- **Alert**: Generated alerts from monitoring rules
- **Task**: Scheduled or ad-hoc tasks (scripts, patches, commands)

## Database Schema Requirements

Use PostgreSQL with:
- Row-level security (RLS) policies for tenant isolation
- Separate schemas per major tenant OR shared tables with tenant_id
- Audit logging on all sensitive operations
- Soft deletes with deleted_at timestamps

### Critical Tables
```sql
-- Core hierarchy
partners, organizations, sites, devices

-- Users & access
users, roles, permissions, user_role_assignments (polymorphic scope)

-- Monitoring
monitors, alert_rules, alerts, alert_history

-- Automation
scripts, script_categories, tasks, task_results

-- Patch management
patches, patch_policies, patch_deployments, patch_status

-- Asset inventory
device_software, device_hardware, device_network_interfaces

-- Audit & compliance
audit_logs, compliance_checks, compliance_results
```

## API Structure

RESTful API with OpenAPI spec:
```
/api/v1/
  /auth/...
  /partners/
    /:partnerId/organizations/
      /:orgId/sites/
        /:siteId/devices/
  /devices/:deviceId/
    /terminal (WebSocket upgrade)
    /tasks
    /patches
    /software
    /alerts
  /policies/
  /scripts/
  /alerts/
  /reports/
```

## Agent Requirements

Build a lightweight, cross-platform agent in Go or Rust:

### Agent Capabilities
- Secure registration with one-time tokens
- Persistent WebSocket connection with reconnection logic
- System info collection (CPU, RAM, disk, network, OS details)
- Software inventory scanning
- Real-time shell/PowerShell/bash execution
- Script execution with output streaming
- Patch scanning and installation (Windows Update API, apt, yum)
- File transfer (upload/download)
- Service management
- Event log forwarding
- Heartbeat with configurable interval

### Agent Security
- Certificate pinning
- Signed binaries
- Encrypted local config storage
- Tamper detection

## Feature Modules

### 1. Dashboard & Overview
- Global dashboard (partner-level aggregations)
- Organization dashboard
- Device health summary
- Active alerts widget
- Recent activity feed
- Quick actions

### 2. Device Management
- Device list with filtering, search, sorting
- Device details page (specs, software, patches, alerts, history)
- Bulk actions (run script, restart, assign policy)
- Device grouping via tags and dynamic groups
- Remote terminal (WebSocket-based shell)

### 3. Monitoring & Alerting
- Built-in monitors (CPU, RAM, disk, service status, process)
- Custom script-based monitors
- Alert rules with severity levels
- Notification channels (email, Slack, webhook, PagerDuty)
- Alert escalation policies
- Maintenance windows

### 4. Patch Management
- Patch scanning schedules
- Patch approval workflows
- Patch policies (auto-approve, delay, exclude)
- Deployment windows
- Compliance reporting

### 5. Scripting & Automation
- Script library (PowerShell, Bash, Python)
- Script editor with syntax highlighting
- Script scheduling (cron-like)
- Script output logging
- Community script sharing (optional)

### 6. Policies
- Monitoring policies
- Patch policies  
- Script policies (scheduled tasks)
- Policy inheritance (Partner → Org → Site → Device)
- Policy overrides

### 7. Reporting
- Scheduled reports (PDF/CSV export)
- Executive summary reports
- Compliance reports
- Patch status reports
- Asset inventory reports

### 8. Administration
- User management with SSO support
- Role-based access control
- API key management
- Webhook configurations
- White-labeling (logo, colors, custom domain)
- Billing integration (Stripe) with usage-based pricing

## Real-Time Architecture

```
[Agent] <--WSS--> [Agent Gateway Service] <--NATS--> [API Services]
                         |
                         v
                  [Redis PubSub] <--> [Frontend WebSocket]
```

- Agent Gateway: Handles thousands of persistent agent connections
- NATS/RabbitMQ: Distributes commands to correct gateway instance
- Redis PubSub: Pushes real-time updates to frontend dashboards

## Security Requirements

- All API endpoints require authentication
- Tenant isolation enforced at database level (RLS)
- Rate limiting per tenant
- Input validation and sanitization
- Audit logging for compliance
- Secrets management (Vault or cloud KMS)
- SOC 2 compliance considerations

## Initial Implementation Phases

### Phase 1: Foundation
1. Project scaffolding (monorepo with Turborepo)
2. Database schema and migrations
3. Authentication system with multi-tenant context
4. Basic CRUD for Partners, Organizations, Sites
5. User management and RBAC

### Phase 2: Agent & Connectivity  
1. Agent scaffolding (Go)
2. Agent registration flow
3. WebSocket gateway service
4. Basic command execution (ping, sysinfo)
5. Device list in frontend

### Phase 3: Core RMM Features
1. System monitoring and metrics collection
2. Alert rules and notifications
3. Remote terminal
4. Script execution
5. Software inventory

### Phase 4: Advanced Features
1. Patch management
2. Policy engine
3. Reporting
4. Billing integration

## File Structure

```
/apps
  /web                 # Next.js frontend
  /api                 # Fastify/Node API
  /agent-gateway       # WebSocket gateway service
  /agent               # Go agent source
/packages
  /db                  # Prisma schema, migrations
  /ui                  # Shared React components
  /types               # Shared TypeScript types
  /utils               # Shared utilities
/infrastructure
  /docker
  /kubernetes
  /terraform
```

## Start With

Begin by setting up:
1. Turborepo monorepo structure
2. PostgreSQL with the core schema (partners, orgs, sites, devices, users)
3. Next.js app with authentication (Clerk)
4. Basic API with tenant-aware middleware
5. Simple dashboard showing the hierarchy

Let's start with Phase 1, Step 1: Set up the monorepo structure with all the necessary 
configurations, then we'll implement the database schema.
```

---
