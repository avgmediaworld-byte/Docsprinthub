"use client";

import type { CSSProperties } from "react";

type LayerTone = "primary" | "accent";

interface ArtLayer {
  style: CSSProperties;
  tone: LayerTone;
  type?: "fill" | "outline";
}

const ART_PRESETS: Record<string, ArtLayer[]> = {
  "academic-frame": [
    { tone: "primary", style: { left: "7%", top: "10%", width: "2%", height: "78%", opacity: 0.24 } },
    { tone: "accent", type: "outline", style: { right: "-13%", top: "19%", width: "42%", height: "23%", borderRadius: "999px", opacity: 0.52 } },
  ],
  "commerce-gold": [
    { tone: "accent", style: { left: "-6%", top: "13%", width: "65%", height: "12%", clipPath: "polygon(0 0, 100% 0, 84% 100%, 0 100%)", opacity: 0.2 } },
    { tone: "primary", type: "outline", style: { right: "10%", bottom: "12%", width: "24%", height: "24%", transform: "rotate(45deg)", opacity: 0.34 } },
  ],
  "computer-science": [
    { tone: "accent", style: { right: "7%", top: "11%", width: "30%", height: "8%", clipPath: "polygon(0 45%, 76% 45%, 76% 0, 100% 50%, 76% 100%, 76% 55%, 0 55%)", opacity: 0.75 } },
    { tone: "primary", type: "outline", style: { left: "9%", bottom: "12%", width: "28%", height: "17%", borderRadius: "10%", opacity: 0.48 } },
  ],
  "education-theme": [
    { tone: "accent", style: { left: "0", bottom: "0", width: "26%", height: "34%", borderTopRightRadius: "100%", opacity: 0.22 } },
    { tone: "primary", type: "outline", style: { right: "10%", top: "16%", width: "21%", height: "21%", transform: "rotate(45deg)", opacity: 0.4 } },
  ],
  "elegant-border": [
    { tone: "primary", type: "outline", style: { left: "8%", top: "8%", width: "84%", height: "84%", borderRadius: "2%", opacity: 0.34 } },
    { tone: "accent", style: { left: "15%", top: "14%", width: "14%", height: "1.2%", opacity: 0.75 } },
  ],
  "engineering-blue": [
    { tone: "primary", style: { right: "-12%", bottom: "-4%", width: "87%", height: "19%", transform: "rotate(-10deg)", opacity: 0.17 } },
    { tone: "accent", style: { left: "0", top: "20%", width: "8%", height: "55%", clipPath: "polygon(0 0, 100% 8%, 100% 92%, 0 100%)", opacity: 0.44 } },
  ],
  "law-professional": [
    { tone: "primary", type: "outline", style: { left: "12%", top: "12%", width: "2%", height: "76%", opacity: 0.55 } },
    { tone: "accent", type: "outline", style: { right: "12%", top: "12%", width: "2%", height: "76%", opacity: 0.55 } },
  ],
  "medical-white": [
    { tone: "accent", style: { left: "12%", top: "17%", width: "17%", height: "17%", borderRadius: "999px", opacity: 0.22 } },
    { tone: "primary", style: { right: "14%", bottom: "17%", width: "7%", height: "24%", opacity: 0.25 } },
  ],
  "minimal-academic": [
    { tone: "primary", style: { left: "12%", top: "13%", width: "4%", height: "67%", opacity: 0.27 } },
    { tone: "accent", style: { left: "12%", top: "82%", width: "52%", height: "1.2%", opacity: 0.85 } },
  ],
  "modern-university": [
    { tone: "primary", type: "outline", style: { right: "-9%", top: "10%", width: "51%", height: "30%", borderRadius: "999px", opacity: 0.36 } },
    { tone: "accent", style: { left: "11%", bottom: "14%", width: "34%", height: "8%", borderRadius: "999px", opacity: 0.25 } },
  ],
  "premium-academic": [
    { tone: "accent", type: "outline", style: { left: "7%", top: "7%", width: "86%", height: "86%", borderRadius: "3%", opacity: 0.46 } },
    { tone: "primary", style: { left: "44%", top: "14%", width: "12%", height: "12%", transform: "rotate(45deg)", opacity: 0.26 } },
  ],
  "research-paper": [
    { tone: "primary", type: "outline", style: { left: "10%", top: "11%", width: "80%", height: "1px", opacity: 0.5 } },
    { tone: "accent", type: "outline", style: { left: "10%", top: "11%", width: "1px", height: "78%", opacity: 0.5 } },
  ],
  "science-project": [
    { tone: "primary", type: "outline", style: { left: "12%", top: "16%", width: "34%", height: "20%", borderRadius: "999px", opacity: 0.4 } },
    { tone: "accent", type: "outline", style: { right: "12%", bottom: "13%", width: "28%", height: "17%", borderRadius: "999px", opacity: 0.48 } },
  ],
  "thesis-modern": [
    { tone: "accent", style: { right: "-12%", top: "38%", width: "116%", height: "15%", transform: "rotate(-13deg)", opacity: 0.24 } },
    { tone: "primary", style: { left: "10%", bottom: "12%", width: "20%", height: "4%", opacity: 0.65 } },
  ],
  "university-classic": [
    { tone: "primary", type: "outline", style: { left: "35%", top: "15%", width: "30%", height: "18%", borderRadius: "999px", opacity: 0.48 } },
    { tone: "accent", type: "outline", style: { left: "40%", top: "19%", width: "20%", height: "10%", borderRadius: "999px", opacity: 0.66 } },
  ],
  "corporate-blue": [
    { tone: "primary", style: { right: "0", top: "0", width: "37%", height: "33%", clipPath: "polygon(28% 0, 100% 0, 100% 100%)", opacity: 0.22 } },
    { tone: "accent", style: { left: "11%", bottom: "13%", width: "58%", height: "2.5%", opacity: 0.72 } },
  ],
  "school-project": [
    { tone: "accent", style: { left: "13%", top: "14%", width: "15%", height: "15%", transform: "rotate(18deg)", borderRadius: "18%", opacity: 0.35 } },
    { tone: "primary", style: { right: "13%", bottom: "15%", width: "17%", height: "17%", transform: "rotate(-18deg)", borderRadius: "999px", opacity: 0.28 } },
  ],
  "ai-future": [
    { tone: "accent", type: "outline", style: { left: "9%", top: "15%", width: "28%", height: "18%", borderRadius: "9%", opacity: 0.65 } },
    { tone: "primary", style: { right: "9%", bottom: "13%", width: "34%", height: "2%", opacity: 0.7 } },
  ],
  "portfolio-pro": [
    { tone: "accent", style: { left: "0", top: "0", width: "35%", height: "27%", clipPath: "polygon(0 0, 100% 0, 0 100%)", opacity: 0.3 } },
    { tone: "primary", style: { right: "9%", bottom: "12%", width: "28%", height: "18%", borderRadius: "48% 8% 48% 8%", opacity: 0.24 } },
  ],
  "minimal-white": [
    { tone: "primary", type: "outline", style: { right: "10%", top: "10%", width: "15%", height: "80%", opacity: 0.3 } },
    { tone: "accent", style: { left: "10%", bottom: "10%", width: "15%", height: "2%", opacity: 0.7 } },
  ],
  "premium-gold": [
    { tone: "accent", type: "outline", style: { left: "13%", top: "18%", width: "74%", height: "14%", borderRadius: "999px", opacity: 0.7 } },
    { tone: "primary", type: "outline", style: { left: "13%", bottom: "18%", width: "74%", height: "14%", borderRadius: "999px", opacity: 0.42 } },
  ],
};

export default function TemplateSignatureArt({ templateId, primaryColor, accentColor }: { templateId: string; primaryColor: string; accentColor: string }) {
  const layers = ART_PRESETS[templateId] ?? [];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {layers.map((layer, index) => {
        const color = layer.tone === "accent" ? accentColor : primaryColor;
        const style: CSSProperties = {
          position: "absolute",
          ...layer.style,
          ...(layer.type === "outline" ? { border: "2px solid", borderColor: color } : { backgroundColor: color }),
        };

        return <div key={`${templateId}-${index}`} style={style} />;
      })}
    </div>
  );
}
