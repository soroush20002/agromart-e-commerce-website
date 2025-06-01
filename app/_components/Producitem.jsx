"use client";
import { Button } from "@/components/ui/button";
import { ConfigProvider } from "antd";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductItemDetail from "./ProductItemDetail";
import { Modal } from "antd";
import { sendTelegramMessage } from "../_utils/GlobalApi";
import Image from "next/image";

function Producitem({ product }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      const storedJwt = sessionStorage.getItem("jwt");
      setUser(storedUser);
      setJwt(storedJwt);
    }
  }, []);

  const showLoading = () => {
    setOpen(true);
    setLoading(true);
    sendTelegramMessage(`user ${user?.username} => ${product?.namefa}`);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  return (
    <div className="bg-white p-2 md:p-6 flex flex-col items-center justify-center gap-3 border rounded-b-lg mt-6 hover:scale-110 hover:shadow-lg transition-all ease-in-out cursor-pointer rounded-2xl  ">
      <Image
        src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${product?.images?.[0]?.url}`}
        alt={product?.namefa}
        width="500"
        height="200"
        className="h-[200px] w-[200px] object-contain rounded-2xl "
      />
      <h1 className="font-bold text-lg text-center ">{product?.namefa}</h1>
      {product.sellingPrice && (
        <h2 className="line-through font-bold text-gray-500">
          {product.sellingPrice}{" "}
        </h2>
      )}
      <h2 className="font-bold ">
        <span className="mr-0.5">تومان</span>
        <span dir="ltr">{product?.mrp?.toLocaleString()}</span>
      </h2>
      <Button
        className="text-green-600 hover:text-white hover:bg-green-500 "
        variant="outline"
        onClick={showLoading}
      >
        افزودن به سبد
      </Button>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Vazirmatn, sans-serif",
          },
        }}
      >
        <Modal
          width={800}
          footer={null}
          open={open}
          onCancel={() => setOpen(false)}
        >
          <ProductItemDetail product={product} />
        </Modal>
      </ConfigProvider>
    </div>
  );
}

export default Producitem;
