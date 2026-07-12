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