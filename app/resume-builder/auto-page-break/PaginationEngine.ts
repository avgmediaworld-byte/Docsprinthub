import OverflowDetector from "./OverflowDetector";

import {
  DocumentPage,
} from "./types";

export default class PaginationEngine {

  private detector =
    new OverflowDetector();

  paginate(
    container: HTMLElement
  ): DocumentPage[] {

    if (!container) {
      return [];
    }

    return this.detector.paginate(
      container
    );

  }

}