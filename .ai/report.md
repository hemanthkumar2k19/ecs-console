# Report: Replace Dummy Data with Real DB Dump Data

## Files Modified

- `lib/mock.ts` — replaced all non-login mock data with data derived from `dump.sql`

## Files Created

None

## Explanation of Changes

### Preserved (Login module, untouched)
- `MOCK_USERS` — kept as-is per instruction

### New / Replaced Exports

| Export | Source |
|--------|--------|
| `MOCK_HOSTS` | `hosts` table (2 rows) + `host_tags` (4 rows) enriched inline |
| `MOCK_AGENTS` | `agents` table (2 rows) + `osquery_instances` (2 rows) enriched inline |
| `MOCK_RULES` | `rules` table (12 rows), annotated with owning policy name |
| `MOCK_POLICIES` | `policies` + `policy_versions` + `policy_assignments` + `policy_rules` (3 policies) |
| `MOCK_STATE_SNAPSHOTS` | `state_snapshots` latest per rule per host (7 unique snapshots) |
| `MOCK_STATS` | Derived from actual counts: 2 hosts, 2 agents, 3 policies, 12 rules, 7 checks (2 compliant / 5 non-compliant) |
| `MOCK_ACTIVITY` | Derived from snapshot timeline — events ordered by time |
| `MOCK_COMPLIANCE_TIMELINE` | Rule-level compliant vs non-compliant tally (for bar/pie charts) |
| `MOCK_WEEKLY_EVIDENCE` | All 26 snapshots are from 2026-04-07 (Tuesday); other days = 0 |

### Key Observations from Dump
- Both hosts are in `env=dev`, project `ps-postgres`
- Both agents are `active`; no offline/degraded agents
- 5 out of 7 latest compliance checks are **non-compliant** (SSL/TLS off, logging disabled)
- Only `max-connections=300` and `password_encryption=scram-sha-256` are passing
- `tls-enabled=false` and `tls-version=unknown` on the nginx host

## Suggested Next Improvements

1. **Hosts page** — Build a table UI using `MOCK_HOSTS` showing name, type, IP, env, tags
2. **Agents page** — Show agent status, version, last seen, linked host
3. **Policies page** — List policies with active rules count and assignment selector
4. **Compliance / Evidence page** — Show `MOCK_STATE_SNAPSHOTS` as a detailed findings table with pass/fail badges
5. **Dashboard charts** — Wire `MOCK_COMPLIANCE_TIMELINE` to a bar chart and `MOCK_STATS.compliance` to a donut chart
