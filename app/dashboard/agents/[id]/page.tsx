"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  Monitor,
  Activity,
  Hash,
  CheckCircle2,
  XCircle,
  FileSearch,
  Clock,
} from "lucide-react";
import {
  getAgentById,
  getHostById,
  getSnapshotsByHost,
  Agent,
  Host,
  StateSnapshot,
} from "@/lib/api";

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  count,
  iconCls = "text-primary-600",
  bgCls = "bg-primary-50",
}: {
  icon: React.ElementType;
  title: string;
  count?: number;
  iconCls?: string;
  bgCls?: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className={`w-7 h-7 rounded-lg ${bgCls} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-3.5 h-3.5 ${iconCls}`} />
      </div>
      <h2 className="text-sm font-bold text-text-primary">{title}</h2>
      {count !== undefined && (
        <span className="ml-1 text-[10px] font-bold text-text-muted bg-surface-2 border border-neutral-100 px-1.5 py-0.5 rounded">
          {count}
        </span>
      )}
    </div>
  );
}

// ─── MetaCell ─────────────────────────────────────────────────────────────────

function MetaCell({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-surface-2 rounded-xl p-3 border border-neutral-100">
      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-xs font-semibold text-text-primary truncate ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [agent, setAgent] = useState<Agent | null>(null);
  const [host, setHost] = useState<Host | null>(null);
  const [snapshots, setSnapshots] = useState<StateSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAgentById(id).then((a) => {
      if (!a) {
        setLoading(false);
        return;
      }
      setAgent(a);

      Promise.all([
        getHostById(a.host_id),
        getSnapshotsByHost(a.host_id),
      ]).then(([h, hostSnapshots]) => {
        if (h) setHost(h);
        setSnapshots(hostSnapshots);
        setLoading(false);
      });
    });
  }, [id]);

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex-1 p-8 space-y-6">
        <div className="h-10 w-48 bg-neutral-100 rounded-xl animate-pulse" />
        <div className="h-40 bg-neutral-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="h-48 bg-neutral-100 rounded-2xl animate-pulse" />
          <div className="h-48 bg-neutral-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-text-primary font-bold">Agent not found</p>
          <button onClick={() => router.back()} className="text-xs text-primary-600 hover:underline mt-1 inline-block">
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const hostTypeColor: Record<string, string> = {
    yugabyte: "bg-amber-100 text-amber-700 border-amber-200",
    postgres: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background space-y-6">
      {/* Back nav */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-2 border border-neutral-200 text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors"
          title="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
          Agent Dashboard
        </span>
      </div>

      {/* ── 1. AGENT DETAILS ─────────────────────────────────────────────────── */}
      <section className="bg-surface-1 rounded-2xl border border-neutral-200 shadow-sm p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5">
                Agent Details
              </p>
              <h1 className="text-xl font-bold text-text-primary font-mono">{agent.id}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 border border-success/30 px-2 py-0.5 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  {agent.status}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase bg-neutral-100 text-neutral-600 border-neutral-200">
                  v{agent.version}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/20 mb-5">
          <Activity className="w-4 h-4 text-success flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-bold text-success">Agent is active and reporting</p>
            <p className="text-[10px] text-text-muted mt-0.5">
              Enrolled: {new Date(agent.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              {agent.decommissioned_at && (
                <span className="text-danger ml-2">
                  · Decommissioned: {new Date(agent.decommissioned_at).toLocaleDateString("en-GB")}
                </span>
              )}
            </p>
          </div>
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        </div>

        {/* osquery instance */}
        <div className="rounded-xl border border-neutral-200 bg-surface-2 p-4">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Hash className="w-3 h-3" /> osquery Instance
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <p className="text-[10px] text-text-muted mb-0.5">Instance ID</p>
              <p className="text-[10px] font-mono text-text-secondary">{agent.osquery_instance.id}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-muted mb-0.5">Node Key</p>
              <p className="text-[10px] font-mono text-text-primary font-bold">{agent.osquery_instance.node_key}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-muted mb-0.5">Active</p>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${agent.osquery_instance.is_active ? "bg-success/10 text-success border-success/30" : "bg-neutral-100 text-neutral-500 border-neutral-200"}`}>
                {agent.osquery_instance.is_active ? <><CheckCircle2 className="w-2.5 h-2.5" /> Active</> : <><XCircle className="w-2.5 h-2.5" /> Inactive</>}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-text-muted mb-0.5">Last Seen</p>
              <p className="text-[10px] text-text-secondary">
                {new Date(agent.last_seen).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── 2. HOST DETAILS TILE ─────────────────────────────────────────── */}
        <section className="bg-surface-1 rounded-2xl border border-neutral-200 shadow-sm p-6 flex flex-col">
          <SectionHeader icon={Monitor} title="Host Details" iconCls="text-primary-600" bgCls="bg-primary-50" />
          
          {!host ? (
            <div className="py-8 text-center flex-1 flex flex-col items-center justify-center">
              <Monitor className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-text-muted">Host information unavailable.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-100 bg-surface-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <Monitor className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-text-primary">{host.name}</p>
                  <p className="text-[10px] text-text-muted font-mono mt-0.5">{host.id}</p>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${hostTypeColor[host.type] ?? "bg-neutral-100 text-neutral-600 border-neutral-200"}`}>
                  {host.type}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
                <MetaCell label="IP Address" value={host.ip} mono />
                <MetaCell label="OS Family" value={host.os_family} />
                <MetaCell label="Environment" value={host.env} />
                <MetaCell label="Project ID" value={host.project_id} mono />
              </div>

              <div className="mt-auto pt-4 border-t border-neutral-100">
                <Link href={`/dashboard/hosts/${host.id}`} className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group w-max">
                  View Host Dashboard
                  <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ── 3. RECENT EVIDENCE TILE ──────────────────────────────────────── */}
        <section className="bg-surface-1 rounded-2xl border border-neutral-200 shadow-sm p-6 flex flex-col">
          <SectionHeader icon={FileSearch} title="Recent Evidence" count={snapshots.length} iconCls="text-violet-600" bgCls="bg-violet-50" />
          
          {snapshots.length === 0 ? (
            <div className="py-8 text-center flex-1 flex flex-col items-center justify-center">
              <FileSearch className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-text-muted">No evidence collected yet.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2">
                {snapshots.slice(0, 5).map((snap) => {
                  const isCompliant = snap.status === "compliant";
                  return (
                    <div key={snap.id} className="flex items-start gap-3 p-3 rounded-xl border border-neutral-100 bg-surface-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${isCompliant ? "bg-success/10" : "bg-danger/10"}`}>
                        {isCompliant ? <CheckCircle2 className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-danger" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-text-primary font-mono truncate">{snap.rule_name}</p>
                        <p className="text-[10px] text-text-muted mt-0.5 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {new Date(snap.snapshot_time).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase flex-shrink-0 ${isCompliant ? "bg-success/10 text-success border-success/30" : "bg-danger/10 text-danger border-danger/30"}`}>
                        {snap.status}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-100">
                <Link href="/dashboard/evidence" className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group w-max">
                  View all evidence in Evidence Explorer
                  <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
