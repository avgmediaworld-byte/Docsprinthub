"use client";

import { ReactNode } from "react";

interface TitleBlockProps {
  title?: ReactNode;

  subtitle?: ReactNode;

  align?: "left" | "center" | "right";

  titleClassName?: string;

  subtitleClassName?: string;

  className?: string;
}

export default function TitleBlock({
  title,

  subtitle,

  align = "center",

  titleClassName = "",

  subtitleClassName = "",

  className = "",
}: TitleBlockProps) {
  const alignment = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div
      className={`flex flex-col gap-3 ${alignment[align]} ${className}`}
    >
      {/* Main Title */}
      <div
        className={`text-4xl font-extrabold uppercase tracking-wide text-slate-900 ${titleClassName}`}
      >
        {title ?? "PROJECT REPORT"}
      </div>

      {/* Subtitle */}
      <div
        className={`max-w-2xl text-base leading-7 text-slate-600 ${subtitleClassName}`}
      >
        {subtitle ?? "Academic Session 2026-27"}
      </div>
    </div>
  );
}