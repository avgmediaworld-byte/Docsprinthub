"use client";

import BaseBackground from "./BaseBackground";

export default function MinimalWhite() {
  return (
    <BaseBackground
      className="bg-white"
      style={{ background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 52%, #f0f9ff 100%)" }}
      overlay={
        <>
          {/* Soft Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-sky-50" />

          {/* Corner Glow */}
          <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-slate-200/25 blur-3xl" />

          <div className="absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-blue-100/20 blur-3xl" />
        </>
      }
      effects={
        <>
          {/* Top Border */}
          <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-slate-700 via-slate-300 to-slate-700" />

          {/* Bottom Border */}
          <div className="absolute bottom-0 left-0 h-2 w-full bg-gradient-to-r from-slate-700 via-slate-300 to-slate-700" />

          {/* Left Line */}
          <div className="absolute left-8 top-12 h-[82%] w-px bg-slate-200" />

          {/* Right Line */}
          <div className="absolute right-8 top-12 h-[82%] w-px bg-slate-200" />

          {/* Decorative Circle */}
          <div className="absolute top-24 right-20 h-28 w-28 rounded-full border border-slate-200" />

          <div className="absolute bottom-24 left-16 h-20 w-20 rounded-full border border-slate-200" />
        </>
      }
    />
  );
}
