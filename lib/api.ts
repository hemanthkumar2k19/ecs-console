"use server";

import {
  MOCK_USERS,
  MOCK_STATS,
  MOCK_ACTIVITY,
  MOCK_WEEKLY_EVIDENCE,
  MOCK_HOSTS,
  MOCK_AGENTS,
  MOCK_POLICIES,
  MOCK_RULES,
  MOCK_STATE_SNAPSHOTS,
  MOCK_COMPLIANCE_TIMELINE,
} from "./mock";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  userId: string;
  name: string;
  role: string;
  email: string;
  department: string;
  avatar: string;
  lastLogin: string;
}

export interface DashboardStats {
  hosts: typeof MOCK_STATS.hosts;
  agents: typeof MOCK_STATS.agents;
  policies: typeof MOCK_STATS.policies;
  rules: typeof MOCK_STATS.rules;
  compliance: typeof MOCK_STATS.compliance;
}

export interface ActivityItem {
  time: string;
  event: string;
  type: "info" | "success" | "warning" | "danger";
  resource: string;
}

export interface WeeklyEvidencePoint {
  day: string;
  count: number;
}

export type Host = (typeof MOCK_HOSTS)[number];
export type Agent = (typeof MOCK_AGENTS)[number];
export type Policy = (typeof MOCK_POLICIES)[number];
export type Rule = (typeof MOCK_RULES)[number];
export type StateSnapshot = (typeof MOCK_STATE_SNAPSHOTS)[number];
export type CompliancePoint = (typeof MOCK_COMPLIANCE_TIMELINE)[number];

// ─── HTTP API Client ──────────────────────────────────────────────────────────
// Set NEXT_PUBLIC_API_BASE_URL in .env.local to enable live API calls.
// If unset or the request fails, the function falls back to mock data.

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`
  : null;

/**
 * Generic fetch helper. Returns parsed JSON or throws on non-2xx responses.
 */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE) throw new Error("API_BASE not configured");
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(userId: string, password: string): Promise<AuthUser> {
  try {
    return await apiFetch<AuthUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ userId, password }),
    });
  } catch (e) {
    if (API_BASE) console.warn("login: API call failed, falling back to mock", e);
  }

  // Mock fallback
  await new Promise((resolve) => setTimeout(resolve, 800));
  const user = MOCK_USERS.find((u) => u.userId === userId && u.password === password);
  if (!user) throw new Error("Invalid credentials");

  return {
    userId: user.userId,
    name: user.name,
    role: user.role,
    email: user.email,
    department: user.department,
    avatar: user.avatar,
    lastLogin: user.lastLogin,
  };
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    return await apiFetch<DashboardStats>("/dashboard/stats");
  } catch (e) {
    if (API_BASE) console.warn("getDashboardStats: API call failed, falling back to mock", e);
  }
  return MOCK_STATS;
}

export async function getActivityFeed(): Promise<ActivityItem[]> {
  try {
    return await apiFetch<ActivityItem[]>("/dashboard/activity");
  } catch (e) {
    if (API_BASE) console.warn("getActivityFeed: API call failed, falling back to mock", e);
  }
  return MOCK_ACTIVITY as ActivityItem[];
}

export async function getWeeklyEvidence(): Promise<WeeklyEvidencePoint[]> {
  try {
    return await apiFetch<WeeklyEvidencePoint[]>("/dashboard/weekly-evidence");
  } catch (e) {
    if (API_BASE) console.warn("getWeeklyEvidence: API call failed, falling back to mock", e);
  }
  return MOCK_WEEKLY_EVIDENCE;
}

export async function getComplianceTimeline(): Promise<CompliancePoint[]> {
  try {
    return await apiFetch<CompliancePoint[]>("/dashboard/compliance-timeline");
  } catch (e) {
    if (API_BASE) console.warn("getComplianceTimeline: API call failed, falling back to mock", e);
  }
  return MOCK_COMPLIANCE_TIMELINE;
}

// ─── Hosts ────────────────────────────────────────────────────────────────────

export async function getHosts(): Promise<Host[]> {
  try {
    return await apiFetch<Host[]>("/hosts");
  } catch (e) {
    if (API_BASE) console.warn("getHosts: API call failed, falling back to mock", e);
  }
  return MOCK_HOSTS;
}

export async function getHostById(id: string): Promise<Host | undefined> {
  try {
    return await apiFetch<Host>(`/hosts/${id}`);
  } catch (e) {
    if (API_BASE) console.warn(`getHostById(${id}): API call failed, falling back to mock`, e);
  }
  return MOCK_HOSTS.find((h) => h.id === id);
}

// ─── Agents ───────────────────────────────────────────────────────────────────

export async function getAgents(): Promise<Agent[]> {
  try {
    return await apiFetch<Agent[]>("/agents");
  } catch (e) {
    if (API_BASE) console.warn("getAgents: API call failed, falling back to mock", e);
  }
  return MOCK_AGENTS;
}

export async function getAgentById(id: string): Promise<Agent | undefined> {
  try {
    return await apiFetch<Agent>(`/agents/${id}`);
  } catch (e) {
    if (API_BASE) console.warn(`getAgentById(${id}): API call failed, falling back to mock`, e);
  }
  return MOCK_AGENTS.find((a) => a.id === id);
}

// ─── Policies ─────────────────────────────────────────────────────────────────

export async function getPolicies(): Promise<Policy[]> {
  try {
    return await apiFetch<Policy[]>("/policies");
  } catch (e) {
    if (API_BASE) console.warn("getPolicies: API call failed, falling back to mock", e);
  }
  return MOCK_POLICIES;
}

export async function getPolicyById(id: string): Promise<Policy | undefined> {
  try {
    return await apiFetch<Policy>(`/policies/${id}`);
  } catch (e) {
    if (API_BASE) console.warn(`getPolicyById(${id}): API call failed, falling back to mock`, e);
  }
  return MOCK_POLICIES.find((p) => p.id === id);
}

// ─── Rules ────────────────────────────────────────────────────────────────────

export async function getRules(): Promise<Rule[]> {
  try {
    return await apiFetch<Rule[]>("/rules");
  } catch (e) {
    if (API_BASE) console.warn("getRules: API call failed, falling back to mock", e);
  }
  return MOCK_RULES;
}

export async function getRulesByPolicy(policyName: string): Promise<Rule[]> {
  try {
    return await apiFetch<Rule[]>(`/rules?policy=${encodeURIComponent(policyName)}`);
  } catch (e) {
    if (API_BASE) console.warn(`getRulesByPolicy(${policyName}): API call failed, falling back to mock`, e);
  }
  return MOCK_RULES.filter((r) => r.policy === policyName);
}

// ─── State Snapshots (Compliance Results) ─────────────────────────────────────

export async function getStateSnapshots(): Promise<StateSnapshot[]> {
  try {
    return await apiFetch<StateSnapshot[]>("/snapshots");
  } catch (e) {
    if (API_BASE) console.warn("getStateSnapshots: API call failed, falling back to mock", e);
  }
  return MOCK_STATE_SNAPSHOTS;
}

export async function getSnapshotsByHost(hostId: string): Promise<StateSnapshot[]> {
  try {
    return await apiFetch<StateSnapshot[]>(`/snapshots?host_id=${encodeURIComponent(hostId)}`);
  } catch (e) {
    if (API_BASE) console.warn(`getSnapshotsByHost(${hostId}): API call failed, falling back to mock`, e);
  }
  return MOCK_STATE_SNAPSHOTS.filter((s) => s.host_id === hostId);
}
