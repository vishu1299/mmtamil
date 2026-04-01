"use client";
import React, { useState, useEffect } from "react";
import { getPrivacyPolicyData } from "../privacyinfo/privacypolicy/api/api";

interface PrivacyPolicyData {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const PrivacyPolicy = () => {
  const [privacyPolicyData, setPrivacyPolicyData] = useState<
    PrivacyPolicyData[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPrivacyPolicyData();
        const responseData = data.data || data;
        const validData = Array.isArray(responseData)
          ? responseData
          : [responseData];

        const sortedData = validData
          .filter((item) => item && item.title)
          .sort((a, b) => {
            // Custom order: Privacy Policy first, then Cookie Policy, then others
            const order = {
              "Privacy Policy": 1,
              "Cookie Policy": 2,
            };
            const orderA = order[a.title as keyof typeof order] || 3;
            const orderB = order[b.title as keyof typeof order] || 3;

            if (orderA !== orderB) {
              return orderA - orderB;
            }
            return a.title.localeCompare(b.title);
          });

        setPrivacyPolicyData(sortedData);
      } catch (error) {
        console.error("Error fetching privacy policy data:", error);
      }
    };

    fetchData();
  }, []);

  if (privacyPolicyData.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-8 md:gap-6 mt-5">
        {/* Sidebar */}
        <div className="col-span-3 ml-4 md:ml-8 lg:ml-16 pr-4 md:px-0">
          <nav className="sm:sticky sm:top-16 flex flex-col justify-center pt-6 gap-2 mb-6">
            {privacyPolicyData?.map((item) => (
              <div key={item.id} className="mt-2 text-lg md:text-xl">
                <a
                  href={`#${item.title?.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block text-gray-800 font-medium hover:text-pink-500"
                >
                  {item.title}
                </a>
              </div>
            ))}
          </nav>
        </div>

        {/* Main description */}
        <div className="col-span-5 mr-4 md:mr-8 lg:mr-16">
          <div className="flex-1 pl-4 pt-6">
            <p className="bg-black md:text-4xl text-xl md:font-bold font-semibold text-white py-10 flex items-center justify-center mt-22">
              Rules and Policies
            </p>
            {privacyPolicyData?.map((item, index) => (
              <div
                key={item.id}
                id={item.title?.toLowerCase().replace(/\s+/g, "-")}
                className={`pt-20 text-gray-800 w-full px-4 ${
                  index === privacyPolicyData.length - 1 ? "mb-32" : ""
                }`}
              >
                <h2 className="md:text-4xl text-xl md:font-bold font-semibold text-gray-800 mb-4">
                  {item.title}
                </h2>
                <div
                  className="description-wrapper text-lg leading-relaxed text-gray-700 space-y-6"
                  dangerouslySetInnerHTML={{ __html: item.description || "" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
