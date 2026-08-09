"use client";

import React from "react";

export interface BadgePlaceholderProps {
  text?: string;

  variant?:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "dark";

  rounded?: boolean;

  className?: string;
}

export default function BadgePlaceholder({
  text = "PREMIUM",

  variant = "primary",

  rounded = true,

  className = "",
}: BadgePlaceholderProps) {

  const variants = {
    primary:
      "bg-blue-600 text-white",

    success:
      "bg-emerald-600 text-white",

    warning:
      "bg-amber-500 text-black",

    danger:
      "bg-red-600 text-white",

    dark:
      "bg-slate-900 text-white",
  };

  return (
    <div
      className={`
        inline-flex
        items-center
        justify-center
        px-4
        py-2
        text-xs
        font-bold
        tracking-[0.25em]
        uppercase
        shadow-sm

        ${rounded ? "rounded-full" : "rounded-md"}

        ${variants[variant]}

        ${className}
      `}
    >
      {text}
    </div>
  );
}