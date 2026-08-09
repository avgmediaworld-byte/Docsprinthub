"use client";

import React from "react";

export interface InstitutePlaceholderProps {
  name?: string;

  tagline?: string;

  align?: "left" | "center" | "right";

  showDivider?: boolean;

  className?: string;
}

export default function InstitutePlaceholder({
  name = "ABC UNIVERSITY",

  tagline = "Knowledge • Innovation • Excellence",

  align = "center",

  showDivider = true,

  className = "",
}: InstitutePlaceholderProps) {
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
          text-xl
          font-bold
          uppercase
          tracking-[0.15em]
          text-slate-800
        "
      >
        {name}
      </h2>

      <p
        className="
          mt-2
          text-sm
          italic
          text-slate-500
        "
      >
        {tagline}
      </p>

      {showDivider && (
        <div
          className="
            mt-4
            h-[2px]
            w-28
            rounded-full
            bg-blue-600
          "
        />
      )}
    </div>
  );
}