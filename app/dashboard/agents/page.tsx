"use client";

import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, Activity, Clock, Server } from "lucide-react";
import { getAgents, Agent } from "@/lib/api";
import { useDataTable } from "@/hooks/useDataTable";
import DataTableToolbar from "@/components/dashboard/DataTableToolbar";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const table = useDataTable(agents, "host_name");

  useEffect(() => {
    getAgents().then((data) => {
      setAgents(data);
      setLoading(false);
    });
  }, []);

  const statusStyle: Record<string, string> = {
    active: "bg-success/10 text-success border-success/30",
    inactive: "bg-neutral-100 text-neutral-500 border-neutral-200",
    decommissioned: "bg-danger/10 text-danger border-danger/30",
  };

  const renderRow = (agent: Agent) => (
    <tr key={agent.id} className="hover:bg-surface-hover transition-colors group cursor-pointer">
      <td className="px-5 py-4">
        <Link href={`/dashboard/agents/${agent.id}`} className="flex items-center gap-2 hover:opacity-80">
          <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            <Bot className="w-3.5 h-3.5 text-primary-600" />
          </div>
          <span className="text-[10px] text-text-muted font-mono group-hover:text-primary-600 transition-colors">{agent.id.slice(0, 16)}…</span>
        </Link>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs font-semibold text-text-primary">{agent.host_name}</span>
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${agent.status === "active" ? "bg-success animate-pulse" : "bg-neutral-400"}`} />
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${statusStyle[agent.status] ?? "bg-neutral-100 text-neutral-600"}`}>
            {agent.status}
          </span>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className="text-xs font-mono text-text-secondary bg-surface-2 px-2 py-0.5 rounded border border-neutral-100">
          v{agent.version}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Clock className="w-3 h-3 text-text-muted" />
          <span className="font-mono">
            {new Date(agent.last_seen).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${agent.osquery_instance.is_active ? "bg-success" : "bg-neutral-400"}`} />
          <span className="text-[10px] font-mono text-text-muted">
            {agent.osquery_instance.id.slice(0, 12)}…
          </span>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className="text-xs text-text-muted font-mono">
          {new Date(agent.created_at).toLocaleDateString("en-GB", {
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
            <Bot className="w-5 h-5 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Agents</h1>
        </div>
        <p className="text-sm text-text-secondary ml-12">
          Deployed osquery agents and their live status.
        </p>
      </header>

      {!loading && <DataTableToolbar {...table} searchPlaceholder="Search agents by host name..." />}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-surface-1 rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-surface-2">
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Agent ID</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Host</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Version</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Last Seen</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">osquery Instance</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Enrolled At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {Array.isArray(table.processedData) ? (
                // Ungrouped
                table.processedData.length > 0 ? (
                  table.processedData.map(renderRow)
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-text-muted text-sm">
                      No agents found matching your criteria.
                    </td>
                  </tr>
                )
              ) : (
                // Grouped
                Object.entries(table.processedData).map(([groupVal, groupAgents]) => (
                  <Fragment key={groupVal}>
                    <tr className="bg-surface-3/50 border-t-2 border-neutral-200">
                      <td colSpan={7} className="px-5 py-2 text-xs font-bold text-text-primary uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <span className="text-text-muted">{table.groupByKey} :</span>
                          <span className="bg-primary-50 text-primary-600 px-2 py-0.5 rounded border border-primary-200">{groupVal}</span>
                          <span className="ml-auto text-text-muted font-normal text-[10px]">{groupAgents.length} items</span>
                        </div>
                      </td>
                    </tr>
                    {groupAgents.map(renderRow)}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-neutral-100 bg-surface-2 flex items-center justify-between">
            <p className="text-xs text-text-muted">
              {Array.isArray(table.processedData) 
                ? `${table.processedData.length} agent${table.processedData.length !== 1 ? 's' : ''}` 
                : `${Object.keys(table.processedData).length} group${Object.keys(table.processedData).length !== 1 ? 's' : ''}`}
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-success font-medium">
              <Activity className="w-3 h-3" />
              {agents.filter((a) => a.status === "active").length} active overall
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
