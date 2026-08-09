"use client";

import BaseDecoration from "./BaseDecoration";

interface HexagonProps {
  color?: string;
  opacity?: number;
  size?: number;
}

export default function Hexagon({
  color = "#2563eb",
  opacity = 0.12,
  size = 90,
}: HexagonProps) {
  return (
    <BaseDecoration opacity={opacity}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${10 + i * 18}%`,
            right: `${6 + i * 8}%`,
            width: size,
            height: size,
            border: `2px solid ${color}`,
            clipPath:
              "polygon(25% 6%,75% 6%,100% 50%,75% 94%,25% 94%,0% 50%)",
          }}
        />
      ))}
    </BaseDecoration>
  );
}