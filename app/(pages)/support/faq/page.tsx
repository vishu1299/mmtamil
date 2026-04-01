"use client";
import React, { useState, useEffect } from "react";
import { getFaqData } from "./api/api";

interface FaqData {
  id: string;
  heading: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const Faq = () => {
  const [faqData, setFaqData] = useState<FaqData[]>([]);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFaqData();
        const responseData = data.data || data;
        const validData = Array.isArray(responseData)
          ? responseData
          : [responseData];

        const sortedData = validData
          .filter((item) => item && item.heading)
          .sort((a, b) => a.heading.localeCompare(b.heading));

        setFaqData(sortedData);
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
      }
    };

    fetchData();
  }, []);

  if (faqData.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  const toggleAccordion = (id: string) => {
    setActiveItem(activeItem === id ? null : id);
  };

  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-8 md:gap-6 mt-5">
        {/* Sidebar */}
        <div className="col-span-3 ml-4 md:ml-8 lg:ml-16 pr-4 md:px-0">
          <nav className="sm:sticky sm:top-16 flex flex-col justify-center pt-6 gap-2 mb-6">
            {faqData?.map((item) => (
              <div key={item.id} className="mt-2 text-lg md:text-xl">
                <a
                  href={`#${item.heading?.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block text-gray-800 font-medium hover:text-pink-500"
                  onClick={() => toggleAccordion(item.id)}
                >
                  {item.heading}
                </a>
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="col-span-5 mr-4 md:mr-8 lg:mr-16">
          <div className="flex-1 pl-4 pt-6">
            <p className="bg-black md:text-4xl text-xl md:font-bold font-semibold text-white py-10 flex items-center justify-center mt-22">
              Educational Guides
            </p>
            <div className="mt-8">
              {faqData?.map((item) => (
                <div
                  key={item.id}
                  id={item.heading?.toLowerCase().replace(/\s+/g, "-")}
                  className="mb-4 border-b border-gray-200 pb-4"
                >
                  <button
                    className="w-full flex justify-between items-center text-left"
                    onClick={() => toggleAccordion(item.id)}
                  >
                    <h2 className="md:text-xl text-lg font-semibold text-gray-800">
                      {item.heading}
                    </h2>
                    <span className="text-2xl">
                      {activeItem === item.id ? "−" : "+"}
                    </span>
                  </button>
                  {activeItem === item.id && (
                    <div
                      className="mt-4 text-gray-700 prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: item.content || "" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
