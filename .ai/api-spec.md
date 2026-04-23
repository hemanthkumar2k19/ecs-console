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

```
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
- **IDs**: UUID v4 strings
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

**Error Responses**
| Status | Body |
|---|---|
| `401` | `{ "error": "Invalid credentials" }` |
| `422` | `{ "error": "userId and password are required" }` |

> [!NOTE]
> `avatar` is a two-letter initials string used for the UI avatar component.  
> `role` is one of `"admin"` | `"analyst"`.

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
      { "label": "PostgreSQL",  "value": 1, "color": "#FB923C" }
    ]
  },
  "agents": {
    "total": 2,
    "online": 2,
    "offline": 0,
    "trend": 0,
    "breakdown": [
      { "label": "Active",   "value": 2, "color": "#22C55E" },
      { "label": "Degraded", "value": 0, "color": "#F59E0B" },
      { "label": "Offline",  "value": 0, "color": "#EF4444" }
    ]
  },
  "policies": {
    "total": 3,
    "active": 3,
    "draft": 0,
    "trend": 0,
    "breakdown": [
      { "label": "yugabyte_baseline", "value": 1, "color": "#F59E0B" },
      { "label": "nginx_baseline",    "value": 1, "color": "#3B82F6" },
      { "label": "postgres_baseline", "value": 1, "color": "#FB923C" }
    ]
  },
  "rules": {
    "total": 12,
    "active": 12,
    "breakdown": [
      { "label": "Critical", "value": 2, "color": "#EF4444" },
      { "label": "High",     "value": 5, "color": "#F59E0B" },
      { "label": "Medium",   "value": 5, "color": "#3B82F6" }
    ]
  },
  "compliance": {
    "total_checks": 7,
    "compliant": 2,
    "non_compliant": 5,
    "trend": -5,
    "breakdown": [
      { "label": "Compliant",     "value": 2, "color": "#22C55E" },
      { "label": "Non-Compliant", "value": 5, "color": "#EF4444" }
    ]
  }
}
```

---

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

**`type` enum**: `"info"` | `"success"` | `"warning"` | `"danger"`

---

### `GET /api/v1/dashboard/weekly-evidence`

Evidence collection counts per day of the current week (Mon–Sun).

**Response `200 OK`**
```json
[
  { "day": "Mon", "count": 0 },
  { "day": "Tue", "count": 26 },
  { "day": "Wed", "count": 0 },
  { "day": "Thu", "count": 0 },
  { "day": "Fri", "count": 0 },
  { "day": "Sat", "count": 0 },
  { "day": "Sun", "count": 0 }
]
```

---

### `GET /api/v1/dashboard/compliance-timeline`

Per-rule compliance totals across all hosts (for the bar/line chart).

**Response `200 OK`**
```json
[
  { "rule": "tls-enable-check",          "compliant": 0, "non_compliant": 2 },
  { "rule": "max-connections-check",     "compliant": 1, "non_compliant": 0 },
  { "rule": "log-connections-check",     "compliant": 0, "non_compliant": 1 },
  { "rule": "log-disconnections-check",  "compliant": 0, "non_compliant": 1 },
  { "rule": "password-encryption-check", "compliant": 1, "non_compliant": 0 },
  { "rule": "tls-version-check",         "compliant": 0, "non_compliant": 1 }
]
```

---

## 3. Hosts

### `GET /api/v1/hosts`

List all registered hosts.

**Response `200 OK`**
```json
[
  {
    "id": "0c3e9829-a255-4694-8f40-d6375ec98af0",
    "name": "yugabyte-node-01",
    "ip": "10.89.0.10",
    "os_family": "Linux",
    "os_version": "Ubuntu 22.04",
    "env": "dev",
    "project_id": "ps-postgres",
    "type": "yugabyte",
    "created_at": "2026-04-07T10:58:56Z",
    "updated_at": "2026-04-07T10:58:56Z",
    "tags": [
      { "key": "env",      "value": "dev",      "source": "agent" },
      { "key": "database", "value": "yugabyte",  "source": "agent" }
    ]
  }
]
```

**Tag object**
| Field | Type | Description |
|---|---|---|
| `key` | `string` | Tag name |
| `value` | `string` | Tag value |
| `source` | `string` | Origin: `"agent"` | `"manual"` | `"imported"` |

---

### `GET /api/v1/hosts/:id`

Get a single host by UUID.

**Response `200 OK`** — same shape as a single element from the list above.

**Error**: `404 { "error": "Host not found" }`

---

## 4. Agents

### `GET /api/v1/agents`

List all agents.

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
      "host_identifier": "0c3e9829-a255-4694-8f40-d6375ec98af0",
      "is_active": true
    }
  }
]
```

**`status` enum**: `"active"` | `"inactive"` | `"degraded"`

> [!NOTE]
> `osquery_instance` may be `null` if no osquery process is registered for the agent.

---

### `GET /api/v1/agents/:id`

Get a single agent by UUID.

**Response `200 OK`** — same shape as a single element from the list above.

**Error**: `404 { "error": "Agent not found" }`

---

## 5. Policies

### `GET /api/v1/policies`

List all active policy versions.

**Response `200 OK`**
```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567800",
    "name": "yugabyte_baseline",
    "description": "YugaByteDB security & compliance baseline",
    "version": "1.0.0",
    "is_active": true,
    "created_at": "2026-04-07T10:58:19Z",
    "updated_at": "2026-04-07T10:58:19Z",
    "assignment": {
      "key": "database",
      "operator": "=",
      "value": "yugabyte"
    },
    "rules": [
      "tls-enable-check",
      "max-connections-check",
      "log-connections-check",
      "log-disconnections-check",
      "password-encryption-check"
    ]
  }
]
```

**Assignment object** — defines which hosts this policy targets via tag matching:
| Field | Type | Description |
|---|---|---|
| `key` | `string` | Host tag key, e.g. `"database"` |
| `operator` | `string` | `"="` | `"!="` | `"in"` |
| `value` | `string` | Tag value to match |

**`rules`** is an array of rule **name** strings (not IDs).

---

### `GET /api/v1/policies/:id`

Get a single policy by UUID.

**Error**: `404 { "error": "Policy not found" }`

---

## 6. Rules

### `GET /api/v1/rules`

List all rules across all policies.

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
    "policy": "yugabyte_baseline"
  }
]
```

