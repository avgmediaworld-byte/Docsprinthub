import PageManager from "./PageManager";

import HeightCalculator from "./HeightCalculator";

import {
  DocumentPage,
} from "./types";

export default class OverflowDetector {

  private manager =
    new PageManager();

  paginate(
    container: HTMLElement
  ): DocumentPage[] {

    if (!container) {
      return [];
    }

    const sections =
      HeightCalculator.measureAll(
        container
      );

    return this.manager.paginate(
      sections
    );

  }

}