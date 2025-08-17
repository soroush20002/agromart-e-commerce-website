"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PaymentRedirectGuard = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAndRedirect = () => {
      const orderInfo = localStorage.getItem("orderInfo");

      if (!orderInfo) {
        router.replace("/");
      } else {
        window.location.reload();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAndRedirect();
      }
    };

    const handlePopState = () => {
      checkAndRedirect();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
};

export default PaymentRedirectGuard;
