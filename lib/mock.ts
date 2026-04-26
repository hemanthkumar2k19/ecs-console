// ─── Auth ───────────────────────────────────────────────────────────────────

export const MOCK_USERS = [
  {
    id: "admin",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    email: "admin@ecs.internal",
    department: "Operations",
    avatar: "AU",
    last_login: "2025-04-16T08:30:00Z",
  },
  {
    id: "analyst01",
    password: "analyst123",
    name: "Evidence Analyst",
    role: "analyst",
    email: "analyst01@ecs.internal",
    department: "Forensics",
    avatar: "EA",
    last_login: "2025-04-15T14:20:00Z",
  },
  {
    id: "sarah.j",
    password: "password123",
    name: "Sarah Jenkins",
    role: "stakeholder",
    email: "sarah.j@enterprise.com",
    department: "Management",
    avatar: "SJ",
    last_login: "2026-04-20T10:15:00Z",
  },
  {
    id: "m.chen",
    password: "password123",
    name: "Michael Chen",
    role: "stakeholder",
    email: "m.chen@fintech-solutions.io",
    department: "Finance",
    avatar: "MC",
    last_login: "2026-04-19T09:45:00Z",
  },
];

// ─── Components ─────────────────────────────────────────────────────────────

export const MOCK_COMPONENTS = [
  {
    id: "comp-yugabyte",
    name: "yugabyte",
    display_name: "YugabyteDB",
    type: "database",
    description: "Distributed SQL Database",
    created_at: "2026-04-07T10:00:00Z",
    updated_at: "2026-04-07T10:00:00Z",
  },
  {
    id: "comp-postgres",
    name: "postgres",
    display_name: "PostgreSQL",
    type: "database",
    description: "Relational Database",
    created_at: "2026-04-07T10:00:00Z",
    updated_at: "2026-04-07T10:00:00Z",
  },
  {
    id: "comp-nginx",
    name: "nginx",
    display_name: "Nginx Web Server",
    type: "webserver",
    description: "Web Server and Reverse Proxy",
    created_at: "2026-04-07T10:00:00Z",
    updated_at: "2026-04-07T10:00:00Z",
  },
  {
    id: "comp-aerospike",
    name: "aerospike",
    display_name: "Aerospike",
    type: "database",
    description: "Real-time NoSQL Data Platform",
    created_at: "2026-04-07T10:00:00Z",
    updated_at: "2026-04-07T10:00:00Z",
  },
  {
    id: "comp-jenkins",
    name: "jenkins",
    display_name: "Jenkins",
    type: "ci-cd",
    description: "Automation Server",
    created_at: "2026-04-07T10:00:00Z",
    updated_at: "2026-04-07T10:00:00Z",
  },
  {
    id: "comp-sql",
    name: "sql",
    display_name: "Cloud SQL",
    type: "database",
    description: "Fully Managed Relational Database Service",
    created_at: "2026-04-07T10:00:00Z",
    updated_at: "2026-04-07T10:00:00Z",
  },
  {
    id: "comp-pubsub",
    name: "pubsub",
    display_name: "Pub/Sub",
    type: "messaging",
    description: "Asynchronous Messaging Service",
    created_at: "2026-04-07T10:00:00Z",
    updated_at: "2026-04-07T10:00:00Z",
  },
  {
    id: "comp-storage",
    name: "storage",
    display_name: "Cloud Storage",
    type: "storage",
    description: "Object Storage Service",
    created_at: "2026-04-07T10:00:00Z",
    updated_at: "2026-04-07T10:00:00Z",
  },
];

// ─── Hosts ───────────────────────────────────────────────────────────────────

