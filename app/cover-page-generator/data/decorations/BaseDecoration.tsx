"use client";

import { ReactNode } from "react";

export interface BaseDecorationProps {
  children?: ReactNode;

  className?: string;

  opacity?: number;

  zIndex?: number;
}

export default function BaseDecoration({
  children,
  className = "",
  opacity = 1,
  zIndex = 10,
}: BaseDecorationProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{
        opacity,
        zIndex,
      }}
    >
      {children}
    </div>
  );
}