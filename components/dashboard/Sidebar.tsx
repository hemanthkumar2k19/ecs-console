"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Monitor,
  Bot,
  ShieldCheck,
  ListChecks,
  ClipboardCheck,
  Settings,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  FolderKanban,
  BookOpen,
  ListTree,
  ClipboardList,
  Cpu,
  FileSearch,
} from "lucide-react";

const infraItems = [
  { label: "Hosts", icon: Monitor, href: "/dashboard/hosts" },
  { label: "Agents", icon: Bot, href: "/dashboard/agents" },
  { label: "Components", icon: Cpu, href: "/dashboard/components" },
];

const policyItems = [
  { label: "Policies", icon: ShieldCheck, href: "/dashboard/policies" },
  { label: "Rules", icon: ListChecks, href: "/dashboard/rules" },
  { label: "Compliance", icon: ClipboardCheck, href: "/dashboard/compliance" },
  { label: "Evidence", icon: FileSearch, href: "/dashboard/evidence" },
];

const governanceItems = [
  { label: "Stakeholders", icon: Users, href: "/dashboard/stakeholders" },
  { label: "Projects", icon: FolderKanban, href: "/dashboard/projects" },
  { label: "Audits", icon: BookOpen, href: "/dashboard/audits" },
  { label: "Audit Controls", icon: ListTree, href: "/dashboard/audit-controls" },
  { label: "Project Audits", icon: ClipboardList, href: "/dashboard/project-audits" },
];

const bottomItems = [
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const NavLink = ({
    item,
  }: {
    item: { label: string; icon: React.ElementType; href: string };
  }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        className={`group flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
          isActive
            ? "bg-primary-500/10 text-primary-500 border border-primary-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
            : "text-neutral-400 hover:bg-sidebar-hover hover:text-sidebar-text"
        } ${isCollapsed ? "justify-center" : "gap-3"}`}
        title={isCollapsed ? item.label : undefined}
      >
        <Icon
          className={`w-4 h-4 flex-shrink-0 transition-colors ${
            isActive ? "text-primary-500" : "text-neutral-500 group-hover:text-neutral-300"
          }`}
        />
        {!isCollapsed && <span>{item.label}</span>}
        {!isCollapsed && isActive && (
          <div className="ml-auto flex items-center">
             <div className="w-1 h-1 rounded-full bg-primary-500 animate-pulse mr-2" />
             <ChevronRight className="w-3.5 h-3.5 text-primary-500/50" />
          </div>
        )}
      </Link>
    );
  };

  const SectionLabel = ({ label }: { label: string }) =>
    !isCollapsed ? (
      <p className="px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-600 mb-2 mt-4 first:mt-0">
        {label}
      </p>
    ) : (
      <div className="border-t border-neutral-800 my-2" />
    );

  return (
    <aside className={`flex-shrink-0 flex flex-col bg-sidebar-bg border-r border-neutral-800 min-h-screen transition-all duration-300 ${isCollapsed ? "w-[72px]" : "w-60"}`}>
      {/* Header */}
      <div className={`flex items-center py-5 px-4 border-b border-neutral-800 ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shadow-sm flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="flex-shrink-0">
              <p className="text-sm font-bold text-sidebar-text leading-none">ECS Console</p>
              <p className="text-[10px] text-neutral-500 mt-0.5 uppercase tracking-wider font-medium">Evidence Platform</p>
            </div>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-neutral-500 hover:text-primary-500 transition-colors flex-shrink-0"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 overflow-x-hidden overflow-y-auto ${isCollapsed ? "px-2" : "px-3"} py-4 space-y-0.5`}>
        <SectionLabel label="Infrastructure" />
        {infraItems.map((item) => <NavLink key={item.href} item={item} />)}

        <SectionLabel label="Policy" />
        {policyItems.map((item) => <NavLink key={item.href} item={item} />)}

        <SectionLabel label="Governance" />
        {governanceItems.map((item) => <NavLink key={item.href} item={item} />)}
      </nav>

      {/* Bottom Section */}
      <div className={`${isCollapsed ? "px-2" : "px-3"} py-4 border-t border-neutral-800 space-y-0.5`}>
        {bottomItems.map((item) => <NavLink key={item.href} item={item} />)}
      </div>
    </aside>
  );
}
