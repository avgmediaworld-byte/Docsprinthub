"use client";

import React from "react";

/* ===========================================================
   DocSprintHub
   Cover Page Generator

   Template : Academic Frame
   Version  : 1.0

   Sprint-1
=========================================================== */

export default function AcademicFrame() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-10">

      {/* Paper */}

      <main
      className="
      relative
      w-[794px]
      min-h-[1123px]
      overflow-hidden
      rounded-xl
      border
      border-slate-200
      bg-white
      shadow-2xl
      "
      >

        {/* Safe Print Area */}

        <div className="flex h-full flex-col p-10">

          {/* ===============================================
              Decorative Layer
          =============================================== */}

          <div
            className="
              absolute
              right-[-90px]
              top-[-90px]
              h-72
              w-72
              rounded-full
              bg-blue-50
            "
          />

          <div
            className="
              absolute
              left-[-120px]
              bottom-[-120px]
              h-80
              w-80
              rounded-full
              bg-slate-100
            "
          />

          <div
            className="
              absolute
              left-0
              top-0
              h-full
              w-2
              bg-gradient-to-b
              from-slate-900
              via-blue-700
              to-slate-900
            "
          />

          <div
            className="
              absolute
              right-0
              top-0
              h-full
              w-2
              bg-gradient-to-b
              from-slate-900
              via-blue-700
              to-slate-900
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              flex
              items-center
              justify-center
              select-none
            "
          >

            <h1
              className="
                text-[180px]
                font-black
                tracking-widest
                text-slate-100
                opacity-40
              "
            >
              DSP
            </h1>

          </div>`        

          {/* ======================================================
              Header
          ====================================================== */}

          <section
            id="header-area"
            className="relative flex h-[170px] flex-col items-center justify-center"
          >

            {/* Top Accent Ribbon */}

            <div className="absolute left-0 top-0 h-2 w-full rounded-t-xl bg-gradient-to-r from-slate-900 via-blue-700 to-slate-900" />

            {/* Logo */}

            <div
              className="
                mb-5
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                border-4
                border-slate-200
                bg-white
                shadow-md
              "
            >
              <span className="text-xs font-semibold text-slate-400">
                LOGO
              </span>
            </div>

            {/* Institution */}

            <h1
              className="
                text-center
                text-3xl
                font-extrabold
                tracking-wide
                text-slate-900
              "
            >
              Institution Name
            </h1>

            {/* Department */}

            <p className="mt-2 text-base font-medium text-slate-600">
              Department of Computer Science
            </p>

            {/* Address */}

            <p className="mt-1 text-sm text-slate-500">
              City • State • Website
            </p>

          </section>

          {/* ======================================================
              Hero
          ====================================================== */}

          <section
            id="hero-area"
            className="
              mt-8
              flex
              h-[220px]
              flex-col
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-b
              from-slate-50
              to-white
              px-8
              text-center
            "
          >

            {/* Document Badge */}

            <div
              className="
                rounded-full
                border
                border-blue-200
                bg-blue-50
                px-5
                py-2
                text-xs
                font-semibold
                uppercase
                tracking-[0.3em]
                text-blue-700
              "
            >
              Project Report
            </div>

            {/* Title */}

            <h2
              className="
                mt-8
                max-w-[620px]
                text-5xl
                font-black
                uppercase
                leading-tight
                tracking-tight
                text-slate-900
              "
            >
              Artificial Intelligence System
            </h2>

            {/* Divider */}

            <div
              className="
                mt-8
                h-[4px]
                w-24
                rounded-full
                bg-gradient-to-r
                from-blue-700
                via-slate-900
                to-blue-700
              "
            />

            {/* Subtitle */}

            <p
              className="
                mt-8
                max-w-[620px]
                text-base
                leading-8
                text-slate-600
              "
            >
              Submitted in partial fulfillment of the requirements
              for the award of the Bachelor of Technology Degree.
            </p>

          </section>

          {/* ======================================================
              Information
          ====================================================== */}

          <section
            id="information-area"
            className="
              mt-8
              grid
              flex-1
              grid-cols-2
              gap-8
            "
          >

            {/* ===========================
                Submitted By
            ============================ */}

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                p-8
                shadow-sm
              "
            >

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-700">
                Submitted By
              </p>

              <div className="mt-8 space-y-5">

                <InfoRow
                  label="Student"
                  value="Student Name"
                />

                <InfoRow
                  label="Roll No."
                  value="220012345"
                />

                <InfoRow
                  label="Registration"
                  value="REG20260001"
                />

                <InfoRow
                  label="Course"
                  value="B.Tech CSE"
                />

              </div>

            </div>

            {/* ===========================
                Submitted To
            ============================ */}

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                p-8
                shadow-sm
              "
            >

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-700">
                Submitted To
              </p>

              <div className="mt-8 space-y-5">

                <InfoRow
                  label="Guide"
                  value="Guide Name"
                />

                <InfoRow
                  label="Department"
                  value="Computer Science"
                />

                <InfoRow
                  label="Institution"
                  value="Institution Name"
                />

                <InfoRow
                  label="Session"
                  value="2026 - 2027"
                />

              </div>

            </div>

          </section>

          {/* ======================================================
              Footer
          ====================================================== */}

          <section
            id="footer-area"
            className="
              relative
              mt-8
              flex
              h-[90px]
              items-center
              justify-between
              border-t
              border-slate-200
              pt-5
            "
          >

            <div>

              <p className="text-sm font-semibold text-slate-900">
                www.docsprinthub.com
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Professional Cover Page Generator
              </p>

            </div>

            <div className="text-right">

              <p className="text-sm font-semibold text-slate-900">
                Session 2026–27
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Premium Academic Template
              </p>

            </div>

          </section>

        </div>

      </main>

    </div>
  );

  function InfoRow({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) {
    return (
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">

        <span className="text-sm font-medium text-slate-500">
          {label}
        </span>

        <span className="text-sm font-semibold text-slate-900">
          {value}
        </span>

      </div>
    );
  }  

}