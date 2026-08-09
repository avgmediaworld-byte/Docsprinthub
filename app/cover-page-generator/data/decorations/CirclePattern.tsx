"use client";

import BaseDecoration from "./BaseDecoration";

interface CirclePatternProps {
  color?: string;
  opacity?: number;
  size?: number;
  count?: number;
}

export default function CirclePattern({
  color = "#2563eb",
  opacity = 0.12,
  size = 120,
  count = 6,
}: CirclePatternProps) {
  return (
    <BaseDecoration opacity={opacity}>
      {Array.from({ length: count }).map((_, index) => {
        const top = (index * 14) % 75;
        const left = (index * 18) % 80;

        return (
          <div
            key={index}
            className="absolute rounded-full border"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: size - index * 12,
              height: size - index * 12,
              borderColor: color,
              borderWidth: "2px",
            }}
          />
        );
      })}
    </BaseDecoration>
  );
}