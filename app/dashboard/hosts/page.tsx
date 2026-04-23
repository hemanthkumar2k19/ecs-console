"use client";

import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import { ArrowLeft, Monitor, Tag, Cpu, Globe } from "lucide-react";
import { getHosts, Host } from "@/lib/api";
import { useDataTable } from "@/hooks/useDataTable";
import DataTableToolbar from "@/components/dashboard/DataTableToolbar";

export default function HostsPage() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);

  const table = useDataTable(hosts, "name");

  useEffect(() => {
    getHosts().then((data) => {
      setHosts(data);
      setLoading(false);
    });
  }, []);

  const typeColor: Record<string, string> = {
    yugabyte: "bg-amber-100 text-amber-700 border-amber-200",
    postgres: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const renderRow = (host: Host) => (
    <tr key={host.id} className="hover:bg-surface-hover transition-colors group">
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            <Cpu className="w-3.5 h-3.5 text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-text-primary text-xs">{host.name}</p>
            <p className="text-[10px] text-text-muted font-mono">{host.id.slice(0, 8)}…</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wide ${typeColor[host.type] ?? "bg-neutral-100 text-neutral-600 border-neutral-200"}`}>
          {host.type}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 text-text-secondary font-mono text-xs">
          <Globe className="w-3 h-3 text-text-muted" />
          {host.ip}
        </div>
      </td>
      <td className="px-5 py-4">
        <div>
          <p className="text-xs text-text-primary font-medium">{host.os_family}</p>
          <p className="text-[10px] text-text-muted">{host.os_version}</p>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className="text-xs font-medium text-text-secondary bg-surface-2 px-2 py-0.5 rounded border border-neutral-100">
          {host.env}
        </span>
      </td>
      <td className="px-5 py-4">
        <span className="text-xs text-text-secondary font-mono">{host.project_id}</span>
      </td>
      <td className="px-5 py-4">
        <div className="flex flex-wrap gap-1">
          {host.tags.map((tag, i) => (
            <div key={i} className="flex items-center gap-1 text-[10px] bg-surface-3 border border-neutral-200 rounded px-1.5 py-0.5">
              <Tag className="w-2.5 h-2.5 text-text-muted" />
              <span className="text-text-secondary font-medium">{tag.key}</span>
              <span className="text-text-muted">=</span>
              <span className="text-text-primary font-bold">{tag.value}</span>
            </div>
          ))}
        </div>
      </td>
      <td className="px-5 py-4">
        <span className="text-xs text-text-muted font-mono">
          {new Date(host.created_at).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
          })}
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
          <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
            <Monitor className="w-5 h-5 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Hosts</h1>
        </div>
        <p className="text-sm text-text-secondary ml-12">
          All enrolled hosts across your infrastructure.
        </p>
      </header>

      {!loading && <DataTableToolbar {...table} searchPlaceholder="Search hosts by name..." />}

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
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">IP</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">OS</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Environment</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Project</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Tags</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Enrolled At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {Array.isArray(table.processedData) ? (
                table.processedData.length > 0 ? (
                  table.processedData.map(renderRow)
                ) : (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-text-muted text-sm">
                      No hosts found matching your criteria.
                    </td>
                  </tr>
                )
              ) : (
                Object.entries(table.processedData).map(([groupVal, groupHosts]) => (
                  <Fragment key={groupVal}>
                    <tr className="bg-surface-3/50 border-t-2 border-neutral-200">
                      <td colSpan={8} className="px-5 py-2 text-xs font-bold text-text-primary uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <span className="text-text-muted">{table.groupByKey} :</span>
                          <span className="bg-primary-50 text-primary-600 px-2 py-0.5 rounded border border-primary-200">{groupVal}</span>
                          <span className="ml-auto text-text-muted font-normal text-[10px]">{groupHosts.length} items</span>
                        </div>
                      </td>
                    </tr>
                    {groupHosts.map(renderRow)}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
          
          <div className="px-5 py-3 border-t border-neutral-100 bg-surface-2 flex items-center justify-between">
            <p className="text-xs text-text-muted">
              {Array.isArray(table.processedData) 
                ? `${table.processedData.length} item${table.processedData.length !== 1 ? 's' : ''}` 
                : `${Object.keys(table.processedData).length} group${Object.keys(table.processedData).length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