export const MOCK_HOSTS = [
  {
    id: "0c3e9829-a255-4694-8f40-d6375ec98af0",
    project_id: "p-customer-portal",
    component_id: "comp-yugabyte",
    name: "yugabyte-node-01",
    ip: "10.89.0.10",
    os_family: "Linux",
    os_version: "Ubuntu 22.04",
    env: "dev",
    type: "yugabyte",
    created_at: "2026-04-07T10:58:56Z",
    updated_at: "2026-04-07T10:58:56Z",
    tags: [
      { key: "env", value: "dev", source: "agent" },
      { key: "database", value: "yugabyte", source: "agent" },
    ],
  },
  {
    id: "e178ffcd-9084-48a4-9cdb-4a5fe6ddd678",
    project_id: "p-billing-core",
    component_id: "comp-postgres",
    name: "postgres-node-01",
    ip: "10.89.0.16",
    os_family: "Linux",
    os_version: "Debian 13",
    env: "dev",
    type: "postgres",
    created_at: "2026-04-07T10:59:15Z",
    updated_at: "2026-04-07T10:59:15Z",
    tags: [
      { key: "env", value: "dev", source: "agent" },
      { key: "service", value: "nginx", source: "agent" },
    ],
  },
];

// ─── Agents ──────────────────────────────────────────────────────────────────

export const MOCK_AGENTS = [
  {
    id: "1368cc28-ff01-4f64-8545-12b0ba5cd0f2",
    host_id: "0c3e9829-a255-4694-8f40-d6375ec98af0",
    host_name: "yugabyte-node-01",
    status: "active",
    version: "1.4.2",
    last_seen: "2026-04-07T11:02:56Z",
    decommissioned_at: null,
    created_at: "2026-04-07T10:58:56Z",
    updated_at: "2026-04-07T11:02:56Z",
    osquery_instance: {
      id: "8ab5816f-ae9e-4dce-a7a9-19430722021e",
      agent_id: "1368cc28-ff01-4f64-8545-12b0ba5cd0f2",
      host_id: "0c3e9829-a255-4694-8f40-d6375ec98af0",
      node_key: "node-key-1",
      host_identifier: "0c3e9829-a255-4694-8f40-d6375ec98af0",
      is_active: true,
      created_at: "2026-04-07T10:58:56Z",
      updated_at: "2026-04-07T11:02:56Z",
    },
  },
  {
    id: "399619d2-e2bd-4d20-b015-dc07bf42bac6",
    host_id: "e178ffcd-9084-48a4-9cdb-4a5fe6ddd678",
    host_name: "postgres-node-01",
    status: "active",
    version: "1.4.2",
    last_seen: "2026-04-07T11:03:15Z",
    decommissioned_at: null,
    created_at: "2026-04-07T10:59:15Z",
    updated_at: "2026-04-07T11:03:15Z",
    osquery_instance: {
      id: "d33a3fb3-9886-435c-a3a0-e342961d732d",
      agent_id: "399619d2-e2bd-4d20-b015-dc07bf42bac6",
      host_id: "e178ffcd-9084-48a4-9cdb-4a5fe6ddd678",
      node_key: "node-key-2",
      host_identifier: "e178ffcd-9084-48a4-9cdb-4a5fe6ddd678",
      is_active: true,
      created_at: "2026-04-07T10:59:15Z",
      updated_at: "2026-04-07T11:03:15Z",
    },
  },
];

// ─── Rules ───────────────────────────────────────────────────────────────────

