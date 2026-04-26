# ECS Console — Backend API Specification

> **Purpose**: This document is the authoritative contract between the frontend (`lib/api.ts`) and the backend REST service.  
> Implement these endpoints on your backend and set `NEXT_PUBLIC_API_BASE_URL` in `.env.local` to enable live data.  
> If an endpoint is unavailable or returns a non-2xx response, the frontend automatically falls back to mock data.

---

## Environment Variable

| Variable | Example | Required |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8080` | Optional — omit to use mock data |

---

## Fallback Priority (Two-Tier)

```text
HTTP REST API  (NEXT_PUBLIC_API_BASE_URL is set)
      ↓ on fetch error / 4xx / 5xx
Mock Data      (always available)
```

> [!IMPORTANT]
> The frontend never crashes — it silently falls back to mock data and logs a warning.  
> Implement endpoints incrementally; only set `NEXT_PUBLIC_API_BASE_URL` once an endpoint is ready.

---

## Common Conventions

- **Base URL**: `{NEXT_PUBLIC_API_BASE_URL}/api/v1`
- **Content-Type**: `application/json`
- **Auth**: Bearer token in `Authorization` header (once auth endpoint is live)
- **Timestamps**: ISO 8601 UTC strings, e.g. `"2026-04-07T10:58:56Z"`
- **IDs**: UUID v4 strings, or namespaced string IDs (e.g. `"comp-yugabyte"`)
- **Errors**: `{ "error": "human-readable message" }` with appropriate HTTP status

---

## 1. Auth

### `POST /api/v1/auth/login`

Authenticate a user and return their profile.

**Request Body**
```json
{
  "userId": "admin",
  "password": "admin123"
}
```

**Response `200 OK`**
```json
{
  "userId": "admin",
  "name": "Admin User",
  "role": "admin",
  "email": "admin@ecs.internal",
  "department": "Operations",
  "avatar": "AU",
  "lastLogin": "2025-04-16T08:30:00Z"
}
```

---

## 2. Dashboard

### `GET /api/v1/dashboard/stats`

Aggregate counts for the top-level dashboard cards.

**Response `200 OK`**
```json
{
  "hosts": {
    "total": 2,
    "active": 2,
    "inactive": 0,
    "trend": 0,
    "breakdown": [
      { "label": "YugabyteDB", "value": 1, "color": "#F59E0B" },
      { "label": "PostgreSQL", "value": 1, "color": "#FB923C" }
    ]
  },
  "agents": {
    "total": 2,
    "online": 2,
    "offline": 0,
    "trend": 0,
    "breakdown": [
      { "label": "Active", "value": 2, "color": "#22C55E" }
    ]
  },
  "policies": {
    "total": 3,
    "active": 3,
    "draft": 0,
    "trend": 0,
    "breakdown": [
      { "label": "yugabyte_baseline", "value": 1, "color": "#F59E0B" }
    ]
  },
  "rules": {
    "total": 12,
    "active": 12,
    "breakdown": [
      { "label": "Critical", "value": 2, "color": "#EF4444" }
    ]
  },
  "compliance": {
    "total_checks": 7,
    "compliant": 2,
    "non_compliant": 5,
    "trend": -5,
    "breakdown": [
      { "label": "Compliant", "value": 2, "color": "#22C55E" },
      { "label": "Non-Compliant", "value": 5, "color": "#EF4444" }
    ]
  }
}
```

### `GET /api/v1/dashboard/activity`

Recent compliance events for the activity feed.

**Response `200 OK`**
```json
[
  {
    "time": "11:03",
    "event": "TLS not enabled on nginx",
    "type": "danger",
    "resource": "Host: postgres-node-01 / Rule: tls-enable-check"
  }
]
```

### `GET /api/v1/dashboard/weekly-evidence`

Evidence collection counts per day of the current week (Mon–Sun).

### `GET /api/v1/dashboard/compliance-timeline`

Per-rule compliance totals across all hosts (for the bar/line chart).

---

## 3. Core Infrastructure

### `GET /api/v1/components`
### `GET /api/v1/components/:id`

List supported system components/architectures.

**Response `200 OK`**
```json
[
  {
    "id": "comp-yugabyte",
    "name": "yugabyte",
    "display_name": "YugabyteDB",
    "type": "database",
    "description": "Distributed SQL Database",
    "created_at": "2026-04-07T10:00:00Z",
    "updated_at": "2026-04-07T10:00:00Z"
  }
]
```

### `GET /api/v1/hosts`
### `GET /api/v1/hosts/:id`

List all registered hosts.

**Response `200 OK`**
```json
[
  {
    "id": "0c3e9829-a255-4694-8f40-d6375ec98af0",
    "project_id": "p-customer-portal",
    "component_id": "comp-yugabyte",
    "name": "yugabyte-node-01",
    "ip": "10.89.0.10",
    "os_family": "Linux",
    "os_version": "Ubuntu 22.04",
    "env": "dev",
    "type": "yugabyte",
    "created_at": "2026-04-07T10:58:56Z",
    "updated_at": "2026-04-07T10:58:56Z",
    "tags": [
      { "key": "env", "value": "dev", "source": "agent" },
      { "key": "database", "value": "yugabyte", "source": "agent" }
    ]
  }
]
```

*(Note: The frontend expects backend to eventually implement `POST /api/v1/hosts` and an endpoint to update host tags `PUT /api/v1/hosts/:id/tags`)*

### `GET /api/v1/agents`
### `GET /api/v1/agents/:id`

List all osquery/local agents running on hosts.

**Response `200 OK`**
```json
[
  {
    "id": "1368cc28-ff01-4f64-8545-12b0ba5cd0f2",
    "host_id": "0c3e9829-a255-4694-8f40-d6375ec98af0",
    "host_name": "yugabyte-node-01",
    "status": "active",
    "version": "1.4.2",
    "last_seen": "2026-04-07T11:02:56Z",
    "decommissioned_at": null,
    "created_at": "2026-04-07T10:58:56Z",
    "updated_at": "2026-04-07T11:02:56Z",
    "osquery_instance": {
      "id": "8ab5816f-ae9e-4dce-a7a9-19430722021e",
      "agent_id": "1368cc28-ff01-4f64-8545-12b0ba5cd0f2",
      "host_id": "0c3e9829-a255-4694-8f40-d6375ec98af0",
      "node_key": "node-key-1",
      "host_identifier": "0c3e9829-a255-4694-8f40-d6375ec98af0",
      "is_active": true,
      "created_at": "2026-04-07T10:58:56Z",
      "updated_at": "2026-04-07T11:02:56Z"
    }
  }
]
```

---

## 4. Compliance & Security

### `GET /api/v1/policies`
### `GET /api/v1/policies/:id`

List policy baselines mapping to specific components.

**Response `200 OK`**
```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567800",
    "component_id": "comp-yugabyte",
    "audit_control_id": null,
    "name": "yugabyte_baseline",
    "description": "YugaByteDB security & compliance baseline",
    "severity": "medium",
    "created_by": "admin",
    "updated_by": "admin",
    "created_at": "2026-04-07T10:58:19Z",
    "updated_at": "2026-04-07T10:58:19Z",
    "version": "1.0.0",
    "is_active": true,
    "rules": [
      "b1b2c3d4-e5f6-7890-abcd-ef1234567811",
      "c1b2c3d4-e5f6-7890-abcd-ef1234567812"
    ]
  }
]
```

### `GET /api/v1/rules`
### `GET /api/v1/rules?policy={policyName}`

List individual compliance checks/rules.

**Response `200 OK`**
```json
[
  {
    "id": "b1b2c3d4-e5f6-7890-abcd-ef1234567811",
    "name": "tls-enable-check",
    "description": "Check SSL/TLS enablement",
    "osquery_sql": "SELECT * FROM yugabyte_settings WHERE name = 'ssl'",
    "interval_seconds": 60,
    "evaluation_mode": "scheduled",
    "severity": "high",
    "is_active": true,
    "created_at": "2026-04-07T10:58:19Z",
    "updated_at": "2026-04-07T10:58:19Z",
    "policy": "yugabyte_baseline"
  }
]
```

### `GET /api/v1/snapshots`
### `GET /api/v1/snapshots?host_id={hostId}`

List evidence collection snapshots detailing compliance state for individual rules on hosts.

**Response `200 OK`**
```json
[
  {
    "id": "ba50ea50-86e6-4f6a-a51a-46b976461b27",
    "rule_id": "b1b2c3d4-e5f6-7890-abcd-ef1234567811",
    "rule_name": "tls-enable-check",
    "host_id": "0c3e9829-a255-4694-8f40-d6375ec98af0",
    "host_name": "yugabyte-node-01",
    "columns": [
      {
        "name": "ssl",
        "setting": "off",
        "source": "default",
        "category": "Connections and Authentication / SSL",
        "verified_at": "2026-04-07T11:03:02Z"
      }
    ],
    "snapshot_time": "2026-04-07T11:03:02Z",
    "received_at": "2026-04-07T11:03:02Z",
    "status": "non-compliant"
  }
]
```

---

## 5. Projects & Governance

The following endpoints are documented as available via REST wrapper. They map to internal entities for auditing, ownership mapping, and project associations:

### `GET /api/v1/projects`
List projects tracked for internal audits.

### `GET /api/v1/stakeholders`
List business stakeholders or application owners.

### `GET /api/v1/audits`
List formal compliance audits (e.g., SOC2, ISO 27001).

### `GET /api/v1/audit-controls`
List specific controls required for compliance audits.

### `GET /api/v1/project-audits`
List status and mappings of audits applicable to specific projects.

---

## 6. Metadata & Assignments

The following endpoints expose internal join-tables and metadata tagging for more advanced queries:

### `GET /api/v1/host-tags`
List all tags registered against hosts.

### `GET /api/v1/policy-versions`
List version history of compliance policies.

### `GET /api/v1/policy-rules`
List join table entries mapping policies to rules.

### `GET /api/v1/host-policy-assignments`
List join table entries assigning specific policies to individual hosts.

---

## Implementation Roadmap (Suggested Order)

Implement endpoints in this order so the UI can progressively light up:

| Priority | Endpoint | Reason |
|---|---|---|
| 1 | `GET /components` | Foundation for projects and policies |
| 2 | `GET /hosts` | Core entity, used as FK in agents & snapshots |
| 3 | `GET /agents` | Needed for Agents page |
| 4 | `GET /policies` | Needed for Policies page |
| 5 | `GET /rules` | Needed for Rules page |
| 6 | `GET /snapshots` | Needed for Compliance page |
| 7 | `GET /dashboard/*` | Aggregations — derive from above |
| 8 | `GET /projects`, `GET /audits` | Governance metadata layers |
| 9 | `POST /auth/login` | Auth — set last so frontend doesn't break |

---
