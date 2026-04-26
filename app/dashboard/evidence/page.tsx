"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileSearch,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Monitor,
  Clock,
  Database,
  RefreshCw,
} from "lucide-react";
import { getStateSnapshots, getHosts, StateSnapshot, Host } from "@/lib/api";

// ─── Types ───────────────────────────────────────────────────────────────────

type StatusFilter = "all" | "compliant" | "non-compliant";

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const isCompliant = status === "compliant";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${
        isCompliant
          ? "bg-success/10 text-success border-success/30"
          : "bg-danger/10 text-danger border-danger/30"
      }`}
    >
      {isCompliant ? (
        <CheckCircle2 className="w-2.5 h-2.5" />
      ) : (
        <XCircle className="w-2.5 h-2.5" />
      )}
      {status}
    </span>
  );
}

// ─── Snapshot card (collapsible) ──────────────────────────────────────────────

function SnapshotCard({
  snapshot,
  defaultOpen = false,
}: {
  snapshot: StateSnapshot;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const isCompliant = snapshot.status === "compliant";

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isCompliant
          ? "border-neutral-200 bg-surface-1"
          : "border-danger/20 bg-danger/[0.02]"
      }`}
    >
      {/* Header row — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-2/50 transition-colors"
      >
        <div
          className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
            isCompliant ? "bg-success/10" : "bg-danger/10"
          }`}
        >
          {isCompliant ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-danger" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-text-primary font-mono truncate">
              {snapshot.rule_name}
            </span>
            <StatusBadge status={snapshot.status} />
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-[10px] text-text-muted">
            <span className="flex items-center gap-1">
              <Monitor className="w-2.5 h-2.5" />
              {snapshot.host_name}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {new Date(snapshot.snapshot_time).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="font-mono text-[9px] text-text-muted/60">
              {snapshot.columns.length} column{snapshot.columns.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {open ? (
          <ChevronDown className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
        )}
      </button>

      {/* Expanded column data */}
      {open && (
        <div className="px-4 pb-4 border-t border-neutral-100">
          <div className="mt-3 rounded-xl overflow-hidden border border-neutral-200">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-surface-2 border-b border-neutral-100">
                  <th className="text-left px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-wider w-1/5">
                    Column
                  </th>
                  <th className="text-left px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-wider w-1/5">
                    Value
                  </th>
                  <th className="text-left px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-wider w-1/5">
                    Source
                  </th>
                  <th className="text-left px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-wider w-36">
                    Verified At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {snapshot.columns.map((col, i) => (
                  <tr key={i} className="hover:bg-surface-2/50 transition-colors">
                    <td className="px-3 py-2.5">
                      <span className="font-mono font-bold text-text-primary text-[11px]">
                        {col.name}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`font-mono font-bold text-[11px] px-1.5 py-0.5 rounded ${
                          col.setting === "off" || col.setting === "false" || col.setting === "unknown"
                            ? "bg-danger/10 text-danger"
                            : "bg-success/10 text-success"
                        }`}
                      >
                        {col.setting}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[10px] bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded font-mono text-text-secondary">
                        {col.source}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[10px] text-text-muted max-w-[200px] truncate">
                      {(col as any).category ?? "—"}
                    </td>
                    <td className="px-3 py-2.5 text-[10px] text-text-muted font-mono whitespace-nowrap">
                      {new Date(col.verified_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Snapshot metadata footer */}
          <div className="flex items-center gap-4 mt-3 text-[10px] text-text-muted">
            <span>
              Snapshot ID: <span className="font-mono">{snapshot.id.slice(0, 16)}…</span>
            </span>
            <span>
              Rule ID: <span className="font-mono">{snapshot.rule_id.slice(0, 16)}…</span>
            </span>
            <span>
              Received:{" "}
              {new Date(snapshot.received_at).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function EvidencePage() {
  const [snapshots, setSnapshots] = useState<StateSnapshot[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [hostFilter, setHostFilter] = useState("all");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([getStateSnapshots(), getHosts()]).then(([snaps, h]) => {
      setSnapshots(snaps);
      setHosts(h);
      setLoading(false);
    });
  }, []);

  // ── Filtered results ───────────────────────────────────────────────────────
  const filtered = snapshots.filter((s) => {
    const matchSearch =
      !search ||
      s.rule_name.toLowerCase().includes(search.toLowerCase()) ||
      s.host_name.toLowerCase().includes(search.toLowerCase()) ||
      s.columns.some(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.setting.toLowerCase().includes(search.toLowerCase())
      );
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchHost = hostFilter === "all" || s.host_id === hostFilter;
    return matchSearch && matchStatus && matchHost;
  });

  // ── Group by host ──────────────────────────────────────────────────────────
  const grouped = filtered.reduce<Record<string, StateSnapshot[]>>((acc, s) => {
    (acc[s.host_name] ??= []).push(s);
    return acc;
  }, {});

  const totalCompliant = snapshots.filter((s) => s.status === "compliant").length;
  const totalNonCompliant = snapshots.filter((s) => s.status === "non-compliant").length;
  const passRate = snapshots.length > 0 ? Math.round((totalCompliant / snapshots.length) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-2 border border-neutral-200 text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
          Back to Dashboard
        </span>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
          <FileSearch className="w-5 h-5 text-violet-600" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Evidence</h1>
      </div>
      <p className="text-sm text-text-secondary mb-6 ml-12">
        Raw compliance evidence collected by agents across all hosts.
      </p>

      {/* ── Summary strip ───────────────────────────────────────────────────── */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface-1 border border-neutral-200 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
              Total Snapshots
            </p>
            <p className="text-2xl font-bold text-text-primary">{snapshots.length}</p>
          </div>
          <div className="bg-success/5 border border-success/20 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-success uppercase tracking-widest mb-1">
              Compliant
            </p>
            <p className="text-2xl font-bold text-success">{totalCompliant}</p>
          </div>
          <div className="bg-danger/5 border border-danger/20 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-danger uppercase tracking-widest mb-1">
              Non-Compliant
            </p>
            <p className="text-2xl font-bold text-danger">{totalNonCompliant}</p>
          </div>
          <div className="bg-surface-1 border border-neutral-200 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
              Pass Rate
            </p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold text-text-primary">{passRate}%</p>
            </div>
            <div className="h-1 w-full bg-neutral-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-success rounded-full transition-all duration-700"
                style={{ width: `${passRate}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rule, host, column, value…"
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-surface-1 border border-neutral-200 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 bg-surface-2 border border-neutral-200 rounded-xl p-1">
          {(["all", "compliant", "non-compliant"] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors ${
                statusFilter === f
                  ? "bg-surface-1 text-text-primary shadow-sm border border-neutral-200"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>

        {/* Host filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted" />
          <select
            value={hostFilter}
            onChange={(e) => setHostFilter(e.target.value)}
            className="pl-8 pr-4 py-2.5 text-xs bg-surface-1 border border-neutral-200 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-300 appearance-none cursor-pointer"
          >
            <option value="all">All Hosts</option>
            {hosts.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        {/* Result count */}
        <span className="text-[10px] text-text-muted font-medium ml-auto">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Evidence list grouped by host ───────────────────────────────────── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <FileSearch className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-text-muted">No evidence matches your filters.</p>
          <button
            onClick={() => { setSearch(""); setStatusFilter("all"); setHostFilter("all"); }}
            className="mt-2 text-xs text-primary-600 hover:underline flex items-center gap-1 mx-auto"
          >
            <RefreshCw className="w-3 h-3" /> Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([hostName, snaps]) => {
            const host = hosts.find((h) => h.name === hostName);
            const hostCompliant = snaps.filter((s) => s.status === "compliant").length;

            return (
              <div key={hostName}>
                {/* Host group header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Monitor className="w-3 h-3 text-primary-600" />
                  </div>
                  <Link
                    href={`/dashboard/hosts/${host?.id ?? ""}`}
                    className="text-xs font-bold text-text-primary hover:text-primary-600 transition-colors font-mono"
                  >
                    {hostName}
                  </Link>
                  <span className="text-[10px] text-text-muted">
                    {hostCompliant}/{snaps.length} compliant
                  </span>
                  <div className="flex-1 h-px bg-neutral-100 ml-2" />
                  <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success rounded-full"
                      style={{ width: `${Math.round((hostCompliant / snaps.length) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 pl-8">
                  {snaps.map((s) => (
                    <SnapshotCard key={s.id} snapshot={s} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
