"use client";

import React from "react";

export interface TitlePlaceholderProps {
  title?: string;
  subtitle?: string;

  align?: "left" | "center" | "right";

  titleClassName?: string;
  subtitleClassName?: string;

  className?: string;
}

export default function TitlePlaceholder({
  title = "PROJECT REPORT",
  subtitle = "Artificial Intelligence",

  align = "center",

  titleClassName = "",
  subtitleClassName = "",

  className = "",
}: TitlePlaceholderProps) {
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
      <h1
        className={`
          text-3xl
          font-black
          uppercase
          tracking-wide
          text-slate-900
          ${titleClassName}
        `}
      >
        {title}
      </h1>

      <div
        className={`
          mt-2
          h-1
          w-20
          rounded-full
          bg-blue-600
        `}
      />

      <p
        className={`
          mt-3
          text-base
          font-medium
          text-slate-600
          ${subtitleClassName}
        `}
      >
        {subtitle}
      </p>
    </div>
  );
}