"use client";

import { type CSSProperties, type ReactNode } from "react";

export interface BaseBackgroundProps {
  children?: ReactNode;

  className?: string;

  overlay?: ReactNode;

  effects?: ReactNode;

  style?: CSSProperties;
}

export default function BaseBackground({
  children,
  className = "",
  overlay,
  effects,
  style,
}: BaseBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={style}
    >
      {/* Main Background */}
      {children}

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 pointer-events-none">
          {overlay}
        </div>
      )}

      {/* Extra Effects */}
      {effects && (
        <div className="absolute inset-0 pointer-events-none">
          {effects}
        </div>
      )}
    </div>
  );
}
