"use server";

import sql from "./db";
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

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(userId: string, password: string): Promise<AuthUser> {
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
    if (sql) {
      // If DB is configured, we could do complex aggregation here 
      // For this step, we'll try a dummy query as a health check 
      // and if it passes, we return mock stats (or derived stats).
      // A full implementation would calculate `hosts.total`, etc. from SQL.

      const hostsRes = await sql`SELECT count(*) as total FROM hosts`;
      const agentsRes = await sql`SELECT count(*) as total, sum(case when status = 'active' then 1 else 0 end) as online FROM agents`;
      const policiesRes = await sql`SELECT count(*) as total FROM policies`;
      const rulesRes = await sql`SELECT count(*) as total FROM rules`;

      // We overwrite totals with real DB counts but keep mock breakdowns for UI demo
      return {
        ...MOCK_STATS,
        hosts: { ...MOCK_STATS.hosts, total: Number(hostsRes[0].total) },
        agents: { ...MOCK_STATS.agents, total: Number(agentsRes[0].total), online: Number(agentsRes[0].online) },
        policies: { ...MOCK_STATS.policies, total: Number(policiesRes[0].total) },
        rules: { ...MOCK_STATS.rules, total: Number(rulesRes[0].total) },
      };
    }
  } catch (e) {
    console.warn("getDashboardStats: DB query failed, falling back to mock", e);
  }
  return MOCK_STATS;
}

export async function getActivityFeed(): Promise<ActivityItem[]> {
  try {
    if (sql) {
      // Validate connection
      await sql`SELECT 1`;
      return MOCK_ACTIVITY as ActivityItem[];
    }
  } catch (e) {
    console.warn("getActivityFeed: DB query failed, falling back to mock", e);
  }
  return MOCK_ACTIVITY as ActivityItem[];
}

export async function getWeeklyEvidence(): Promise<WeeklyEvidencePoint[]> {
  try {
    if (sql) {
      await sql`SELECT 1`;
      return MOCK_WEEKLY_EVIDENCE;
    }
  } catch (e) {
    console.warn("getWeeklyEvidence: DB query failed, falling back to mock", e);
  }
  return MOCK_WEEKLY_EVIDENCE;
}

export async function getComplianceTimeline(): Promise<CompliancePoint[]> {
  try {
    if (sql) {
      await sql`SELECT 1`;
      return MOCK_COMPLIANCE_TIMELINE;
    }
  } catch (e) {
    console.warn("getComplianceTimeline: DB query failed, falling back to mock", e);
  }
  return MOCK_COMPLIANCE_TIMELINE;
}

// ─── Hosts ────────────────────────────────────────────────────────────────────

export async function getHosts(): Promise<Host[]> {
  try {
    if (sql) {
      const rows = await sql`
        SELECT 
          h.id, h.name, h.ip, h.os_family, h.os_version, h.env, h.project_id, h.type, h.created_at, h.updated_at,
          COALESCE(
            (SELECT json_agg(json_build_object('key', t.key, 'value', t.value, 'source', t.source))
             FROM host_tags t WHERE t.host_id = h.id),
            '[]'::json
          ) as tags
        FROM hosts h
      `;
      // Ensure tags is parsed correctly if driver doesn't return Array
      return rows.map((r: any) => ({
        ...r,
        tags: Array.isArray(r.tags) ? r.tags : [],
        name: r.name || `host-${r.id.substring(0, 6)}`, // fallback if name is empty
      })) as Host[];
    }
  } catch (e) {
    console.warn("getHosts: DB query failed, falling back to mock", e);
  }
  return MOCK_HOSTS;
}

export async function getHostById(id: string): Promise<Host | undefined> {
  const hosts = await getHosts();
  return hosts.find(h => h.id === id);
}

// ─── Agents ───────────────────────────────────────────────────────────────────