export const MOCK_RULES = [
  // yugabyte_baseline rules
  {
    id: "b1b2c3d4-e5f6-7890-abcd-ef1234567811",
    name: "tls-enable-check",
    description: "Check SSL/TLS enablement",
    osquery_sql: "SELECT * FROM yugabyte_settings WHERE name = 'ssl'",
    interval_seconds: 60,
    evaluation_mode: "scheduled",
    severity: "high",
    is_active: true,
    created_at: "2026-04-07T10:58:19Z",
    updated_at: "2026-04-07T10:58:19Z",
    policy: "yugabyte_baseline",
  },
  {
    id: "c1b2c3d4-e5f6-7890-abcd-ef1234567812",
    name: "max-connections-check",
    description: "Check max_connections",
    osquery_sql: "SELECT * FROM yugabyte_settings WHERE name = 'max_connections'",
    interval_seconds: 60,
    evaluation_mode: "scheduled",
    severity: "medium",
    is_active: true,
    created_at: "2026-04-07T10:58:19Z",
    updated_at: "2026-04-07T10:58:19Z",
    policy: "yugabyte_baseline",
  },
  {
    id: "d1b2c3d4-e5f6-7890-abcd-ef1234567813",
    name: "log-connections-check",
    description: "Ensure client connections are logged for audit",
    osquery_sql: "SELECT * FROM yugabyte_settings WHERE name = 'log_connections'",
    interval_seconds: 60,
    evaluation_mode: "scheduled",
    severity: "high",
    is_active: true,
    created_at: "2026-04-07T10:58:19Z",
    updated_at: "2026-04-07T10:58:19Z",
    policy: "yugabyte_baseline",
  },
  {
    id: "e1b2c3d4-e5f6-7890-abcd-ef1234567814",
    name: "log-disconnections-check",
    description: "Ensure client disconnections are logged for audit",
    osquery_sql: "SELECT * FROM yugabyte_settings WHERE name = 'log_disconnections'",
    interval_seconds: 60,
    evaluation_mode: "scheduled",
    severity: "medium",
    is_active: true,
    created_at: "2026-04-07T10:58:19Z",
    updated_at: "2026-04-07T10:58:19Z",
    policy: "yugabyte_baseline",
  },
  {
    id: "f1b2c3d4-e5f6-7890-abcd-ef1234567815",
    name: "password-encryption-check",
    description: "Check password encryption",
    osquery_sql: "SELECT * FROM yugabyte_settings WHERE name = 'password_encryption'",
    interval_seconds: 300,
    evaluation_mode: "scheduled",
    severity: "critical",
    is_active: true,
    created_at: "2026-04-07T10:58:19Z",
    updated_at: "2026-04-07T10:58:19Z",
    policy: "yugabyte_baseline",
  },
  // nginx_baseline rules
  {
    id: "b1b2c3d4-e5f6-7890-abcd-ef1234567821",
    name: "tls-enable-check",
    description: "Check TLS is enabled",
    osquery_sql: "SELECT * FROM nginx_settings WHERE name = 'tls-enabled'",
    interval_seconds: 60,
    evaluation_mode: "scheduled",
    severity: "high",
    is_active: true,
    created_at: "2026-04-07T10:58:19Z",
    updated_at: "2026-04-07T10:58:19Z",
    policy: "nginx_baseline",
  },
  {
    id: "c1b2c3d4-e5f6-7890-abcd-ef1234567822",
    name: "tls-version-check",
    description: "Check TLS version",
    osquery_sql: "SELECT * FROM nginx_settings WHERE name = 'tls-version'",
    interval_seconds: 60,
    evaluation_mode: "scheduled",
    severity: "medium",
    is_active: true,
    created_at: "2026-04-07T10:58:19Z",
    updated_at: "2026-04-07T10:58:19Z",
    policy: "nginx_baseline",
  },
  // postgres_baseline rules
  {
    id: "b1b2c3d4-e5f6-7890-abcd-ef1234567891",
    name: "tls-enable-check",
    description: "Verify SSL/TLS is enabled",
    osquery_sql: "SELECT * FROM postgres_settings WHERE name = 'ssl'",
    interval_seconds: 60,
    evaluation_mode: "scheduled",
    severity: "high",
    is_active: true,
    created_at: "2026-04-07T10:58:19Z",
    updated_at: "2026-04-07T10:58:19Z",
    policy: "postgres_baseline",
  },
  {
    id: "c1b2c3d4-e5f6-7890-abcd-ef1234567892",
    name: "max-connections-check",
    description: "Check max_connections",
    osquery_sql: "SELECT * FROM postgres_settings WHERE name = 'max_connections'",
    interval_seconds: 60,
    evaluation_mode: "scheduled",
    severity: "medium",
    is_active: true,
    created_at: "2026-04-07T10:58:19Z",
    updated_at: "2026-04-07T10:58:19Z",
    policy: "postgres_baseline",
  },
  {
    id: "d1b2c3d4-e5f6-7890-abcd-ef1234567893",
    name: "log-connections-check",
    description: "Ensure client connections are logged for audit",
    osquery_sql: "SELECT * FROM postgres_settings WHERE name = 'log_connections'",
    interval_seconds: 60,
    evaluation_mode: "scheduled",
    severity: "high",
    is_active: true,
    created_at: "2026-04-07T10:58:19Z",
    updated_at: "2026-04-07T10:58:19Z",
    policy: "postgres_baseline",
  },
  {
    id: "e1b2c3d4-e5f6-7890-abcd-ef1234567894",
    name: "log-disconnections-check",
    description: "Ensure client disconnections are logged for audit",
    osquery_sql: "SELECT * FROM postgres_settings WHERE name = 'log_disconnections'",
    interval_seconds: 60,
    evaluation_mode: "scheduled",
    severity: "medium",
    is_active: true,
    created_at: "2026-04-07T10:58:19Z",
    updated_at: "2026-04-07T10:58:19Z",
    policy: "postgres_baseline",
  },
  {
    id: "f1b2c3d4-e5f6-7890-abcd-ef1234567895",
    name: "password-encryption-check",
    description: "Check password encryption",
    osquery_sql: "SELECT * FROM postgres_settings WHERE name = 'password_encryption'",
    interval_seconds: 300,
    evaluation_mode: "scheduled",
    severity: "critical",
    is_active: true,
    created_at: "2026-04-07T10:58:19Z",
    updated_at: "2026-04-07T10:58:19Z",
    policy: "postgres_baseline",
  },
];

