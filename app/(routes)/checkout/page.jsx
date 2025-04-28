import React, { Suspense } from "react";
import Checkout from "./Checkout";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <Checkout />
    </Suspense>
  );
}
