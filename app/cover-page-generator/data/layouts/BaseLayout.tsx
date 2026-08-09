"use client";

import React, { ReactNode } from "react";

export interface BaseLayoutProps {
  children?: ReactNode;

  className?: string;

  header?: ReactNode;

  body?: ReactNode;

  footer?: ReactNode;

  background?: ReactNode;

  decorations?: ReactNode[];
}

export default function BaseLayout({
  children,
  className = "",
  header,
  body,
  footer,

  background,

  decorations = [],
  }: BaseLayoutProps) {
  return (
  <div
    className={`relative h-full w-full overflow-hidden ${className}`}
  >
    {/* Background Layer */}
    {background && (
      <div className="absolute inset-0 z-0">
        {background}
      </div>
    )}

    {/* Decoration Layer */}
    {decorations.length > 0 && (
      <div className="absolute inset-0 z-10 pointer-events-none">
        {decorations.map((item, index) => (
          <React.Fragment key={index}>
            {item}
          </React.Fragment>
        ))}
      </div>
    )}

    {/* Header */}
    {header && (
      <header className="relative z-20">
        {header}
      </header>
    )}

    {/* Body */}
    {body && (
      <main className="relative z-20 h-full w-full">
        {body}
      </main>
    )}

    {/* Custom Content */}
    {children && (
      <div className="relative z-20">
        {children}
      </div>
    )}

    {/* Footer */}
    {footer && (
      <footer className="absolute bottom-0 left-0 z-20 w-full">
        {footer}
      </footer>
    )}
  </div>
  );
}
