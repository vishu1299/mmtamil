import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const DateSelector = ({
  formdata,
  setFormData,
}: {
  formdata: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 130 }, (_, i) =>
    (currentYear - 18 - i).toString()
  );

  // Default to 31 days if month/year not selected
  const getDaysInMonth = (month: number | null, year: number | null) => {
    if (!month || !year) return 31;
    return new Date(year, month, 0).getDate();
  };

  const days = Array.from(
    {
      length: getDaysInMonth(
        month ? Number(month) : null,
        year ? Number(year) : null
      ),
    },
    (_, i) => (i + 1).toString()
  );

  useEffect(() => {
    setFormData({ ...formdata, dateOfBirth: `${month}-${day}-${year}` });
  }, [month, day, year]);

  return (
    <div>
      <p className="text-base font-semibold ">Birthday:</p>
      <div className="gap-2 grid grid-cols-3">
        <div className="flex flex-col">
          <Select onValueChange={(value) => setMonth(value)}>
            <SelectTrigger className="w-full border-b-2 text-base hover:border-red-600 font-semibold rounded-none p-0 shadow-none focus:ring-0 focus:outline-none">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((name, index) => (
                <SelectItem key={index} value={(index + 1).toString()}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {year && !month && <p className="text-red-500">Required</p>}
        </div>

        <div className="flex flex-col">
          <Select onValueChange={(value) => setDay(value)}>
            <SelectTrigger className="w-full border-b-2 text-base hover:border-red-600 font-semibold rounded-none p-0 shadow-none focus:ring-0 focus:outline-none">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {month && year && !day && <p className="text-red-500">Required</p>}
        </div>

        <div className="flex flex-col">
          {/* Year Selection */}
          <Select onValueChange={(value) => setYear(value)}>
            <SelectTrigger className="w-full border-b-2 text-base hover:border-red-600 font-semibold rounded-none p-0 shadow-none focus:ring-0 focus:outline-none">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {month && !year && <p className="text-red-500">Required</p>}
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
