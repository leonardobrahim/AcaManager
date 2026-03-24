import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface BadgeProps extends React.ComponentProps<"div"> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        {
          "border-transparent bg-indigo-100/80 text-indigo-700 hover:bg-indigo-100": variant === "default",
          "border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200/80": variant === "secondary",
          "border-transparent bg-red-100 text-red-700 hover:bg-red-200/80": variant === "destructive",
          "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-200/80": variant === "success",
          "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200/80": variant === "warning",
          "text-slate-700 border-slate-200": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
