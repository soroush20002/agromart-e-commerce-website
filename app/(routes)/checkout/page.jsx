import React, { Suspense } from "react";
import Checkout from "./Checkout";

export const metadata = {
  title: "پرداخت",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <Checkout />
    </Suspense>
  );
}