export async function getAgents(): Promise<Agent[]> {
  try {
    if (sql) {
      const rows = await sql`
        SELECT 
          a.id, a.host_id, h.name as host_name, a.status, a.version, a.last_seen, a.decommissioned_at, a.created_at, a.updated_at,
          (
            SELECT json_build_object('id', o.id, 'host_identifier', o.host_identifier, 'is_active', o.is_active)
            FROM osquery_instances o WHERE o.agent_id = a.id LIMIT 1
          ) as osquery_instance
        FROM agents a
        LEFT JOIN hosts h ON a.host_id = h.id
      `;
      return rows.map((r: any) => ({
        ...r,
        host_name: r.host_name || `host-${r.host_id.substring(0, 6)}`
      })) as Agent[];
    }
  } catch (e) {
    console.warn("getAgents: DB query failed, falling back to mock", e);
  }
  return MOCK_AGENTS;
}

export async function getAgentById(id: string): Promise<Agent | undefined> {
  const agents = await getAgents();
  return agents.find((a) => a.id === id);
}

// ─── Policies ─────────────────────────────────────────────────────────────────

export async function getPolicies(): Promise<Policy[]> {
  try {
    if (sql) {
      const rows = await sql`
        SELECT 
          p.id, p.name, p.description, p.created_at, p.updated_at,
          pv.version, pv.is_active,
          (
            SELECT json_build_object('key', pa.key, 'operator', pa.operator, 'value', pa.value)
            FROM policy_assignments pa WHERE pa.policy_version_id = pv.id LIMIT 1
          ) as assignment,
          COALESCE(
            (
              SELECT json_agg(r.name)
              FROM policy_rules pr 
              JOIN rules r ON pr.rule_id = r.id
              WHERE pr.policy_version_id = pv.id
            ),
            '[]'::json
          ) as rules
        FROM policies p
        JOIN policy_versions pv ON pv.policy_id = p.id
        WHERE pv.is_active = true
      `;
      return rows as unknown as Policy[];
    }
  } catch (e) {
    console.warn("getPolicies: DB query failed, falling back to mock", e);
  }
  return MOCK_POLICIES;
}

export async function getPolicyById(id: string): Promise<Policy | undefined> {
  const policies = await getPolicies();
  return policies.find((p) => p.id === id);
}

// ─── Rules ────────────────────────────────────────────────────────────────────

export async function getRules(): Promise<Rule[]> {
  try {
    if (sql) {
      const rows = await sql`
        SELECT 
          r.id, r.name, r.description, r.osquery_sql, r.interval_seconds, r.evaluation_mode, r.severity, r.is_active, r.created_at, r.updated_at,
          p.name as policy
        FROM rules r
        JOIN policy_rules pr ON pr.rule_id = r.id
        JOIN policy_versions pv ON pr.policy_version_id = pv.id
        JOIN policies p ON pv.policy_id = p.id
      `;
      return rows as unknown as Rule[];
    }
  } catch (e) {
    console.warn("getRules: DB query failed, falling back to mock", e);
  }
  return MOCK_RULES;
}

export async function getRulesByPolicy(policyName: string): Promise<Rule[]> {
  const rules = await getRules();
  return rules.filter((r) => r.policy === policyName);
}

// ─── State Snapshots (Compliance Results) ─────────────────────────────────────

export async function getStateSnapshots(): Promise<StateSnapshot[]> {
  try {
    if (sql) {
      const rows = await sql`
        SELECT 
          s.id, s.rule_name, s.host_id, h.name as host_name, s.columns, s.snapshot_time, s.received_at
        FROM state_snapshots s
        LEFT JOIN hosts h ON s.host_id = h.id
        ORDER BY s.snapshot_time DESC
        LIMIT 100
      `;

      // Determine compliance in JS as a simplified mock
      // This maps to what the DB gives and assigns mock compliance.
      return rows.map((r: any) => {
        const col = (r.columns || [])[0];
        // Naive mock logic: if value is 300 or scram-sha-256 it's compliant 
        let status = "non-compliant";
        if (col && (col.setting === "300" || col.setting === "scram-sha-256" || col.setting === "on")) {
          status = "compliant";
        }

        return {
          ...r,
          host_name: r.host_name || `host-${r.host_id.substring(0, 6)}`,
          status
        };
      }) as StateSnapshot[];
    }
  } catch (e) {
    console.warn("getStateSnapshots: DB query failed, falling back to mock", e);
  }
  return MOCK_STATE_SNAPSHOTS;
}

export async function getSnapshotsByHost(
  hostId: string
): Promise<StateSnapshot[]> {
  const snaps = await getStateSnapshots();
  return snaps.filter((s) => s.host_id === hostId);
}
