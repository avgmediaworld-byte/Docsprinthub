"use client";

import BaseLayout from "./BaseLayout";

interface Academic02Props {
  logo?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  center?: React.ReactNode;
  bottom?: React.ReactNode;

  background?: React.ReactNode;
  decorations?: React.ReactNode[];
}

export default function Academic02({
  logo,
  title,
  subtitle,
  center,
  bottom,
  background,
  decorations,
}: Academic02Props){
  return (
    
    <BaseLayout
      className="px-14 py-12"
      background={background}
      decorations={decorations}
      body={
        <div className="flex h-full flex-col">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-6">

            <div className="flex items-center">
              {logo}
            </div>

          </div>

          {/* Title */}
          <div className="mt-10 text-center">
            {title}
          </div>

          {/* Subtitle */}
          <div className="mt-4 text-center">
            {subtitle}
          </div>

          {/* Main Area */}
          <div className="flex-1 flex items-center justify-center w-full">
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
