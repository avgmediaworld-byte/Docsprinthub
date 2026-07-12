"use client";

import React from "react";

import DocumentPage from "../components/DocumentPage";

import {
  DocumentPage as DocumentPageType,
  PageSection,
} from "./types";


type Props = {
    pages: DocumentPageType[];

    renderSection: (
        section: PageSection,
        pageNumber: number
    ) => React.ReactNode;
};

export default function PageRenderer({
    pages,
    renderSection,
}: Props) {

return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "24px",
                width: "100%",
            }}
        >
            {pages.map((page, index) => (

                <DocumentPage
                key={page.id}
                pageNumber={index + 1}
                totalPages={pages.length}
                >

                        {page.sections.map((section) => (
                            <React.Fragment
                                key={section.id}
                            >
                                {renderSection(section, index + 1)}
                            </React.Fragment>
                        ))}

                    </DocumentPage>
                
            ))}
        </div>
    );

}