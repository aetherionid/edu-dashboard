"use client"

import { cn } from "@/lib/utils";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

function Switch({ checked = false, onCheckedChange, disabled = false, className }: SwitchProps) {
  const handleClick = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        // Base styles
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-all duration-300 ease-in-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "hover:opacity-90",
        // Color based on state - VERY DIFFERENT COLORS
        checked
          ? "bg-emerald-500 border-emerald-500" // Green when ON
          : "bg-slate-300 dark:bg-slate-600 border-slate-300 dark:border-slate-600", // Gray when OFF
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          // Thumb base styles
          "pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-lg ring-0 transition-all duration-300 ease-in-out",
          // Thumb color and position
          checked
            ? "translate-x-5 bg-white" // Move right when ON, white thumb
            : "translate-x-0 bg-white" // Stay left when OFF, white thumb
        )}
      />
    </button>
  )
}

export { Switch };

