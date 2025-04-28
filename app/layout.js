"use client"
import '@ant-design/v5-patch-for-react-19';
import "./globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { Toaster } from "@/components/ui/sonner";
import UpdateCartContext from "./_context/UpdateCartContext";

import { useState } from "react";
import Header2 from './_components/Header2';

export default function RootLayout({ children }) {

  const [updateCart,setUpdateCart]=useState(false);
  return (
    <html lang="en">  
      <body>
        <UpdateCartContext.Provider value={{updateCart,setUpdateCart}} >
        <Header/>
        <Header2/>
        {children}
        <Toaster/>
        <Footer/>
        </UpdateCartContext.Provider>
      </body>
    </html>
  );
}