// ─── Policies ─────────────────────────────────────────────────────────────────

export const MOCK_POLICIES = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567800",
    component_id: "comp-yugabyte",
    audit_control_id: null,
    name: "yugabyte_baseline",
    description: "YugaByteDB security & compliance baseline",
    severity: "medium",
    created_by: "admin",
    updated_by: "admin",
    created_at: "2026-04-07T10:58:19Z",
    updated_at: "2026-04-07T10:58:19Z",
    version: "1.0.0",
    is_active: true,
    rules: [
      "b1b2c3d4-e5f6-7890-abcd-ef1234567811",
      "c1b2c3d4-e5f6-7890-abcd-ef1234567812",
      "d1b2c3d4-e5f6-7890-abcd-ef1234567813",
      "e1b2c3d4-e5f6-7890-abcd-ef1234567814",
      "f1b2c3d4-e5f6-7890-abcd-ef1234567815",
    ],
  },
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567820",
    component_id: "comp-nginx",
    audit_control_id: null,
    name: "nginx_baseline",
    description: "Nginx security & compliance baseline",
    severity: "medium",
    created_by: "admin",
    updated_by: "admin",
    created_at: "2026-04-07T10:58:19Z",
    updated_at: "2026-04-07T10:58:19Z",
    version: "1.0.0",
    is_active: true,
    rules: [
      "b1b2c3d4-e5f6-7890-abcd-ef1234567821",
      "c1b2c3d4-e5f6-7890-abcd-ef1234567822",
    ],
  },
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    component_id: "comp-postgres",
    audit_control_id: null,
    name: "postgres_baseline",
    description: "PostgreSQL security & compliance baseline",
    severity: "medium",
    created_by: "admin",
    updated_by: "admin",
    created_at: "2026-04-07T10:58:19Z",
    updated_at: "2026-04-07T10:58:19Z",
    version: "1.0.0",
    is_active: true,
    rules: [
      "b1b2c3d4-e5f6-7890-abcd-ef1234567891",
      "c1b2c3d4-e5f6-7890-abcd-ef1234567892",
      "d1b2c3d4-e5f6-7890-abcd-ef1234567893",
      "e1b2c3d4-e5f6-7890-abcd-ef1234567894",
      "f1b2c3d4-e5f6-7890-abcd-ef1234567895",
    ],
  },
];

// ─── State Snapshots (Evidence / Compliance Results) ──────────────────────────

