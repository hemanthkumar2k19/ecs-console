"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Cpu,
  Monitor,
  Server,
  Globe,
  Tag,
  ArrowRight,
} from "lucide-react";
import { getComponentById, getHosts, Component, Host } from "@/lib/api";
import { getTechLogo } from "@/components/dashboard/TechLogos";

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  count,
  iconCls = "text-primary-600",
  bgCls = "bg-primary-50",
}: {
  icon: React.ElementType;
  title: string;
  count?: number;
  iconCls?: string;
  bgCls?: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className={`w-7 h-7 rounded-lg ${bgCls} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-3.5 h-3.5 ${iconCls}`} />
      </div>
      <h2 className="text-sm font-bold text-text-primary">{title}</h2>
      {count !== undefined && (
        <span className="ml-1 text-[10px] font-bold text-text-muted bg-surface-2 border border-neutral-100 px-1.5 py-0.5 rounded">
          {count}
        </span>
      )}
    </div>
  );
}

// ─── MetaCell ─────────────────────────────────────────────────────────────────

function MetaCell({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-surface-2 rounded-xl p-3 border border-neutral-100 flex-1">
      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-xs font-semibold text-text-primary truncate ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ComponentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [component, setComponent] = useState<Component | null>(null);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getComponentById(id), getHosts()]).then(([c, allHosts]) => {
      if (!c) {
        setLoading(false);
        return;
      }
      setComponent(c);
      setHosts(allHosts.filter((h) => h.component_id === c.id));
      setLoading(false);
    });
  }, [id]);

  const typeColor: Record<string, string> = {
    database: "bg-amber-50 text-amber-700 border-amber-200",
    webserver: "bg-blue-50 text-blue-700 border-blue-200",
    cache: "bg-violet-50 text-violet-700 border-violet-200",
    storage: "bg-teal-50 text-teal-700 border-teal-200",
    cloud: "bg-sky-50 text-sky-700 border-sky-200",
    os: "bg-neutral-100 text-neutral-700 border-neutral-200",
    other: "bg-neutral-100 text-neutral-600 border-neutral-200",
  };

  const hostTypeColor: Record<string, string> = {
    yugabyte: "bg-amber-100 text-amber-700 border-amber-200",
    postgres: "bg-blue-100 text-blue-700 border-blue-200",
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 space-y-6">
        <div className="h-10 w-48 bg-neutral-100 rounded-xl animate-pulse" />
        <div className="h-40 bg-neutral-100 rounded-2xl animate-pulse" />
        <div className="h-64 bg-neutral-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!component) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Cpu className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-text-primary font-bold">Component not found</p>
          <button onClick={() => router.back()} className="text-xs text-primary-600 hover:underline mt-1 inline-block">
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const Logo = getTechLogo(component.name);

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background space-y-6">
      {/* Back nav */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-2 border border-neutral-200 text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors"
          title="Go back to Components"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
          Component Dashboard
        </span>
      </div>

      {/* ── 1. COMPONENT DETAILS ────────────────────────────────────────────── */}
      <section className="bg-surface-1 rounded-2xl border border-neutral-200 shadow-sm p-6 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-1">
            Component Profile
          </p>
          <h1 className="text-2xl font-bold text-text-primary">{component.display_name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-mono text-text-muted">{component.name}</span>
            <span className="text-neutral-300">•</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${typeColor[component.type] ?? "bg-neutral-100 text-neutral-600 border-neutral-200"}`}>
              {component.type}
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-[10px] font-mono text-text-muted bg-surface-2 border border-neutral-100 px-2 py-0.5 rounded">
              {component.id}
            </span>
          </div>
        </div>

        <div className="w-20 h-20 rounded-2xl bg-surface-2 border border-neutral-100 flex items-center justify-center shadow-sm flex-shrink-0">
          <Logo className="w-10 h-10 text-text-primary" />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetaCell label="Description" value={component.description ?? "No description available"} />
        <MetaCell label="Enrolled On" value={new Date(component.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} />
        <MetaCell label="Last Updated" value={new Date(component.updated_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} />
      </div>

      {/* ── 2. HOST PREVIEW LIST ────────────────────────────────────────────── */}
      <section className="bg-surface-1 rounded-2xl border border-neutral-200 shadow-sm p-6">
        <SectionHeader icon={Monitor} title="Enrolled Hosts" count={hosts.length} />

        <p className="text-sm text-text-secondary mb-5">
          These hosts are actively running {component.display_name} and are bound to policies for this component type.
        </p>

        {hosts.length === 0 ? (
          <div className="py-12 text-center bg-surface-2 border border-neutral-100 rounded-xl">
            <Server className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-text-primary">No enrolled hosts found</p>
            <p className="text-xs text-text-muted mt-1">
              There are currently no active hosts categorized as this component.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {hosts.map((host) => (
              <Link
                key={host.id}
                href={`/dashboard/hosts/${host.id}`}
                className="group flex flex-col p-4 rounded-xl border border-neutral-200 bg-surface-1 hover:border-primary-300 hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-2 border border-neutral-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                      <Server className="w-5 h-5 text-text-secondary group-hover:text-primary-600 transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary group-hover:text-primary-600 transition-colors">
                        {host.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${hostTypeColor[host.type] ?? "bg-neutral-100 text-neutral-600 border-neutral-200"}`}>
                          {host.type}
                        </span>
                        <span className="flex items-center gap-1 text-[9px] font-bold text-success bg-success/10 border border-success/30 px-1.5 py-0.5 rounded">
                          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                          Online
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-surface-2 flex items-center justify-center group-hover:bg-primary-50 transition-colors flex-shrink-0">
                    <ArrowRight className="w-3 h-3 text-text-muted group-hover:text-primary-600" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <div className="bg-surface-2 rounded-lg p-2 border border-neutral-100">
                    <p className="text-[9px] font-bold text-text-muted uppercase mb-0.5">IP / Network</p>
                    <p className="text-[10px] font-mono text-text-primary flex items-center gap-1">
                      <Globe className="w-2.5 h-2.5 text-text-muted" /> {host.ip}
                    </p>
                  </div>
                  <div className="bg-surface-2 rounded-lg p-2 border border-neutral-100">
                    <p className="text-[9px] font-bold text-text-muted uppercase mb-0.5">OS Platform</p>
                    <p className="text-[10px] font-medium text-text-primary truncate">
                      {host.os_family} {host.os_version}
                    </p>
                  </div>
                </div>

                {host.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-neutral-100">
                    {host.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="flex items-center gap-1 text-[9px] bg-surface-2 border border-neutral-200 rounded px-1.5 py-0.5 text-text-secondary">
                        <Tag className="w-2 h-2 text-text-muted" />
                        <span className="font-medium">{tag.key}</span>
                        <span className="text-text-muted">=</span>
                        <span className="font-bold text-text-primary">{tag.value}</span>
                      </span>
                    ))}
                    {host.tags.length > 3 && (
                      <span className="text-[9px] text-text-muted font-medium py-0.5">
                        +{host.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
