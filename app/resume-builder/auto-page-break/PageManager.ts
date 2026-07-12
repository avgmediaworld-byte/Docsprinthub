import {
  DocumentPage,
  PageItem,
  PageSection,
} from "./types";

import {
  PRINTABLE_HEIGHT,
} from "./constants";

export default class PageManager {

  private static readonly FOOTER_SPACE = 80;

  private static readonly TOLERANCE = 10;

  private pages: DocumentPage[] = [];

  constructor() {
    this.reset();
  }

  /**
   * Reset pagination.
   */
  private reset() {

    this.pages = [];

    this.createPage();

  }

  /**
   * Create new page.
   */
  private createPage(): DocumentPage {

    const page: DocumentPage = {

      id: this.pages.length + 1,

      usedHeight: 0,

      remainingHeight:
        PRINTABLE_HEIGHT -
        PageManager.FOOTER_SPACE,

      sections: [],

    };

    this.pages.push(page);

    return page;

  }

  /**
   * Current page.
   */
  private currentPage(): DocumentPage {

    return this.pages[
      this.pages.length - 1
    ];

  }
/**
 * Remaining printable height.
 */
private remainingHeight(): number {

  return this.currentPage().remainingHeight;

}

/**
 * Check whether an item can fit.
 */
private canFit(
  height: number
): boolean {

  return (
    this.remainingHeight() >=
    height - PageManager.TOLERANCE
  );

}

/**
 * Update page height.
 */
private updateHeight(
  page: DocumentPage,
  height: number
) {

  page.usedHeight += height;

  page.remainingHeight =
    PRINTABLE_HEIGHT -
    PageManager.FOOTER_SPACE -
    page.usedHeight;

}

/**
 * Clone section.
 */
private cloneSection(
  section: PageSection
): PageSection {

  return {
    ...section,

    id: crypto.randomUUID(),

    items: [],

    contentHeight: 0,

    isContinuation: false,

    headingHeight: section.headingHeight,

    height: section.headingHeight,
  };

}

/**
 * Create continuation page for a split section.
 */
private startContinuation(
  section: PageSection
): PageSection {

  this.createPage();

  const next =
    this.cloneSection(section);

  next.isContinuation = true;

  next.headingHeight = 0;

  next.height = 0;

  next.contentHeight = 0;

  return next;

  
}
  /**
   * Push completed section.
   */
  private pushSection(
    page: DocumentPage,
    section: PageSection
  ) {
    
    console.log("PUSH SECTION", {
      page: page.id,
      section: section.name,
      items: section.items.length,
      height: section.height,
      usedBefore: page.usedHeight,
      remainingBefore: page.remainingHeight,
    });

    page.sections.push(section);

    this.updateHeight(
      page,
      section.height
    );
  console.log("UPDATED PAGE", {
  page: page.id,
  used: page.usedHeight,
  remaining: page.remainingHeight,
});
    
    
  }

      /**
   * Add one complete item into current section.
   */
    private addItem(
    workingSection: PageSection,
    item: PageItem
  ) {

    workingSection.items.push(item);

    workingSection.contentHeight += item.height;

    workingSection.height =
      workingSection.headingHeight +
      workingSection.contentHeight;

      console.log({
      section: workingSection.name,
      items: workingSection.items.length,
      heading: workingSection.headingHeight,
      content: workingSection.contentHeight,
      total: workingSection.height,
    });

  }

  /**
   * Paginate one section item-by-item.
   */
  private paginateSection(
    section: PageSection
  ) {

    if (!section.splittable) {

  if (!this.canFit(section.height)) {
    this.createPage();
  }

  this.pushSection(
    this.currentPage(),
    section
    
  );

  return;

}
  
    // Empty section
    if (section.items.length === 0) {

 
      if (!this.canFit(section.height)) {
        this.createPage();
      }

      this.pushSection(
        this.currentPage(),
        section
      );

      return;

    }

    // Working section
    let workingSection =
      this.cloneSection(section);

    // First page
    workingSection.isContinuation = false;

    for (const item of section.items) {

    const projectedHeight =
      workingSection.height +
      item.height;

    const remaining =
      this.remainingHeight();

    const SAFE_BOTTOM_SPACE = 12;

    const canFit =
      projectedHeight <=
      (remaining - SAFE_BOTTOM_SPACE);

        console.log({
          page: this.currentPage().id,
          section: section.name,
          item: item.dataId,
          itemHeight: item.height,
          sectionItems: workingSection.items.length,
          currentSectionHeight: workingSection.height,
          projectedHeight,
          remaining,
          usedHeight: this.currentPage().usedHeight,
          canFit,
        });

        if (canFit) {

          this.addItem(
            workingSection,
            item
          );

          continue;

        }

      // Push current page section
      if (
        workingSection.items.length > 0
      ) {

        this.pushSection(
          this.currentPage(),
          workingSection
        );

      }

      // Create continuation section on next page
      workingSection =
        this.startContinuation(
          section
        );
      workingSection.height = 0;
      workingSection.contentHeight = 0;
      workingSection.items = [];
      // Add current item to continuation
      this.addItem(
        workingSection,
        item
      );

    // Remaining items
        }

    // Push last remaining part of the section
    if (
      workingSection.items.length > 0 &&
      workingSection.contentHeight > 0
    ) {

      this.pushSection(
        this.currentPage(),
        workingSection
      );

    }

  }

  /**
   * Paginate all measured sections.
   */
  paginate(
    sections: PageSection[]
  ): DocumentPage[] {

    this.reset();

    for (const section of sections) {

      this.paginateSection(
        section
      );

    }

    return this.pages;

  }

  /**
   * ------------------------------------------------------------------
   * Compatibility API
   * ------------------------------------------------------------------
   */

  addSection(
    section: PageSection
  ) {

    this.paginateSection(
      section
    );

  }

  /**
   * Current generated pages.
   */
  getPages(): DocumentPage[] {

    return this.pages;

  }

  /**
   * Clear pages.
   */
  clear() {

    this.reset();

  }

}