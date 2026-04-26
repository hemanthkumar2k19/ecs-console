"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FolderKanban,
  BookOpen,
  CheckCircle2,
  Clock3,
  XCircle,
  Calendar,
  Users,
  ClipboardList,
  Monitor,
  Cpu,
  Globe,
  Tag,
  Database,
  Server,
  Activity,
} from "lucide-react";
import {
  getProjects,
  getProjectAudits,
  getAudits,
  getHosts,
  getComponents,
  Project,
  ProjectAudit,
  Audit,
  Host,
  Component,
} from "@/lib/api";

// ─── Status configs ──────────────────────────────────────────────────────────

const auditStatusCfg: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
  IN_PROGRESS: { label: "In Progress", icon: Clock3, cls: "bg-blue-50 text-blue-700 border-blue-200" },
  COMPLETED: { label: "Completed", icon: CheckCircle2, cls: "bg-success/10 text-success border-success/30" },
  PENDING: { label: "Pending", icon: Clock3, cls: "bg-amber-50 text-amber-700 border-amber-200" },
  FAILED: { label: "Failed", icon: XCircle, cls: "bg-danger/10 text-danger border-danger/30" },
};

const componentTypeIcon: Record<string, React.ElementType> = {
  database: Database,
  webserver: Server,
};

const componentTypeColor: Record<string, string> = {
  database: "bg-amber-50 text-amber-700 border-amber-200",
  webserver: "bg-blue-50 text-blue-700 border-blue-200",
};

