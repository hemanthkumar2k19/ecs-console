"use client";

import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import { ArrowLeft, Monitor, Tag, Cpu, Globe } from "lucide-react";
import { getHosts, createHost, Host } from "@/lib/api";
import { useDataTable } from "@/hooks/useDataTable";
import DataTableToolbar from "@/components/dashboard/DataTableToolbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";


export default function HostsPage() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    ip: "",
    os_family: "Linux",
    os_version: "Ubuntu 22.04",
    env: "dev",
    type: "postgres",
    project_id: "",
    component_id: ""
  });

  const table = useDataTable(hosts, "name");

  const loadHosts = () => {
    getHosts().then((data) => {
      setHosts(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadHosts();
  }, []);

  const handleAddHost = async (e: React.FormEvent) => {
    e.preventDefault();
    await createHost(formData);
    setOpenAddModal(false);
    setFormData({
      name: "", ip: "", os_family: "Linux", os_version: "Ubuntu 22.04",
      env: "dev", type: "postgres", project_id: "", component_id: ""
    });
    setLoading(true);
    loadHosts();
  };

  const typeColor: Record<string, string> = {
    yugabyte: "bg-amber-100 text-amber-700 border-amber-200",
    postgres: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const renderRow = (host: Host) => (
    <tr key={host.id} className="hover:bg-surface-hover transition-colors group cursor-pointer">
      <td className="px-5 py-4">
        <Link href={`/dashboard/hosts/${host.id}`} className="flex items-center gap-2 hover:opacity-80">
          <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            <Cpu className="w-3.5 h-3.5 text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-text-primary text-xs group-hover:text-primary-600 transition-colors">{host.name}</p>
            <p className="text-[10px] text-text-muted font-mono">{host.id.slice(0, 8)}…</p>
          </div>
        </Link>
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
        <span className="text-xs text-text-muted font-mono">{host.component_id}</span>
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
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Hosts</h1>
          </div>
          
          <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] font-semibold">
                <Plus className="w-4 h-4" /> Add Host
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden">
              <form onSubmit={handleAddHost}>
                {/* Modal header */}
                <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50">
                  <DialogHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Monitor className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <DialogTitle className="text-base font-bold text-neutral-900">Add New Host</DialogTitle>
                        <p className="text-[11px] text-neutral-500 mt-0.5">Register a new infrastructure host to the console.</p>
                      </div>
                    </div>
                  </DialogHeader>
                </div>

                {/* Fields */}
                <div className="px-6 py-5 space-y-5">
                  {/* Identity */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Identity</p>
                    <div className="grid gap-1.5">
                      <label className="text-[11px] font-semibold text-neutral-700">Host Name <span className="text-red-400">*</span></label>
                      <Input required placeholder="e.g. db-node-01" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-9 text-sm" />
                    </div>
                    <div className="grid gap-1.5">
                      <label className="text-[11px] font-semibold text-neutral-700">IP Address <span className="text-red-400">*</span></label>
                      <Input required placeholder="e.g. 10.0.1.12" value={formData.ip} onChange={e => setFormData({...formData, ip: e.target.value})} className="h-9 text-sm font-mono" />
                    </div>
                  </div>

                  {/* OS */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Operating System</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1.5">
                        <label className="text-[11px] font-semibold text-neutral-700">OS Family <span className="text-red-400">*</span></label>
                        <Input required placeholder="Linux" value={formData.os_family} onChange={e => setFormData({...formData, os_family: e.target.value})} className="h-9 text-sm" />
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-[11px] font-semibold text-neutral-700">OS Version <span className="text-red-400">*</span></label>
                        <Input required placeholder="Ubuntu 22.04" value={formData.os_version} onChange={e => setFormData({...formData, os_version: e.target.value})} className="h-9 text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Config */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Configuration</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1.5">
                        <label className="text-[11px] font-semibold text-neutral-700">Environment <span className="text-red-400">*</span></label>
                        <Input required placeholder="dev / prod" value={formData.env} onChange={e => setFormData({...formData, env: e.target.value})} className="h-9 text-sm" />
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-[11px] font-semibold text-neutral-700">Type <span className="text-red-400">*</span></label>
                        <Input required placeholder="postgres / yugabyte" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="h-9 text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1.5">
                        <label className="text-[11px] font-semibold text-neutral-700">Project ID</label>
                        <Input placeholder="p-xxx" value={formData.project_id} onChange={e => setFormData({...formData, project_id: e.target.value})} className="h-9 text-sm font-mono" />
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-[11px] font-semibold text-neutral-700">Component ID</label>
                        <Input placeholder="comp-xxx" value={formData.component_id} onChange={e => setFormData({...formData, component_id: e.target.value})} className="h-9 text-sm font-mono" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpenAddModal(false)} className="h-9 text-sm border-neutral-200 text-neutral-600">Cancel</Button>
                  <Button type="submit" className="h-9 text-sm bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-sm">Create Host</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Component</th>
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
