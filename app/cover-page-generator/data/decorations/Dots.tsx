"use client";

import BaseDecoration from "./BaseDecoration";

interface DotsProps {
  color?: string;
  opacity?: number;
  size?: number;
  gap?: number;
}

export default function Dots({
  color = "#2563eb",
  opacity = 0.08,
  size = 4,
  gap = 26,
}: DotsProps) {
  return (
    <BaseDecoration opacity={opacity}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${color} ${size / 2}px, transparent ${size / 2}px)`,
          backgroundSize: `${gap}px ${gap}px`,
        }}
      />
    </BaseDecoration>
  );
}