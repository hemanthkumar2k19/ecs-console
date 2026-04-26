"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { getProjectAudits, ProjectAudit } from "@/lib/api";
import { useDataTable } from "@/hooks/useDataTable";
import DataTableToolbar from "@/components/dashboard/DataTableToolbar";

export default function ProjectAuditsPage() {
  const [items, setItems] = useState<ProjectAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const table = useDataTable(items, "status");

  useEffect(() => {
    getProjectAudits().then((data) => { setItems(data); setLoading(false); });
  }, []);

  const statusStyle: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
    COMPLETED: "bg-success/10 text-success border-success/30",
    FAILED: "bg-danger/10 text-danger border-danger/30",
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background">
      <header className="mb-4">
        <div className="flex items-center gap-3 mb-5">
          <Link href="/dashboard" className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-2 border border-neutral-200 text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Back to Dashboard</span>
        </div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-sky-600" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Project Audits</h1>
        </div>
        <p className="text-sm text-text-secondary ml-12">Assignments of audit frameworks to active projects.</p>
      </header>

      {!loading && <DataTableToolbar {...table} searchPlaceholder="Search by status..." />}

      {loading ? (
        <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-20 rounded-xl bg-neutral-100 animate-pulse" />)}</div>
      ) : (
        <div className="bg-surface-1 rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-surface-2">
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">ID</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Project</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Audit</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Assigned By</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Assigned At</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Completed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {(Array.isArray(table.processedData) ? table.processedData : Object.values(table.processedData).flat()).map((pa) => (
                <tr key={pa.id} className="hover:bg-surface-hover transition-colors">
                  <td className="px-5 py-4"><span className="text-[10px] font-mono text-text-muted">{pa.id}</span></td>
                  <td className="px-5 py-4"><span className="text-xs font-mono text-text-secondary">{pa.project_id}</span></td>
                  <td className="px-5 py-4"><span className="text-xs font-mono text-text-secondary">{pa.audit_id}</span></td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wide ${statusStyle[pa.status] ?? "bg-neutral-100 text-neutral-600 border-neutral-200"}`}>
                      {pa.status}
                    </span>
                  </td>
                  <td className="px-5 py-4"><span className="text-xs font-mono text-text-muted">{pa.assigned_by}</span></td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono text-text-muted">
                      {new Date(pa.assigned_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono text-text-muted">{pa.completed_at ? new Date(pa.completed_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-neutral-100 bg-surface-2">
            <p className="text-xs text-text-muted">{items.length} assignment{items.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      )}
    </div>
  );
}
