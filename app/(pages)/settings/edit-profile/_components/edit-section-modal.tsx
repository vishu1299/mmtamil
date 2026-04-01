"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { IoMale, IoFemale } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";

export type SectionType =
  | "basic"
  | "religion"
  | "education"
  | "lifestyle"
  | "location"
  | "family";

export interface ProfileData {
  name: string;
  showName: boolean;
  height: string;
  gender: string;
  location: string;
  annualIncome: string;
  dob: string;
  status: string;
  religion: string;
  caste: string;
  subCaste: string;
  motherTongue: string;
  qualification: string;
  profession: string;
  company: string;
  diet: string;
  smokingDrinking: string;
  aboutMe: string;
  hobbies: string;
  country: string;
  state: string;
  city: string;
  fatherOccupation: string;
  motherOccupation: string;
  siblings: string;
}

interface EditSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: SectionType;
  data: ProfileData;
  onSave: (updated: Partial<ProfileData>) => void;
}

const heightOptions = [
  "4'8\"", "4'9\"", "4'10\"", "4'11\"",
  "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"",
  "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\"",
];

const incomeOptions = [
  "Below ₹ 1 Lakh", "₹ 1-2 Lakh", "₹ 2-3 Lakh", "₹ 3-4 Lakh",
  "₹ 4-5 Lakh", "₹ 5-7 Lakh", "₹ 7-10 Lakh", "₹ 10-15 Lakh",
  "₹ 15-20 Lakh", "₹ 20-30 Lakh", "₹ 30-50 Lakh", "₹ 50 Lakh+",
];

const statusOptions = ["Never Married", "Divorced", "Widowed", "Separated"];
const religionOptions = ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Other"];
const dietOptions = ["Vegetarian", "Non-Vegetarian", "Eggetarian", "Vegan"];
const smokingDrinkingOptions = ["No", "Occasionally", "Yes"];

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

const SelectField = ({ label, value, options, onChange }: SelectFieldProps) => (
  <div>
    <label className="block text-sm text-[#6B6B6B] mb-1.5">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-[#E8E0E0] rounded-xl px-4 py-3.5 text-sm text-[#2C2C2C] outline-none bg-white appearance-none cursor-pointer"
      >
        <option value="" disabled>Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] pointer-events-none" />
    </div>
  </div>
);

interface TextFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (val: string) => void;
}

const TextField = ({ label, value, placeholder, onChange }: TextFieldProps) => (
  <div>
    <label className="block text-sm text-[#6B6B6B] mb-1.5">{label}</label>
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-[#E8E0E0] rounded-xl px-4 py-3.5 text-sm text-[#2C2C2C] outline-none bg-white placeholder:text-[#B0B0B0]"
    />
  </div>
);

interface TextAreaFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (val: string) => void;
}

