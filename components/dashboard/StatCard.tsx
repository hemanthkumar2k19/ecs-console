"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: LucideIcon;
  description?: string;
  breakdown: { label: string; value: number; color: string }[];
  href?: string;
}

export default function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  description,
  breakdown,
  href,
}: StatCardProps) {
  const total = breakdown.reduce((acc, curr) => acc + curr.value, 0);

  const innerContent = (
    <>
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center transition-colors group-hover:bg-primary-100">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
        {trend !== undefined && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              trend >= 0
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
            }`}
          >
            {trend >= 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-text-muted transition-colors group-hover:text-text-primary">{title}</p>
        <h3 className="text-2xl font-bold text-text-primary mt-1">{value}</h3>
        {description && (
          <p className="text-xs text-text-muted mt-1">{description}</p>
        )}
      </div>

      {/* Mini Visual Chart (Bar Stack) */}
      <div className="mt-5 space-y-3">
        <div className="h-2 w-full bg-neutral-100 rounded-full flex overflow-hidden">
          {breakdown.map((item, i) => (
            <div
              key={i}
              className="h-full transition-all duration-1000"
              style={{
                width: `${total > 0 ? (item.value / total) * 100 : 0}%`,
                backgroundColor: item.color,
              }}
              title={`${item.label}: ${item.value}`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {breakdown.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const containerClass = "bg-surface-1 rounded-xl border border-neutral-200 p-5 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group block h-full";

  if (href) {
    return (
      <Link href={href} className={containerClass}>
        {innerContent}
      </Link>
    );
  }

  return <div className={containerClass}>{innerContent}</div>;
}
