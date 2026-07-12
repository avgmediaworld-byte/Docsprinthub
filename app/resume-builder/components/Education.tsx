"use client";

import { ResumeData, EducationItem } from "../types/resume";

type Props = {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
};

export default function Education({
  data,
  setData,
}: Props) {
  const education = data.education;

  const handleChange = (
    id: string,
    field: keyof EducationItem,
    value: string
  ) => {
    setData({
      ...data,
      education: education.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    });
  };

  const addEducation = () => {
    setData({
      ...data,
      education: [
        ...education,
        {
          id: Date.now().toString(),
          course: "",
          institute: "",
          board: "",
          year: "",
          division: "",
          percentage: "",
          status: "Completed",
        },
      ],
    });
  };

  const removeEducation = (id: string) => {
    if (education.length <= 3) return;

    setData({
      ...data,
      education: education.filter((item) => item.id !== id),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mt-6">

      <div className="flex items-center justify-between mb-4">

        <h2 className="text-xl font-bold">
          🎓 Education
        </h2>

      </div>

      <div className="overflow-x-auto rounded-lg border">

        <table className="w-full min-w-[1100px] table-fixed border-collapse">
        
        <thead className="bg-gray-100">

          <tr>

            <th className="w-[16%] border p-2 text-center text-sm">
              Course Name
            </th>

            <th className="w-[17%] border p-2 text-center text-sm">
              Institution
            </th>

            <th className="w-[17%] border p-2 text-center text-sm">
              Board / University
            </th>

          <th
            style={{ width: "90px" }}
            className="border p-2 text-center text-sm"
          >
            Year
          </th>

            <th className="w-[14%] border p-2 text-center text-sm">
              Division
            </th>

              <th
                style={{ width: "90px" }}
                className="border p-2 text-center text-sm"
              >
                % / CGPA
              </th>

            <th className="w-[12%] border p-2 text-center text-sm">
              Status
            </th>

            <th className="w-[8%] border p-2 text-center text-sm">
              Action
            </th>

          </tr>

        </thead>

          <tbody>

            {education.map((item, index) => (

              <tr key={item.id}>

                <td className="border p-2">

                  <input
                    type="text"
                    value={item.course}
                    onChange={(e) =>
                      handleChange(
                        item.id,
                        "course",
                        e.target.value
                      )
                    }
                    placeholder="Course"
                    className="w-full border rounded-md px-2 py-2 text-sm"
                  />

                </td>

                <td className="border p-2">

                  <input
                    type="text"
                    value={item.institute}
                    onChange={(e) =>
                      handleChange(
                        item.id,
                        "institute",
                        e.target.value
                      )
                    }
                    placeholder="Institution"
                    className="w-full border rounded-md px-2 py-2 text-sm"
                  />

                </td>

                <td className="border p-2">

                  <input
                    type="text"
                    value={item.board}
                    onChange={(e) =>
                      handleChange(
                        item.id,
                        "board",
                        e.target.value
                      )
                    }
                    placeholder="Board"
                    className="w-full border rounded-md px-2 py-2 text-sm"
                  />

                </td>

                <td className="border p-2">

                  <input
                    type="text"
                    value={item.year}
                    onChange={(e) =>
                      handleChange(
                        item.id,
                        "year",
                        e.target.value
                      )
                    }
                    placeholder="2026"
                    className="w-full rounded-md border px-1 py-2 text-center text-sm"
                  />

                </td>

                <td className="border p-2">

                  <input
                    type="text"
                    value={item.division}
                    onChange={(e) =>
                      handleChange(
                        item.id,
                        "division",
                        e.target.value
                      )
                    }
                    placeholder="First Division"
                    className="w-full border rounded-md px-2 py-2 text-sm"
                  />

                </td>

                <td className="border p-2">

                  <input
                    type="text"
                    value={item.percentage}
                    onChange={(e) =>
                      handleChange(
                        item.id,
                        "percentage",
                        e.target.value
                      )
                    }
                    placeholder="85%"
                    className="w-full rounded-md border px-1 py-2 text-center text-sm"
                  />

                </td>

                <td className="border p-2">

                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleChange(
                        item.id,
                        "status",
                        e.target.value as
                          | "Completed"
                          | "Pursuing"
                      )
                    }
                    className="w-full border rounded-md px-2 py-2 text-sm"
                  >

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Pursuing">
                      Pursuing
                    </option>

                  </select>

                </td>

                <td className="border p-2 text-center">

                  {index >= 3 && (

                    <button
                      type="button"
                      onClick={() =>
                        removeEducation(item.id)
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑
                    </button>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

       
        <tfoot>

        <tr>

        <td colSpan={8} className="border-t p-2 text-center">
              
        <button
          type="button"
          onClick={addEducation}
          className="rounded-xl border  px-1 py-1 text-sm font-medium shadow-sm text-blue-600 hover:bg-blue-50 hover:shadow-md transition-all"
        >
          + Add Qualification
        </button>
         </td>
        </tr>
      
      </tfoot>
      </table>

    </div>
      <p className="mt-3 text-xs text-gray-500">
        💡 Tip: Fill only the information you want to show in your resume. Empty
        fields will be ignored automatically in the PDF.
      </p>

    </div>
  );
}