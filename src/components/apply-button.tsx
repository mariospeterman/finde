'use client';

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { emitApplyIntent } from "@/lib/apply-intent";

type ApplyButtonProps = {
  source: string;
  plan?: string;
  className?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type">;

export function ApplyButton({ source, plan = "pilot-program", className = "", children, ...props }: ApplyButtonProps) {
  const baseClass =
    "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300";

  return (
    <button
      type="button"
      onClick={() => emitApplyIntent({ source, plan })}
      className={`${baseClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

