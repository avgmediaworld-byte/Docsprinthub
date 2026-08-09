"use client";

import { useState } from "react";

export default function LogoutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    setIsSigningOut(true);
    try {
      await fetch("/api/admin/session", { method: "DELETE", credentials: "same-origin" });
    } finally {
      window.location.assign("/admin/login");
    }
  }

  return <button type="button" onClick={signOut} disabled={isSigningOut} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60">{isSigningOut ? "Signing out..." : "Sign out"}</button>;
}
