"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";

export function SearchBar() {
  const setSearch = useAppStore((s) => s.setSearch);
  const searchValue = useAppStore((s) => s.filters.search);
  const [localValue, setLocalValue] = useState(searchValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (value: string) => {
      setLocalValue(value);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSearch(value);
      }, 300);
    },
    [setSearch]
  );

  const handleClear = useCallback(() => {
    setLocalValue("");
    setSearch("");
    inputRef.current?.focus();
  }, [setSearch]);

  // Keyboard shortcut: Ctrl+K or Cmd+K to focus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative flex items-center w-full max-w-md">
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search channels... (Ctrl+K)"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-9 pr-9 bg-secondary/50 border-border/50 focus:border-neon/50 focus:ring-neon/20"
        aria-label="Search channels"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
