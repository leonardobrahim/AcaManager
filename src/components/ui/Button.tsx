import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-slate-900 text-slate-50 hover:bg-slate-900/90 shadow': variant === 'default',
            'bg-red-500 text-slate-50 hover:bg-red-500/90 shadow-sm': variant === 'destructive',
            'border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 shadow-sm': variant === 'outline',
            'bg-slate-100 text-slate-900 hover:bg-slate-100/80': variant === 'secondary',
            'hover:bg-slate-100 hover:text-slate-900': variant === 'ghost',
            'h-9 px-4 py-2': size === 'default',
            'h-8 rounded-md px-3 text-xs': size === 'sm',
            'h-10 rounded-md px-8': size === 'lg',
            'h-9 w-9': size === 'icon',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
