"use client";

import React from "react";

export interface BodyItem {
  label: string;
  value: string;
}

export interface BodyPlaceholderProps {
  items?: BodyItem[];

  columns?: 1 | 2;

  align?: "left" | "center";

  className?: string;
}

const DEFAULT_ITEMS: BodyItem[] = [
  {
    label: "Presented By",
    value: "Student Name",
  },
  {
    label: "Roll Number",
    value: "220101001",
  },
  {
    label: "Department",
    value: "Computer Science",
  },
  {
    label: "Session",
    value: "2026–27",
  },
];

export default function BodyPlaceholder({
  items = DEFAULT_ITEMS,

  columns = 1,

  align = "center",

  className = "",
}: BodyPlaceholderProps) {

  return (
    <div
      className={`
        grid
        gap-6
        ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}
        ${className}
      `}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={
            align === "center"
              ? "text-center"
              : "text-left"
          }
        >
          <div
            className="
              text-xs
              uppercase
              tracking-[0.18em]
              text-slate-500
            "
          >
            {item.label}
          </div>

          <div
            className="
              mt-2
              text-lg
              font-bold
              text-slate-800
            "
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}