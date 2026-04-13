"use client";

import { customAxios } from "@/utils/axios-interceptor";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
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

type PaymentStatusMsgKey =
  | "statusPending"
  | "statusSuccessful"
  | "statusInitiated"
  | "statusRejected"
  | "statusApproved";

const PAYMENT_STATUS_KEYS: Record<Payment["status"], PaymentStatusMsgKey> = {
  PENDING: "statusPending",
  SUCCESSFULL: "statusSuccessful",
  INITIATED: "statusInitiated",
  REJECTED: "statusRejected",
  APPROVED: "statusApproved",
};

const Payment = () => {
  const t = useTranslations("payments");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const dateLocale = locale === "ta" ? "ta-IN" : "en-IN";

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await customAxios().get("mmm/payment/getallpayment");
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
    <div className="mb-4 px-4 lg:mb-0">
      <p className="py-2 text-[24px] font-semibold text-[#333]">{t("title")}</p>
      <div className="flex justify-between gap-8">
        <div className="w-full bg-[#fff] shadow-md">
          <div>
            <div className="flex items-center justify-start gap-4 border-b-2 py-4 sm:pl-4">
              <div className="text-2xl text-[#525252]"></div>
              <div>
                <p className="text-xl font-semibold text-[#525252]">
                  {t("billingHistory")}
                </p>
              </div>
            </div>
          </div>
          <div className="my-8 flex w-full items-center justify-center sm:my-16">
            {loading ? (
              <div>{tc("loading")}</div>
            ) : payments && payments.length > 0 ? (
              <div className="w-full px-4">
                {payments.map((payment, index) => (
                  <div
                    key={payment.id || index}
                    className="mb-4 rounded-lg border bg-white px-6 py-4 shadow transition-all hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-base font-semibold text-[#333]">
                          {t("transactionId")}{" "}
                          {payment.transactionID}
                        </p>
                        <div className="text-sm text-[#525252]">
                          {payment.method}
                        </div>
                        <p className="text-sm text-[#525252]">
                          {t("statusLabel")}{" "}
                          <span className="font-medium">
                            {t(PAYMENT_STATUS_KEYS[payment.status])}
                          </span>
                        </p>
                        <p className="text-sm text-[#525252]">
                          {t("quantityLabel")}{" "}
                          <span className="font-medium">{payment.coins}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#6B7280]">
                          {new Date(
                            payment.initiatedDate
                          ).toLocaleString(dateLocale, {
                            weekday: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                        <p className="mb-2 mt-8 text-lg font-semibold text-[#333]">
                          ${Number(payment.amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Image
                  src="/assets/images/payments/img1.png"
                  alt={t("emptyIllustrationAlt")}
                  width={244}
                  height={244}
                  className="h-[150px] w-[150px] lg:h-[244px] lg:w-[244px]"
                />
                <p className="mx-2 mt-4 text-center text-[20px] font-semibold text-[#333]">
                  {t("emptyTitle")}
                </p>
                <p className="mx-2 text-center text-[#525252]">
                  {t("emptyHint")}
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