export const MOCK_STATE_SNAPSHOTS = [
  // yugabyte-node-01 (host: 0c3e9829-...)
  {
    id: "ba50ea50-86e6-4f6a-a51a-46b976461b27",
    rule_id: "b1b2c3d4-e5f6-7890-abcd-ef1234567811",
    rule_name: "tls-enable-check",
    host_id: "0c3e9829-a255-4694-8f40-d6375ec98af0",
    host_name: "yugabyte-node-01",
    columns: [
      {
        name: "ssl",
        setting: "off",
        source: "default",
        category: "Connections and Authentication / SSL",
        verified_at: "2026-04-07T11:03:02Z",
      },
    ],
    snapshot_time: "2026-04-07T11:03:02Z",
    received_at: "2026-04-07T11:03:02Z",
    status: "non-compliant",
  },
  {
    id: "dae2e0ee-c2b7-4234-b569-aaf9853e0f10",
    rule_id: "c1b2c3d4-e5f6-7890-abcd-ef1234567812",
    rule_name: "max-connections-check",
    host_id: "0c3e9829-a255-4694-8f40-d6375ec98af0",
    host_name: "yugabyte-node-01",
    columns: [
      {
        name: "max_connections",
        setting: "300",
        source: "configuration file",
        category: "Connections and Authentication / Connection Settings",
        verified_at: "2026-04-07T11:03:02Z",
      },
    ],
    snapshot_time: "2026-04-07T11:03:02Z",
    received_at: "2026-04-07T11:03:02Z",
    status: "compliant",
  },
  {
    id: "bc790e8b-132e-43a3-b8df-d6a8be0575c4",
    rule_id: "e1b2c3d4-e5f6-7890-abcd-ef1234567814",
    rule_name: "log-disconnections-check",
    host_id: "0c3e9829-a255-4694-8f40-d6375ec98af0",
    host_name: "yugabyte-node-01",
    columns: [
      {
        name: "log_disconnections",
        setting: "off",
        source: "default",
        category: "Reporting and Logging / What to Log",
        verified_at: "2026-04-07T11:03:02Z",
      },
    ],
    snapshot_time: "2026-04-07T11:03:02Z",
    received_at: "2026-04-07T11:03:02Z",
    status: "non-compliant",
  },
  {
    id: "f8664ad6-3a72-4d0b-84a8-c88bdbd7c664",
    rule_id: "d1b2c3d4-e5f6-7890-abcd-ef1234567813",
    rule_name: "log-connections-check",
    host_id: "0c3e9829-a255-4694-8f40-d6375ec98af0",
    host_name: "yugabyte-node-01",
    columns: [
      {
        name: "log_connections",
        setting: "off",
        source: "default",
        category: "Reporting and Logging / What to Log",
        verified_at: "2026-04-07T11:02:40Z",
      },
    ],
    snapshot_time: "2026-04-07T11:02:40Z",
    received_at: "2026-04-07T11:02:40Z",
    status: "non-compliant",
  },
  {
    id: "78e109f1-1b0b-47f8-abb0-4712161d6af3",
    rule_id: "f1b2c3d4-e5f6-7890-abcd-ef1234567815",
    rule_name: "password-encryption-check",
    host_id: "0c3e9829-a255-4694-8f40-d6375ec98af0",
    host_name: "yugabyte-node-01",
    columns: [
      {
        name: "password_encryption",
        setting: "scram-sha-256",
        source: "default",
        category: "Connections and Authentication / Authentication",
        verified_at: "2026-04-07T11:01:18Z",
      },
    ],
    snapshot_time: "2026-04-07T11:01:18Z",
    received_at: "2026-04-07T11:01:18Z",
    status: "compliant",
  },
  // postgres-node-01 / nginx (host: e178ffcd-...)
  {
    id: "87a51f07-816d-4dcf-a817-1baaf25fc20b",
    rule_id: "b1b2c3d4-e5f6-7890-abcd-ef1234567821",
    rule_name: "tls-enable-check",
    host_id: "e178ffcd-9084-48a4-9cdb-4a5fe6ddd678",
    host_name: "postgres-node-01",
    columns: [
      {
        name: "tls-enabled",
        setting: "false",
        source: "nginx_runtime",
        host: "10.89.0.16",
        verified_at: "2026-04-07T11:03:02Z",
      },
    ],
    snapshot_time: "2026-04-07T11:03:02Z",
    received_at: "2026-04-07T11:03:02Z",
    status: "non-compliant",
  },
  {
    id: "bb41c392-1297-465e-a8f3-7c0d7e29a006",
    rule_id: "c1b2c3d4-e5f6-7890-abcd-ef1234567822",
    rule_name: "tls-version-check",
    host_id: "e178ffcd-9084-48a4-9cdb-4a5fe6ddd678",
    host_name: "postgres-node-01",
    columns: [
      {
        name: "tls-version",
        setting: "unknown",
        source: "nginx_runtime",
        host: "10.89.0.16",
        verified_at: "2026-04-07T11:03:20Z",
      },
    ],
    snapshot_time: "2026-04-07T11:03:20Z",
    received_at: "2026-04-07T11:03:20Z",
    status: "non-compliant",
  },
];

