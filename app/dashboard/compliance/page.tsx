"use client";

import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardCheck, CheckCircle2, XCircle, Server, Clock } from "lucide-react";
import { getStateSnapshots, StateSnapshot } from "@/lib/api";
import { useDataTable } from "@/hooks/useDataTable";
import DataTableToolbar from "@/components/dashboard/DataTableToolbar";

export default function CompliancePage() {
  const [snapshots, setSnapshots] = useState<StateSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  const table = useDataTable(snapshots, "rule_name");

  useEffect(() => {
    getStateSnapshots().then((data) => {
      setSnapshots(data);
      setLoading(false);
    });
  }, []);

  const renderRow = (snap: StateSnapshot) => {
    const col = snap.columns[0];
    const isCompliant = snap.status === "compliant";
    return (
      <tr key={snap.id} className="hover:bg-surface-hover transition-colors group">
        <td className="px-5 py-4">
          <span className="text-xs font-semibold text-text-primary font-mono">{snap.rule_name}</span>
        </td>
        <td className="px-5 py-4">
          <div className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs text-text-primary font-medium">{snap.host_name}</span>
          </div>
        </td>
        <td className="px-5 py-4">
          {isCompliant ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 border border-success/30 px-2 py-0.5 rounded uppercase tracking-wide w-fit">
              <CheckCircle2 className="w-3 h-3" />
              Pass
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold text-danger bg-danger/10 border border-danger/30 px-2 py-0.5 rounded uppercase tracking-wide w-fit">
              <XCircle className="w-3 h-3" />
              Fail
            </span>
          )}
        </td>
        <td className="px-5 py-4">
          <span className="text-xs text-text-secondary font-mono">{col?.name ?? "—"}</span>
        </td>
        <td className="px-5 py-4">
          <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${
            isCompliant
              ? "text-success bg-success/10 border-success/20"
              : "text-danger bg-danger/10 border-danger/20"
          }`}>
            {col?.setting ?? "—"}
          </span>
        </td>
        <td className="px-5 py-4">
          <span className="text-[10px] text-text-muted bg-surface-2 border border-neutral-100 px-2 py-0.5 rounded font-mono">
            {col?.source ?? "—"}
          </span>
        </td>
        <td className="px-5 py-4">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock className="w-3 h-3" />
            <span className="font-mono">
              {new Date(snap.snapshot_time).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </td>
      </tr>
    );
  };

  const getStats = (data: typeof table.processedData) => {
    let list = Array.isArray(data) ? data : Object.values(data).flat();
    return {
      compliant: list.filter((s) => s.status === "compliant").length,
      nonCompliant: list.filter((s) => s.status === "non-compliant").length,
      total: list.length
    };
  };

  const filteredStats = getStats(table.processedData);

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
          <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Compliance</h1>
        </div>
        <p className="text-sm text-text-secondary ml-12">
          Latest state snapshots and compliance check results per host and rule.
        </p>
      </header>

      {/* Summary Chips - Updates dynamically based on filtered data */}
      {!loading && (
        <div className="flex gap-3 mb-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/30">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="text-xs font-bold text-success">{filteredStats.compliant} Compliant</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-danger/10 border border-danger/30">
            <XCircle className="w-4 h-4 text-danger" />
            <span className="text-xs font-bold text-danger">{filteredStats.nonCompliant} Non-Compliant</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-2 border border-neutral-200">
            <span className="text-xs font-bold text-text-secondary">{filteredStats.total} Total Checks</span>
          </div>
        </div>
      )}

      {!loading && <DataTableToolbar {...table} searchPlaceholder="Search by rule name..." />}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-surface-1 rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-surface-2">
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Rule</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Host</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Setting</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Value</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Source</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Verified At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {Array.isArray(table.processedData) ? (
                table.processedData.length > 0 ? (
                  table.processedData.map(renderRow)
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-text-muted text-sm">
                      No snapshots found matching your criteria.
                    </td>
                  </tr>
                )
              ) : (
                Object.entries(table.processedData).map(([groupVal, groupSnaps]) => (
                  <Fragment key={groupVal}>
                    <tr className="bg-surface-3/50 border-t-2 border-neutral-200">
                      <td colSpan={7} className="px-5 py-2 text-xs font-bold text-text-primary uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <span className="text-text-muted">{table.groupByKey} :</span>
                          <span className="bg-primary-50 text-primary-600 px-2 py-0.5 rounded border border-primary-200">{groupVal}</span>
                          <span className="ml-auto text-text-muted font-normal text-[10px]">{groupSnaps.length} items</span>
                        </div>
                      </td>
                    </tr>
                    {groupSnaps.map(renderRow)}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-neutral-100 bg-surface-2 flex items-center justify-between">
            <p className="text-xs text-text-muted">
              {Array.isArray(table.processedData) 
                ? `${table.processedData.length} snapshot${table.processedData.length !== 1 ? 's' : ''}` 
                : `${Object.keys(table.processedData).length} group${Object.keys(table.processedData).length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
