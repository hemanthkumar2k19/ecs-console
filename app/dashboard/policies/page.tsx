"use client";

import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Tag, FileText, CheckCircle2 } from "lucide-react";
import { getPolicies, Policy } from "@/lib/api";
import { useDataTable } from "@/hooks/useDataTable";
import DataTableToolbar from "@/components/dashboard/DataTableToolbar";

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  const table = useDataTable(policies, "name");

  useEffect(() => {
    getPolicies().then((data) => {
      setPolicies(data);
      setLoading(false);
    });
  }, []);

  const renderCard = (policy: Policy) => (
    <div
      key={policy.id}
      className="bg-surface-1 rounded-xl border border-neutral-200 shadow-sm p-6 hover:shadow-md hover:border-primary-200 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary font-mono">{policy.name}</h3>
            <p className="text-xs text-text-muted mt-0.5">{policy.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {policy.is_active && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 border border-success/30 px-2 py-1 rounded uppercase tracking-wide">
              <CheckCircle2 className="w-3 h-3" />
              Active
            </span>
          )}
          <span className="text-[10px] font-mono text-text-muted bg-surface-2 border border-neutral-100 px-2 py-1 rounded">
            v{policy.version}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Component Binding */}
        <div className="rounded-lg bg-surface-2 border border-neutral-100 p-3">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
            <Tag className="w-3 h-3" /> Component Binding
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-text-primary bg-surface-1 border border-neutral-200 px-2 py-0.5 rounded font-mono">
              Component ID
            </span>
            <span className="text-xs text-text-muted font-mono">
              =
            </span>
            <span className="text-xs font-bold text-primary-700 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded font-mono truncate max-w-[150px]" title={policy.component_id}>
              {policy.component_id}
            </span>
          </div>
        </div>

        {/* Rules */}
        <div className="rounded-lg bg-surface-2 border border-neutral-100 p-3">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
            <FileText className="w-3 h-3" /> Rules ({(policy.rules || []).length})
          </p>
          <div className="flex flex-wrap gap-1">
            {(policy.rules || []).map((rule, i) => (
              <span
                key={i}
                className="text-[10px] font-mono text-text-secondary bg-surface-1 border border-neutral-200 px-2 py-0.5 rounded"
              >
                {rule}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[10px] text-text-muted">
        <span className="font-mono">ID: {policy.id}</span>
        <span>
          Created{" "}
          {new Date(policy.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
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
            <ShieldCheck className="w-5 h-5 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Security Policies</h1>
        </div>
        <p className="text-sm text-text-secondary ml-12">
          Active compliance baselines and their rule assignments.
        </p>
      </header>

      {!loading && <DataTableToolbar {...table} searchPlaceholder="Search policies by name..." />}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Array.isArray(table.processedData) ? (
            table.processedData.length > 0 ? (
              table.processedData.map(renderCard)
            ) : (
              <div className="p-8 text-center text-text-muted text-sm bg-surface-1 rounded-xl border border-neutral-200">
                No policies found matching your criteria.
              </div>
            )
          ) : (
            Object.entries(table.processedData).map(([groupVal, groupPolicies]) => (
              <Fragment key={groupVal}>
                <div className="flex items-center gap-2 mt-8 mb-2">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{table.groupByKey} :</span>
                  <span className="text-xs font-bold bg-primary-50 text-primary-600 px-2 py-0.5 rounded border border-primary-200">{groupVal}</span>
                  <span className="ml-auto text-text-muted font-normal text-[10px]">{groupPolicies.length} items</span>
                </div>
                {groupPolicies.map(renderCard)}
              </Fragment>
            ))
          )}
        </div>
      )}
    </div>
  );
}
