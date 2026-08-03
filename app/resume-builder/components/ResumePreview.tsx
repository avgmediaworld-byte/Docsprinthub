"use client";

import { useEffect, useRef, useState } from "react";

import type {
  DocumentPage,
  PageSection,
} from "../auto-page-break/types";
import PageRenderer from "../auto-page-break/PageRenderer";
import PaginationEngine from "../auto-page-break/PaginationEngine";
import Biodata from "../templates/Biodata";
import Classic from "../templates/Classic";
import Fresher from "../templates/Fresher";
import Modern from "../templates/Modern";
import type { ResumeData } from "../types/resume";
import ExportButton from "./ExportButton";

type Props = {
  data: ResumeData;
  onPDF: () => void;
  onJPG: () => void;
  onPrint: () => void;
  onBack: () => void;
};

function haveSamePagination(
  previous: DocumentPage[],
  next: DocumentPage[],
) {
  return (
    previous.length === next.length &&
    previous.every((page, pageIndex) => {
      const nextPage = next[pageIndex];

      return (
        nextPage !== undefined &&
        page.sections.length === nextPage.sections.length &&
        page.sections.every((section, sectionIndex) => {
          const nextSection = nextPage.sections[sectionIndex];

          return (
            nextSection !== undefined &&
            section.name === nextSection.name &&
            section.isContinuation === nextSection.isContinuation &&
            section.items.length === nextSection.items.length &&
            section.items.every(
              (item, itemIndex) =>
                item.dataId === nextSection.items[itemIndex]?.dataId,
            )
          );
        })
      );
    })
  );
}

export default function ResumePreview({
  data,
  onPDF,
  onJPG,
  onPrint,
  onBack,
}: Props) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [paginationEngine] = useState(() => new PaginationEngine());
  const isPaginating = useRef(false);
  const [documentPages, setDocumentPages] = useState<DocumentPage[]>([]);

  const renderMeasureTemplate = () => {
    switch (data.template) {
      case "fresher":
        return <Fresher data={data} />;
      case "modern":
        return <Modern data={data} />;
      case "biodata":
        return <Biodata data={data} />;
      case "classic":
      default:
        return <Classic data={data} />;
    }
  };

  const renderSection = (section: PageSection, pageNumber: number) => (
    <Classic
      data={data}
      pageNumber={pageNumber}
      section={section.name}
      pageSection={section}
    />
  );

  const serializedData = JSON.stringify(data);

  useEffect(() => {
    const measureElement = measureRef.current;

    if (!measureElement) {
      return;
    }

    let frame = 0;

    const updatePagination = () => {
      if (!measureRef.current || isPaginating.current) {
        return;
      }

      isPaginating.current = true;

      try {
        const pages = paginationEngine.paginate(measureRef.current);

        setDocumentPages((previous) =>
          haveSamePagination(previous, pages) ? previous : pages,
        );
      } finally {
        isPaginating.current = false;
      }
    };

    const schedulePagination = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updatePagination);
    };

    const observer = new ResizeObserver(schedulePagination);
    observer.observe(measureElement);
    schedulePagination();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [paginationEngine, serializedData]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <button
          type="button"
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
          }}
        >
          ← Back to Edit
        </button>

        <ExportButton onPDF={onPDF} onJPG={onJPG} onPrint={onPrint} />
      </div>

      <div
        ref={measureRef}
        aria-hidden="true"
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
        <PageRenderer pages={documentPages} renderSection={renderSection} />
      </div>
    </>
  );
}