const hostTypeColor: Record<string, string> = {
  yugabyte: "bg-amber-100 text-amber-700 border-amber-200",
  postgres: "bg-blue-100 text-blue-700 border-blue-200",
};

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

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [projectAudits, setProjectAudits] = useState<ProjectAudit[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProjects(),
      getProjectAudits(),
      getAudits(),
      getHosts(),
      getComponents(),
    ]).then(([projects, pas, auds, allHosts, allComponents]) => {
      const found = projects.find((p) => p.id === id) ?? null;
      const projectHosts = allHosts.filter((h) => h.project_id === id);
      const componentIds = new Set(projectHosts.map((h) => h.component_id));
      const projectComponents = allComponents.filter((c) => componentIds.has(c.id));

      setProject(found);
      setProjectAudits(pas.filter((pa) => pa.project_id === id));
      setAudits(auds);
      setHosts(projectHosts);
      setComponents(projectComponents);
      setLoading(false);
    });
  }, [id]);

  const getAudit = (auditId: string) => audits.find((a) => a.id === auditId);
  const getComponent = (componentId: string) => components.find((c) => c.id === componentId);

  const completed = projectAudits.filter((pa) => pa.status === "COMPLETED").length;
  const progressPct = projectAudits.length > 0
    ? Math.round((completed / projectAudits.length) * 100)
    : 0;

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex-1 p-8 space-y-6">
        <div className="h-10 w-48 bg-neutral-100 rounded-xl animate-pulse" />
        <div className="h-36 bg-neutral-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="h-48 bg-neutral-100 rounded-2xl animate-pulse" />
          <div className="h-48 bg-neutral-100 rounded-2xl animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-neutral-100 rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <FolderKanban className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-text-primary font-bold">Project not found</p>
          <Link href="/dashboard" className="text-xs text-teal-600 hover:underline mt-1 inline-block">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background space-y-6">

      {/* Back nav */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-2 border border-neutral-200 text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors"
          title="Back to My Projects"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
          Back to My Projects
        </span>
      </div>

      {/* ── 1. PROJECT DETAILS ─────────────────────────────────────────────── */}
      <section className="bg-surface-1 rounded-2xl border border-neutral-200 shadow-sm p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center flex-shrink-0">
              <FolderKanban className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-0.5">
                Project Dashboard
              </p>
              <h1 className="text-xl font-bold text-text-primary">{project.name}</h1>
              <p className="text-sm text-text-secondary mt-0.5">{project.description}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg border bg-success/10 text-success border-success/30 uppercase tracking-wide flex-shrink-0">
            {project.status}
          </span>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-neutral-100 pt-5">
          {[
            { label: "App ID", value: String(project.app_id), mono: true },
            { label: "Stakeholder", value: project.stakeholder_id, mono: true },
            { label: "Due Date", value: project.due_date ? new Date(project.due_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—", mono: false },
            { label: "Created", value: new Date(project.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), mono: false },
          ].map(({ label, value, mono }) => (
            <div key={label} className="bg-surface-2 rounded-xl p-3 border border-neutral-100">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{label}</p>
              <p className={`text-xs font-semibold text-text-primary truncate ${mono ? "font-mono" : ""}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Audit progress bar */}
        <div className="mt-5 pt-5 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-teal-500" />
              Audit Progress
            </span>
            <span className="text-xs font-bold text-teal-600">{progressPct}% complete</span>
          </div>
          <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="flex gap-5 mt-2 text-[10px] text-text-muted">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-success" />{completed} Completed</span>
            <span className="flex items-center gap-1"><Clock3 className="w-3 h-3 text-blue-500" />{projectAudits.filter(pa => pa.status === "IN_PROGRESS").length} In Progress</span>
            <span className="flex items-center gap-1"><ClipboardList className="w-3 h-3 text-text-muted" />{projectAudits.length} Total</span>
          </div>
        </div>
      </section>

      {/* ── 2. HOSTS PREVIEW + COMPONENTS PREVIEW ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Hosts Preview */}
        <section className="bg-surface-1 rounded-2xl border border-neutral-200 shadow-sm p-6">
          <SectionHeader icon={Monitor} title="Hosts" count={hosts.length} iconCls="text-primary-600" bgCls="bg-primary-50" />
          {hosts.length === 0 ? (
            <p className="text-xs text-text-muted text-center py-6">No hosts enrolled in this project.</p>
          ) : (
            <div className="space-y-3">
              {hosts.map((host) => {
                const comp = getComponent(host.component_id);
                return (
                  <Link
                    key={host.id}
                    href={`/dashboard/hosts/${host.id}`}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-100 bg-surface-2 hover:border-primary-200 hover:bg-surface-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <Monitor className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-bold text-text-primary truncate">{host.name}</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${hostTypeColor[host.type] ?? "bg-neutral-100 text-neutral-600 border-neutral-200"}`}>
                          {host.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-text-muted flex-wrap">
                        <span className="flex items-center gap-1"><Globe className="w-2.5 h-2.5" />{host.ip}</span>
                        <span>{host.os_family} · {host.os_version}</span>
                        <span className="text-text-secondary font-medium">{host.env}</span>
                      </div>
                      {comp && (
                        <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-violet-700 bg-violet-50 border border-violet-200 px-1.5 py-0.5 rounded">
                          <Cpu className="w-2.5 h-2.5" />{comp.display_name}
                        </span>
                      )}
                      {host.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {host.tags.map((tag, i) => (
                            <span key={i} className="flex items-center gap-0.5 text-[9px] bg-surface-1 border border-neutral-200 rounded px-1.5 py-0.5 text-text-muted">
                              <Tag className="w-2 h-2" />
                              {tag.key}={tag.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Components Preview */}
        <section className="bg-surface-1 rounded-2xl border border-neutral-200 shadow-sm p-6">
          <SectionHeader icon={Cpu} title="Components" count={components.length} iconCls="text-violet-600" bgCls="bg-violet-50" />
          {components.length === 0 ? (
            <p className="text-xs text-text-muted text-center py-6">No components linked to this project.</p>
          ) : (
            <div className="space-y-3">
              {components.map((comp) => {
                const CompIcon = componentTypeIcon[comp.type] ?? Cpu;
                const relatedHosts = hosts.filter((h) => h.component_id === comp.id);
                return (
                  <div
                    key={comp.id}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-100 bg-surface-2 hover:border-violet-200 hover:bg-surface-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                      <CompIcon className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-bold text-text-primary">{comp.display_name}</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${componentTypeColor[comp.type] ?? "bg-neutral-100 text-neutral-600 border-neutral-200"}`}>
                          {comp.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-text-muted mb-2">{comp.description}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                        <Monitor className="w-2.5 h-2.5" />
                        <span>{relatedHosts.length} host{relatedHosts.length !== 1 ? "s" : ""} enrolled</span>
                        {relatedHosts.map((h) => (
                          <span key={h.id} className="font-mono text-text-secondary bg-surface-1 border border-neutral-200 px-1.5 py-0.5 rounded">
                            {h.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Activity className="w-3 h-3 text-success" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ── 3. AUDIT ASSIGNMENTS ──────────────────────────────────────────── */}
      <section>
        <SectionHeader icon={BookOpen} title="Audit Assignments" count={projectAudits.length} iconCls="text-violet-600" bgCls="bg-violet-50" />
        <div className="space-y-3">
          {projectAudits.map((pa) => {
            const audit = getAudit(pa.audit_id);
            const cfg = auditStatusCfg[pa.status] ?? { label: pa.status, icon: Clock3, cls: "bg-neutral-100 text-neutral-600 border-neutral-200" };
            const StatusIcon = cfg.icon;

            return (
              <div
                key={pa.id}
                className="bg-surface-1 rounded-xl border border-neutral-200 shadow-sm p-5 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{audit?.name ?? pa.audit_id}</p>
                    <p className="text-xs text-text-muted mt-0.5">{audit?.description ?? "—"}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-text-muted">
                      <span>Assigned: {new Date(pa.assigned_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      {pa.completed_at && (
                        <span className="text-success font-medium">
                          ✓ Completed: {new Date(pa.completed_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wide flex-shrink-0 ${cfg.cls}`}>
                  <StatusIcon className="w-3 h-3" />
                  {cfg.label}
                </span>
              </div>
            );
          })}

          {projectAudits.length === 0 && (
            <div className="py-10 text-center text-text-muted text-sm bg-surface-1 rounded-xl border border-neutral-200">
              No audits assigned to this project yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
