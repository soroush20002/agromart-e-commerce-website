"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button, ConfigProvider } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Fuse from "fuse.js";
import { useRef } from "react";
import { sendTelegramMessage } from "../_utils/GlobalApi";

function Header2() {
  const searchBoxRef = useRef(null);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setSearchText("");
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const normalizePersian = (str) => {
    if (!str) return "";
    return str
      .replace(/ي/g, "ی")
      .replace(/ك/g, "ک")
      .replace(/[ًٌٍَُِّْ]/g, "")
      .replace(/\u200C/g, "")
      .replace(/[^آ-یa-zA-Z0-9 ]/g, "")
      .trim();
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    sendTelegramMessage(`user ${user?.username} is searching: (${value})`)
    setSearchText(value);

    if (value.trim().length > 1) {
      const res = await fetch("https://agri.liara.run/api/products");
      const data = await res.json();
      const allProducts = data?.data || [];

      const normalizedProducts = allProducts.map((item) => ({
        ...item,
        normalizedNamefa: normalizePersian(item.namefa),
      }));

      const fuse = new Fuse(normalizedProducts, {
        keys: ["normalizedNamefa"],
        threshold: 0.4,
      });

      const results = fuse.search(normalizePersian(value)).map((r) => r.item);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const H = () => {
    sendTelegramMessage(`user (${user?.username}) => Home page`);
  };

  const P = () => {
    sendTelegramMessage(`user (${user?.username})  => Support`);
  };

  const A = () => {
    sendTelegramMessage(`user (${user?.username})  => About us`);
  };

  const M = () => {
    sendTelegramMessage(`user (${user?.username})  => Mosh `);
  };

  return (
    <div className="hidden max-[1024px]:flex flex-col gap-3 items-center border rounded-xl p-4 mx-1 mt-3 mb-4 relative bg-white shadow-md">
      <div
        className="
          w-full 
          flex 
          flex-wrap 
          justify-center 
          items-center 
          gap-2
          max-[712px]:flex-wrap
          max-[768px]:flex-row
          max-[1024px]:flex-row
        "
      >
        {[
          { label: "صفحه اصلی", href: "/" },
          { label: "پشتیبانی", href: "/support" },
          { label: "درباره ما", href: "/about-us" },
          { label: "مشاوره رایگان", href: "/mosh" },
        ].map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="w-auto max-[768px]:flex-1 max-[712px]:w-1/4 text-center"
          >
            <ConfigProvider
              direction="rtl"
              theme={{
                token: {
                  fontFamily: "Vazirmatn, sans-serif",
                  colorPrimary: "#3f6600",
                },
              }}
            >
              <Button
                block
                type="primary"
                style={{
                  backgroundColor: "#3f6600",
                  borderColor: "#3f6600",
                }}
                onClick={() => {
                  if (item.label === "صفحه اصلی") {
                    H();
                  } else if (item.label === "پشتیبانی") {
                    P();
                  } else if (item.label === "درباره ما") {
                    A();
                  } else if (item.label === "مشاوره رایگان") {
                    M();
                  }
                }}
              >
                {item.label}
              </Button>
            </ConfigProvider>
          </Link>
        ))}
        <div
          dir="rtl"
          className={`
            hidden
            max-[768px]:flex
            border rounded-md px-2 py-1 items-center gap-2
            max-[712px]:w-full
            max-[768px]:flex-1
            mt-2 max-[712px]:mt-4
          `}
        >
          <Search className="text-gray-500" />
          <input
            className="flex-1 outline-none text-sm"
            type="text"
            placeholder="جستجو ..."
            value={searchText}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div
        ref={searchBoxRef}
        dir="rtl"
        className={`transition-all ease-in-out duration-300 transform ${
          searchResults.length > 0
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2"
        } absolute top-full left-4 right-4 bg-white border rounded-b-lg shadow-md z-50 max-h-[300px] overflow-y-auto mt-1`}
      >
        {searchResults.map((item) => (
          <Link key={item.id} href={`/products-search/${item?.slug}`}>
            <div className="p-2 hover:bg-gray-100 cursor-pointer text-sm">
              {item?.namefa}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Header2;
