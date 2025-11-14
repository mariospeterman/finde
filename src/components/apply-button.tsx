'use client';

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { emitApplyIntent } from "@/lib/apply-intent";

type ApplyButtonProps = {
  source: string;
  plan?: string;
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function ApplyButton({
  source,
  plan = "pilot-program",
  className = "",
  children,
  onClick,
  type,
  ...props
}: ApplyButtonProps) {
  const baseClass =
    "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300";

  return (
    <button
      type={type ?? "button"}
      onClick={(event) => {
        emitApplyIntent({ source, plan });
        onClick?.(event);
      }}
      className={`${baseClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

