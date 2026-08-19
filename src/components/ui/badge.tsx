import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-blue-600 text-white shadow hover:bg-blue-700":
            variant === "default",
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100":
            variant === "secondary",
          "border-transparent bg-red-600 text-white shadow hover:bg-red-700":
            variant === "destructive",
          "border-slate-300 text-slate-950 dark:border-slate-700 dark:text-slate-50":
            variant === "outline",
          "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300":
            variant === "success",
          "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300":
            variant === "warning",
          "border-transparent bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300":
            variant === "info",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
