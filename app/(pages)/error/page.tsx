import React from "react";
import { AlertCircle } from "lucide-react";

const PaymentErrorPage = () => {
  return (
    <div className=" bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-pink-100 p-3 mb-4">
            <AlertCircle size={48} className="text-pink-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-6">
            We could not process your payment. Please check your payment details
            and try again.
          </p>

          <div className="border-t border-gray-200 w-full my-6"></div>

          <div className="w-full space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Error Code</span>
              <span className="font-medium text-pink-500">ERR-5432</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-medium text-gray-800">TXN87654321</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-800">
                Credit Card •••• 4242
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-medium text-gray-800">March 13, 2025</span>
            </div>
          </div>

          <div className="border-t border-gray-200 w-full my-6"></div>

          <div className="space-y-4 w-full">
            <button className="w-full py-3 px-4 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition duration-200">
              Go to Home Page
            </button>

            {/* <button 
              className="w-full py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition duration-200"
        
            >
              Go to Search Page
            </button> */}
          </div>
        </div>
      </div>

      {/* <div className="mt-8 text-center">
        <p className="text-gray-600">Need help? <a href="#" className="text-pink-500 hover:underline">Contact our support team</a></p>
        <p className="text-gray-500 mt-2">Our support team is available 24/7 to assist you</p>
      </div> */}
    </div>
  );
};

export default PaymentErrorPage;
