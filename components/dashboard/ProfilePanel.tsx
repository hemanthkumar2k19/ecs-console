"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircle, Mail, Building2, Clock, LogOut, ChevronRight, Bell, Shield, PanelRightClose, PanelRightOpen } from "lucide-react";

export default function ProfilePanel() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you'd clear session/tokens here
    router.push("/");
  };

  // Normally this would come from a context or API call
  const user = {
    name: "Admin User",
    userId: "admin",
    email: "admin@ecs.internal",
    department: "Operations",
    avatar: "AU",
    lastLogin: "Today, 08:30 AM",
  };

  const AccountItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex items-center gap-3 py-3 border-b border-surface-2 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-text-muted">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider truncate">{label}</p>
        <p className="text-sm font-medium text-text-primary truncate">{value}</p>
      </div>
    </div>
  );

  return (
    <aside className={`flex-shrink-0 bg-surface-1 border-l border-neutral-200 min-h-screen hidden 2xl:flex flex-col transition-all duration-300 ${isCollapsed ? "w-[72px] items-center py-6 px-0" : "w-80 p-6"}`}>
      {/* Header with Notifications & Toggle */}
      <div className={`flex w-full mb-10 ${isCollapsed ? "justify-center" : "justify-between items-center"}`}>
        {!isCollapsed && <h2 className="font-bold text-text-primary leading-none">Account</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-text-muted hover:text-primary-500 transition-colors flex-shrink-0"
          title={isCollapsed ? "Expand account panel" : "Collapse account panel"}
        >
          {isCollapsed ? <PanelRightOpen className="w-5 h-5" /> : <PanelRightClose className="w-5 h-5" />}
        </button>
      </div>

      {isCollapsed ? (
        // Collapsed View
        <div className="flex flex-col items-center gap-6 w-full flex-1">
          <button className="relative w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center text-text-muted hover:text-primary-500 transition-colors" title="Notifications">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-surface-1" />
          </button>
          
          <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-primary-50" title={`${user.name}\n${user.department}`}>
            {user.avatar}
          </div>
          
          <div className="w-8 h-px bg-neutral-100 my-2" />
          
          <button className="w-10 h-10 rounded-xl bg-surface-2 text-text-muted hover:text-accent-orange hover:bg-primary-50 transition-colors flex items-center justify-center" title="Audit Logs">
            <Shield className="w-4 h-4" />
          </button>
          
          <div className="mt-auto pt-6 w-full flex justify-center border-t border-neutral-100">
            <button 
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center hover:bg-danger/20 transition-colors" 
              title="Logout Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        // Expanded View
        <>
          <div className="flex justify-end mb-6">
            <button className="relative w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center text-text-muted hover:text-primary-500 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-surface-1" />
            </button>
          </div>

          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 rounded-3xl bg-primary-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg mb-4 ring-4 ring-primary-50">
              {user.avatar}
            </div>
            <h3 className="text-lg font-bold text-text-primary">{user.name}</h3>
            <p className="text-xs text-primary-600 font-bold bg-primary-50 px-2 py-0.5 rounded mt-1 uppercase tracking-tight italic">
              Super Admin
            </p>
          </div>

          <div className="space-y-1 mb-10 overflow-hidden">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest px-1 mb-3">Professional Info</h4>
            <AccountItem icon={UserCircle} label="User ID" value={user.userId} />
            <AccountItem icon={Mail} label="Email Address" value={user.email} />
            <AccountItem icon={Building2} label="Department" value={user.department} />
            <AccountItem icon={Clock} label="Last Session" value={user.lastLogin} />
          </div>

          <div className="space-y-3 flex-1">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest px-1 mb-2">Account Safety</h4>
            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-100 bg-surface-2/50 hover:bg-surface-1 hover:border-primary-200 hover:shadow-sm transition-all text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-accent-orange" />
                </div>
                <span className="text-sm font-medium text-text-secondary">Audit Logs</span>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </button>
          </div>

          <div className="pt-6 border-t border-neutral-100">
            <button 
              onClick={handleLogout}
              className="w-full h-11 rounded-xl bg-danger/10 text-danger font-bold text-sm flex items-center justify-center gap-2 hover:bg-danger/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout Session
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
