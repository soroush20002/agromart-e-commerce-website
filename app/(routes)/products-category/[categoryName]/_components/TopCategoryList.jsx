"use client";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import LoadingOverlay from "@/app/_components/LoadingOverlay";
import { sendTelegramMessage } from "@/app/_utils/GlobalApi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

function TopCategoryList({ categoryList, selectedCategory }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const catRefs = useRef([]);

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

  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    setActiveCategory(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="flex gap-5 mt-15 overflow-auto overflow-y-hidden mx-7 md:mx-20 justify-center">
      {categoryList.map((category, index) => {
        const isSelected =
          activeCategory?.toLowerCase() === category?.name?.toLowerCase();
        return (
          <Link
            onClick={load}
            href={`/products-category/${category.name}`}
            key={index}
            ref={el => catRefs.current[index] = el}
            className={clsx(
              "flex flex-col items-center bg-green-200 gap-2 p-3 rounded-lg group cursor-pointer hover:bg-green-400 w-[150px] min-w-[100px] ",
              isSelected && "bg-green-900 text-white"
            )}
          >
            <Image
              src={
                category?.image?.[0]?.url
                  ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${category.image[0].url}`
                  : "/placeholder.png"
              }
              alt=""
              width={50}
              height={50}
              className="group-hover:scale-125 transition-all ease-in-out"
            />
            <h2 className={clsx("text-green-800", isSelected && "text-white")}>
              {category?.namefa}
            </h2>
          </Link>
        );
      })}
      <LoadingOverlay loading={loading} />
    </div>
  );
}

export default TopCategoryList;
