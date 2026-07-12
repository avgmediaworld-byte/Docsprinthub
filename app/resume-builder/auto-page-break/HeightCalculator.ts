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

  // Debug (temporary)
  console.log(
    "SECTION:",
    section.dataset.section,
    "ITEMS:",
    items.length,
    items.map((i) => ({
      type: i.type,
      dataId: i.dataId,
      height: i.height,
    }))
  );

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

  let contentHeight: number;

  // Item based sections
if (
  [
    "education",
    "experience",
    "skills",
    "certificates",
    "personal-details",
    "other-personal-details",
    "declaration",
  ].includes(sectionName)
) {

  contentHeight = items.reduce(
    (total, item) => total + item.height,
    0
  );

} else {

  contentHeight = Math.max(
    0,
    HeightCalculator.measure(element) -
      headingHeight
  );

}

  return {

    id:
      crypto.randomUUID(),

    name:
      sectionName,

    headingHeight,

    contentHeight,

    height:
      headingHeight +
      contentHeight,

    splittable:
      element.dataset.splittable ===
      "true",

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