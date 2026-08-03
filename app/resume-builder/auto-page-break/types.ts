export interface PageItem {
  id: string;

  section: string;

  type: string;

  dataId?: string;

  height: number;

  splittable: boolean;

  element?: HTMLElement;
}

export interface PageSection {
  id: string;

  name: string;

  headingHeight: number;

  contentHeight: number;

  /**
   * Vertical space that belongs to a section's layout rather than one
   * individual item (for example a table header, a wrapper margin, or a
   * grid gap).  It is kept with every rendered part of a split section so
   * that an item can never be placed below the page footer.
   */
  fixedContentHeight: number;

  height: number;

  splittable: boolean;

  items: PageItem[];

  element?: HTMLElement;

  isContinuation?: boolean;
}

export interface DocumentPage {
  id: number;

  usedHeight: number;

  remainingHeight: number;

  sections: PageSection[];
}

export interface PaginationResult {
  pages: DocumentPage[];
}

export interface PaginationOptions {
  pageHeight: number;

  pageWidth: number;

  pageMargin: number;
}

export interface RenderedItem {
  section: string;

  type: string;

  dataId?: string;

  pageId: number;
}

export interface OverflowResult {
  currentPage: DocumentPage;

  nextPage?: DocumentPage;

  overflow: boolean;
}
