"use client";

import { ReactNode } from "react";

interface LogoSlotProps {
  children?: ReactNode;

  size?: number;

  bordered?: boolean;

  className?: string;
}

export default function LogoSlot({
  children,

  size = 110,

  bordered = true,

  className = "",
}: LogoSlotProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-white shadow-sm ${className}`}
      style={{
        width: size,
        height: size,
        border: bordered ? "2px solid #e2e8f0" : "none",
      }}
    >
      {children ?? (
        <div className="text-3xl text-slate-400 font-bold">
          LOGO
        </div>
      )}
    </div>
  );
}