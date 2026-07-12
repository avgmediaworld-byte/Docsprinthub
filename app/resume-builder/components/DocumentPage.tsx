"use client";

import React from "react";

type DocumentPageProps = {
  children: React.ReactNode;
  pageNumber?: number;
  totalPages?: number;

  className?: string;

  style?: React.CSSProperties;
};

const A4_WIDTH = "210mm";
const A4_HEIGHT = "297mm";
const PAGE_PADDING = "12mm";

export default function DocumentPage({
  children,
  className,
  style,
  pageNumber,
  totalPages,

}: DocumentPageProps) {
  
  return (
    <div
      className="document-page-wrapper"
      style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
          padding: "0px",
          boxSizing: "border-box",

      }}
    >
      <div
        id="resume-preview"
        className={`document-page ${className ?? ""}`}
        
        style={{
        width: A4_WIDTH,
        minHeight: A4_HEIGHT,
        maxHeight: A4_HEIGHT,
        background: "#fff",
        position: "relative",
        boxSizing: "border-box",
        
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,.15)",
        borderRadius: "2px",
        display: "flex",
        flexDirection: "column",
        zIndex: 1,
        padding: "0",
        ...style,
        }}
      >
        
        <div
          style={{
              position: "absolute",
              inset: "6mm",
              border: "3px solid #173f82",
              pointerEvents: "none",
              zIndex: 0,
          }}
      />

            {/* Outer Border */}

      <div
        style={{
          position: "absolute",
          inset: "4mm",
          border: "3px solid #163A70",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Inner Border */}

      <div
        style={{
          position: "absolute",
          inset: "5mm",
          border: "1px solid #163A70",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Content */}


  <div
    style={{
      position: "relative",
      zIndex: 1,
      width: "100%",
      minHeight: "100%",
      overflow: "visible",
      padding: PAGE_PADDING,
      flex: 1,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
    }}
  >
  {children}
  </div>

    {totalPages && totalPages > 1 && (
      <div
        style={{
          position: "absolute",
          right: "10mm",
          bottom: "10mm",

          fontSize: "12px",
          color: "#100e0e",

          zIndex: 50,
          lineHeight: 1,

          pointerEvents: "none",
        }}
      >
        Page {pageNumber} of {totalPages}
      </div>
    )}
      </div>

    </div>
  );
}