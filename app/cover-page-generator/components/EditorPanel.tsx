"use client";

import React from "react";

export default function EditorPanel() {
  return (
    <aside
      className="
        h-full
        w-[360px]
        overflow-y-auto
        border-r
        border-slate-200
        bg-white
      "
    >
      {/* ===============================
          Editor Header
      =============================== */}

      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white p-5">

        <h2 className="text-xl font-bold text-slate-900">
          Cover Page Editor
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Customize your template
        </p>

      </div>

      {/* ===============================
          Editor Body
      =============================== */}

      <div className="space-y-6 p-5">

        {/* =====================================
            Content Section
        ===================================== */}

        <section id="content-section">

          <SectionTitle title="Content" />

            <div className="mt-5 space-y-4">

            <InputField
                label="Institution Name"
                placeholder="ABC University"
            />

            <InputField
                label="Department"
                placeholder="Department of Computer Science"
            />

            <InputField
                label="Address"
                placeholder="City, State"
            />

            <InputField
                label="Document Type"
                placeholder="Project Report"
            />

            <InputField
                label="Project Title"
                placeholder="Artificial Intelligence System"
            />

            <InputField
                label="Subtitle"
                placeholder="Enter subtitle"
            />

            <InputField
                label="Student Name"
                placeholder="Student Name"
            />

            <InputField
                label="Guide Name"
                placeholder="Guide Name"
            />

            <InputField
                label="Course"
                placeholder="B.Tech CSE"
            />

            <InputField
                label="Session"
                placeholder="2026-27"
            />

            </div>


        </section>

        {/* =====================================
            Theme Section
        ===================================== */}

        <section id="theme-section">

          <SectionTitle title="Theme" />

          <div className="mt-5 grid grid-cols-2 gap-3">

            <ThemeCard
                title="Classic Blue"
                primary="bg-blue-600"
                secondary="bg-blue-100"
            />

            <ThemeCard
                title="Emerald"
                primary="bg-emerald-600"
                secondary="bg-emerald-100"
            />

            <ThemeCard
                title="Royal Purple"
                primary="bg-violet-600"
                secondary="bg-violet-100"
            />

            <ThemeCard
                title="Ruby Red"
                primary="bg-red-600"
                secondary="bg-red-100"
            />

            <ThemeCard
                title="Dark Pro"
                primary="bg-slate-900"
                secondary="bg-slate-400"
            />

            <ThemeCard
                title="Luxury Gold"
                primary="bg-amber-500"
                secondary="bg-yellow-100"
            />

            </div>

        </section>

        {/* =====================================
            Typography Section
        ===================================== */}

        <section id="typography-section">

          <SectionTitle title="Typography" />

          <div className="mt-5 space-y-5">

            <SelectField
                label="Font Family"
                options={[
                "Inter",
                "Poppins",
                "Montserrat",
                "Roboto",
                "Open Sans",
                ]}
            />

            <RangeField
                label="Font Size"
                value="32"
                min={12}
                max={72}
            />

            <RangeField
                label="Font Weight"
                value="700"
                min={300}
                max={900}
                step={100}
            />

            <RangeField
                label="Letter Spacing"
                value="1"
                min={0}
                max={10}
            />

            <RangeField
                label="Line Height"
                value="1.5"
                min={1}
                max={3}
                step={0.1}
            />

            <ToggleField
                label="Uppercase Text"
            />

            </div>

        </section>

        {/* =====================================
            Layout Section
        ===================================== */}

        <section id="layout-section">

          <SectionTitle title="Layout" />

        </section>

        {/* =====================================
            Logo Section
        ===================================== */}

        <section id="logo-section">

          <SectionTitle title="Logo" />

        </section>

        {/* =====================================
            Background Section
        ===================================== */}

        <section id="background-section">

          <SectionTitle title="Background" />

        </section>

        {/* =====================================
            Decoration Section
        ===================================== */}

        <section id="decoration-section">

          <SectionTitle title="Decoration" />

        </section>

        {/* =====================================
            Export Section
        ===================================== */}

        <section id="export-section">

          <SectionTitle title="Export" />

        </section>

      </div>

    </aside>
  );
}

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
  helperText?: string;
  onChange?: (value: string) => void;
}

function InputField({
  label,
  placeholder = "",
  value = "",
  required = false,
  disabled = false,
  type = "text",
  helperText,
  onChange,
}: InputFieldProps) {
  return (
    <div className="space-y-2">

      {/* Label */}

      <div className="flex items-center justify-between">

        <label className="text-sm font-semibold text-slate-700">

          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}

        </label>

      </div>

      {/* Input */}

      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          bg-white
          px-4
          py-2.5
          text-sm
          text-slate-800
          placeholder:text-slate-400
          shadow-sm
          outline-none
          transition-all
          duration-200

          hover:border-slate-400

          focus:border-blue-600
          focus:ring-4
          focus:ring-blue-100

          disabled:cursor-not-allowed
          disabled:bg-slate-100
          disabled:text-slate-400
        "
      />

      {/* Helper Text */}

      {helperText && (
        <p className="text-xs text-slate-500">
          {helperText}
        </p>
      )}

    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-900">{title}</h3>;
}

function ThemeCard({ title, primary, secondary }: { title: string; primary: string; secondary: string }) {
  return (
    <button type="button" className="rounded-xl border border-slate-200 p-3 text-left transition hover:border-blue-400 hover:shadow-sm">
      <span className={`mb-3 block h-8 rounded-lg ${primary}`} />
      <span className={`mb-3 block h-3 rounded ${secondary}`} />
      <span className="text-xs font-semibold text-slate-700">{title}</span>
    </button>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block space-y-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <select defaultValue={options[0]} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function RangeField({ label, value, min, max, step = 1 }: { label: string; value: string; min: number; max: number; step?: number }) {
  return (
    <label className="block space-y-2 text-sm font-semibold text-slate-700">
      <span className="flex justify-between gap-3"><span>{label}</span><span className="font-medium text-slate-500">{value}</span></span>
      <input type="range" defaultValue={value} min={min} max={max} step={step} className="w-full accent-blue-600" />
    </label>
  );
}

function ToggleField({ label }: { label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <input type="checkbox" className="h-4 w-4 accent-blue-600" />
    </label>
  );
}
