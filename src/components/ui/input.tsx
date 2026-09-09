import * as React from "react";
import { cn } from "@/lib/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      suppressHydrationWarning
      className={cn(
        "h-11 w-full rounded-[var(--radius-md)] bg-surface px-3 text-sm text-ink placeholder:text-faint shadow-[var(--shadow-border)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/30",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
