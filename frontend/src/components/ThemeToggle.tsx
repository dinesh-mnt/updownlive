"use client";

import * as React from "react";
import { Moon, Sun, Monitor, ChevronDown, Check } from "lucide-react";
import { useTheme } from "next-themes";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark",  label: "Dark",  icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();

  React.useEffect(() => { setMounted(true); }, []);

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-24 rounded-lg bg-white/5 border border-brand-black/20 dark:border-white/10 animate-pulse" />
    );
  }

  const active = options.find(o => o.value === theme) ?? options[0];
  const ActiveIcon = active.icon;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-white/5 border border-brand-black/20 dark:border-white/10 hover:border-brand-blue/50 hover:bg-white/10 transition-all text-brand-black dark:text-white text-sm font-medium"
        aria-label="Toggle theme"
        aria-expanded={open}
      >
        <ActiveIcon size={15} />
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl border border-brand-border dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl shadow-black/10 dark:shadow-black/40 z-50 overflow-hidden py-1">
          {options.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => { setTheme(value); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors
                ${theme === value
                  ? "text-brand-blue bg-brand-blue/8 dark:bg-brand-blue/15"
                  : "text-brand-black dark:text-white hover:bg-brand-light dark:hover:bg-white/5"
                }`}
            >
              <Icon size={15} />
              <span className="flex-1 text-left">{label}</span>
              {theme === value && <Check size={13} className="text-brand-blue" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
