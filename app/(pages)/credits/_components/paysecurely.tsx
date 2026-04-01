"use client";
import React from "react";
import { FaLock } from "react-icons/fa";
import {
  Custompaydialog,
  DialogContentCustome,
  DialogTriggerCustome,
} from "./custompaydialog";
import { FcGoogle } from "react-icons/fc";
import { SiApple } from "react-icons/si";
import { FaRegCreditCard } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";

const PaySecurely = () => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

  const handleCheckout = async () => {
    const response = await fetch(
      "http://localhost:5000/api/create-checkout-session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ name: "Premium Membership", price: 50, quantity: 1 }],
        }),
      }
    );

    const { id } = await response.json();

    const stripe = await stripePromise;
    console.log("Stripe", stripe);

    stripe?.redirectToCheckout({ sessionId: id });
  };

  return (
    <div>
      <Custompaydialog>
        <DialogTriggerCustome asChild className="w-full h-auto">
          <p className="cursor-pointer">Get Coins</p>
        </DialogTriggerCustome>
        <DialogContentCustome className="w-full rounded-none   py-2">
          <div className="flex justify-between items-center py-2 border-b">
            <div className="md:text-center flex-1 text-base sm:text-lg font-normal px-2">
              Pay securely: Get 65 credits for only{" "}
              <span className="text-green-500">$9.99</span>!
            </div>
          </div>

          <div className="flex justify-center gap-2 items-center">
            <div className="flex gap-4 justify-center items-center">
              <FaRegCreditCard className="font-bold text-black text-lg" />
              <p className="font-bold text-black">Card</p>
            </div>
          </div>

          <div className="border bg-gray-300 w-full"></div>

          <div className="px-4 sm:px-8">
            <div className="flex gap-2  sm:gap-6 justify-center md:mt-4 mt-2">
              <button className="bg-black text-white gap-1 py-2 px-4 sm:px-10 rounded-md flex items-center text-sm sm:text-base">
                <FcGoogle className="mr-1" /> Pay
              </button>
              <button className="bg-black text-white gap-1 px-4 sm:px-10 py-2 rounded-md flex items-center text-sm sm:text-base">
                <SiApple className="mr-1" /> Pay
              </button>
            </div>

            <div className="w-full sm:w-[50%] mx-auto mt-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Credit or Debit Card Number
                </label>
                <input
                  type="text"
                  placeholder="xxxx xxxx xxxx"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="flex gap-2 ">
                <div className="lg:mt-2">
                  <label className="block text-sm text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="lg:mt-2">
                  <label className="block text-sm text-gray-700 mb-1">
                    CVV/CVC
                  </label>
                  <input
                    type="text"
                    placeholder="CVC"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>

              <div className="lg:mt-2">
                <label className="block text-sm text-gray-700 mb-1">
                  Name On Card
                </label>
                <input
                  type="text"
                  placeholder="Full name as on card"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-4 bg-[#EF4765] text-white py-2 flex items-center justify-center font-medium text-base sm:text-lg"
              >
                <FaLock className="mr-2" /> Get Coins
              </button>
            </div>

            <div className="  flex justify-center gap-2  lg:mt-4 mt-2">
              <div className=" ">
                <Image
                  src="/assets/images/mastercard/img-1.png"
                  alt="Mastercard payment option"
                  width={42}
                  height={40}
                  className="w-12 h-8"
                />
              </div>
              <div className="">
                {" "}
                <Image
                  src="/assets/images/mastercard/img-2.png"
                  alt=""
                  className="w-12 h-8"
                  width={42}
                  height={40}
                />
              </div>
              <div className="">
                <Image
                  src="/assets/images/mastercard/img-3.png"
                  alt=""
                  className="w-12 h-8"
                  width={42}
                  height={40}
                />
              </div>
            </div>
          </div>

          <div className="lg:py-2">
            <div className="border-b border-gray-200 md:py-2 text-[10px] sm:text-[12px] font-medium text-black px-2 sm:px-4">
              <p>
                By proceeding with payment you reaffirm accepting our
                <span className="text-[#007bff] font-normal underline">
                  {" "}
                  Terms of Use,
                </span>
                <span className="text-[#007bff] underline">
                  {" "}
                  Privacy Policy,
                </span>
                <span className="text-[#007bff] underline">
                  {" "}
                  Payment and Refund Policy.
                </span>
              </p>
            </div>

            <div className="text-[10px] sm:text-[12px] text-gray-400 px-2 sm:px-4 mt-2 pb-3">
              <p>
                Your privacy is important to us: your card statement may show
                payments with a neutral internet merchant descriptor to protect
                your personal online space (NOT BestDates).
              </p>
              <p className="mt-1 lg:py-2">
                This site uses 128-bit SSL encryption for the security of the
                data exchange between your browser and our servers.
              </p>
              <p className="text-[#333] text-[10px] sm:text-[12px]">
                support@bestdates.com
              </p>
            </div>
          </div>
        </DialogContentCustome>
      </Custompaydialog>
    </div>
  );
};

export default PaySecurely;
