export interface CuratedTemplateDesign {
  backgroundId: string;
  decorationIds: string[];
  headingFont: string;
  layoutId: string;
  primaryColor: string;
  accentColor: string;
}

// Each recipe uses only the existing background, layout and decoration sources.
// A recipe's signature is kept unique so gallery designs do not repeat.
export const CURATED_TEMPLATE_DESIGNS = {
  "academic-frame": { backgroundId: "gradient-blue", layoutId: "academic01", decorationIds: ["wave-top"], primaryColor: "#174EA6", accentColor: "#38BDF8", headingFont: "Georgia, serif" },
  "commerce-gold": { backgroundId: "royal-purple", layoutId: "corporate01", decorationIds: ["corner-ribbon"], primaryColor: "#F8FAFC", accentColor: "#FBBF24", headingFont: "Georgia, serif" },
  "computer-science": { backgroundId: "navy-luxury", layoutId: "corporate02", decorationIds: ["hexagon", "corner-ribbon"], primaryColor: "#E0F2FE", accentColor: "#22D3EE", headingFont: "Inter, sans-serif" },
  "education-theme": { backgroundId: "green-nature", layoutId: "creative01", decorationIds: ["wave-top", "circle-pattern"], primaryColor: "#064E3B", accentColor: "#FACC15", headingFont: "Trebuchet MS, sans-serif" },
  "elegant-border": { backgroundId: "minimal-white", layoutId: "academic02", decorationIds: ["corner-ribbon"], primaryColor: "#334155", accentColor: "#C4B5FD", headingFont: "Georgia, serif" },
  "engineering-blue": { backgroundId: "gradient-blue", layoutId: "corporate02", decorationIds: ["hexagon", "wave-bottom"], primaryColor: "#0B2D5C", accentColor: "#FACC15", headingFont: "Arial, sans-serif" },
  "law-professional": { backgroundId: "minimal-white", layoutId: "corporate01", decorationIds: ["corner-ribbon", "wave-top"], primaryColor: "#3F1D2E", accentColor: "#9B7A35", headingFont: "Times New Roman, serif" },
  "medical-white": { backgroundId: "minimal-white", layoutId: "academic02", decorationIds: ["circle-pattern"], primaryColor: "#0F766E", accentColor: "#2DD4BF", headingFont: "Inter, sans-serif" },
  "minimal-academic": { backgroundId: "minimal-white", layoutId: "academic01", decorationIds: ["circle-pattern", "wave-bottom"], primaryColor: "#111827", accentColor: "#64748B", headingFont: "Helvetica Neue, sans-serif" },
  "modern-university": { backgroundId: "gradient-blue", layoutId: "academic02", decorationIds: ["wave-top", "wave-bottom"], primaryColor: "#0F3B78", accentColor: "#60A5FA", headingFont: "Trebuchet MS, sans-serif" },
  "premium-academic": { backgroundId: "navy-luxury", layoutId: "corporate01", decorationIds: ["corner-ribbon", "wave-bottom"], primaryColor: "#FEF3C7", accentColor: "#D4AF37", headingFont: "Georgia, serif" },
  "research-paper": { backgroundId: "minimal-white", layoutId: "academic01", decorationIds: ["wave-top", "circle-pattern"], primaryColor: "#1E3A8A", accentColor: "#60A5FA", headingFont: "Cambria, serif" },
  "science-project": { backgroundId: "green-nature", layoutId: "creative01", decorationIds: ["circle-pattern", "hexagon"], primaryColor: "#14532D", accentColor: "#84CC16", headingFont: "Trebuchet MS, sans-serif" },
  "thesis-modern": { backgroundId: "gradient-blue", layoutId: "corporate02", decorationIds: ["corner-ribbon", "wave-bottom"], primaryColor: "#3730A3", accentColor: "#A78BFA", headingFont: "Times New Roman, serif" },
  "university-classic": { backgroundId: "minimal-white", layoutId: "academic02", decorationIds: ["wave-top", "corner-ribbon"], primaryColor: "#1E3A5F", accentColor: "#D97706", headingFont: "Times New Roman, serif" },
  "corporate-blue": { backgroundId: "navy-luxury", layoutId: "corporate01", decorationIds: ["wave-top", "hexagon"], primaryColor: "#FFFFFF", accentColor: "#38BDF8", headingFont: "Inter, sans-serif" },
  "school-project": { backgroundId: "green-nature", layoutId: "academic01", decorationIds: ["circle-pattern", "wave-bottom"], primaryColor: "#7C2D12", accentColor: "#F97316", headingFont: "Comic Sans MS, cursive" },
  "ai-future": { backgroundId: "navy-luxury", layoutId: "corporate02", decorationIds: ["hexagon", "corner-ribbon"], primaryColor: "#CFFAFE", accentColor: "#22D3EE", headingFont: "Arial, sans-serif" },
  "portfolio-pro": { backgroundId: "royal-purple", layoutId: "creative01", decorationIds: ["wave-top", "corner-ribbon"], primaryColor: "#FDF2F8", accentColor: "#FB7185", headingFont: "cursive" },
  "minimal-white": { backgroundId: "minimal-white", layoutId: "academic01", decorationIds: ["circle-pattern"], primaryColor: "#0F172A", accentColor: "#CBD5E1", headingFont: "Helvetica Neue, sans-serif" },
  "premium-gold": { backgroundId: "navy-luxury", layoutId: "corporate01", decorationIds: ["corner-ribbon", "wave-bottom"], primaryColor: "#FEF3C7", accentColor: "#EAB308", headingFont: "Georgia, serif" },
} satisfies Record<string, CuratedTemplateDesign>;

export const CURATED_TEMPLATE_DESIGN_COUNT = Object.keys(CURATED_TEMPLATE_DESIGNS).length;

export function getCuratedTemplateDesign(templateId: string): CuratedTemplateDesign | undefined {
  return CURATED_TEMPLATE_DESIGNS[templateId as keyof typeof CURATED_TEMPLATE_DESIGNS];
}

function createDesignSignature(design: CuratedTemplateDesign) {
  return [
    design.backgroundId,
    design.layoutId,
    [...design.decorationIds].sort().join(","),
    design.primaryColor,
    design.accentColor,
    design.headingFont,
  ].join("|");
}

const designSignatures = Object.values(CURATED_TEMPLATE_DESIGNS).map(createDesignSignature);

if (new Set(designSignatures).size !== designSignatures.length) {
  throw new Error("Every curated cover template must have a unique design signature.");
}
