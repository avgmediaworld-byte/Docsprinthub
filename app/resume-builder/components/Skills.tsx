"use client";

import { useState } from "react";
import { ResumeData, SkillItem } from "../types/resume";

type Props = {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
};

export default function Skills({
  data,
  setData,
}: Props) {
  const [skill, setSkill] = useState("");

  const addSkill = () => {
    const value = skill.trim();

    if (!value) return;

    const alreadyExists = data.skills.some(
      (item) =>
        item.name.toLowerCase() === value.toLowerCase()
    );

    if (alreadyExists) {
      alert("Skill already added.");
      return;
    }

    const newSkill: SkillItem = {
      id: Date.now().toString(),
      name: value,
    };

    setData({
      ...data,
      skills: [...data.skills, newSkill],
    });

    setSkill("");
  };

  const removeSkill = (id: string) => {
    setData({
      ...data,
      skills: data.skills.filter(
        (item) => item.id !== id
      ),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-0 p-5 mt-6">

      <div className="mb-5">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        ⭐ Skills
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Add your technical and professional skills.
      </p>
    </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">

      {/* Input */}
      <div className="md:col-span-3">
        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
          placeholder="Enter a skill..."
          className="w-full h-10 rounded-lg border-1 border-black-700 px-5 text-base outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Button */}
      <div className="md:col-span-1">
        <button
          type="button"
          onClick={addSkill}
          className="w-auto h-10 rounded-lg border-2 border-blue-600 bg-blue-600 text-lg font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          + Add Skill
        </button>
        </div>

      </div>

      <div className="mt-4 flex flex-wrap gap-4">

        {data.skills.map((item) => (
          <div
            key={item.id}
            className="flex min-w-[100px] items-center justify-between gap-2 rounded-xl border-1 border-Black-200 bg-white px-4 py-2 shadow-sm transition hover:border-blue-600"
          >
            <span className="whitespace-nowrap text-sm font-medium text-gray-800">
              {item.name}
            </span>

            <button
              type="button"
              onClick={() => removeSkill(item.id)}
              className="ml-1 flex h-2 w-5 items-center justify-center rounded-full text-gray-500 transition hover:bg-red-100 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        ))}

      </div>

      {data.skills.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">
          No skills added yet.
        </p>
      )}

      <p className="mt-4 text-xs text-gray-500">
        💡 Tip: Press <b>Enter</b> or click <b>Add Skill</b> to add a new skill.
      </p>

    </div>
  );
}
