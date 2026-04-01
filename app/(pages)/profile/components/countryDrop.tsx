"use client";

import { Country, City } from "country-state-city";
import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CountryCitySelector = ({
  formdata,
  setFormdata,
}: {
  formdata: any;
  setFormdata: any;
}) => {
  const t = useTranslations("profileComponents");
  const countries = useMemo(() => Country.getAllCountries(), []);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    if (formdata.country) {
      const selectedCountry = countries.find(
        (country) => country.name === formdata.country
      );
      if (selectedCountry) {
        const countryCities = City.getCitiesOfCountry(selectedCountry.isoCode);
        setCities(countryCities || []);
      }
    }
  }, [formdata.country, countries]);

  const handleInputChange = (name: string, value: string) => {
    if (name === "country") {
      const selectedCountry = countries.find((country) => country.name === value);
      if (selectedCountry) {
        const countryCities = City.getCitiesOfCountry(selectedCountry.isoCode);
        setCities(countryCities || []);
      }
      setFormdata((prev: any) => ({
        ...prev,
        country: value,
        city: value,
      }));
    } else {
      setFormdata((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="space-y-6 px-6 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <div>
          <label htmlFor="country" className="block text-sm text-gray-700 mb-1">
            {t("country")}
          </label>
          <Select
            value={formdata.country}
            onValueChange={(value) => handleInputChange("country", value)}
          >
            <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
              <SelectValue placeholder={t("selectCountry")} />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.isoCode} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="city" className="block text-sm text-gray-700 mb-1">
            {t("city")}
          </label>
          <Select value={formdata.city} onValueChange={(value) => handleInputChange("city", value)}>
            <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
              <SelectValue placeholder={t("selectCity")} />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city, index) => (
                <SelectItem
                  key={`${city.name}-${city.stateCode ?? index}`}
                  value={city.name}
                >
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CountryCitySelector;
