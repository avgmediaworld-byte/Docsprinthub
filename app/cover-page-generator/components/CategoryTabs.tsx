"use client";

export type TemplateCategory =
  | "all"
  | "academic"
  | "corporate"
  | "school"
  | "technology"
  | "creative"
  | "minimal"
  | "premium";

interface CategoryTabsProps {
  selectedCategory: TemplateCategory;
  onCategoryChange: (category: TemplateCategory) => void;
}

const categories: {
  id: TemplateCategory;
  label: string;
}[] = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "academic",
    label: "Academic",
  },
  {
    id: "corporate",
    label: "Corporate",
  },
  {
    id: "school",
    label: "School",
  },
  {
    id: "technology",
    label: "Technology",
  },
  {
    id: "creative",
    label: "Creative",
  },
  {
    id: "minimal",
    label: "Minimal",
  },
  {
    id: "premium",
    label: "Premium",
  },
];

export default function CategoryTabs({
  selectedCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const active = selectedCategory === category.id;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.id)}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200 ${
              active
                ? "border-blue-600 bg-blue-600 text-white shadow"
                : "border-slate-300 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600"
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
