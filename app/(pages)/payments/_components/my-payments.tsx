"use client";
import { customAxios } from "@/utils/axios-interceptor";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Payment {
  id: number;
  transactionID: string;
  amount: number;
  coins: number;
  method: string;
  status: "PENDING" | "SUCCESSFULL" | "INITIATED" | "REJECTED" | "APPROVED";
  initiatedDate: string;
}

const Payment = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await customAxios().get("mmm/payment/getallpayment");
        console.log('Payment Response:', response.data); // Add this line
        setPayments(response.data.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="mb-4 lg:mb-0 px-4 ">
      <p className=" text-[#333] font-semibold text-[24px] py-2">My Payments</p>
      <div className="flex justify-between gap-8  ">
        <div className=" w-full shadow-md bg-[#fff]  ">
          <div>
            <div className="flex gap-4 sm:pl-4 justify-start items-center border-b-2 py-4">
              <div className="text-[#525252] text-2xl"></div>
              <div>
                <p className="text-[#525252] font-semibold text-xl">
                  Billing history
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center sm:my-16 my-8 w-full">
            {loading ? (
              <div>Loading...</div>
            ) : payments && payments.length > 0 ? (
              <div className="w-full px-4">
                {payments.map((payment, index) => (
                  <div key={payment.id || index} className="border rounded-lg py-4 bg-white shadow transition-all px-6 mb-4 hover:shadow-xl">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <p className="text-[#333] font-semibold text-base">
                          Transaction ID: {payment.transactionID}
                        </p>
                        <div className="text-[#525252] text-sm">
                          {payment.method}
                        </div>
                        <p className="text-[#525252] text-sm">
                          Status: <span className="font-medium">{payment.status}</span>
                        </p>
                        <p className="text-[#525252] text-sm">
                          Quantity: <span className="font-medium">{payment.coins}</span>               
                        </p>
                      </div>
                      <div className="text-right">
                        
                        <p className="text-[#6B7280] text-sm">
                          {new Date(payment.initiatedDate).toLocaleString('en-US', {
                            weekday: 'long',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                        <p className="text-[#333] font-semibold text-lg mb-2 mt-8">
                          ${Number(payment.amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <Image
                  src="/assets/images/payments/img1.png"
                  alt="img"
                  width={244}
                  height={244}
                  className="h-[150px] w-[150px] lg:h-[244px] lg:w-[244px]"
                />
                <p className="text-[#333] text-[20px] font-semibold mt-4 text-center mx-2">
                  No billing history
                </p>
                <p className="text-[#525252] text-center mx-2">
                  Your transactions will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
