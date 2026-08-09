"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

const supportTopics = [
  ["Technical Support", "Having trouble using a tool or downloading your document?"],
  ["Suggest an Improvement", "Have an idea to make an existing feature better?"],
  ["Request a New Feature", "Tell us about a new tool or feature you would like to see."],
  ["Request a Template", "Want a new resume, letter, or document template?"],
  ["Report a Problem", "Found something that is not working correctly?"],
];

const requestTypes = ["General Question", "Technical Support", "Suggest an Improvement", "Request a New Feature", "Request a Template", "Report a Problem", "Other"];

type FeedbackForm = { name: string; email: string; type: string; message: string; website: string };

const initialForm: FeedbackForm = { name: "", email: "", type: "", message: "", website: "" };

export default function HelpSupportPage() {
  const [form, setForm] = useState<FeedbackForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  function updateField(field: keyof FeedbackForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json().catch(() => ({ message: "Feedback could not be submitted." }));
      if (!response.ok) throw new Error(result.message || "Feedback could not be submitted.");
      setNotice({ kind: "success", message: result.message });
      setForm(initialForm);
    } catch (error) {
      setNotice({ kind: "error", message: error instanceof Error ? error.message : "Feedback could not be submitted." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return <main className="min-h-screen bg-slate-50 text-slate-950">
    <header className="border-b border-slate-200 bg-white">
      <div className="flex w-full items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl"><Image src="/docsprinthub-logo.png" alt="DocSprintHub logo" width={38} height={38} className="h-9 w-9 object-contain" priority /><span className="whitespace-nowrap">DocSprint<span className="text-blue-600">Hub</span></span></Link>
        <span className="text-base font-bold text-slate-800">Help &amp; Support</span>
      </div>
    </header>

    <section className="border-b border-blue-100 bg-gradient-to-b from-blue-50 to-slate-50 px-5 py-7 text-center sm:py-9">
      <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">How can we help you?</h1>
      <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Need help with DocSprintHub or have an idea to make it better? Send us your question, feedback, or suggestion. We would love to hear from you.</p>
    </section>

    <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_28rem] lg:py-14 sm:px-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">What do you need help with?</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">{supportTopics.map(([title, description]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-sm font-extrabold text-blue-700">?</span><h3 className="mt-4 font-bold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></article>)}</div>
        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-7"><h2 className="text-xl font-bold text-slate-950">Need more help?</h2><p className="mt-2 leading-7 text-slate-700">For any other questions or assistance, feel free to contact us. The DocSprintHub Support Team will review every submitted request.</p></section>
      </div>

      <section className="self-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-5">
        <h2 className="text-2xl font-bold text-slate-950">Send us your feedback</h2><p className="mt-2 text-sm leading-6 text-slate-600">Your feedback helps us improve DocSprintHub.</p>
        <form className="mt-6 space-y-4" onSubmit={submitFeedback}>
          <label className="block"><span className="text-sm font-bold text-slate-800">Your name <span className="font-normal text-slate-500">(optional)</span></span><input value={form.name} onChange={(event) => updateField("name", event.target.value)} maxLength={120} placeholder="Enter your name" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
          <label className="block"><span className="text-sm font-bold text-slate-800">Email <span className="font-normal text-slate-500">(optional)</span></span><input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} maxLength={254} placeholder="Enter your email" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
          <label className="block"><span className="text-sm font-bold text-slate-800">Type of request</span><select required value={form.type} onChange={(event) => updateField("type", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"><option value="">Select an option</option>{requestTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
          <label className="block"><span className="text-sm font-bold text-slate-800">Your message</span><textarea required value={form.message} onChange={(event) => updateField("message", event.target.value)} minLength={10} maxLength={5000} rows={6} placeholder="Tell us how we can help..." className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
          <label className="sr-only" aria-hidden="true">Leave this field empty<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => updateField("website", event.target.value)} /></label>
          {notice && <p role={notice.kind === "error" ? "alert" : "status"} className={`rounded-xl p-3 text-sm leading-6 ${notice.kind === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>{notice.message}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">{isSubmitting ? "Sending feedback..." : "Submit feedback"}</button>
        </form>
      </section>
    </section>

    <footer className="bg-slate-900 px-5 py-8 text-white sm:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between"><p>© 2026 DocSprintHub · Powered by HP Sons Traders</p><div className="flex flex-wrap gap-x-5 gap-y-2 text-slate-200"><Link href="/">Home</Link><Link href="/resume-builder">Resume Builder</Link><Link href="/pdf-tools">PDF Tools</Link><Link href="/help-support">Help &amp; Support</Link></div></div></footer>
  </main>;
}
