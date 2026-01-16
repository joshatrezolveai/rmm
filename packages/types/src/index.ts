// Core entity types for CloudRMM

export interface Partner {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  primaryColor?: string;
  customDomain?: string;
  billingEmail: string;
  status: 'active' | 'suspended' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Organization {
  id: string;
  partnerId: string;
  name: string;
  slug: string;
  status: 'active' | 'suspended' | 'inactive';
  billingPlan?: string;
  contactEmail: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Site {
  id: string;
  organizationId: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  timezone?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Device {
  id: string;
  siteId: string;
  organizationId: string;
  hostname: string;
  ipAddress?: string;
  macAddress?: string;
  os: string;
  osVersion: string;
  agentVersion: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  lastSeenAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: 'active' | 'suspended' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export type RoleScope = 'platform' | 'partner' | 'organization' | 'site';

export interface Role {
  id: string;
  name: string;
  scope: RoleScope;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  scopeType: RoleScope;
  scopeId: string; // partnerId, orgId, or siteId depending on scope
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
