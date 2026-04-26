"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Calendar,
  BookOpen,
  ArrowRight,
  ClipboardList,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { getProjects, getProjectAudits, getAudits, Project, ProjectAudit, Audit } from "@/lib/api";
import { AuthUser } from "@/lib/api";
import { MOCK_STAKEHOLDERS } from "@/lib/mock";

interface StakeholderDashboardProps {
  user: AuthUser;
}

const statusBadge: Record<string, { label: string; cls: string }> = {
  IN_PROGRESS: { label: "In Progress", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  COMPLETED: { label: "Completed", cls: "bg-success/10 text-success border-success/30" },
  PENDING: { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  FAILED: { label: "Failed", cls: "bg-danger/10 text-danger border-danger/30" },
};

export default function StakeholderDashboard({ user }: StakeholderDashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectAudits, setProjectAudits] = useState<ProjectAudit[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProjects(), getProjectAudits(), getAudits()]).then(
      ([p, pa, a]) => {
        // Find this user's stakeholder record(s)
        const stakeholderIds = MOCK_STAKEHOLDERS
          .filter((s) => s.user_id === user.userId)
          .map((s) => s.id);

        // Filter projects belonging to this stakeholder
        const myProjects = p.filter((proj) =>
          stakeholderIds.includes(proj.stakeholder_id)
        );
        setProjects(myProjects);
        setProjectAudits(pa);
        setAudits(a);
        setLoading(false);
      }
    );
  }, [user.userId]);

  const getAuditName = (auditId: string) =>
    audits.find((a) => a.id === auditId)?.name ?? auditId;

  const getProjectAuditStats = (projectId: string) => {
    const pas = projectAudits.filter((pa) => pa.project_id === projectId);
    return {
      total: pas.length,
      completed: pas.filter((pa) => pa.status === "COMPLETED").length,
      inProgress: pas.filter((pa) => pa.status === "IN_PROGRESS").length,
      audits: pas,
    };
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 space-y-4">
        <div className="h-12 w-64 bg-neutral-100 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 rounded-2xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background">
      {/* Header */}
      <header className="mb-8">
        <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">
          Stakeholder Portal
        </p>
        <h1 className="text-2xl font-bold text-text-primary leading-tight">
          Welcome back, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Here are your active projects and their audit progress.
        </p>
      </header>

      {/* Summary strip */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 border border-teal-200">
          <FolderKanban className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-bold text-teal-700">{projects.length} Projects</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-blue-700">
            {projectAudits.filter((pa) =>
              projects.some((p) => p.id === pa.project_id)
            ).length} Audits assigned
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-success/10 border border-success/30">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span className="text-xs font-bold text-success">
            {projectAudits.filter(
              (pa) =>
                pa.status === "COMPLETED" &&
                projects.some((p) => p.id === pa.project_id)
            ).length} Completed
          </span>
        </div>
      </div>

      {/* Project Cards */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderKanban className="w-12 h-12 text-neutral-300 mb-4" />
          <p className="text-text-muted font-medium">No projects assigned to your account.</p>
          <p className="text-xs text-text-muted mt-1">Contact your administrator to get access.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => {
            const stats = getProjectAuditStats(project.id);
            const progressPct = stats.total > 0
              ? Math.round((stats.completed / stats.total) * 100)
              : 0;

            return (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="group bg-surface-1 rounded-2xl border border-neutral-200 shadow-sm p-6 hover:shadow-md hover:border-teal-300 hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <FolderKanban className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded border bg-success/10 text-success border-success/30 uppercase tracking-wide">
                    {project.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-text-primary mb-1 group-hover:text-teal-700 transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs text-text-muted mb-4 flex-1">{project.description}</p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] text-text-muted mb-1.5">
                    <span className="flex items-center gap-1">
                      <ClipboardList className="w-3 h-3" />
                      {stats.completed}/{stats.total} audits complete
                    </span>
                    <span className="font-bold text-teal-600">{progressPct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all duration-700"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Audit tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {stats.audits.slice(0, 3).map((pa) => {
                    const badge = statusBadge[pa.status] ?? { label: pa.status, cls: "bg-neutral-100 text-neutral-600 border-neutral-200" };
                    return (
                      <span
                        key={pa.id}
                        className={`text-[10px] font-medium border px-2 py-0.5 rounded ${badge.cls}`}
                      >
                        {getAuditName(pa.audit_id)}
                      </span>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  {project.due_date && (
                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Due{" "}
                        {new Date(project.due_date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-teal-600 group-hover:gap-2 transition-all">
                    View details <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
