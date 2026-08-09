"use client";

import React from "react";

export interface SubtitlePlaceholderProps {
  text?: string;

  align?: "left" | "center" | "right";

  uppercase?: boolean;

  className?: string;
}

export default function SubtitlePlaceholder({
  text = "Submitted in Partial Fulfillment of the Requirements",

  align = "center",

  uppercase = false,

  className = "",
}: SubtitlePlaceholderProps) {
  const alignment =
    align === "left"
      ? "text-left items-start"
      : align === "right"
      ? "text-right items-end"
      : "text-center items-center";

  return (
    <div className={`flex flex-col ${alignment} ${className}`}>
      <p
        className={`
          max-w-md
          text-sm
          leading-relaxed
          tracking-wide
          text-slate-500

          ${uppercase ? "uppercase" : ""}
        `}
      >
        {text}
      </p>
    </div>
  );
}