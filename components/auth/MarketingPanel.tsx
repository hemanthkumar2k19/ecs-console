import { ShieldCheck, Database, Activity } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Evidence Chain",
    desc: "End-to-end encrypted evidence storage with full audit trail and tamper detection.",
  },
  {
    icon: Database,
    title: "Centralized Repository",
    desc: "Unified platform for all digital and physical evidence records across cases.",
  },
  {
    icon: Activity,
    title: "Real-time Monitoring",
    desc: "Live dashboards for case progress, evidence status, and compliance reporting.",
  },
];

export default function MarketingPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-10 w-80 h-80 rounded-full bg-blue-600 opacity-10 blur-3xl" />
        <div className="absolute bottom-10 right-0 w-96 h-96 rounded-full bg-blue-400 opacity-10 blur-3xl" />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-bold text-lg leading-none tracking-tight">ECS Console</p>
          <p className="text-xs text-blue-300 mt-0.5">Evidence Collection System</p>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 space-y-10">
        <div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            Manage Evidence.<br />
            <span className="text-blue-400">Stay in Control.</span>
          </h1>
          <p className="mt-4 text-slate-300 text-sm leading-relaxed max-w-sm">
            A unified management console for all your evidence collection workflows,
            case tracking, and compliance reporting.
          </p>
        </div>

        <div className="space-y-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">{title}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <p className="text-xs text-slate-600">© 2025 ECS Platform. All rights reserved.</p>
      </div>
    </div>
  );
}