**`severity` enum**: `"critical"` | `"high"` | `"medium"` | `"low"`
**`evaluation_mode` enum**: `"scheduled"` | `"event-driven"`

> [!NOTE]
> `policy` is the **name** of the parent policy, not its ID. The same rule name (e.g. `tls-enable-check`) may appear multiple times if it belongs to multiple policies.

---

### `GET /api/v1/rules?policy={policyName}`

Filter rules by policy name.

**Query Params**
| Param | Type | Required | Description |
|---|---|---|---|
| `policy` | `string` | No | Filter by policy name, e.g. `yugabyte_baseline` |

---

### `GET /api/v1/rules/:id`

Get a single rule by UUID.

**Error**: `404 { "error": "Rule not found" }`

---

## 7. State Snapshots (Compliance Evidence)

### `GET /api/v1/snapshots`

List the latest compliance snapshots (max 100, ordered by `snapshot_time DESC`).

**Response `200 OK`**
```json
[
  {
    "id": "ba50ea50-86e6-4f6a-a51a-46b976461b27",
    "rule_name": "tls-enable-check",
    "host_id": "0c3e9829-a255-4694-8f40-d6375ec98af0",
    "host_name": "yugabyte-node-01",
    "status": "non-compliant",
    "snapshot_time": "2026-04-07T11:03:02Z",
    "received_at": "2026-04-07T11:03:02Z",
    "columns": [
      {
        "name": "ssl",
        "setting": "off",
        "source": "default",
        "category": "Connections and Authentication / SSL",
        "verified_at": "2026-04-07T11:03:02Z"
      }
    ]
  }
]
```

**`status` enum**: `"compliant"` | `"non-compliant"` | `"unknown"`

**Column object**
| Field | Type | Description |
|---|---|---|
| `name` | `string` | Setting/config key name |
| `setting` | `string` | Observed value |
| `source` | `string` | Value origin, e.g. `"default"`, `"configuration file"`, `"nginx_runtime"` |
| `category` | `string` | Grouping label for UI display |
| `verified_at` | `string` | ISO timestamp when this setting was read |

---

### `GET /api/v1/snapshots?host_id={hostId}`

Filter snapshots by host UUID.

**Query Params**
| Param | Type | Required | Description |
|---|---|---|---|
| `host_id` | `string` | No | Filter by host UUID |
| `rule_name` | `string` | No | Filter by rule name |
| `status` | `string` | No | `"compliant"` or `"non-compliant"` |
| `limit` | `integer` | No | Default `100`, max `500` |

---

### `GET /api/v1/snapshots/:id`

Get a single snapshot by UUID.

**Error**: `404 { "error": "Snapshot not found" }`

---

## Implementation Roadmap (Suggested Order)

Implement endpoints in this order so the UI can progressively light up:

| Priority | Endpoint | Reason |
|---|---|---|
| 1 | `GET /hosts` | Core entity, used as FK in agents & snapshots |
| 2 | `GET /agents` | Needed for Agents page |
| 3 | `GET /policies` | Needed for Policies page |
| 4 | `GET /rules` | Needed for Rules page |
| 5 | `GET /snapshots` | Needed for Compliance page |
| 6 | `GET /dashboard/stats` | Aggregation — can derive from above |
| 7 | `GET /dashboard/activity` | Stream / derived events |
| 8 | `GET /dashboard/compliance-timeline` | Chart data |
| 9 | `GET /dashboard/weekly-evidence` | Chart data |
| 10 | `POST /auth/login` | Auth — set last so frontend doesn't break |

---

## OpenAPI Snippet (Minimal)

```yaml
openapi: "3.1.0"
info:
  title: ECS Console API
  version: "1.0.0"
servers:
  - url: "{baseUrl}/api/v1"
    variables:
      baseUrl:
        default: "http://localhost:8080"
paths:
  /hosts:
    get:
      summary: List hosts
      responses:
        "200":
          description: Array of Host objects
  /agents:
    get:
      summary: List agents
      responses:
        "200":
          description: Array of Agent objects
  /policies:
    get:
      summary: List active policies
      responses:
        "200":
          description: Array of Policy objects
  /rules:
    get:
      summary: List rules
      parameters:
        - name: policy
          in: query
          schema:
            type: string
      responses:
        "200":
          description: Array of Rule objects
  /snapshots:
    get:
      summary: List compliance snapshots
      parameters:
        - name: host_id
          in: query
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: Array of StateSnapshot objects
  /dashboard/stats:
    get:
      summary: Dashboard aggregate statistics
      responses:
        "200":
          description: DashboardStats object
  /auth/login:
    post:
      summary: Authenticate user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                userId:
                  type: string
                password:
                  type: string
      responses:
        "200":
          description: AuthUser object
        "401":
          description: Invalid credentials
```
