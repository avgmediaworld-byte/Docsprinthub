"use client";

import BaseBackground from "./BaseBackground";

export default function RoyalPurple() {
  return (
    <BaseBackground
      className="bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-700"
      style={{ background: "linear-gradient(135deg, #2e1065 0%, #581c87 52%, #a21caf 100%)" }}
      overlay={
        <>
          {/* Purple Glow */}
          <div className="absolute -top-40 left-0 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl" />

          <div className="absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl" />
        </>
      }
      effects={
        <>
          {/* Mesh Gradient */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,#ffffff_0%,transparent_45%),radial-gradient(circle_at_bottom_right,#ffffff_0%,transparent_45%)]" />

          {/* Diagonal Lines */}
          <svg
            className="absolute inset-0 h-full w-full opacity-15"
            viewBox="0 0 800 1100"
            fill="none"
          >
            {Array.from({ length: 18 }).map((_, i) => (
              <line
                key={i}
                x1={i * 60}
                y1="0"
                x2={i * 60 - 250}
                y2="1100"
                stroke="white"
                strokeWidth="1"
              />
            ))}
          </svg>

          {/* Decorative Rings */}
          <div className="absolute top-20 right-16 h-36 w-36 rounded-full border border-white/20" />

          <div className="absolute bottom-20 left-12 h-28 w-28 rounded-full border border-white/20" />

          {/* Accent Blob */}
          <div className="absolute top-1/3 left-10 h-28 w-28 rounded-full bg-pink-400/20 blur-2xl" />
        </>
      }
    />
  );
}
