import {
  DocumentPage,
  PageSection,
} from "./types";

import {
  PRINTABLE_HEIGHT,
} from "./constants";

export default class OverflowMover {

  move(
    pages: DocumentPage[]
  ): DocumentPage[] {

    if (!pages.length) {
      return [];
    }

    const result: DocumentPage[] = [];

    let current: DocumentPage = {
      id: 1,
      usedHeight: 0,
      remainingHeight: PRINTABLE_HEIGHT,
      sections: [],
    };

    const createNewPage = (): DocumentPage => ({
      id: result.length + 2,
      usedHeight: 0,
      remainingHeight: PRINTABLE_HEIGHT,
      sections: [],
    });

    for (const page of pages) {

      for (const section of page.sections) {

        if (
          current.remainingHeight < section.height
        ) {

          result.push(current);

          current = createNewPage();

        }

        current.sections.push(section);

        current.usedHeight += section.height;

        current.remainingHeight =
          PRINTABLE_HEIGHT -
          current.usedHeight;

      }

    }

    if (current.sections.length > 0) {
      result.push(current);
    }

    return result;

  }

}