"use client";

import { ReactNode } from "react";

export interface InfoItem {
  label: ReactNode;
  value: ReactNode;
}

interface InfoBlockProps {
  items?: InfoItem[];

  columns?: 1 | 2;

  className?: string;

  labelClassName?: string;

  valueClassName?: string;
}

export default function InfoBlock({
  items = [],

  columns = 2,

  className = "",

  labelClassName = "",

  valueClassName = "",
}: InfoBlockProps) {
  return (
    <div
      className={`grid gap-6 ${
        columns === 2
          ? "grid-cols-2"
          : "grid-cols-1"
      } ${className}`}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col gap-1"
        >
          <span
            className={`text-xs font-semibold uppercase tracking-wider text-slate-500 ${labelClassName}`}
          >
            {item.label}
          </span>

          <span
            className={`text-base font-semibold text-slate-900 ${valueClassName}`}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}