"use client";

import BaseDecoration from "./BaseDecoration";

interface CornerRibbonProps {
  color?: string;
  width?: number;
}

export default function CornerRibbon({
  color = "#2563eb",
  width = 180,
}: CornerRibbonProps) {
  return (
    <BaseDecoration>
      <div
        className="absolute top-0 right-0"
        style={{
          width,
          height: width,
          background: color,
          clipPath: "polygon(100% 0,0 0,100% 100%)",
          opacity: 0.18,
        }}
      />
    </BaseDecoration>
  );
}