"use client";

import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import { ArrowLeft, FolderKanban, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { getProjects, Project } from "@/lib/api";
import { useDataTable } from "@/hooks/useDataTable";
import DataTableToolbar from "@/components/dashboard/DataTableToolbar";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const table = useDataTable(projects, "name");

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const statusStyle: Record<string, string> = {
    ACTIVE: "bg-success/10 text-success border-success/30",
    INACTIVE: "bg-neutral-100 text-neutral-500 border-neutral-200",
    COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
    ARCHIVED: "bg-orange-50 text-orange-700 border-orange-200",
  };

  const renderRow = (p: Project) => (
    <tr key={p.id} className="hover:bg-surface-hover transition-colors group">
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
            <FolderKanban className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div>
            <p className="font-semibold text-text-primary text-xs">{p.name}</p>
            <p className="text-[10px] text-text-muted">{p.description}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wide ${statusStyle[p.status] ?? "bg-neutral-100 text-neutral-600 border-neutral-200"}`}>
          {p.status}
        </span>
      </td>
      <td className="px-5 py-4">
        <span className="text-xs font-mono text-text-muted bg-surface-2 border border-neutral-100 px-2 py-0.5 rounded">
          {p.stakeholder_id}
        </span>
      </td>
      <td className="px-5 py-4">
        {p.due_date ? (
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Calendar className="w-3 h-3 text-text-muted" />
            <span className="font-mono">
              {new Date(p.due_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </div>
        ) : (
          <span className="text-text-muted text-xs">—</span>
        )}
      </td>
      <td className="px-5 py-4">
        <span className="text-xs text-text-muted font-mono">
          {new Date(p.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background">
      <header className="mb-4">
        <div className="flex items-center gap-3 mb-5">
          <Link href="/dashboard" className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-2 border border-neutral-200 text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors" title="Back to Dashboard">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Back to Dashboard</span>
        </div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
        </div>
        <p className="text-sm text-text-secondary ml-12">
          Active infrastructure projects with associated stakeholders and audits.
        </p>
      </header>

      {!loading && <DataTableToolbar {...table} searchPlaceholder="Search projects by name..." />}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-20 rounded-xl bg-neutral-100 animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-surface-1 rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-surface-2">
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Stakeholder</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Due Date</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {Array.isArray(table.processedData) ? (
                table.processedData.length > 0 ? (
                  table.processedData.map(renderRow)
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-text-muted text-sm">No projects found.</td>
                  </tr>
                )
              ) : (
                Object.entries(table.processedData).map(([groupVal, groupItems]) => (
                  <Fragment key={groupVal}>
                    <tr className="bg-surface-3/50 border-t-2 border-neutral-200">
                      <td colSpan={5} className="px-5 py-2 text-xs font-bold text-text-primary uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <span className="text-text-muted">{table.groupByKey} :</span>
                          <span className="bg-teal-50 text-teal-600 px-2 py-0.5 rounded border border-teal-200">{groupVal}</span>
                          <span className="ml-auto text-text-muted font-normal text-[10px]">{groupItems.length} items</span>
                        </div>
                      </td>
                    </tr>
                    {groupItems.map(renderRow)}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-neutral-100 bg-surface-2">
            <p className="text-xs text-text-muted">
              {Array.isArray(table.processedData)
                ? `${table.processedData.length} project${table.processedData.length !== 1 ? "s" : ""}`
                : `${Object.keys(table.processedData).length} groups`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
