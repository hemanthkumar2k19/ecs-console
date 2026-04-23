import { useState, useMemo } from "react";

export function useDataTable<T extends Record<string, any>>(data: T[], searchKey: keyof T) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKey, setFilterKey] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [groupByKey, setGroupByKey] = useState<string>("");

  const availableColumns = useMemo(() => {
    if (!data.length) return [];
    const sample = data[0];
    return Object.keys(sample).filter((key) => {
      // Exclude ids, timestamps, and the primary search key from generic filters
      if (key === "id" || key.endsWith("_id") || key === String(searchKey) || key.endsWith("_at") || key.endsWith("_time")) return false;
      const val = sample[key];
      return typeof val === "string" || typeof val === "number" || typeof val === "boolean";
    });
  }, [data, searchKey]);

  const uniqueFilterValues = useMemo(() => {
    if (!filterKey || !data.length) return [];
    const vals = new Set(data.map((item) => String(item[filterKey] ?? "")));
    return Array.from(vals).filter((v) => v !== "");
  }, [data, filterKey]);

  const processedData = useMemo(() => {
    let result = data;

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) => {
        const val = item[searchKey];
        return val && typeof val === "string" && val.toLowerCase().includes(q);
      });
    }

    // Filter
    if (filterKey && filterValue) {
      result = result.filter((item) => String(item[filterKey]) === filterValue);
    }

    // Group
    if (groupByKey) {
      return result.reduce((acc, item) => {
        const val = String(item[groupByKey] || "Unknown");
        if (!acc[val]) acc[val] = [];
        acc[val].push(item);
        return acc;
      }, {} as Record<string, T[]>);
    }

    return result; 
  }, [data, searchQuery, filterKey, filterValue, groupByKey, searchKey]);

  return {
    searchQuery, setSearchQuery,
    filterKey, setFilterKey,
    filterValue, setFilterValue,
    groupByKey, setGroupByKey,
    availableColumns,
    uniqueFilterValues,
    processedData
  };
}
