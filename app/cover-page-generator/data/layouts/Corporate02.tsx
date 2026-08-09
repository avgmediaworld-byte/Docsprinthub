"use client";

import React from "react";
import BaseLayout from "./BaseLayout";

interface Corporate02Props {
  logo?: React.ReactNode;
  company?: React.ReactNode;

  title?: React.ReactNode;
  subtitle?: React.ReactNode;

  body?: React.ReactNode;
  footer?: React.ReactNode;

  badge?: React.ReactNode;

  // Theme Support
  background?: React.ReactNode;
  decorations?: React.ReactNode[];
}

export default function Corporate02({
  logo,
  company,
  title,
  subtitle,
  body,
  footer,
  badge,
  background,
  decorations,
}: Corporate02Props) {
  return (
    <BaseLayout
      className="px-14 py-12"
      background={background}
      decorations={decorations}
      body={
        <div className="relative flex h-full flex-col">

          {/* Badge */}
          {badge && (
            <div className="absolute right-0 top-0">
              {badge}
            </div>
          )}

          {/* Company */}
          <div className="flex flex-col items-center">

            {logo}

            {company && (
              <div className="mt-4">
                {company}
              </div>
            )}

          </div>

          {/* Title */}
          <div className="mt-10 text-center">
            {title}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div className="mt-4 text-center">
              {subtitle}
            </div>
          )}

          {/* Body */}
          <div className="flex flex-1 items-center justify-center">
            {body}
          </div>

          {/* Footer */}
          {footer && (
            <div className="border-t border-slate-200 pt-6">
              {footer}
            </div>
          )}

        </div>
      }
    />
  );
}