"use client";

import { Trash2 } from "lucide-react";

import { useState } from "react";

import {
  ResumeData,
  PersonalExtraField,
} from "../types/resume";



type Props = {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
};

export default function PersonalDetails({
  data,
  setData,
}: Props) {

  const personal = data.personal;

  const [newField, setNewField] = useState({
    label: "",
    value: "",
  });


    const handlePhotoUpload = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      const file = e.target.files?.[0];

      if (!file) return;

      // File Type Check
      if (!file.type.startsWith("image/")) {
        alert("Please upload only image files.");
        return;
      }

      // File Size Check
      if (file.size > 1 * 1024 * 1024) {
        alert("Image size should be less than 1 MB.");
        return;
      }

      // Check Passport Ratio
      const image = new Image();

      image.onload = () => {

        const ratio = image.width / image.height;

        // Passport Photo Ratio = 3:4
        if (Math.abs(ratio - 0.75) > 0.03) {
          alert("Please upload only a passport size photo (3:4 ratio).");
          return;
        }

        // Minimum Size
        if (image.width < 300 || image.height < 400) {
          alert("Minimum passport photo size should be 300 × 400 pixels.");
          return;
        }

        const reader = new FileReader();

        reader.onload = () => {
          setData((prev) => ({
            ...prev,
            personal: {
              ...prev.personal,
              photo: reader.result as string,
            },
          }));
        };

        reader.readAsDataURL(file);

      };

      image.src = URL.createObjectURL(file);

    };

  const handleChange = (
    field: keyof typeof personal,
    value: any
  ) => {

    if (
      field === "correspondenceAddress" &&
      personal.sameAddress
    ) {

      setData({
        ...data,
        personal: {
          ...personal,
          correspondenceAddress: value,
          permanentAddress: value,
        },
      });

      return;
    }

    setData({
      ...data,
      personal: {
        ...personal,
        [field]: value,
      },
    });
  };

  const handleSameAddress = (
    checked: boolean
  ) => {

    setData({
      ...data,
      personal: {
        ...personal,
        sameAddress: checked,
        permanentAddress: checked
          ? personal.correspondenceAddress
          : personal.permanentAddress,
      },
    });

      };
      const removePhoto = () => {

        setData((prev) => ({
          ...prev,
          personal: {
            ...prev.personal,
            photo: "",
          },
        }));

      };  

      const addField = () => {

      if (
        newField.label.trim() === "" ||
        newField.value.trim() === ""
      ) {
        return;
      }

      const field: PersonalExtraField = {
        id: crypto.randomUUID(),
        label: newField.label.trim(),
        value: newField.value.trim(),
      };

      setData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          extraFields: [
            ...prev.personal.extraFields,
            field,
          ],
        },
      }));

      setNewField({
        label: "",
        value: "",
      });

    };

  const removeField = (id: string) => {

    setData({
      ...data,
      personal: {
        ...personal,
        extraFields:
          personal.extraFields.filter(
            (item) => item.id !== id
          ),
      },
    });

  };

    return (

    <div className="bg-white rounded-xl shadow-sm p-6">

      <div className="mb-8 flex items-start justify-between gap-8">

        {/* Left */}

        <div className="flex-1">

          <h2 className="text-3xl font-bold flex items-center gap-2">
            👤 Personal Details
          </h2>

          <p className="text-gray-500 mt-2">
            Fill your personal information carefully.
          </p>

        </div>

        {/* Right Photo */}

      <div className="w-[135px] flex-shrink-0 flex flex-col items-center">

        {/* Preview Box */}

        <div
          className="
          w-[135px]
          h-[170px]
          overflow-hidden
          rounded-xl
          border-2
          border-dashed
          border-gray-300
          bg-gray-100
          flex
          items-center
          justify-center
          shrink-0
          ">

          {personal.photo ? (
            <img
              src={personal.photo}
              alt="Preview"
                width={135}
                height={170}
              className="rounded-xl border" 
            />
             ) : 
            (
            <div className="text-center text-gray-400">
              <div className="text-4xl">👤</div>
              <p className="text-xs mt-2">No Photo</p>
            </div>
          )}

        </div>

        {/* Upload */}

        <label
          className="
            mt-3
            w-full
            cursor-pointer
            rounded-lg
            bg-blue-600
            py-2
            text-center
            text-sm
            font-semibold
            text-white
            hover:bg-blue-700
          "
        >

          {personal.photo ? "Change Photo" : "Choose Photo"}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />

        </label>

        {/* Remove */}

        {personal.photo && (

          <button
            type="button"
            onClick={removePhoto}
            className="
              mt-2
              w-full
              rounded-lg
              border
              border-red-500
              py-2
              text-sm
              font-semibold
              text-red-600
              hover:bg-red-50
            "
          >
            Remove Photo
          </button>

        )}

      </div>

      </div>

      
      
      {/* Basic Details */}

      <div className="grid grid-cols-2 md:grid-cols-2 gap-5">

        {/* Full Name */}
        <div>
          <label className="font-semibold">
            Full Name *
          </label>

          <input
            type="text"
            value={personal.fullName}
            onChange={(e) =>
              handleChange("fullName", e.target.value)
            }
            className="w-full mt-2 rounded-xl border-1 border-black-200 p-2"
            placeholder="Enter Full Name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="font-semibold">
            Email Address *
          </label>

          <input
            type="email"
            value={personal.email}
            onChange={(e) =>
              handleChange("email", e.target.value)
            }
            className="w-full mt-2 rounded-xl border-1 border-black-200 p-2"
            placeholder="example@gmail.com"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="font-semibold">
            Mobile Number *
          </label>

          <input
            type="text"
            value={personal.phone}
            onChange={(e) =>
              handleChange("phone", e.target.value)
            }
            className="w-full mt-2 rounded-xl border-1 border-black-200 p-2"
            placeholder="9876543210"
          />
        </div>

        {/* Alternate Mobile */}
        <div>
          <label className="font-semibold">
            Alternate Mobile
          </label>

          <input
            type="text"
            value={personal.alternatePhone}
            onChange={(e) =>
              handleChange("alternatePhone", e.target.value)
            }
            className="w-full mt-2 rounded-xl border-1 border-black-200 p-2"
            placeholder="Optional"
          />
        </div>

      </div>
            {/* Family Details */}

      <div className="mt-8">

        <h3 className="text-lg font-bold mb-4">
          👨‍👩‍👧 Family Details
        </h3>

        <div className="grid md:grid-cols-3 gap-5">

          <div>

            <label className="font-semibold">
              Father's Name
            </label>

            <input
              type="text"
              value={personal.fatherName}
              onChange={(e) =>
                handleChange("fatherName", e.target.value)
              }
              className="w-full mt-2 rounded-xl border-1 border-black-200 p-2"
              placeholder="Father's Name"
            />

          </div>

          <div>

            <label className="font-semibold">
              Mother's Name
            </label>

            <input
              type="text"
              value={personal.motherName}
              onChange={(e) =>
                handleChange("motherName", e.target.value)
              }
              className="w-full mt-2 rounded-xl border-1 border-black-200 p-2"
              placeholder="Mother's Name"
            />

          </div>

          <div>

            <label className="font-semibold">
              Spouse Name (Optional)
            </label>

            <input
              type="text"
              value={personal.spouseName}
              onChange={(e) =>
                handleChange("spouseName", e.target.value)
              }
              className="w-full mt-2 rounded-xl border-1 border-black-300 p-2"
              placeholder="Optional"
            />

          </div>

        </div>

      </div>

      {/* Personal Information */}

      <div className="mt-8">

        <h3 className="text-lg font-bold mb-4">
          ℹ️ Personal Information
        </h3>

        <div className="grid md:grid-cols-3 gap-5">

          <div>

            <label className="font-semibold">
              Date of Birth
            </label>

            <input
              type="date"
              value={personal.dob}
              onChange={(e) =>
                handleChange("dob", e.target.value)
              }
              className="w-full mt-2 rounded-xl border-1 border-black-200 p-2"
            />

          </div>

          <div>

            <label className="font-semibold">
              Languages Known
            </label>

            <input
              type="text"
              value={personal.languages}
              onChange={(e) =>
                handleChange("languages", e.target.value)
              }
              className="w-full mt-2 rounded-xl border-1 border-black-200 p-2"
              placeholder="Hindi, English..."
            />

          </div>

          <div>

            <label className="font-semibold">
              Hobbies
            </label>

            <input
              type="text"
              value={personal.hobbies}
              onChange={(e) =>
                handleChange("hobbies", e.target.value)
              }
              className="w-full mt-2 rounded-xl border-1 border-black-200 p-2"
              placeholder="Reading, Music..."
            />

          </div>

        </div>

      </div>

      {/* Address */}

      <div className="mt-8">

        <h3 className="text-lg font-bold mb-4">
          🏠 Address
        </h3>

      <div className="grid grid-cols-2 gap-5 mt-4">

        {/* Correspondence Address */}

        <div>

          <label className="font-semibold">
            Correspondence Address
          </label>

          <textarea
            rows={2}
            value={personal.correspondenceAddress}
            onChange={(e) =>
              handleChange(
                "correspondenceAddress",
                e.target.value
              )
            }
            className="w-full mt-2 rounded-xl border-1 border-black-200 p-2"
            placeholder="Enter Correspondence Address"
          />

        </div>

        {/* Permanent Address */}

        <div>

          <label className="font-semibold">
            Permanent Address
          </label>

          <textarea
            rows={2}
            value={personal.permanentAddress}
            disabled={personal.sameAddress}
            onChange={(e) =>
              handleChange(
                "permanentAddress",
                e.target.value
              )
            }
            className={`w-full mt-2 rounded-xl border-1 p-2 ${
              personal.sameAddress
                ? "bg-gray-100 border-gray-300"
                : "border-black-200"
            }`}
            placeholder="Enter Permanent Address"
          />

        </div>

      </div>

      <label className="mt-x flex items-center gap-2">

        <input
          type="checkbox"
          checked={personal.sameAddress}
          onChange={(e) =>
            handleSameAddress(e.target.checked)
          }
        />

        Same as Correspondence Address

      </label>
      <div className="mt-8">  

      </div>

      </div>
  
     {/* Additional Personal Information */}

      <div className="mt-8 mb-5">

      <h3 className="text-xl font-bold flex items-center gap-2">
        ➕ Other Personal Details
      </h3>

    <p className="mt-1 text-sm text-gray-500">
      (e.g., Caste, Religion, PAN Card, Aadhaar Card, etc.)
    </p>

      </div>


      <div className="flex items-end gap-4">

        {/* Field Name */}
        <div className="flex-1">
          <input
            type="text"
            value={newField.label}
            onChange={(e) =>
              setNewField({
                ...newField,
                label: e.target.value,
              })
            }
            placeholder="Caste"
            className="w-full rounded-xl border-1 border-black-200 p-2"
          />
        </div>

        {/* Field Value */}
        <div className="flex-1">
          <input
            type="text"
            value={newField.value}
            onChange={(e) =>
              setNewField({
                ...newField,
                value: e.target.value,
              })
            }
            placeholder="Gen."
            className="w-full rounded-xl border-1 border-black-200 p-2"
          />
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={addField}
          className="w-auto rounded-xl bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
          + Add Details
        </button>

      </div>
      
      {personal.extraFields?.length> 0 && (

      <div className="mt-6 overflow-x-auto rounded-xl border">

            <table className="w-full border-collapse">

              <thead className="bg-skyblue-100">

                <tr>

                  <th className="border px-4 py-2 text-left font-semibold">
                    Field Name
                  </th>

                  <th className="border px-4 py-2 text-left font-semibold">
                    Value
                  </th>

                  <th className="border px-4 py-2 text-center font-semibold">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {personal.extraFields.map((item) => (

                  <tr key={item.id}>

                    <td className="border px-4 py-2">
                      {item.label}
                    </td>

                    <td className="border px-4 py-2">
                      {item.value}
                    </td>

                    <td className="border px-4 py-2 text-center">

                  <button
                    type="button"
                    onClick={() => removeField(item.id)}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      rounded-lg
                      p-2
                      text-red-600
                      transition
                      hover:bg-red-100
                      hover:text-red-700
                    "
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

    </div>  
    );
}