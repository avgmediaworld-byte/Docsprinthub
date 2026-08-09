"use client";

import React from "react";

export interface LogoPlaceholderProps {
  logo?: React.ReactNode;

  size?: number;

  title?: string;

  subtitle?: string;

  transparent?: boolean;

  bordered?: boolean;

  className?: string;
}

export default function LogoPlaceholder({
  logo,

  size = 72,

  title = "DS",

  subtitle = "DocSprintHub",

  transparent = true,

  bordered = true,

  className = "",
}: LogoPlaceholderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
    >
      <div
        style={{
          width: size,
          height: size,
        }}
        className={`
          flex
          items-center
          justify-center
          overflow-hidden
          rounded-full
          transition-all

          ${
            transparent
              ? "bg-transparent"
              : "bg-white shadow-md"
          }

          ${
            bordered
              ? "border-2 border-slate-300"
              : "border-0"
          }
        `}
      >
        {logo ? (
          logo
        ) : (
          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              rounded-full
              bg-gradient-to-br
              from-blue-600
              via-sky-500
              to-cyan-400
              text-white
              font-black
              tracking-wider
            "
            style={{
              fontSize: size * 0.34,
            }}
          >
            {title}
          </div>
        )}
      </div>

      {!logo && (
        <div
          className="
            mt-2
            text-center
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.25em]
            text-slate-500
          "
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}