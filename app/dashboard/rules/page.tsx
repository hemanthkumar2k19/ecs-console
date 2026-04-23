"use client";

import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import { ArrowLeft, ListChecks, Clock, Database, AlertTriangle } from "lucide-react";
import { getRules, Rule } from "@/lib/api";
import { useDataTable } from "@/hooks/useDataTable";
import DataTableToolbar from "@/components/dashboard/DataTableToolbar";

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  const table = useDataTable(rules, "name");

  useEffect(() => {
    getRules().then((data) => {
      setRules(data);
      setLoading(false);
    });
  }, []);

  const severityStyle: Record<string, string> = {
    critical: "bg-red-100 text-red-700 border-red-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-green-100 text-green-700 border-green-200",
  };

  const severityDot: Record<string, string> = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-amber-500",
    low: "bg-green-500",
  };

  const renderRow = (rule: Rule) => (
    <tr key={rule.id} className="hover:bg-surface-hover transition-colors group">
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${severityDot[rule.severity] ?? "bg-neutral-400"}`} />
          <div>
            <p className="font-semibold text-text-primary text-xs font-mono">{rule.name}</p>
            <p className="text-[10px] text-text-muted mt-0.5">{rule.description}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className="text-[10px] font-mono text-primary-700 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded">
          {rule.policy}
        </span>
      </td>
      <td className="px-5 py-4">
        <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wide ${severityStyle[rule.severity] ?? "bg-neutral-100 text-neutral-600 border-neutral-200"}`}>
          {rule.severity}
        </span>
      </td>
      <td className="px-5 py-4">
        <span className="text-xs text-text-secondary bg-surface-2 border border-neutral-100 px-2 py-0.5 rounded font-mono">
          {rule.evaluation_mode}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Clock className="w-3 h-3 text-text-muted" />
          <span className="font-mono">{rule.interval_seconds}s</span>
        </div>
      </td>
      <td className="px-5 py-4 max-w-xs">
        <div className="flex items-center gap-1.5">
          <Database className="w-3 h-3 text-text-muted flex-shrink-0" />
          <code className="text-[10px] text-text-secondary font-mono truncate block max-w-[220px]" title={rule.osquery_sql}>
            {rule.osquery_sql}
          </code>
        </div>
      </td>
      <td className="px-5 py-4">
        {rule.is_active ? (
          <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 border border-success/30 px-2 py-0.5 rounded uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
            Active
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded uppercase tracking-wide">
            <AlertTriangle className="w-3 h-3" />
            Inactive
          </span>
        )}
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
          <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
            <ListChecks className="w-5 h-5 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Rules</h1>
        </div>
        <p className="text-sm text-text-secondary ml-12">
          osquery-based evaluation rules across all security policies.
        </p>
      </header>

      {!loading && <DataTableToolbar {...table} searchPlaceholder="Search rules by name..." />}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-surface-1 rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-surface-2">
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Rule Name</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Policy</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Severity</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Mode</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Interval</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">SQL Query</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {Array.isArray(table.processedData) ? (
                table.processedData.length > 0 ? (
                  table.processedData.map(renderRow)
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-text-muted text-sm">
                      No rules found matching your criteria.
                    </td>
                  </tr>
                )
              ) : (
                Object.entries(table.processedData).map(([groupVal, groupRules]) => (
                  <Fragment key={groupVal}>
                    <tr className="bg-surface-3/50 border-t-2 border-neutral-200">
                      <td colSpan={7} className="px-5 py-2 text-xs font-bold text-text-primary uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <span className="text-text-muted">{table.groupByKey} :</span>
                          <span className="bg-primary-50 text-primary-600 px-2 py-0.5 rounded border border-primary-200">{groupVal}</span>
                          <span className="ml-auto text-text-muted font-normal text-[10px]">{groupRules.length} items</span>
                        </div>
                      </td>
                    </tr>
                    {groupRules.map(renderRow)}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-neutral-100 bg-surface-2 flex items-center justify-between">
            <p className="text-xs text-text-muted">
              {Array.isArray(table.processedData) 
                ? `${table.processedData.length} rule${table.processedData.length !== 1 ? 's' : ''}` 
                : `${Object.keys(table.processedData).length} group${Object.keys(table.processedData).length !== 1 ? 's' : ''}`}
            </p>
            <p className="text-xs text-text-muted">{rules.filter((r) => r.is_active).length} active</p>
          </div>
        </div>
      )}
    </div>
  );
}
