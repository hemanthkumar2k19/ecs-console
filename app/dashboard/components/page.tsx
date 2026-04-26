"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, ArrowRight } from "lucide-react";
import { getComponents, Component } from "@/lib/api";
import { getTechLogo } from "@/components/dashboard/TechLogos";

export default function ComponentsPage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComponents().then((data) => {
      setComponents(data);
      setLoading(false);
    });
  }, []);

  const typeColor: Record<string, string> = {
    database: "bg-amber-50 text-amber-700 border-amber-200",
    webserver: "bg-blue-50 text-blue-700 border-blue-200",
    cache: "bg-violet-50 text-violet-700 border-violet-200",
    storage: "bg-teal-50 text-teal-700 border-teal-200",
    cloud: "bg-sky-50 text-sky-700 border-sky-200",
    os: "bg-neutral-100 text-neutral-700 border-neutral-200",
    other: "bg-neutral-100 text-neutral-600 border-neutral-200",
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-2 border border-neutral-200 text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Back to Dashboard
          </span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Components Library</h1>
            <p className="text-sm text-text-secondary mt-1">
              A holistic view of the technology types and systems currently enrolled.
            </p>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {components.map((c) => {
            const Logo = getTechLogo(c.name);
            return (
              <Link
                key={c.id}
                href={`/dashboard/components/${c.id}`}
                className="group flex flex-col bg-surface-1 rounded-2xl border border-neutral-200 shadow-sm hover:border-primary-300 hover:shadow-md transition-all p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wide h-max ${
                      typeColor[c.type] ?? "bg-neutral-100 text-neutral-600 border-neutral-200"
                    }`}
                  >
                    {c.type}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-neutral-100 flex items-center justify-center shadow-sm flex-shrink-0">
                    <Logo className="w-6 h-6 text-text-primary group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                <div className="mb-4 flex-1">
                  <h2 className="text-lg font-bold text-text-primary group-hover:text-primary-600 transition-colors">
                    {c.display_name}
                  </h2>
                  <p className="text-xs text-text-muted font-mono mt-0.5">{c.name}</p>
                  <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                    {c.description ?? "No description available."}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-100 pt-4 mt-auto">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    View Enrolled Hosts
                  </span>
                  <div className="w-6 h-6 rounded-full bg-surface-2 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                    <ArrowRight className="w-3 h-3 text-text-muted group-hover:text-primary-600" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
