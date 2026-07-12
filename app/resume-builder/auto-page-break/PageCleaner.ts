import {
    DocumentPage,
} from "./types";

export default class PageCleaner {

    clean(
        pages: DocumentPage[]
    ): DocumentPage[] {

        return pages.filter(
            (page) =>
                page.sections.length > 0
        );

    }

}