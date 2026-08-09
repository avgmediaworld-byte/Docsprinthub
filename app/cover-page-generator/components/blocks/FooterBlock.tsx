"use client";

import { ReactNode } from "react";

interface FooterBlockProps {
  left?: ReactNode;

  center?: ReactNode;

  right?: ReactNode;

  className?: string;

  borderTop?: boolean;
}

export default function FooterBlock({
  left,

  center,

  right,

  className = "",

  borderTop = true,
}: FooterBlockProps) {
  return (
    <footer
      className={`
        flex
        items-end
        justify-between
        gap-6
        pt-6
        ${borderTop ? "border-t border-slate-200" : ""}
        ${className}
      `}
    >
      <div className="flex-1">
        {left}
      </div>

      <div className="flex-1 text-center">
        {center}
      </div>

      <div className="flex-1 text-right">
        {right}
      </div>
    </footer>
  );
}