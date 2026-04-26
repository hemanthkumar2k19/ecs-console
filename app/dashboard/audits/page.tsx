"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getAudits, Audit } from "@/lib/api";
import { useDataTable } from "@/hooks/useDataTable";
import DataTableToolbar from "@/components/dashboard/DataTableToolbar";

export default function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const table = useDataTable(audits, "name");

  useEffect(() => {
    getAudits().then((data) => { setAudits(data); setLoading(false); });
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
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-violet-600" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Audits</h1>
        </div>
        <p className="text-sm text-text-secondary ml-12">High-level audit frameworks (e.g. CSITE, ITPP) applied to projects.</p>
      </header>

      {!loading && <DataTableToolbar {...table} searchPlaceholder="Search audits by name..." />}

      {loading ? (
        <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-20 rounded-xl bg-neutral-100 animate-pulse" />)}</div>
      ) : (
        <div className="bg-surface-1 rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-surface-2">
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Description</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Created By</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {(Array.isArray(table.processedData) ? table.processedData : Object.values(table.processedData).flat()).map((a) => (
                <tr key={a.id} className="hover:bg-surface-hover transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-3.5 h-3.5 text-violet-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary text-xs">{a.name}</p>
                        <p className="text-[10px] text-text-muted font-mono">{a.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className="text-xs text-text-secondary">{a.description ?? "—"}</span></td>
                  <td className="px-5 py-4"><span className="text-xs text-text-muted font-mono">{a.created_by}</span></td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-text-muted font-mono">
                      {new Date(a.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-neutral-100 bg-surface-2">
            <p className="text-xs text-text-muted">{audits.length} audit{audits.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      )}
    </div>
  );
}