// ─── Stakeholders ─────────────────────────────────────────────────────────────

export const MOCK_STAKEHOLDERS = [
  {
    id: "stake-1",
    user_id: "sarah.j",
    name: "Sarah Jenkins",
    email: "sarah.j@enterprise.com",
    organization: "Global Retail Corp",
    created_at: "2026-04-01T10:00:00Z",
    updated_at: "2026-04-01T10:00:00Z",
  },
  {
    id: "stake-2",
    user_id: "m.chen",
    name: "Michael Chen",
    email: "m.chen@fintech-solutions.io",
    organization: "Fintech Solutions",
    created_at: "2026-04-02T09:30:00Z",
    updated_at: "2026-04-02T09:30:00Z",
  },
];

// ─── Projects ─────────────────────────────────────────────────────────────────

export const MOCK_PROJECTS = [
  {
    id: "p-customer-portal",
    stakeholder_id: "stake-1",
    name: "Customer Portal 2.0",
    app_id: 101,
    description: "External facing customer engagement platform",
    status: "ACTIVE",
    due_date: "2026-10-15T00:00:00Z",
    created_by: "admin",
    updated_by: "admin",
    created_at: "2026-04-01T10:00:00Z",
    updated_at: "2026-04-01T10:00:00Z",
  },
  {
    id: "p-billing-core",
    stakeholder_id: "stake-2",
    name: "Billing Engine Core",
    app_id: 202,
    description: "Mission critical transaction processing engine",
    status: "ACTIVE",
    due_date: "2026-12-31T00:00:00Z",
    created_by: "admin",
    updated_by: "admin",
    created_at: "2026-04-05T08:00:00Z",
    updated_at: "2026-04-05T08:00:00Z",
  },
  {
    id: "p-mobile-backend",
    stakeholder_id: "stake-1",
    name: "Mobile App Backend",
    app_id: 303,
    description: "API gateway and backend for mobile applications",
    status: "ACTIVE",
    due_date: "2026-09-30T00:00:00Z",
    created_by: "admin",
    updated_by: "admin",
    created_at: "2026-04-10T14:20:00Z",
    updated_at: "2026-04-10T14:20:00Z",
  },
];

// ─── Audits ───────────────────────────────────────────────────────────────────

