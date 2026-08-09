"use client";

import BaseBackground from "./BaseBackground";

export default function GradientBlue() {
  return (
    <BaseBackground
      className="bg-gradient-to-br from-sky-50 via-white to-blue-100"
      style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 54%, #dbeafe 100%)" }}
      overlay={
        <>
          {/* Top Glow */}
          <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />

          {/* Bottom Glow */}
          <div className="absolute -bottom-36 -right-28 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
        </>
      }
      effects={
        <>
          {/* Top Right Wave */}
          <svg
            className="absolute top-0 right-0 h-56 w-72 opacity-60"
            viewBox="0 0 500 300"
            fill="none"
          >
            <path
              d="M520 -20 C380 40 360 120 250 130 C150 140 120 40 -20 90"
              stroke="#2563eb"
              strokeWidth="3"
            />
            <path
              d="M520 10 C380 70 360 150 250 160 C150 170 120 70 -20 120"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <path
              d="M520 40 C380 100 360 180 250 190 C150 200 120 100 -20 150"
              stroke="#60a5fa"
              strokeWidth="2"
            />
          </svg>

          {/* Bottom Left Wave */}
          <svg
            className="absolute bottom-0 left-0 h-56 w-72 rotate-180 opacity-60"
            viewBox="0 0 500 300"
            fill="none"
          >
            <path
              d="M520 -20 C380 40 360 120 250 130 C150 140 120 40 -20 90"
              stroke="#2563eb"
              strokeWidth="3"
            />
            <path
              d="M520 10 C380 70 360 150 250 160 C150 170 120 70 -20 120"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <path
              d="M520 40 C380 100 360 180 250 190 C150 200 120 100 -20 150"
              stroke="#60a5fa"
              strokeWidth="2"
            />
          </svg>

          {/* Decorative Circles */}
          <div className="absolute top-28 right-24 h-36 w-36 rounded-full border border-blue-200/50" />

          <div className="absolute top-40 right-40 h-20 w-20 rounded-full bg-blue-100/50" />

          <div className="absolute bottom-24 left-20 h-24 w-24 rounded-full border border-sky-200/50" />
        </>
      }
    />
  );
}
