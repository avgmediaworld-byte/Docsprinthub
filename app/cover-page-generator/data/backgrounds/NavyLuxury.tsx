"use client";

import BaseBackground from "./BaseBackground";

export default function NavyLuxury() {
  return (
    <BaseBackground
      className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0f172a 55%, #1e293b 100%)" }}
      overlay={
        <>
          {/* Gold Glow */}
          <div className="absolute -top-40 -right-24 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl" />
        </>
      }
      effects={
        <>
          {/* Gold Top Line */}
          <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-yellow-700 via-yellow-300 to-yellow-700" />

          {/* Gold Bottom Line */}
          <div className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-yellow-700 via-yellow-300 to-yellow-700" />

          {/* Left Border */}
          <div className="absolute left-8 top-8 h-[90%] w-px bg-yellow-400/20" />

          {/* Right Border */}
          <div className="absolute right-8 top-8 h-[90%] w-px bg-yellow-400/20" />

          {/* Decorative Rings */}
          <div className="absolute top-16 right-16 h-40 w-40 rounded-full border border-yellow-400/20" />

          <div className="absolute bottom-20 left-14 h-24 w-24 rounded-full border border-yellow-500/20" />

        </>
      }
    />
  );
}
