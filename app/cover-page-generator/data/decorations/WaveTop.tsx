"use client";

import BaseDecoration from "./BaseDecoration";

interface WaveTopProps {
  color?: string;
  opacity?: number;
  height?: number;
  flip?: boolean;
}

export default function WaveTop({
  color = "#2563eb",
  opacity = 0.18,
  height = 180,
  flip = false,
}: WaveTopProps) {
  return (
    <BaseDecoration opacity={opacity}>
      <svg
        className={`absolute top-0 left-0 w-full ${
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
          M0,64
          C180,180
          420,0
          720,90
          C980,180
          1180,40
          1440,120
          L1440,0
          L0,0
          Z
          "
        />
      </svg>
    </BaseDecoration>
  );
}