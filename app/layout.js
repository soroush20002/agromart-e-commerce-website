import "@ant-design/v5-patch-for-react-19";
import "./globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import Header2 from "./_components/Header2";
import Loading from "./loading";
import CartProvider from "./_components/CartProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <Header2 />
          <Suspense fallback={<Loading />}>{children}</Suspense>
          <Toaster />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
