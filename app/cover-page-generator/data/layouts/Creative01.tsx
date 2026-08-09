"use client";

import BaseLayout from "./BaseLayout";

interface Creative01Props {
  logo?: React.ReactNode;
  badge?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;

  // Theme Support
  background?: React.ReactNode;
  decorations?: React.ReactNode[];
}

export default function Creative01({
  logo,
  badge,
  title,
  subtitle,
  body,
  footer,
  background,
  decorations,
}: Creative01Props) {
  return (
    <BaseLayout
      className="px-14 py-14"
      background={background}
      decorations={decorations}
      body={
        <div className="flex h-full flex-col">

          {/* Top Section */}
          <div className="flex items-start justify-between">

            <div>
              {logo}
            </div>

            <div>
              {badge}
            </div>

          </div>

          {/* Hero Title */}
          <div className="mt-12 text-center">

            {title}

            <div className="mt-5">
              {subtitle}
            </div>

          </div>

          {/* Flexible Body */}
          <div className="flex-1 flex items-center justify-center">
            {body}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 pt-6">
            {footer}
          </div>

        </div>
      }
    />
  );
}