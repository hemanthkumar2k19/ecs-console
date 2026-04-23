"use client";

import { Search, Filter, Layers } from "lucide-react";

interface DataTableToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterKey: string;
  setFilterKey: (val: string) => void;
  filterValue: string;
  setFilterValue: (val: string) => void;
  groupByKey: string;
  setGroupByKey: (val: string) => void;
  availableColumns: string[];
  uniqueFilterValues: string[];
  searchPlaceholder?: string;
}

export default function DataTableToolbar({
  searchQuery, setSearchQuery,
  filterKey, setFilterKey,
  filterValue, setFilterValue,
  groupByKey, setGroupByKey,
  availableColumns,
  uniqueFilterValues,
  searchPlaceholder = "Search...",
}: DataTableToolbarProps) {
  
  const handleFilterKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterKey(e.target.value);
    setFilterValue("");
  };

  return (
    <div className="flex flex-col xl:flex-row xl:items-center gap-3 mb-6 p-4 rounded-xl bg-surface-1 border border-neutral-200 shadow-sm">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input 
          type="text" 
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-surface-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-text-primary placeholder:text-text-muted"
        />
      </div>

      <div className="w-px h-8 bg-neutral-200 hidden xl:block mx-2" />

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="w-4 h-4 text-text-muted" />
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider hidden sm:block">Filter By</span>
        <select 
          value={filterKey}
          onChange={handleFilterKeyChange}
          className="text-sm bg-surface-2 border border-neutral-200 rounded-lg px-3 py-2 outline-none focus:border-primary-500 font-medium text-text-primary w-[140px]"
        >
          <option value="">None</option>
          {availableColumns.map(col => <option key={col} value={col}>{col}</option>)}
        </select>
        
        {filterKey && (
          <select 
            value={filterValue}
            onChange={e => setFilterValue(e.target.value)}
            className="text-sm bg-surface-2 border border-neutral-200 rounded-lg px-3 py-2 outline-none focus:border-primary-500 font-medium text-text-primary min-w-[120px] max-w-[200px]"
          >
            <option value="">All</option>
            {uniqueFilterValues.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        )}
      </div>

      <div className="w-px h-8 bg-neutral-200 hidden xl:block mx-2" />

      {/* Group By */}
      <div className="flex flex-wrap items-center gap-2">
        <Layers className="w-4 h-4 text-text-muted" />
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider hidden sm:block">Group By</span>
        <select 
          value={groupByKey}
          onChange={e => setGroupByKey(e.target.value)}
          className="text-sm bg-surface-2 border border-neutral-200 rounded-lg px-3 py-2 outline-none focus:border-primary-500 font-medium text-text-primary w-[140px]"
        >
          <option value="">None</option>
          {availableColumns.map(col => <option key={col} value={col}>{col}</option>)}
        </select>
      </div>
    </div>
  );
}
