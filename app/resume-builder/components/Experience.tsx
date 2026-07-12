"use client";

import { ResumeData, ExperienceItem } from "../types/resume";

type Props = {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
};

export default function Experience({
  data,
  setData,
}: Props) {
  const experiences = data.experience;

  const handleChange = (
    id: string,
    field: keyof ExperienceItem,
    value: string
  ) => {
    setData({
      ...data,
      experience: experiences.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    });
  };

  const addExperience = () => {
    setData({
      ...data,
      experience: [
        ...experiences,
        {
          id: Date.now().toString(),
          designation: "",
          company: "",
          duration: "",
          description: "",
        },
      ],
    });
  };

  const removeExperience = (id: string) => {
    setData({
      ...data,
      experience: experiences.filter(
        (item) => item.id !== id
      ),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mt-6">

      <div className="mb-4">

        <h2 className="text-xl font-bold">
          💼 Experience
        </h2>

      </div>

      <div className="overflow-x-auto rounded-lg border">

        <table className="w-full min-w-[950px] border-collapse">

          <thead className="bg-gray-100">

            <tr>

              <th className="border p-2 text-left text-sm">
                Job Title
              </th>

              <th className="border p-2 text-left text-sm">
                Company
              </th>

              <th className="border p-2 text-left text-sm">
                Duration
              </th>

              <th className="border p-2 text-left text-sm">
                Description
              </th>

              <th className="border p-2 text-center text-sm">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {experiences.map((item) => (

              <tr key={item.id}>

                <td className="border p-2">

                  <input
                    type="text"
                    value={item.designation}
                    onChange={(e) =>
                      handleChange(
                        item.id,
                        "designation",
                        e.target.value
                      )
                    }
                    placeholder="Software Developer"
                    className="w-full border rounded-md px-2 py-2 text-sm"
                  />

                </td>

                <td className="border p-2">

                  <input
                    type="text"
                    value={item.company}
                    onChange={(e) =>
                      handleChange(
                        item.id,
                        "company",
                        e.target.value
                      )
                    }
                    placeholder="Company Name"
                    className="w-full border rounded-md px-2 py-2 text-sm"
                  />

                </td> 

                <td className="border p-2">

                  <input
                    type="text"
                    value={item.duration}
                    onChange={(e) =>
                      handleChange(
                        item.id,
                        "duration",
                        e.target.value
                      )
                    }
                    placeholder="Jan 2024 - Present"
                    className="w-full border rounded-md px-2 py-2 text-sm"
                  />

                </td>

                <td className="border p-2">

                  <textarea
                    rows={1}
                    value={item.description}
                    onChange={(e) =>
                      handleChange(
                        item.id,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Write your work responsibilities..."
                    className="w-full border rounded-md px-2 py-2 text-sm resize-none"
                  />

                </td>

                <td className="border p-2 text-center">

                  <button
                    type="button"
                    onClick={() =>
                      removeExperience(item.id)
                    }
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

          <tfoot>

            <tr>

              <td
                colSpan={5}
                className="border-t p-2 text-center"
              >

                <button
                  type="button"
                  onClick={addExperience}
                  className="rounded-xl border  px-1 py-1 text-sm font-medium shadow-sm text-blue-600 hover:bg-blue-50 hover:shadow-md transition-all"
                >
                  + Add Experience
                </button>

              </td>

            </tr>

          </tfoot>

          </table>

      </div>

      <p className="mt-3 text-xs text-gray-500">
        💡 Add only relevant work experience. Empty fields won't appear in the final resume.
      </p>

    </div>
  );
}