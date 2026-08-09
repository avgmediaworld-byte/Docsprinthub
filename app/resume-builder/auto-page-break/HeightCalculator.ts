import {
  PageItem,
  PageSection,
} from "./types";

export default class HeightCalculator {

  /**
 * Measure actual element height including vertical margins.
 */
static measure(
  element: HTMLElement
): number {

  const styles =
    window.getComputedStyle(element);

  const marginTop =
    parseFloat(styles.marginTop || "0");

  const marginBottom =
    parseFloat(styles.marginBottom || "0");

  const rect =
    element.getBoundingClientRect();

return Math.ceil(
  rect.height +
  marginTop +
  marginBottom
);

}

/**
 * Returns section name.
 */
private static getSectionName(
  element: HTMLElement
): string {

  return (
    element.dataset.section ??
    element.closest("[data-section]")
      ?.getAttribute("data-section") ??
    "section"
  );

}

 /**
 * Create measurable page item.
 */
static createItem(
  element: HTMLElement
): PageItem {

  return {

    id:
      crypto.randomUUID(),

    section:
      HeightCalculator.getSectionName(
        element
      ),

    type:
      element.dataset.type ??
      "item",

    dataId:
      element.dataset.id,

    height:
      HeightCalculator.measure(
        element
      ),

    splittable:
      element.dataset.splittable ===
      "true",

    element,

  };

}

/**
 * Extract all measurable items from a section.
 */
private static extractItems(
  section: HTMLElement
): PageItem[] {

  const items: PageItem[] = [];

  const elements = Array.from(
    section.querySelectorAll("[data-page-item]")
  ).filter(
    (node): node is HTMLElement =>
      node instanceof HTMLElement
  );

  for (const element of elements) {

    const item =
      HeightCalculator.createItem(element);

    items.push(item);

  }

  return items;

}
/**
 * Convert one DOM section into PageSection.
 */
static createSection(
  element: HTMLElement
): PageSection {

  const items =
    HeightCalculator.extractItems(
      element
    );

  const heading =
    element.querySelector(
      "[data-heading]"
    ) as HTMLElement | null;

  const headingHeight =
    heading
      ? HeightCalculator.measure(
          heading
        )
      : 0;

  const sectionName =
    element.dataset.section ??
    "section";

  const itemHeight = items.reduce(
    (total, item) => total + item.height,
    0,
  );

  const measuredContentHeight = Math.max(
    0,
    HeightCalculator.measure(element) - headingHeight,
  );

  /**
   * Items alone do not include wrapper layout, such as the Education table
   * header, table/grid spacing, or the declaration signature spacing.  Keep
   * that space in the pagination calculation as well.  If items share a
   * horizontal row, their summed heights can be larger than the section's
   * physical height; retaining that larger value is deliberate safety space.
   */
  const splittable = element.dataset.splittable === "true";
  const fixedContentHeight = splittable
    ? Math.max(0, measuredContentHeight - itemHeight)
    : 0;

  // An unsplittable section (such as the declaration) is rendered as one
  // block. Its nested items can share rows, so adding their individual
  // heights exaggerates the true section height and creates an empty page.
  const contentHeight = splittable
    ? itemHeight + fixedContentHeight
    : measuredContentHeight;

  return {

    id:
      crypto.randomUUID(),

    name:
      sectionName,

    headingHeight,

    contentHeight,

    fixedContentHeight,

    height:
      headingHeight +
      contentHeight,

    splittable,

    items,

    element,

  };



}

/**
 * Measure all printable sections.
 */
static measureAll(
  container: HTMLElement
): PageSection[] {

  // Force browser layout update
  container.getBoundingClientRect();

  const sections: PageSection[] = [];

  const elements = Array.from(
    container.querySelectorAll(
      "[data-section]"
    )
  ).filter(
    (node): node is HTMLElement =>
      node instanceof HTMLElement
  );

  for (const element of elements) {

    // Ensure latest layout is measured
    element.getBoundingClientRect();

    sections.push(
      HeightCalculator.createSection(
        element
      )
    );

  }

  return sections;

}

}
