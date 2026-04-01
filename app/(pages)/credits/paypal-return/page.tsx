"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { getPayPalOrder } from "../api/api";

function PayPalReturnContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("token");

  const [state, setState] = useState<
    "loading" | "ok" | "error"
  >("loading");
  const [detail, setDetail] = useState<string>("");

  useEffect(() => {
    if (!orderId) {
      setState("error");
      setDetail("Missing PayPal order reference. Return to plans and try again.");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await getPayPalOrder(orderId);
        const body = res.data as Record<string, unknown>;
        if (cancelled) return;

        const ok = body?.success === true;
        const inner = (body?.data ?? body) as Record<string, unknown>;
        const status =
          typeof inner.status === "string"
            ? inner.status
            : typeof inner.orderStatus === "string"
              ? inner.orderStatus
              : undefined;

        if (ok || status === "COMPLETED" || status === "APPROVED") {
          setState("ok");
          setDetail(status ? `Order status: ${status}` : "Your payment was received.");
        } else {
          setState("error");
          setDetail(
            typeof body?.message === "string"
              ? body.message
              : "We could not confirm this payment yet."
          );
        }
      } catch {
        if (!cancelled) {
          setState("error");
          setDetail("Verification failed. Check your account or contact support.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
        {state === "loading" && (
          <>
            <Loader2 className="w-12 h-12 text-maroon animate-spin mx-auto mb-4" />
            <h1 className="font-playfair text-xl font-semibold text-[#2C2C2C] mb-2">
              Verifying payment
            </h1>
            <p className="text-sm text-[#6B6B6B]">Please wait…</p>
          </>
        )}
        {state === "ok" && (
          <>
            <div className="rounded-full bg-green-50 p-3 w-fit mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="font-playfair text-xl font-semibold text-[#2C2C2C] mb-2">
              Thank you
            </h1>
            <p className="text-sm text-[#6B6B6B] mb-6">{detail}</p>
          </>
        )}
        {state === "error" && (
          <>
            <div className="rounded-full bg-red-50 p-3 w-fit mx-auto mb-4">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="font-playfair text-xl font-semibold text-[#2C2C2C] mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-[#6B6B6B] mb-6">{detail}</p>
          </>
        )}
        <Link
          href="/credits"
          className="inline-block w-full py-3 bg-maroon text-white text-sm font-semibold rounded-xl hover:bg-maroon/90 transition-colors"
        >
          Back to Premium
        </Link>
      </div>
    </div>
  );
}

export default function PayPalReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center text-[#6B6B6B]">
          Loading…
        </div>
      }
    >
      <PayPalReturnContent />
    </Suspense>
  );
}
