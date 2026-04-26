"use client";

import { useEffect, useState } from "react";
import StatsPanel from "@/components/dashboard/StatsPanel";
import StakeholderDashboard from "@/components/dashboard/StakeholderDashboard";
import { getSession } from "@/lib/session";
import { AuthUser } from "@/lib/api";

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getSession());
    setReady(true);
  }, []);

  if (!ready) return <div className="flex-1 animate-pulse bg-gray-50" />;

  if (user?.role === "stakeholder") {
    return <StakeholderDashboard user={user} />;
  }

  return <StatsPanel />;
}
