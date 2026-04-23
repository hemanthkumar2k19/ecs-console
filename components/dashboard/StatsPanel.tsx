"use client";

import { useEffect, useState } from "react";
import {
  Monitor,
  Bot,
  ShieldCheck,
  ListChecks,
  Activity,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import StatCard from "./StatCard";
import {
  getDashboardStats,
  getActivityFeed,
  getComplianceTimeline,
  DashboardStats,
  ActivityItem,
  CompliancePoint,
} from "@/lib/api";

export default function StatsPanel() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [compliance, setCompliance] = useState<CompliancePoint[]>([]);

  useEffect(() => {
    getDashboardStats().then(setStats);
    getActivityFeed().then(setActivity);
    getComplianceTimeline().then(setCompliance);
  }, []);

  if (!stats) return <div className="flex-1 p-8 animate-pulse bg-gray-50" />;

  const maxVal = Math.max(...compliance.map((c) => c.compliant + c.non_compliant), 1);

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary leading-tight">System Overview</h1>
        <p className="text-sm text-text-secondary mt-1">
          Real-time status of your evidence collection infrastructure.
        </p>
      </header>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Hosts"
          value={stats.hosts.total.toLocaleString()}
          trend={stats.hosts.trend}
          icon={Monitor}
          description={`${stats.hosts.active} active nodes`}
          breakdown={stats.hosts.breakdown}
          href="/dashboard/hosts"
        />
        <StatCard
          title="Active Agents"
          value={stats.agents.total.toLocaleString()}
          trend={stats.agents.trend}
          icon={Bot}
          description={`${stats.agents.online} online now`}
          breakdown={stats.agents.breakdown}
          href="/dashboard/agents"
        />
        <StatCard
          title="Security Policies"
          value={stats.policies.total.toLocaleString()}
          trend={stats.policies.trend}
          icon={ShieldCheck}
          description={`${stats.policies.active} enforced`}
          breakdown={stats.policies.breakdown}
          href="/dashboard/policies"
        />
        <StatCard
          title="Active Rules"
          value={stats.rules.total.toLocaleString()}
          icon={ListChecks}
          description={`${stats.rules.active} active`}
          breakdown={stats.rules.breakdown}
          href="/dashboard/rules"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Compliance Summary */}
        <div className="bg-surface-1 rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-text-primary flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary-500" />
              Compliance Summary
            </h3>
            <span className="text-[10px] font-bold text-primary-600 bg-primary-100 px-2 py-1 rounded">
              LIVE
            </span>
          </div>

          {/* Totals Row */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-success/10 border border-success/20">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              <div>
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-wide">Compliant</p>
                <p className="text-xl font-bold text-success">{stats.compliance.compliant}</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-danger/10 border border-danger/20">
              <XCircle className="w-5 h-5 text-danger flex-shrink-0" />
              <div>
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-wide">Non-Compliant</p>
                <p className="text-xl font-bold text-danger">{stats.compliance.non_compliant}</p>
              </div>
            </div>
          </div>

          {/* Per-rule bars */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">By Rule</p>
            {compliance.map((item, i) => {
              const total = item.compliant + item.non_compliant;
              const passWidth = total > 0 ? (item.compliant / total) * 100 : 0;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary font-medium truncate max-w-[200px]">{item.rule}</span>
                    <span className="text-text-muted font-mono">{item.compliant}/{total}</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                    <div
                      className="h-full rounded-full transition-all duration-1000 bg-success"
                      style={{ width: `${passWidth}%` }}
                    />
                    <div
                      className="h-full rounded-full transition-all duration-1000 bg-danger"
                      style={{ width: `${100 - passWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-surface-1 rounded-xl border border-neutral-200 p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-text-primary flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary-500" />
              System Activity
            </h3>
          </div>
          <div className="space-y-5 flex-1 overflow-hidden">
            {activity.map((item, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 ${
                      item.type === "danger"
                        ? "bg-danger"
                        : item.type === "warning"
                        ? "bg-warning"
                        : item.type === "success"
                        ? "bg-success"
                        : "bg-info"
                    }`}
                  />
                  {i !== activity.length - 1 && (
                    <div className="w-px h-full bg-neutral-100 my-1 group-last:hidden" />
                  )}
                </div>
                <div className="flex-1 pb-4 border-b border-surface-3 group-last:border-0">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-text-primary">{item.event}</p>
                    <span className="text-[10px] text-text-muted font-mono font-medium">{item.time}</span>
                  </div>
                  <p className="text-[10px] text-text-secondary mt-0.5 font-mono">{item.resource}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
