import React, { Suspense } from "react";
import Orc from "./Orc"

export const metadata = {
  title: "تایید پرداخت",
  robots: {
    index: false,
    follow: false,
  },
};
 
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <Orc/>
    </Suspense>
  );
}