export const MOCK_AUDITS = [
  {
    id: "SOC2-T2",
    name: "SOC2 Type II",
    description: "System and Organization Controls 2 Type II Compliance",
    created_by: "admin",
    updated_by: "admin",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "ISO-27001",
    name: "ISO 27001",
    description: "Information Security Management System Standard",
    created_by: "admin",
    updated_by: "admin",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "HIPAA",
    name: "HIPAA Compliance",
    description: "Health Insurance Portability and Accountability Act",
    created_by: "admin",
    updated_by: "admin",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

// ─── Audit Controls ───────────────────────────────────────────────────────────

export const MOCK_AUDIT_CONTROLS = [
  {
    id: "ctrl-enc-rest",
    audit_id: "SOC2-T2",
    name: "Data Encryption at Rest",
    description: "Ensure sensitive data is encrypted while stored on disk",
    control_ref: "CC6.1",
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "ctrl-enc-transit",
    audit_id: "ISO-27001",
    name: "Data Encryption in Transit",
    description: "Ensure data is encrypted during transmission over networks",
    control_ref: "A.10.1.1",
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-01-15T10:00:00Z",
  },
];

// ─── Project Audits ───────────────────────────────────────────────────────────

export const MOCK_PROJECT_AUDITS = [
  // Project 1: Customer Portal 2.0 -> SOC2, ISO, HIPAA
  {
    id: "pa-1",
    project_id: "p-customer-portal",
    audit_id: "SOC2-T2",
    status: "IN_PROGRESS",
    assigned_by: "admin",
    assigned_at: "2026-04-05T10:00:00Z",
    completed_at: null,
  },
  {
    id: "pa-2",
    project_id: "p-customer-portal",
    audit_id: "ISO-27001",
    status: "IN_PROGRESS",
    assigned_by: "admin",
    assigned_at: "2026-04-05T10:00:00Z",
    completed_at: null,
  },
  {
    id: "pa-3",
    project_id: "p-customer-portal",
    audit_id: "HIPAA",
    status: "IN_PROGRESS",
    assigned_by: "admin",
    assigned_at: "2026-04-05T10:00:00Z",
    completed_at: null,
  },
  // Project 2: Billing Engine Core -> SOC2, ISO, HIPAA
  {
    id: "pa-4",
    project_id: "p-billing-core",
    audit_id: "SOC2-T2",
    status: "IN_PROGRESS",
    assigned_by: "admin",
    assigned_at: "2026-04-06T09:00:00Z",
    completed_at: null,
  },
  {
    id: "pa-5",
    project_id: "p-billing-core",
    audit_id: "ISO-27001",
    status: "COMPLETED",
    assigned_by: "admin",
    assigned_at: "2026-04-06T09:00:00Z",
    completed_at: "2026-04-20T17:00:00Z",
  },
  {
    id: "pa-6",
    project_id: "p-billing-core",
    audit_id: "HIPAA",
    status: "IN_PROGRESS",
    assigned_by: "admin",
    assigned_at: "2026-04-06T09:00:00Z",
    completed_at: null,
  },
  // Project 3: Mobile App Backend -> SOC2 only
  {
    id: "pa-7",
    project_id: "p-mobile-backend",
    audit_id: "SOC2-T2",
    status: "IN_PROGRESS",
    assigned_by: "admin",
    assigned_at: "2026-04-12T11:00:00Z",
    completed_at: null,
  },
];

// ─── Host Tags ────────────────────────────────────────────────────────────────

export const MOCK_HOST_TAGS = [
  {
    id: "tag-1",
    host_id: "0c3e9829-a255-4694-8f40-d6375ec98af0",
    key: "env",
    value: "dev",
    source: "agent",
    created_at: "2026-04-07T10:58:56Z",
    updated_at: "2026-04-07T10:58:56Z",
  },
  {
    id: "tag-2",
    host_id: "0c3e9829-a255-4694-8f40-d6375ec98af0",
    key: "database",
    value: "yugabyte",
    source: "agent",
    created_at: "2026-04-07T10:58:56Z",
    updated_at: "2026-04-07T10:58:56Z",
  },
  {
    id: "tag-3",
    host_id: "e178ffcd-9084-48a4-9cdb-4a5fe6ddd678",
    key: "env",
    value: "dev",
    source: "agent",
    created_at: "2026-04-07T10:59:15Z",
    updated_at: "2026-04-07T10:59:15Z",
  },
  {
    id: "tag-4",
    host_id: "e178ffcd-9084-48a4-9cdb-4a5fe6ddd678",
    key: "service",
    value: "nginx",
    source: "agent",
    created_at: "2026-04-07T10:59:15Z",
    updated_at: "2026-04-07T10:59:15Z",
  },
];

// ─── Policy Versions ──────────────────────────────────────────────────────────

export const MOCK_POLICY_VERSIONS = [
  {
    id: "pv-1",
    policy_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567800",
    version: "1.0.0",
    is_active: true,
    created_at: "2026-04-07T10:58:19Z",
    updated_at: "2026-04-07T10:58:19Z",
  },
];

// ─── Policy Rules ─────────────────────────────────────────────────────────────

export const MOCK_POLICY_RULES = [
  {
    id: "pr-1",
    policy_version_id: "pv-1",
    rule_id: "b1b2c3d4-e5f6-7890-abcd-ef1234567811",
    created_at: "2026-04-07T10:58:19Z",
    updated_at: "2026-04-07T10:58:19Z",
  },
  {
    id: "pr-2",
    policy_version_id: "pv-1",
    rule_id: "c1b2c3d4-e5f6-7890-abcd-ef1234567812",
    created_at: "2026-04-07T10:58:19Z",
    updated_at: "2026-04-07T10:58:19Z",
  },
];

// ─── Host Policy Assignments ──────────────────────────────────────────────────

export const MOCK_HOST_POLICY_ASSIGNMENTS = [
  {
    id: "hpa-1",
    host_id: "0c3e9829-a255-4694-8f40-d6375ec98af0",
    policy_version_id: "pv-1",
    project_audit_id: "pa-1",
    status: "ACTIVE",
    assigned_at: "2026-04-07T10:58:19Z",
    activated_at: "2026-04-07T11:00:00Z",
    superseded_at: null,
  },
];

// ─── Dashboard Stats (derived from dump data) ─────────────────────────────────

export const MOCK_STATS = {
  hosts: {
    total: 2,
    active: 2,
    inactive: 0,
    trend: 0,
    breakdown: [
      { label: "YugabyteDB", value: 1, color: "#F59E0B" },
      { label: "PostgreSQL", value: 1, color: "#FB923C" },
    ],
  },
  agents: {
    total: 2,
    online: 2,
    offline: 0,
    trend: 0,
    breakdown: [
      { label: "Active", value: 2, color: "#22C55E" },
      { label: "Degraded", value: 0, color: "#F59E0B" },
      { label: "Offline", value: 0, color: "#EF4444" },
    ],
  },
  policies: {
    total: 3,
    active: 3,
    draft: 0,
    trend: 0,
    breakdown: [
      { label: "yugabyte_baseline", value: 1, color: "#F59E0B" },
      { label: "nginx_baseline", value: 1, color: "#3B82F6" },
      { label: "postgres_baseline", value: 1, color: "#FB923C" },
    ],
  },
  rules: {
    total: 12,
    active: 12,
    breakdown: [
      { label: "Critical", value: 2, color: "#EF4444" },
      { label: "High", value: 5, color: "#F59E0B" },
      { label: "Medium", value: 5, color: "#3B82F6" },
    ],
  },
  compliance: {
    total_checks: 7,
    compliant: 2,
    non_compliant: 5,
    trend: -5,
    breakdown: [
      { label: "Compliant", value: 2, color: "#22C55E" },
      { label: "Non-Compliant", value: 5, color: "#EF4444" },
    ],
  },
};

// ─── Activity Feed (derived from snapshot timeline) ───────────────────────────

export const MOCK_ACTIVITY = [
  {
    time: "11:03",
    event: "TLS not enabled on nginx",
    type: "danger",
    resource: "Host: postgres-node-01 / Rule: tls-enable-check",
  },
  {
    time: "11:03",
    event: "TLS check failed on yugabyte",
    type: "danger",
    resource: "Host: yugabyte-node-01 / Rule: tls-enable-check",
  },
  {
    time: "11:03",
    event: "log_disconnections is OFF",
    type: "warning",
    resource: "Host: yugabyte-node-01 / Rule: log-disconnections-check",
  },
  {
    time: "11:03",
    event: "max_connections set to 300",
    type: "success",
    resource: "Host: yugabyte-node-01 / Rule: max-connections-check",
  },
  {
    time: "11:03",
    event: "TLS version unknown on nginx",
    type: "warning",
    resource: "Host: postgres-node-01 / Rule: tls-version-check",
  },
  {
    time: "11:01",
    event: "Password encryption: scram-sha-256 ✓",
    type: "success",
    resource: "Host: yugabyte-node-01 / Rule: password-encryption-check",
  },
];

// ─── Compliance Timeline (snapshots grouped by rule — for charts) ─────────────

export const MOCK_COMPLIANCE_TIMELINE = [
  { rule: "tls-enable-check", compliant: 0, non_compliant: 2 },
  { rule: "max-connections-check", compliant: 1, non_compliant: 0 },
  { rule: "log-connections-check", compliant: 0, non_compliant: 1 },
  { rule: "log-disconnections-check", compliant: 0, non_compliant: 1 },
  { rule: "password-encryption-check", compliant: 1, non_compliant: 0 },
  { rule: "tls-version-check", compliant: 0, non_compliant: 1 },
];

// ─── Weekly Snapshot Activity (how many state_snapshots received per day) ─────

export const MOCK_WEEKLY_EVIDENCE = [
  { day: "Mon", count: 0 },
  { day: "Tue", count: 26 },
  { day: "Wed", count: 0 },
  { day: "Thu", count: 0 },
  { day: "Fri", count: 0 },
  { day: "Sat", count: 0 },
  { day: "Sun", count: 0 },
];
