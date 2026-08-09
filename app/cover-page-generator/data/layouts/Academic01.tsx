"use client";

import BaseLayout from "./BaseLayout";

interface Academic01Props {
  logo?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  center?: React.ReactNode;
  bottom?: React.ReactNode;

  background?: React.ReactNode;
  decorations?: React.ReactNode[];
}

export default function Academic01({
  logo,
  title,
  subtitle,
  center,
  bottom,
  background,
  decorations,
}: Academic01Props) {
  return (
    <BaseLayout
      className="px-14 py-12"
      background={background}
      decorations={decorations}
      body={
        <div className="flex h-full flex-col items-center">

          {/* Logo */}
          <div className="flex justify-center">
            {logo}
          </div>

          {/* Title */}
          <div className="mt-8 w-full text-center">
            {title}
          </div>

          {/* Subtitle */}
          <div className="mt-4 w-full text-center">
            {subtitle}
          </div>

          {/* Flexible Center Area */}
          <div className="flex-1 flex w-full items-center justify-center">
            {center}
          </div>

          {/* Bottom Area */}
          <div className="w-full">
            {bottom}
          </div>

        </div>
      }
    />
  );
} 