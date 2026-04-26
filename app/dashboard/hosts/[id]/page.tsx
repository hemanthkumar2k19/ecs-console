"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Monitor,
  Bot,
  ShieldCheck,
  Globe,
  Cpu,
  Tag,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  ListChecks,
  KeyRound,
  Hash,
  Layers,
  AlertTriangle,
  BadgeCheck,
  FileSearch,
} from "lucide-react";
import {
  getHostById,
  getAgents,
  getPolicies,
  getRules,
  getComponents,
  getSnapshotsByHost,
  Host,
  Agent,
  Policy,
  Rule,
  Component,
  StateSnapshot,
  updateHostTags,
} from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, TerminalSquare, Copy, Edit2, Trash2 } from "lucide-react";

// ─── Severity badge ───────────────────────────────────────────────────────────

const severityCfg: Record<string, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-blue-50 text-blue-700 border-blue-200",
  info: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

const SeverityBadge = ({ severity }: { severity: string }) => (
  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${severityCfg[severity] ?? severityCfg.info}`}>
    {severity}
  </span>
);

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

export default function HostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [host, setHost] = useState<Host | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [allRules, setAllRules] = useState<Rule[]>([]);
  const [component, setComponent] = useState<Component | null>(null);
  const [snapshots, setSnapshots] = useState<StateSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  const [openEnrollModal, setOpenEnrollModal] = useState(false);
  const [enrollToken, setEnrollToken] = useState("");
  
  const [openTagModal, setOpenTagModal] = useState(false);
  const [tagForm, setTagForm] = useState<{key: string, value: string, source: string}[]>([]);

  const loadHostData = () => {
    Promise.all([
      getHostById(id),
      getAgents(),
      getPolicies(),
      getRules(),
      getComponents(),
      getSnapshotsByHost(id),
    ]).then(([h, agents, allPolicies, rules, components, hostSnapshots]) => {
      if (!h) { setLoading(false); return; }

      const hostAgent = agents.find((a) => a.host_id === h.id) ?? null;
      const hostComponent = components.find((c) => c.id === h.component_id) ?? null;
      const hostPolicies = allPolicies.filter((p) => p.component_id === h.component_id);

      setHost(h);
      setAgent(hostAgent);
      setComponent(hostComponent);
      setPolicies(hostPolicies);
      setAllRules(rules);
      setSnapshots(hostSnapshots);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadHostData();
  }, [id]);

  const handleEnrollClick = () => {
    setEnrollToken(crypto.randomUUID());
    setOpenEnrollModal(true);
  };

  const handleCopyCommand = () => {
    const cmd = `curl -sSL https://ecs.example.com/install.sh | bash -s -- --token ${enrollToken}`;
    navigator.clipboard.writeText(cmd);
    // Could show a toast here in a real app
  };

  const handleEditTagsClick = () => {
    if (host) {
      setTagForm([...host.tags]);
      setOpenTagModal(true);
    }
  };

  const handleSaveTags = async () => {
    if (host) {
      await updateHostTags(host.id, tagForm);
      setOpenTagModal(false);
      loadHostData();
    }
  };

  const handleAddTagRow = () => {
    setTagForm([...tagForm, { key: "", value: "", source: "manual" }]);
  };

  const handleRemoveTagRow = (index: number) => {
    setTagForm(tagForm.filter((_, i) => i !== index));
  };

  const handleUpdateTagRow = (index: number, field: "key" | "value", val: string) => {
    const newTags = [...tagForm];
    newTags[index][field] = val;
    setTagForm(newTags);
  };

  // Rules for a given policy
  const getRulesForPolicy = (policy: Policy) =>
    allRules.filter((r) => policy.rules.includes(r.id));

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

  if (!host) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Monitor className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-text-primary font-bold">Host not found</p>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-2 border border-neutral-200 text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Host Dashboard
          </span>
        </div>

        {!agent && (
          <Button onClick={handleEnrollClick} className="gap-2 bg-amber-500 hover:bg-amber-600 text-white shadow-md border-amber-600 transition-all hover:scale-[1.02] active:scale-[0.98] font-bold">
            <TerminalSquare className="w-4 h-4" /> Enroll Agent
          </Button>
        )}
      </div>

      <Dialog open={openEnrollModal} onOpenChange={setOpenEnrollModal}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <TerminalSquare className="w-4.5 h-4.5 text-amber-600" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-neutral-900">Enroll Agent</DialogTitle>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Deploy the ECS agent to <span className="font-semibold text-neutral-700">{host.name}</span></p>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="px-6 py-5 space-y-4">
            <p className="text-sm text-neutral-600 leading-relaxed">
              Run the command below on the host to install the ECS agent and auto-enroll it to this record.
            </p>

            {/* Token */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Enrollment Token</p>
              <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-2">
                <KeyRound className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                <span className="text-xs font-mono text-neutral-700 flex-1 truncate">{enrollToken}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(enrollToken)}
                  className="text-neutral-400 hover:text-neutral-700 transition-colors"
                  title="Copy token"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Command */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Installation Command</p>
              <div className="relative rounded-xl overflow-hidden border border-neutral-800">
                <div className="bg-[#1a1a2e] text-[#e0e0e0] px-4 py-3.5 font-mono text-xs leading-relaxed overflow-x-auto whitespace-nowrap pr-12">
                  <span className="text-[#569cd6]">curl</span> -sSL https://ecs.example.com/install.sh |{" "}
                  <span className="text-[#569cd6]">bash</span> -s -- --token{" "}
                  <span className="text-[#ce9178]">{enrollToken}</span>
                </div>
                <button
                  onClick={handleCopyCommand}
                  className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-[10px] font-medium transition-colors"
                  title="Copy command"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
            </div>

            {/* Info note */}
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-blue-50 border border-blue-100">
              <Activity className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-blue-700 leading-relaxed">
                The agent will appear in the Agent Details section once it connects. Tokens are single-use.
              </p>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex justify-end">
            <Button variant="outline" onClick={() => setOpenEnrollModal(false)} className="h-9 text-sm border-neutral-200">Done</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 1. HOST DETAILS ──────────────────────────────────────────────────── */}
      <section className="bg-surface-1 rounded-2xl border border-neutral-200 shadow-sm p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <Monitor className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-0.5">
                Host Details
              </p>
              <h1 className="text-xl font-bold text-text-primary">{host.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${hostTypeColor[host.type] ?? "bg-neutral-100 text-neutral-600 border-neutral-200"}`}>
                  {host.type}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 border border-success/30 px-2 py-0.5 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Online
                </span>
                {component && (
                  <span className="text-[10px] font-medium text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded flex items-center gap-1">
                    <Cpu className="w-2.5 h-2.5" /> {component.display_name}
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className="text-[10px] font-mono text-text-muted bg-surface-2 border border-neutral-100 px-2 py-1 rounded">
            {host.id}
          </p>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <MetaCell label="IP Address" value={host.ip} mono />
          <MetaCell label="OS Family" value={host.os_family} />
          <MetaCell label="OS Version" value={host.os_version} />
          <MetaCell label="Environment" value={host.env} />
          <MetaCell label="Project" value={host.project_id} mono />
          <MetaCell label="Component" value={host.component_id} mono />
          <MetaCell label="Enrolled" value={new Date(host.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} />
          <MetaCell label="Last Updated" value={new Date(host.updated_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} />
        </div>

        {/* Tags */}
        {/* Tags */}
        <div className="border-t border-neutral-100 pt-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Tags</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 text-[10px] px-3 gap-1.5 text-amber-700 border-amber-200 bg-amber-50/50 hover:bg-amber-100 hover:border-amber-300 transition-all shadow-sm font-bold" 
              onClick={handleEditTagsClick}
            >
              <Edit2 className="w-3 h-3" /> Edit Tags
            </Button>
          </div>
          {host.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {host.tags.map((tag, i) => (
                <span key={i} className="flex items-center gap-1 text-[10px] bg-surface-2 border border-neutral-200 rounded-lg px-2 py-1 text-text-secondary">
                  <Tag className="w-2.5 h-2.5 text-text-muted" />
                  <span className="font-medium">{tag.key}</span>
                  <span className="text-text-muted">=</span>
                  <span className="font-bold text-text-primary">{tag.value}</span>
                  <span className="ml-1 text-[9px] text-text-muted bg-neutral-100 border border-neutral-200 px-1 rounded">{tag.source}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted">No tags assigned to this host.</p>
          )}
        </div>

        <Dialog open={openTagModal} onOpenChange={setOpenTagModal}>
          <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Tag className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <DialogTitle className="text-base font-bold text-neutral-900">Edit Tags</DialogTitle>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Manage metadata key-value pairs for this host.</p>
                  </div>
                </div>
              </DialogHeader>
            </div>

            {/* Tag rows */}
            <div className="px-6 py-5 space-y-3 max-h-[360px] overflow-y-auto">
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_1fr_36px] gap-2 px-1">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Key</p>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Value</p>
                <div />
              </div>

              {tagForm.length === 0 && (
                <div className="py-6 text-center text-sm text-neutral-400">
                  No tags yet. Click <span className="font-semibold">Add Tag</span> to create one.
                </div>
              )}

              {tagForm.map((tag, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_1fr_36px] gap-2 items-center">
                  <Input
                    placeholder="e.g. env"
                    value={tag.key}
                    onChange={(e) => handleUpdateTagRow(idx, "key", e.target.value)}
                    className="h-9 text-sm font-mono"
                  />
                  <Input
                    placeholder="e.g. production"
                    value={tag.value}
                    onChange={(e) => handleUpdateTagRow(idx, "value", e.target.value)}
                    className="h-9 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTagRow(idx)}
                    className="h-9 w-9 flex items-center justify-center rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                    title="Remove tag"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddTagRow}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-amber-300 text-amber-700 bg-amber-50/50 hover:bg-amber-50 text-xs font-semibold transition-colors mt-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Tag
              </button>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenTagModal(false)} className="h-9 text-sm border-neutral-200 text-neutral-600">Cancel</Button>
              <Button onClick={handleSaveTags} className="h-9 text-sm bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-sm">Save Tags</Button>
            </div>
          </DialogContent>
        </Dialog>
      </section>

      {/* ── 2. AGENT + OSQUERY ───────────────────────────────────────────────── */}
      <section className="bg-surface-1 rounded-2xl border border-neutral-200 shadow-sm p-6">
        <SectionHeader icon={Bot} title="Agent Details" iconCls="text-emerald-600" bgCls="bg-emerald-50" />

        {!agent ? (
          <div className="py-8 text-center">
            <Bot className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-text-muted">No agent enrolled on this host.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Agent meta */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetaCell label="Agent ID" value={agent.id.slice(0, 16) + "…"} mono />
              <MetaCell label="Version" value={`v${agent.version}`} mono />
              <MetaCell label="Status" value={agent.status} />
              <MetaCell
                label="Last Seen"
                value={new Date(agent.last_seen).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              />
            </div>

            {/* Status bar */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/20">
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] text-text-muted mb-0.5">Instance ID</p>
                  <p className="text-[10px] font-mono text-text-secondary">{agent.osquery_instance.id.slice(0, 20)}…</p>
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
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── 3. POLICIES ATTACHED ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader icon={ShieldCheck} title="Attached Policies" count={policies.length} iconCls="text-primary-600" bgCls="bg-primary-50" />

        {policies.length === 0 ? (
          <div className="py-10 text-center text-text-muted text-sm bg-surface-1 rounded-xl border border-neutral-200">
            No policies are linked to this host's component.
          </div>
        ) : (
          <div className="space-y-4">
            {policies.map((policy) => {
              const policyRules = getRulesForPolicy(policy);
              const criticalCount = policyRules.filter((r) => r.severity === "critical").length;
              const highCount = policyRules.filter((r) => r.severity === "high").length;

              return (
                <div key={policy.id} className="bg-surface-1 rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                  {/* Policy header */}
                  <div className="flex items-start justify-between p-5 border-b border-neutral-100">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ShieldCheck className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-text-primary font-mono">{policy.name}</p>
                          {policy.is_active && (
                            <span className="flex items-center gap-0.5 text-[9px] font-bold text-success bg-success/10 border border-success/30 px-1.5 py-0.5 rounded uppercase">
                              <BadgeCheck className="w-2.5 h-2.5" /> Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary">{policy.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-text-muted">
                          <span className="flex items-center gap-1"><Layers className="w-2.5 h-2.5" /> v{policy.version}</span>
                          <SeverityBadge severity={policy.severity} />
                          {criticalCount > 0 && (
                            <span className="flex items-center gap-1 text-red-600 font-bold">
                              <AlertTriangle className="w-2.5 h-2.5" /> {criticalCount} critical rule{criticalCount > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-text-muted flex-shrink-0 ml-4">
                      <p className="font-mono">{policy.id.slice(0, 12)}…</p>
                      <p className="mt-1">{policyRules.length} rules</p>
                    </div>
                  </div>

                  {/* Rules list */}
                  <div className="p-5">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <ListChecks className="w-3 h-3" /> Rules ({policyRules.length})
                    </p>
                    <div className="space-y-2">
                      {policyRules.map((rule) => (
                        <div
                          key={rule.id}
                          className="flex items-start justify-between gap-3 p-3 rounded-xl border border-neutral-100 bg-surface-2 hover:border-primary-200 hover:bg-surface-3 transition-colors"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="w-1 h-full min-h-[28px] rounded-full bg-neutral-200 mt-1 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-text-primary font-mono truncate">{rule.name}</p>
                              <p className="text-[10px] text-text-muted mt-0.5 truncate">{rule.description}</p>
                              <div className="flex items-center gap-2 mt-1.5 text-[9px] text-text-muted flex-wrap">
                                <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> every {rule.interval_seconds}s</span>
                                <span className="bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded font-mono">{rule.evaluation_mode}</span>
                                {rule.is_active ? (
                                  <span className="text-success font-bold">● active</span>
                                ) : (
                                  <span className="text-text-muted">○ inactive</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <SeverityBadge severity={rule.severity} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── 4. RECENT EVIDENCE ─────────────────────────────────────────────── */}
      <section className="bg-surface-1 rounded-2xl border border-neutral-200 shadow-sm p-6">
        <SectionHeader icon={FileSearch} title="Recent Evidence" count={snapshots.length} iconCls="text-violet-600" bgCls="bg-violet-50" />
        
        {snapshots.length === 0 ? (
          <div className="py-8 text-center">
            <FileSearch className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-text-muted">No evidence collected yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {snapshots.slice(0, 5).map((snap) => {
              const isCompliant = snap.status === "compliant";
              return (
                <div key={snap.id} className="flex items-start gap-3 p-3 rounded-xl border border-neutral-100 bg-surface-2 hover:bg-surface-3 transition-colors">
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
        )}
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <Link href="/dashboard/evidence" className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group w-max">
            View all evidence in Evidence Explorer
            <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
