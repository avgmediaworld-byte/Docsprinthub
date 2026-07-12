"use client";

import { ResumeData, CertificateItem } from "../types/resume";

type Props = {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
};

export default function Certificates({
  data,
  setData,
}: Props) {
  const certificates = data.certificates;

  const handleChange = (
    id: string,
    field: keyof CertificateItem,
    value: string
  ) => {
    setData({
      ...data,
      certificates: certificates.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    });
  };

  const addCertificate = () => {
    setData({
      ...data,
      certificates: [
        ...certificates,
        {
          id: Date.now().toString(),
          title: "",
          organization: "",
          year: "",
        },
      ],
    });
  };

  const removeCertificate = (id: string) => {
    setData({
      ...data,
      certificates: certificates.filter(
        (item) => item.id !== id
      ),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-0 p-5 mt-6">

      <div className="mb-4">
        <h2 className="text-xl font-bold">
          📜 Certificates
        </h2>
      </div>

      <div className="overflow-x-auto rounded-lg border">

        <table className="w-full min-w-[850px] border-collapse">

          <thead className="bg-gray-100">

            <tr>

              <th className="border p-2 text-left text-sm">
                Certificate Name
              </th>

              <th className="border p-2 text-left text-sm">
                Organization
              </th>

              <th className="border p-2 text-left text-sm">
                Year
              </th>

              <th className="border p-2 text-center text-sm">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {certificates.map((item) => (

              <tr key={item.id}>

                <td className="border p-2">

                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      handleChange(
                        item.id,
                        "title",
                        e.target.value
                      )
                    }
                    placeholder="CTET"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />

                </td>

                <td className="border p-2">

                  <input
                    type="text"
                    value={item.organization}
                    onChange={(e) =>
                      handleChange(
                        item.id,
                        "organization",
                        e.target.value
                      )
                    }
                    placeholder="CBSE / NIELIT"
                    className="w-full border rounded-md px-3 py-2 text-sm"
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
                    placeholder="2025"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />

                </td>

                <td className="border p-2 text-center">

                  <button
                    type="button"
                    onClick={() =>
                      removeCertificate(item.id)
                    }
                    className="text-red-600 hover:text-red-800 transition"
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
                colSpan={4}
                className="border-t p-2 text-center"
              >

                <button
                  type="button"
                  onClick={addCertificate}
                  className="rounded-xl border px-1 py-1 text-sm font-medium shadow-sm text-blue-600 hover:bg-blue-50 hover:shadow-md transition-all"
                >
                  + Add Certificate
                </button>

              </td>

            </tr>

          </tfoot>
                  </table>

      </div>

      {certificates.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">
          No certificates added yet.
        </p>
      )}

      <p className="mt-4 text-xs text-gray-500">
        💡 Add only important certificates. Empty fields won't appear in the final resume.
      </p>

    </div>
  );
}