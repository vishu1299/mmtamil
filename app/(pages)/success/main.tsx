"use client";

import React, { useEffect, useState } from "react";

import { CheckCircle } from "lucide-react";
import Link from "next/link";

const PaymentSuccessPage = ({ sessionId }: { sessionId: any }) => {
  const [paymentData, setPaymentData] = useState<{
    payment_intent?: string;
    amount_total?: number;
    currency?: string;
    payment_method_types?: string[];
    status?: string;
    created?: number;
  }>({});

  useEffect(() => {
    if (sessionId) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/stripe/session-status?session_id=${sessionId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("access-token") ?? "" },
      })
        .then((res) => res.json())
        .then((data) =>{
          console.log("data on the rock",data);
           setPaymentData(data.data)}) 
        .catch((error) => console.error("Error fetching payment data:", error));
    }
  }, [sessionId]);

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div className="bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">

        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-pink-100 p-3 mb-4">
            <CheckCircle size={48} className="text-pink-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {paymentData.status === "complete"
              ? "Payment Successful!"
              : "Processing Payment"}
          </h1>
          <p className="text-gray-600 mb-6">
            {paymentData.status === "complete"
              ? "Your payment has been processed successfully. Thank you for your purchase!"
              : "We are verifying your payment. Please wait."}
          </p>

          <div className="border-t border-gray-200 w-full my-6"></div>
          <div className="w-full space-y-4">
            <div className="flex justify-between flex-wrap">
              <p className="text-gray-600">Transaction ID</p>
              <p className="font-medium text-gray-800">
                {paymentData.payment_intent || "N/A"}
              </p>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid</span>
              <span className="font-medium text-gray-800">
                {/* {paymentData.amount_total
                  ? `${(paymentData.amount_total / 100).toFixed(
                      2
                    )} ${paymentData.currency?.toUpperCase()}`
                  : "N/A"} */}
                  {paymentData.amount_total
                  ? `${(paymentData.amount_total / 100).toFixed(
                      2
                    )} ${paymentData.currency?.toUpperCase()}`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-800">
                {paymentData.payment_method_types?.[0]?.toUpperCase() || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-medium text-gray-800">
                {formatDate(paymentData.created)}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 w-full my-6"></div>
          <div className="space-y-4 w-full">
            <Link href={"/search"}>
              <button className="w-full py-3 px-4 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition duration-200">
                Go to Home Page
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
