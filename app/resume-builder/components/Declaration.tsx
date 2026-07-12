"use client";

import { ResumeData } from "../types/resume";

type Props = {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
};

const declarations = {
  standard:
    "I hereby declare that the information furnished above is true and correct to the best of my knowledge and belief.",

  professional:
    "I hereby declare that all the information mentioned above is true and complete. I shall be responsible for any discrepancy found in the future.",

  government:
    "I hereby declare that all the particulars furnished above are true, complete and correct to the best of my knowledge and belief. I understand that any false statement may lead to rejection of my candidature.",
};

export default function Declaration({
  data,
  setData,
}: Props) {
  const declaration = data.declaration;

  const handleTypeChange = (
    type:
      | "standard"
      | "professional"
      | "government"
      | "custom"
  ) => {
    setData({
      ...data,
      declaration: {
        ...declaration,
        type,

        text:
          type === "custom"
            ? ""
            : declarations[type],
      },
    });
  };

  const handleChange = (
    field: keyof typeof declaration,
    value: string
  ) => {
    setData({
      ...data,
      declaration: {
        ...declaration,
        [field]: value,
      },
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-0 p-5 mt-6">

      <h2 className="text-xl font-bold mb-4">
        📝 Declaration
      </h2>

      <div className="mt-4">

        <label className="block mb-2 text-sm font-semibold">
          Declaration Type
        </label>

        <select
          value={declaration.type}
          onChange={(e) =>
            handleTypeChange(
              e.target.value as
                | "standard"
                | "professional"
                | "government"
                | "custom"
            )
          }
          className="w-full h-10 rounded-xl border-1 border-black-200 bg-white px-4 outline-none focus:border-blue-600"
        >
      <option value="standard">Standard (Recommended)</option>
      <option value="professional">Professional</option>
      <option value="government">Government Job</option>
      <option value="custom">Write My Own</option>
        </select>

      </div>
        <div className="mt-6">

        <label className="block text-sm font-semibold mb-2">
          Declaration Text
        </label>

      <textarea
        rows={2}
        value={declaration.text}
        onChange={(e) => handleChange("text", e.target.value)}
        readOnly={declaration.type !== "custom"}
        className={`w-full rounded-xl border-1 p-4 outline-none transition resize-none ${
          declaration.type === "custom"
            ? "border-gray-700 focus:border-blue-600"
            : "border-gray-300 bg-gray-100"
        }`}
      />

      </div>

      <div className="grid grid-cols-2 gap-5 mt-6">

        {/* Place */}
        <div className="flex-1">

          <label className="block mb-2 text-sm font-semibold">
            Place
          </label>

          <input
            type="text"
            value={declaration.place}
            onChange={(e) => handleChange("place", e.target.value)}
            placeholder="Enter Place"
            className="w-full h-10 rounded-xl border-1 border-black-200 px-2 outline-none focus:border-blue-600"
          />

        </div>

        {/* Date */}
        <div className="flex-1">

          <label className="block mb-2 text-sm font-semibold">
            Date
          </label>

          <input
            type="date"
            value={declaration.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="w-full h-10 rounded-xl border-1 border-black-200 px-2 outline-none focus:border-blue-600"
          />

      </div>

    </div>

      <div className="mt-8 flex justify-end">

          <div className="text-center">

            <p className="font-semibold">
              {data.personal.fullName || "Your Name"}
            </p>

            <div className="mt-3 border-t border-black w-36"></div>

            <p className="mt-1 text-sm">
              Signature
            </p>

          </div>

        </div>

      </div>
           
    );
}