"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LoadingOverlay from "./LoadingOverlay";
import { sendTelegramMessage } from "../_utils/GlobalApi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
 
const CategoryList = ({ categoryList }) => {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [loading, setLoading] = useState(false);
  const catRefs = useRef([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      const storedJwt = sessionStorage.getItem("jwt");
      setUser(storedUser);
      setJwt(storedJwt);
    }
  }, []);

  useEffect(() => {
    if (catRefs.current.length) {
      const mid = Math.floor(categoryList.length / 2);
      catRefs.current.forEach((cat, i) => {
        let fromVars = { opacity: 0, y: 60 };
        if (i < mid) fromVars = { opacity: 0, x: -80 };
        else if (i > mid) fromVars = { opacity: 0, x: 80 };
        if (categoryList.length % 2 === 0 && (i === mid || i === mid - 1)) fromVars = { opacity: 0, y: 60 };
        if (categoryList.length % 2 === 1 && i === mid) fromVars = { opacity: 0, y: 60 };
        gsap.set(cat, fromVars);
      });
      gsap.to(catRefs.current, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
      });
      catRefs.current.forEach((cat, i) => {
        let fromVars = { opacity: 0, y: 60 };
        if (i < mid) fromVars = { opacity: 0, x: -80 };
        else if (i > mid) fromVars = { opacity: 0, x: 80 };
        if (categoryList.length % 2 === 0 && (i === mid || i === mid - 1)) fromVars = { opacity: 0, y: 60 };
        if (categoryList.length % 2 === 1 && i === mid) fromVars = { opacity: 0, y: 60 };
        gsap.fromTo(
          cat,
          fromVars,
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cat,
              start: "top 90%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });
    }
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [categoryList]);

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
        {categoryList.slice(0, 7).map((category, index) => (
          <Link
            onClick={load}
            href={"/products-category/" + category.name}
            key={index}
            ref={el => catRefs.current[index] = el}
            className="flex flex-col items-center bg-green-200 gap-2 p-3 rounded-lg group cursor-pointer hover:bg-green-400"
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${category?.image?.[0]?.url}`}
              alt=""
              width={50}
              height={50}
              className="group-hover:scale-125 transition-all ease-in-out"
            />
            <h1 className="text-green-800">{category?.namefa}</h1>
          </Link>
        ))}
        {categoryList.map((category, index) => (
          category?.name === "new" || category?.name === "all-products" ? (
            <Link
              onClick={load}
              href={"/products-category/" + category.name}
              key={index}
              ref={el => catRefs.current[index] = el}
              className="flex flex-col md:hidden items-center bg-green-200 gap-2 p-3 rounded-lg group cursor-pointer hover:bg-green-400"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${category?.image?.[0]?.url}`}
                alt=""
                width={50}
                height={50}
                className="group-hover:scale-125 transition-all ease-in-out"
              />
              <h1 className="text-green-800">{category?.namefa}</h1>
            </Link>
          ) : null
        ))}
      </div>
      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default CategoryList;