const TextAreaField = ({
  label,
  value,
  placeholder,
  onChange,
}: TextAreaFieldProps) => (
  <div>
    <label className="block text-sm text-[#6B6B6B] mb-1.5">{label}</label>
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full border border-[#E8E0E0] rounded-xl px-4 py-3.5 text-sm text-[#2C2C2C] outline-none bg-white placeholder:text-[#B0B0B0] resize-none"
    />
  </div>
);

const EditSectionModal: React.FC<EditSectionModalProps> = ({
  isOpen,
  onClose,
  section,
  data,
  onSave,
}) => {
  const tc = useTranslations("common");
  const t = useTranslations("editProfilePage");
  const [form, setForm] = useState<ProfileData>(data);

  useEffect(() => {
    if (isOpen) setForm(data);
  }, [isOpen, data]);

  const update = (field: keyof ProfileData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  const renderFields = () => {
    switch (section) {
      case "basic":
        return (
          <div className="space-y-5">
            <div>
              <TextField label="Name" value={form.name} placeholder="Enter your name" onChange={(v) => update("name", v)} />
              <label className="flex items-center gap-2 mt-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.showName}
                  onChange={(e) => update("showName", e.target.checked)}
                  className="w-4.5 h-4.5 accent-maroon rounded"
                />
                <span className="text-sm text-[#2C2C2C]">Show my name to all</span>
              </label>
            </div>
            <SelectField label="Height" value={form.height} options={heightOptions} onChange={(v) => update("height", v)} />
            <div>
              <label className="block text-sm text-[#6B6B6B] mb-1.5">Gender</label>
              <div className="flex gap-3">
                <button
                  onClick={() => update("gender", "Male")}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl border text-sm font-medium transition-colors ${
                    form.gender === "Male"
                      ? "border-maroon text-maroon bg-red-50"
                      : "border-[#E8E0E0] text-[#6B6B6B] bg-gray-50"
                  }`}
                >
                  <IoMale className="text-lg" /> Male
                </button>
                <button
                  onClick={() => update("gender", "Female")}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl border text-sm font-medium transition-colors ${
                    form.gender === "Female"
                      ? "border-maroon text-maroon bg-red-50"
                      : "border-[#E8E0E0] text-[#6B6B6B] bg-gray-50"
                  }`}
                >
                  <IoFemale className="text-lg" /> Female
                </button>
              </div>
            </div>
            <SelectField label="Current Location" value={form.location} options={["India, Chennai, Tamil Nadu", "India, Bangalore, Karnataka", "India, Mumbai, Maharashtra", "India, Delhi, Delhi", "India, Hyderabad, Telangana"]} onChange={(v) => update("location", v)} />
            <SelectField label="Annual Income" value={form.annualIncome} options={incomeOptions} onChange={(v) => update("annualIncome", v)} />
          </div>
        );

      case "religion":
        return (
          <div className="space-y-5">
            <SelectField label="Religion" value={form.religion} options={religionOptions} onChange={(v) => update("religion", v)} />
            <TextField label="Caste" value={form.caste} placeholder="Enter your caste" onChange={(v) => update("caste", v)} />
            <TextField label="Sub-Caste" value={form.subCaste} placeholder="Enter your sub-caste" onChange={(v) => update("subCaste", v)} />
            <TextField label="Mother Tongue" value={form.motherTongue} placeholder="Enter your mother tongue" onChange={(v) => update("motherTongue", v)} />
          </div>
        );

      case "education":
        return (
          <div className="space-y-5">
            <TextField label="Qualification" value={form.qualification} placeholder="Enter your qualification" onChange={(v) => update("qualification", v)} />
            <TextField label="Profession" value={form.profession} placeholder="Enter your profession" onChange={(v) => update("profession", v)} />
            <TextField label="Company" value={form.company} placeholder="Enter your company" onChange={(v) => update("company", v)} />
          </div>
        );

      case "lifestyle":
        return (
          <div className="space-y-5">
            <SelectField label="Diet" value={form.diet} options={dietOptions} onChange={(v) => update("diet", v)} />
            <SelectField label="Smoking/Drinking" value={form.smokingDrinking} options={smokingDrinkingOptions} onChange={(v) => update("smokingDrinking", v)} />
            <TextAreaField label="About me" value={form.aboutMe} placeholder="Tell about yourself" onChange={(v) => update("aboutMe", v)} />
            <TextField label="Hobbies" value={form.hobbies} placeholder="Enter your hobbies" onChange={(v) => update("hobbies", v)} />
          </div>
        );

      case "location":
        return (
          <div className="space-y-5">
            <TextField label="Country" value={form.country} placeholder="Enter your country" onChange={(v) => update("country", v)} />
            <TextField label="State" value={form.state} placeholder="Enter your state" onChange={(v) => update("state", v)} />
            <TextField label="City" value={form.city} placeholder="Enter your city" onChange={(v) => update("city", v)} />
          </div>
        );

      case "family":
        return (
          <div className="space-y-5">
            <TextField label="Father's Occupation" value={form.fatherOccupation} placeholder="Enter father's occupation" onChange={(v) => update("fatherOccupation", v)} />
            <TextField label="Mother's Occupation" value={form.motherOccupation} placeholder="Enter mother's occupation" onChange={(v) => update("motherOccupation", v)} />
            <TextField label="Siblings" value={form.siblings} placeholder="e.g. 1 Brother, 1 Sister" onChange={(v) => update("siblings", v)} />
          </div>
        );
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 lg:inset-0 lg:flex lg:items-center lg:justify-center">
        <div className="bg-white rounded-t-3xl lg:rounded-2xl w-full lg:max-w-lg max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 lg:animate-none">
          {/* Drag Handle (mobile) */}
          <div className="flex justify-center pt-3 pb-1 lg:hidden">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Title */}
          <div className="px-6 pt-3 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#2C2C2C]">
              {section === "basic"
                ? t("sectionBasic")
                : section === "religion"
                  ? t("sectionReligion")
                  : section === "education"
                    ? t("sectionEducation")
                    : section === "lifestyle"
                      ? t("sectionLifestyle")
                      : section === "location"
                        ? t("sectionLocation")
                        : t("sectionFamily")}
            </h2>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {renderFields()}
          </div>

          {/* Save Button */}
          <div className="px-6 pb-6 pt-3">
            <button
              onClick={handleSave}
              className="w-full py-3.5 bg-maroon text-white text-sm font-semibold rounded-xl hover:bg-maroon/90 transition-colors"
            >
              {tc("save")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditSectionModal;
