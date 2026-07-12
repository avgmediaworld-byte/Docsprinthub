"use client";

import {
  useRef,
  useState,
  useEffect,
} from "react";

import type {
  DocumentPage,
  PageSection,
} from "../auto-page-break/types";

import Classic from "../templates/Classic";
import Fresher from "../templates/Fresher";
import Modern from "../templates/Modern";
import Biodata from "../templates/Biodata";


import ExportButton from "./ExportButton";
import PageRenderer from "../auto-page-break/PageRenderer";
import PaginationEngine from "../auto-page-break/PaginationEngine";

import { ResumeData } from "../types/resume";



type Props = {
  data: ResumeData;
  onPDF: () => void;
  onJPG: () => void;
  onPrint: () => void;
  onBack: () => void;
};



  export default function ResumePreview({
    data,
    onPDF,
    onJPG,
    onPrint,
    onBack,
  }: Props) {

    const pageRef = useRef<HTMLDivElement>(null);
   const paginationEngine = useRef(
    new PaginationEngine()
    ).current;

    
  
  const [documentPages, setDocumentPages] =
    useState<DocumentPage[]>([
      {
        id: 1,
        usedHeight: 0,
        remainingHeight: 0,
        sections: [],
      },
    ]);

  // Printable A4 Area (Future Page Engine)

  /*
  |--------------------------------------------------------------------------
  | Document Constants
  |--------------------------------------------------------------------------
  */
 
    const renderMeasureTemplate = () => {
    switch (data.template) {
        case "classic":
            return <Classic data={data} />;
        case "fresher":
            return <Fresher data={data} />;
        case "modern":
            return <Modern data={data} />;
        case "biodata":
            return <Biodata data={data} />;
          default:
      return null;
    }
  };
  
const pages = documentPages;

  const renderSection = (
  section: PageSection,
  pageNumber: number
) => {
  switch (data.template) {
    case "classic":
      return (
        <Classic
        data={data}
        pageNumber={pageNumber}
        section={section.name}
        pageSection={section}
        />
      );

    case "fresher":
      return (
        <Fresher
          data={data}
        />
      );

    case "modern":
      return (
        <Modern
          data={data}
        />
      );

    case "biodata":
      return (
        <Biodata
          data={data}
        />
      );

    default:
      return null;
  }
};



  const isPaginating = useRef(false);

  useEffect(() => {
  
  if (!pageRef.current) return;

  let frame = 0;

const updateHeight = () => {
    if (!pageRef.current) return;
    if (isPaginating.current) {
  return;
  }


isPaginating.current = true;

const newPages =
  paginationEngine.paginate(
    pageRef.current
  );

console.log("Re-paginated", {
  pages: newPages.length,
  sections: newPages.flatMap(page => page.sections).length,
});

isPaginating.current = false;

setDocumentPages((prev) => {

const same =
  prev.length === newPages.length &&
  prev.every((page, i) => {
    const next = newPages[i];

    if (!next) return false;

    if (page.sections.length !== next.sections.length) {
      return false;
    }

    return page.sections.every((section, j) => {
      const nextSection = next.sections[j];

      return (
        nextSection &&
        section.name === nextSection.name &&
        section.height === nextSection.height &&
      section.items.length === nextSection.items.length &&
      section.items.every(
        (item, k) =>
          item.dataId ===
          nextSection.items[k]?.dataId
      )
      );
    });
  });

if (isPaginating.current) {
  return prev;
}

if (same) {
  return prev;
}

return newPages;
  });
  
};

  //* Abhi sirf placeholder*//



const observer = new ResizeObserver(() => {
    cancelAnimationFrame(frame);

    frame = requestAnimationFrame(() => {
      updateHeight();
    });
  });
    requestAnimationFrame(() => {
    updateHeight();
  });

  if (pageRef.current) {
    observer.observe(pageRef.current);
  }
  if (pageRef.current) {
    observer.observe(pageRef.current);
}


  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
  };
  },[JSON.stringify(data)]);

  
  return (
  <>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems:"center",
        marginBottom:"20px",
      }}
    >
    <button
      onClick={onBack}
      style={{
        background: "#374151",
        color: "#fff",
        padding: "12px 22px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: 500,

        width: "fit-content",
        height: "fit-content",

        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",

        flexShrink: 0,
      }}
    >
      ← Back to Edit
    </button>

      <ExportButton
        onPDF={onPDF}
        onJPG={onJPG}
        onPrint={onPrint}
      />
    </div>

      <div
      ref={pageRef}
      style={{
        position: "fixed",
        left: "-100000px",
        top: 0,
        visibility: "hidden",
        pointerEvents: "none",
        width: "210mm",
      }}
    >
      {renderMeasureTemplate()}
    </div>
    
    

    <div
      style={{
        width: "100%",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
    <PageRenderer
      pages={pages}
      renderSection={renderSection}
  />
</div>
</>
);
}