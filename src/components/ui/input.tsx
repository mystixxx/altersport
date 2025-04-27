import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-border flex h-9 w-full min-w-0 rounded-md border bg-transparent px-4 py-1 text-sm text-black transition-[color,box-shadow] outline-none selection:bg-[#c7c9e14d] selection:text-black file:inline-flex file:h-7 file:text-sm file:font-medium file:text-black placeholder:text-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-[#c7c9e14d]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
