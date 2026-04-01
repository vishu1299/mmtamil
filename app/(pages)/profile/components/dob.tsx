"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const MONTH_KEYS = [
  "month01",
  "month02",
  "month03",
  "month04",
  "month05",
  "month06",
  "month07",
  "month08",
  "month09",
  "month10",
  "month11",
  "month12",
] as const;

const DateSelectorProfile = ({
  formdata,
  setFormData,
}: {
  formdata: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const t = useTranslations("profileComponents");
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 130 }, (_, i) => (currentYear - i).toString());

  const getDaysInMonth = (monthNum: number, yearNum: number) =>
    new Date(yearNum, monthNum, 0).getDate();

  const days = month
    ? Array.from(
        { length: getDaysInMonth(Number(month), Number(year ?? currentYear)) },
        (_, i) => (i + 1).toString()
      )
    : [];

  useEffect(() => {
    if (formdata) {
      setMonth(String(formdata.month || ""));
      setDay(String(formdata.day || ""));
      setYear(String(formdata.year || ""));
    }
  }, [formdata]);

  useEffect(() => {
    if (month && day && year) {
      setFormData((prev: any) => ({ ...prev, month, day, year }));
    }
  }, [month, day, year, setFormData]);

  return (
    <>
      {formdata && (
        <div className="flex gap-2">
          <Select value={month ?? ""} onValueChange={setMonth}>
            <SelectTrigger className="w-full border-b-2 text-base hover:border-red-600 font-semibold rounded-none p-0 shadow-none focus:ring-0 focus:outline-none">
              <SelectValue placeholder={t("dobMonth")} />
            </SelectTrigger>
            <SelectContent>
              {MONTH_KEYS.map((key, index) => (
                <SelectItem
                  key={key}
                  value={(index + 1).toString().padStart(2, "0")}
                >
                  {t(key)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={day ?? ""} onValueChange={setDay}>
            <SelectTrigger className="w-full border-b-2 text-base hover:border-red-600 font-semibold rounded-none p-0 shadow-none focus:ring-0 focus:outline-none">
              <SelectValue placeholder={t("dobDay")} />
            </SelectTrigger>
            <SelectContent>
              {days.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={year ?? ""} onValueChange={setYear}>
            <SelectTrigger className="w-full border-b-2 text-base hover:border-red-600 font-semibold rounded-none p-0 shadow-none focus:ring-0 focus:outline-none">
              <SelectValue placeholder={t("dobYear")} />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
};

export default DateSelectorProfile;
