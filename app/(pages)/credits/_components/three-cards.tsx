"use client";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllPackage } from "../api/api";

interface PricingOption {
  id: string;
  name: string;
  price: number;
  coins: number;
  description: string;
  featured: boolean;
}

const PricingCards = () => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );
  const [submittedData, setSubmittedData] = useState<
    { name: string; price: number; quantity: number }[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pricingOptions, setPricingOptions] = useState<PricingOption[]>([]);

  useEffect(() => {
    const fetchAllPackages = async () => {
      try {
        const result = await getAllPackage();
        const filtered = result?.data?.data?.data
          .filter((item: any) => item.status)
          .map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            coins: item.coins,
            description: item.description,
            featured: false,
          }));
        setPricingOptions(filtered);
        console.log(submittedData);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchAllPackages();
  }, []);

  const handleCheckout = async ({
    name,
    price,
    quantity,
    packageId
  }: {
    name: string;
    price: number;
    quantity: number;
    packageId: string;
  }) => {
    try {
      setSubmittedData((prevData) => [...prevData, { name, price, quantity }]);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("access-token") ?? "" },
        body: JSON.stringify({ items: [{ name, price, quantity }], packageId }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const responseData = await response.json();
      const stripe = await stripePromise;
      if (stripe)
        await stripe.redirectToCheckout({ sessionId: responseData.id });
    } catch (error) {
      console.error("Error during checkout process:", error);
    }
  };

  const nextSlide = () => {
    if (pricingOptions.length > 0 && currentIndex < pricingOptions.length - 1) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % pricingOptions.length);
    }
  };

  const prevSlide = () => {
    if (pricingOptions.length > 0) {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + pricingOptions.length) % pricingOptions.length
      );
    }
  };

  return (
    <div className="bg-gray-100 py-12 px-4 mt-12 mb-10">
      <div className="relative max-w-sm mx-auto">
        {pricingOptions.length > 0 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute z-20 left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2.5 shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-all duration-200"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>

            <div className="overflow-hidden relative w-full">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  width: `${pricingOptions.length * 50}%`,
                  display: 'flex'
                }}
              >
                {pricingOptions.map((option, index) => (
                  <div
                    key={option.id}
                    className="w-full flex-shrink-0"
                    style={{ minWidth: '100%' }}
                  >
                    <div className={`bg-white p-8 rounded-2xl shadow-lg flex flex-col transform transition-all duration-300 
                      ${index === currentIndex ? "scale-100" : "scale-95 opacity-0 pointer-events-none"}`}
                    >
                      <div className="mb-6 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                          ${option.price}
                        </h2>
                        <h3 className="text-2xl font-bold text-pink-600 mb-3">
                          {option.coins} Coins
                        </h3>
                        <p className="text-gray-600 text-base">
                          {option.description}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleCheckout({
                            name: option.name,
                            price: option.price * 100,
                            quantity: 1,
                            packageId: option.id
                          })
                        }
                        className="mt-auto py-3 w-full rounded-xl font-semibold text-lg transition-all duration-200 bg-pink-600 text-white hover:bg-pink-700 transform hover:scale-105"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={nextSlide}
              className="absolute z-20 right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2.5 shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-all duration-200"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PricingCards;
