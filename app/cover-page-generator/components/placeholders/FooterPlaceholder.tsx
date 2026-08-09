"use client";

import React from "react";

export interface FooterPlaceholderProps {
  leftText?: string;

  centerText?: string;

  rightText?: string;

  showDivider?: boolean;

  className?: string;
}

export default function FooterPlaceholder({
  leftText = "Session 2026–27",

  centerText = "www.docsprinthub.com",

  rightText = "Version 1.0",

  showDivider = true,

  className = "",
}: FooterPlaceholderProps) {
  return (
    <div className={`w-full ${className}`}>

      {showDivider && (
        <div className="mb-4 h-px w-full bg-slate-300" />
      )}

      <div className="flex items-center justify-between gap-4 text-xs text-slate-500">

        <span className="font-medium">
          {leftText}
        </span>

        <span className="text-center">
          {centerText}
        </span>

        <span className="font-medium text-right">
          {rightText}
        </span>

      </div>

    </div>
  );
}