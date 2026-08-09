import { TEMPLATE_REGISTRY } from "../data/templateList";
import type { TemplateRegistryItem } from "../data/templateList";
import type { TemplateCategory } from "../components/CategoryTabs";


export interface GalleryFilterOptions {

  search?: string;

  category?: TemplateCategory;

  featured?: boolean;

  premium?: boolean;

}


export class GalleryController {

public getAllTemplates(): TemplateRegistryItem[] {

  return TEMPLATE_REGISTRY;

}

public getTemplateById(

  id: string

): TemplateRegistryItem | undefined {

  return TEMPLATE_REGISTRY.find(

    (template) => template.id === id

  );

}

public getFeaturedTemplates() {

  return TEMPLATE_REGISTRY.filter(

    (template) => template.featured

  );

}

public getPremiumTemplates() {

  return TEMPLATE_REGISTRY.filter(

    (template) => template.premium

  );

}

public filterTemplates(
  options: GalleryFilterOptions
): TemplateRegistryItem[] {

  return TEMPLATE_REGISTRY.filter((template) => {

    if (
      options.category &&
      options.category !== "all" &&
      template.category !== options.category
    ) {
      return false;
    }

    if (options.featured !== undefined) {
      if (template.featured !== options.featured) {
        return false;
      }
    }

    if (options.premium !== undefined) {
      if (template.premium !== options.premium) {
        return false;
      }
    }

    const keyword = options.search?.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return (
      template.name.toLowerCase().includes(keyword) ||
      template.description.toLowerCase().includes(keyword) ||
      template.tags.some(tag =>
        tag.toLowerCase().includes(keyword)
      )
    );
  });

}
}

export const galleryController =
  new GalleryController();