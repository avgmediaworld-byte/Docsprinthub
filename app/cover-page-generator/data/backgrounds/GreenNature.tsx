"use client";

import BaseBackground from "./BaseBackground";

export default function GreenNature() {
  return (
    <BaseBackground
      className="bg-gradient-to-br from-emerald-50 via-green-100 to-teal-200"
      style={{ background: "linear-gradient(135deg, #ecfdf5 0%, #dcfce7 50%, #99f6e4 100%)" }}
      overlay={
        <>
          {/* Top Glow */}
          <div className="absolute -top-40 left-0 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />

          {/* Bottom Glow */}
          <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-green-400/20 blur-3xl" />
        </>
      }
      effects={
        <>
          {/* Organic Wave */}
          <svg
            className="absolute top-0 left-0 w-full h-56 opacity-30"
            viewBox="0 0 1200 240"
            preserveAspectRatio="none"
          >
            <path
              d="M0,80 C180,180 420,0 600,80 C820,180 980,30 1200,120 L1200,0 L0,0 Z"
              fill="#16a34a"
            />
          </svg>

          {/* Bottom Wave */}
          <svg
            className="absolute bottom-0 left-0 w-full h-52 opacity-20"
            viewBox="0 0 1200 240"
            preserveAspectRatio="none"
          >
            <path
              d="M0,160 C180,60 420,220 600,150 C850,60 1000,210 1200,120 L1200,240 L0,240 Z"
              fill="#15803d"
            />
          </svg>

          {/* Decorative Rings */}
          <div className="absolute top-24 right-20 h-36 w-36 rounded-full border border-green-300/40" />

          <div className="absolute bottom-24 left-16 h-28 w-28 rounded-full border border-emerald-300/40" />

          {/* Dot Grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(#166534 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
        </>
      }
    />
  );
}
