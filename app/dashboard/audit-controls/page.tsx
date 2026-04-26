"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ListTree } from "lucide-react";
import { getAuditControls, AuditControl } from "@/lib/api";
import { useDataTable } from "@/hooks/useDataTable";
import DataTableToolbar from "@/components/dashboard/DataTableToolbar";

export default function AuditControlsPage() {
  const [controls, setControls] = useState<AuditControl[]>([]);
  const [loading, setLoading] = useState(true);
  const table = useDataTable(controls, "name");

  useEffect(() => {
    getAuditControls().then((data) => { setControls(data); setLoading(false); });
  }, []);

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
          <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
            <ListTree className="w-5 h-5 text-rose-600" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Audit Controls</h1>
        </div>
        <p className="text-sm text-text-secondary ml-12">CIS-style control groupings within each audit framework.</p>
      </header>

      {!loading && <DataTableToolbar {...table} searchPlaceholder="Search controls by name..." />}

      {loading ? (
        <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-20 rounded-xl bg-neutral-100 animate-pulse" />)}</div>
      ) : (
        <div className="bg-surface-1 rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-surface-2">
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Control Name</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Ref</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Audit ID</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Description</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {(Array.isArray(table.processedData) ? table.processedData : Object.values(table.processedData).flat()).map((c) => (
                <tr key={c.id} className="hover:bg-surface-hover transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                        <ListTree className="w-3.5 h-3.5 text-rose-600" />
                      </div>
                      <p className="font-semibold text-text-primary text-xs">{c.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      {c.control_ref ?? "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4"><span className="text-xs text-text-muted font-mono">{c.audit_id}</span></td>
                  <td className="px-5 py-4"><span className="text-xs text-text-secondary">{c.description ?? "—"}</span></td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-text-muted font-mono">
                      {new Date(c.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-neutral-100 bg-surface-2">
            <p className="text-xs text-text-muted">{controls.length} control{controls.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      )}
    </div>
  );
}
