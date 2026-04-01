"use client";
import React, { useState, useEffect } from "react";
import { getAboutUsData } from "./api/api";

interface AboutUsData {
  id: string;
  heading: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const AboutUs = () => {
  const [aboutUsData, setAboutUsData] = useState<AboutUsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Add scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAboutUsData();
        const responseData = data.data || data;
        const validData = Array.isArray(responseData)
          ? responseData
          : [responseData];

        // Define the desired order of headings
        const headingOrder = ["Who are we","On our platform, we advocate core values such as:",  "Suggested Guidelines for all","Our Trust & Safety principles"];
        
        // Sort based on the predefined order
        const sortedData = validData
          .filter((item) => item && item.heading)
          .sort((a, b) => {
            const indexA = headingOrder.indexOf(a.heading);
            const indexB = headingOrder.indexOf(b.heading);
            return indexA - indexB;
          });

        setAboutUsData(sortedData);
      } catch (error) {
        console.error("Error fetching about us data:", error);
        setError("Unable to load About page data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">{error}</div>;
  }

  if (aboutUsData.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        No content available for About Us.
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-8 md:gap-6 mt-5">
        {/* Sidebar */}
        <div className="col-span-3 ml-4 md:ml-8 lg:ml-16 pr-4 md:px-0">
          <nav className="sm:sticky sm:top-16 flex flex-col justify-center pt-6 gap-2 mb-6">
            {aboutUsData?.map((item) => (
              <div key={item.id} className="mt-2 text-lg md:text-xl">
                <a
                  href={`#${item.heading?.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block text-gray-800 font-medium hover:text-pink-500"
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
            <p className="bg-black md:text-4xl text-xl md:font-bold  font-semibold text-white py-10 flex items-center justify-center mt-22">
              Transparency
            </p>
            {aboutUsData?.map((item, index) => (
              <div
                key={item.id}
                id={item.heading?.toLowerCase().replace(/\s+/g, "-")}
                className={`pt-20 text-gray-800 w-full -ml-[5%] px-8 ${
                  index === aboutUsData.length - 1 ? "mb-32" : ""
                }`}
              >
                <h2 className="md:text-4xl text-xl md:font-bold  font-semibold text-gray-800 mb-4 ">
                  {item.heading}
                </h2>
                <div
                  className="content-wrapper text-lg leading-relaxed text-gray-700 space-y-6"
                  dangerouslySetInnerHTML={{ __html: item.content || "" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
       {/* Back to top button */}
       {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-pink-200 text-white px-4 py-2 rounded-md hover:bg-pink-500 transition-colors duration-200 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to top
        </button>
      )}
    </div>
  );
};

export default AboutUs;
