"use client";

import { useEffect, useRef, useState } from "react";

import {
  ChevronDown,
  FileText,
  Image,
  Printer,
} from "lucide-react";

type Props = {
  onPDF: () => void;
  onJPG: () => void;
  onPrint: () => void;
};

export default function ExportButton({
  onPDF,
  onJPG,
  onPrint,
}: Props) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    window.addEventListener("click", close);

    return () =>
      window.removeEventListener("click", close);
  }, []);

  return (
      <div
        ref={menuRef}
        className="relative inline-block"
        style={{
          position: "relative",
          zIndex: 1000,
          cursor: "pointer",
        }}
      >
      <button
      onClick={() => setOpen(!open)}
      style={{
        width: "170px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "12px",
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
        boxShadow: "0 4px 10px rgba(0,0,0,.15)",
      }}
    >
        Export Resume

        <ChevronDown
          size={18}
          className={`
            transition-transform
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div
      className="
      absolute
      right-0
      top-full
      mt-2
      rounded-xl
      border
      border-gray-200
      bg-white
      shadow-2xl
      overflow-hidden
      z-50
        "
      style={{
          position: "absolute",
          right: 0,
          top: "100%",
          marginTop: "8px",
          width: "170px",
          }}
        >
          <button
            onClick={() => {
              setOpen(false);
              onPDF();
            }}
          style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              padding: "14px 16px",
              cursor: "pointer",
              border: "none",
              background: "#fff",
              borderRadius: "18px",
          }}
          >
            <FileText
              className="text-red-600"
              size={20}
            />

            Export as PDF
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onJPG();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              padding: "14px 16px",
              cursor: "pointer",
              border: "none",
              background: "#fff",
            }}
            >
            <Image
              className="text-green-600"
              size={20}
            />

            Export as JPG
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onPrint();
            }}
          style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              borderRadius: "18px",
              width: "100%",
              padding: "14px 16px",
              cursor: "pointer",
              border: "none",
              background: "#fff",
            }}
          >
            <Printer
              className="text-blue-600"
              size={20}
            />

            Print Resume
          </button>
        </div>
      )}
    </div>
  );
}