"use client";

import React from "react";
import "./template-card.css";
import { Check } from "lucide-react";

type Props = {
  template: {
    id: string;
    title: string;
    subtitle: string;
    badge: string;
    features: string[];
    icon: React.ElementType;
    theme: "red" | "blue" | "green" | "purple";
  };

  selected: boolean;
  onClick: () => void;
};

export default function TemplateCard({
  template,
  selected,
  onClick,
}: Props) {

  const Icon = template.icon;

  return (

      <div
    onClick={onClick}
        className={`template-card ${template.theme}
        relative
        max-w-[430px]
        min-h-[190px]
        rounded-2xl
        border
        bg-white
        overflow-hidden
        cursor-pointer
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl hover:scale-[1.02]
        ${
          selected
            ? "border-blue-500 blue-900 shadow-xl"
            : "border-gray-200 shadow-md hover:border-blue-500"
        }
      `}
    >
      <div className="flex items-start gap-5 p-6">

        {/* Icon */}

        <div className="icon-box">
          <Icon size={70} strokeWidth={2} />
        </div>

        {/* Content */}

        <div className="flex-1">

          {/* Badge */}

          <span
          className="badge"
          >
            {template.badge}
          </span>

          {/* Title */}

          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            {template.title}
          </h3>

          {/* Subtitle */}

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {template.subtitle}
          </p>
                    {/* Features */}

          <div className="mt-5 flex flex-wrap gap-2">

            {template.features.map((item) => (

              <span
                key={item}
                className="chip"
              >
                {item}
              </span>

            ))}

          </div>

        </div>

      </div>

      {/* Bottom Selected */}

      

    </div>

  );

}

