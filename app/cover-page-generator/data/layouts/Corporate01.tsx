"use client";

import React from "react";
import BaseLayout from "./BaseLayout";

interface Corporate01Props {
  logo?: React.ReactNode;
  company?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;

  background?: React.ReactNode;
  decorations?: React.ReactNode[];
}

export default function Corporate01({
  logo,
  company,
  title,
  subtitle,
  badge,
  body,
  footer,
  background,
  decorations,
}: Corporate01Props) {
  return (
    <BaseLayout
      className="px-16 py-14"
      background={background}
      decorations={decorations}
      body={
        <div className="flex h-full flex-col">

          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-5">

            <div>
              {logo}
            </div>

            <div className="flex flex-col items-end gap-2">

              {badge}

              <div>
                {company}
              </div>

            </div>

          </div>

          {/* Title Section */}
          <div className="flex flex-1 flex-col items-center justify-center text-center">

            {title}

            <div className="mt-4">
              {subtitle}
            </div>

          </div>

          {/* Body */}
          <div className="mb-8">
            {body}
          </div>

          {/* Footer */}
          <div>
            {footer}
          </div>

        </div>
      }
    />
  );
}