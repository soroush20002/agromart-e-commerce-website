"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LoadingOverlay from "./LoadingOverlay";
import { sendTelegramMessage } from "../_utils/GlobalApi";

const CategoryList = ({ categoryList }) => {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      const storedJwt = sessionStorage.getItem("jwt");
      setUser(storedUser);
      setJwt(storedJwt);
    }
  }, []);

  const load = async () => {
    sendTelegramMessage(`user ${user?.username} => Category `);
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 10000));
    } catch (error) {
      console.error("eror:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div lang="fa" dir="rtl" className="mt-10">
      <h2 className="font-bold text-green-600 text-2xl"></h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-5 mt-5">
        {categoryList.map((category, index) => (
          <Link
            onClick={load}
            href={"/products-category/" + category.name}
            key={index}
            className="flex flex-col items-center bg-green-200 gap-2 p-3 rounded-lg group cursor-pointer hover:bg-green-400"
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${category?.image?.[0]?.url}`}
              alt="icon"
              width={50}
              height={50}
              className="group-hover:scale-125 transition-all ease-in-out"
            />
            <h2 className="text-green-800">{category?.namefa}</h2>
          </Link>
        ))}
      </div>
      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default CategoryList;
