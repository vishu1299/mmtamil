"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface RegistrationData {
  profileFor: string;
  iAm: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  dateOfBirth: string;
  nativeCountry: string;
  citizenship: string;
  country: string;
  maritalStatus: string;
  height: string;
  religion: string;
  caste: string;
  subCaste: string;
  education: string;
  profession: string;
  fatherDetails: string;
  birthTime: string;
  zodiac: string;
  star: string;
}

const STORAGE_KEY = "mm-registration-data";

const defaultData: RegistrationData = {
  profileFor: "Me",
  iAm: "GROOM",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  password: "",
  dateOfBirth: "",
  nativeCountry: "",
  citizenship: "",
  country: "",
  maritalStatus: "",
  height: "",
  religion: "",
  caste: "",
  subCaste: "",
  education: "",
  profession: "",
  fatherDetails: "",
  birthTime: "",
  zodiac: "",
  star: "",
};

interface RegistrationContextType {
  data: RegistrationData;
  updateData: (partial: Partial<RegistrationData>) => void;
  clearData: () => void;
  photoFiles: File[];
  setPhotoFiles: React.Dispatch<React.SetStateAction<File[]>>;
  horoscopeChartData: Record<number, string>;
  setHoroscopeChartData: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  horoscopeImageFile: File | null;
  setHoroscopeImageFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const RegistrationContext = createContext<RegistrationContextType | null>(null);

export const useRegistration = () => {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error("useRegistration must be used within RegistrationProvider");
  return ctx;
};

export const RegistrationProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<RegistrationData>(defaultData);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [horoscopeChartData, setHoroscopeChartData] = useState<Record<number, string>>({});
  const [horoscopeImageFile, setHoroscopeImageFile] = useState<File | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setData((prev) => ({ ...prev, ...JSON.parse(stored) }));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, hydrated]);

  const updateData = useCallback((partial: Partial<RegistrationData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const clearData = useCallback(() => {
    setData(defaultData);
    setPhotoFiles([]);
    setHoroscopeChartData({});
    setHoroscopeImageFile(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <RegistrationContext.Provider
      value={{
        data,
        updateData,
        clearData,
        photoFiles,
        setPhotoFiles,
        horoscopeChartData,
        setHoroscopeChartData,
        horoscopeImageFile,
        setHoroscopeImageFile,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};
