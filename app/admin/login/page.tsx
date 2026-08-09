import type { Metadata } from "next";
import Link from "next/link";
import AdminLoginForm from "./AdminLoginForm";

export const metadata: Metadata = {
  title: "Analytics Admin | DocSprintHub",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5 py-10 text-slate-950">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">DocSprintHub</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Analytics admin</h1>
        <p className="mt-3 leading-7 text-slate-600">This private dashboard is available only to the site administrator.</p>
        <AdminLoginForm />
        <Link href="/" className="mt-6 inline-block text-sm font-bold text-blue-700 hover:text-blue-900">← Back to DocSprintHub</Link>
      </section>
    </main>
  );
}
