"use client";

import React from "react";

export interface CompanyPlaceholderProps {
  name?: string;

  tagline?: string;

  align?: "left" | "center" | "right";

  showDivider?: boolean;

  className?: string;
}

export default function CompanyPlaceholder({
  name = "DOCSPRINTHUB",

  tagline = "Professional Document Solutions",

  align = "center",

  showDivider = true,

  className = "",
}: CompanyPlaceholderProps) {

  const alignment =
    align === "left"
      ? "items-start text-left"
      : align === "right"
      ? "items-end text-right"
      : "items-center text-center";

  return (
    <div
      className={`flex flex-col ${alignment} ${className}`}
    >

      <h2
        className="
          text-2xl
          font-extrabold
          tracking-[0.18em]
          uppercase
          text-slate-900
        "
      >
        {name}
      </h2>

      <p
        className="
          mt-2
          text-sm
          font-medium
          text-slate-500
        "
      >
        {tagline}
      </p>

      {showDivider && (
        <div
          className="
            mt-4
            h-[3px]
            w-24
            rounded-full
            bg-gradient-to-r
            from-blue-600
            via-cyan-500
            to-sky-400
          "
        />
      )}

    </div>
  );
}