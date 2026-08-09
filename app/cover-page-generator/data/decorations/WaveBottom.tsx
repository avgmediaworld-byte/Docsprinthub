"use client";

import BaseDecoration from "./BaseDecoration";

interface WaveBottomProps {
  color?: string;
  opacity?: number;
  height?: number;
  flip?: boolean;
}

export default function WaveBottom({
  color = "#2563eb",
  opacity = 0.16,
  height = 180,
  flip = false,
}: WaveBottomProps) {
  return (
    <BaseDecoration opacity={opacity}>
      <svg
        className={`absolute bottom-0 left-0 w-full ${
          flip ? "-scale-x-100" : ""
        }`}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{
          height,
        }}
      >
        <path
          fill={color}
          d="
          M0,260
          C180,120
          420,320
          720,220
          C980,120
          1180,300
          1440,180
          L1440,320
          L0,320
          Z
          "
        />
      </svg>
    </BaseDecoration>
  );
}