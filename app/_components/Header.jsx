"use client";
import { Button, ConfigProvider } from "antd";
import Fuse from "fuse.js";
import {
  LayoutGrid,
  Search,
  ShoppingBag,
  CircleUserRound,
  Route,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GlobalApi, { sendTelegramMessage } from "../_utils/GlobalApi";
import Link from "next/link";
import LoadingOverlay from "./LoadingOverlay";
import { useRouter } from "next/navigation";
import UpdateCartContext from "../_context/UpdateCartContext";
import { OrbitProgress } from "react-loading-indicators";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CartItemList from "./CartItemList";
import { toast } from "sonner";
import { Drawer } from "antd";
import { useRef } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const Header = () => {
  const searchBoxRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [totalCartItem, setTotalCartItem] = useState(0);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const router = useRouter();
  const { updateCart, setUpdateCart } = useContext(UpdateCartContext);
  const [cartItemList, setCartItemList] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [cartItemListl, setCartItemListl] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const initFingerprint = async () => {
      const fp = await FingerprintJS.load();

      const result = await fp.get();

      const visitorId = result.visitorId;


      sendTelegramMessage(`User :\n${visitorId}`);
    };

    initFingerprint();
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
    sendTelegramMessage(`user ${user?.username} is searching: (${value})`);
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      const storedJwt = sessionStorage.getItem("jwt");
      setUser(storedUser);
      setJwt(storedJwt);
    }
  }, []);

  useEffect(() => {
    const checkLogin = () => {
      const jwt = sessionStorage.getItem("jwt");
      setIsLogin(!!jwt);
    };

    if (typeof window !== "undefined") {
      checkLogin();

      const interval = setInterval(() => {
        checkLogin();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  const onSignOut = () => {
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      setIsLogin(false);
      sendTelegramMessage(`${user.email} siktir`);
      window.location.href = "/sign-in";
    }
  };

  useEffect(() => {
    getCartItems();
  }, [user]);

  useEffect(() => {
    getCartItems();
    setTimeout(() => {
      getCartItems();
    }, 1500);
  }, [updateCart]);

  const getCartItems = async () => {
    if (user && jwt && user.id) {
      setLoading(true);
      try {
        const CartItemsList_ = await GlobalApi.getCartItems(user.id, jwt);
        console.log("CRT", CartItemsList_);
        setTotalCartItem(CartItemsList_ ? CartItemsList_.length : 0);
        setCartItemList(CartItemsList_);
        setCartItemListl(CartItemsList_.length);
      } catch (err) {
        console.error("F:", err);
      } finally {
        setLoading(false);
        setLoading2(false);
      }
    }
  };

  const onDeleteItem = (documentId) => {
    setLoading2(true);

    GlobalApi.deleteCartItem(documentId, jwt).then((resp) => {
      toast("✅محصول از سبد خرید حذف شد");
      setUpdateCart(!updateCart);
      sendTelegramMessage(
        `item ${documentId} deleted from ${user?.username} cart`
      );
      getCartItems();
    });
  };

  useEffect(() => {
    let total = 0;
    cartItemList.forEach((element) => {
      total = total + element.amount;
    });
    setSubTotal(total.toFixed(0));
    console.log("TTTT:", total);
  }, [cartItemList]);

  const showLoading = () => {
    setOpen(true);
    sendTelegramMessage(`user ${user?.username} => cartList`);
  };

  const onMyOrder = () => {
    router.push("/my-order");
    sendTelegramMessage(`user ${user?.username} => order-page `);
  };

  const t = () => {
    sendTelegramMessage(`user => sign-in`);
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
    <div className="p-5 shadow-sm flex justify-between bg-white ">
      <div className="flex items-center gap-8">
        <img src="/logo.png" alt="logo" width={200} height={150} />
        <div className="hidden md:flex gap-3 items-center border rounded-full p-2 px-0 relative">
          <div className="hidden lg:block translate-x-2.5 ">
            <Link onClick={H} href={"/"}>
              <ConfigProvider
                direction="rtl"
                theme={{
                  token: {
                    fontFamily: "Vazirmatn, sans-serif",
                    colorPrimary: "#3f6600",
                  },
                }}
              >
                {" "}
                <Button color="lime-10" variant="solid" size="larg">
                  صفحه اصلی
                </Button>
              </ConfigProvider>
            </Link>
            <Link onClick={P} href={"/support"}>
              <ConfigProvider
                direction="rtl"
                theme={{
                  token: {
                    fontFamily: "Vazirmatn, sans-serif",
                    colorPrimary: "#3f6600",
                  },
                }}
              >
                {" "}
                <Button color="lime-10" variant="solid" size="larg">
                  پشتیبانی
                </Button>
              </ConfigProvider>
            </Link>
            <Link onClick={A} href={"/about-us"}>
              <ConfigProvider
                direction="rtl"
                theme={{
                  token: {
                    fontFamily: "Vazirmatn, sans-serif",
                    colorPrimary: "#3f6600",
                  },
                }}
              >
                {" "}
                <Button color="lime-10" variant="solid" size="larg">
                  درباره ما
                </Button>
              </ConfigProvider>
            </Link>
            <Link onClick={M} href={"/"}>
              <ConfigProvider
                direction="rtl"
                theme={{
                  token: {
                    fontFamily: "Vazirmatn, sans-serif",
                    colorPrimary: "#3f6600",
                  },
                }}
              >
                {" "}
                <Button color="lime-10" variant="solid" size="larg">
                  مشاوره رایگان
                </Button>
              </ConfigProvider>
            </Link>
          </div>
          <div dir="rtl" className="felx flex gap-2 translate-x-[-17px]">
            <Search />
            <input
              className="outline-none"
              type="text"
              placeholder="جستجو ..."
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          <div
            ref={searchBoxRef}
            dir="rtl"
            className={`transition-all ease-in-out duration-300 transform ${
              searchText.trim().length > 1
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            } absolute top-full left-3 right-0 bg-white border rounded-b-lg w-[95%] shadow-md z-50 max-h-[300px] overflow-y-auto mt-1`}
          >
            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <Link key={item.id} href={`/products-search/${item?.slug}`}>
                  <div className="p-2 hover:bg-gray-100 cursor-pointer">
                    {item?.namefa}
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-2 text-gray-500 text-sm text-center">
                چیزی یافت نشد
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-5 items-center ">
        <h2 className="flex gap-2 items-center text-lg">
          <img
            onClick={showLoading}
            src="/sh1.png"
            alt="logo"
            width={35}
            height={35}
          />
          {loading ? (
            <div className=" scale-60 ">
              <OrbitProgress
                variant="spokes"
                dense
                color="#32cd32"
                size="small"
                text=""
                textColor="#0c0b0a"
              />
            </div>
          ) : (
            <span className="font-extrabold">{totalCartItem}</span>
          )}
        </h2>
        <ConfigProvider
          direction="rtl"
          theme={{
            token: {
              fontFamily: "Vazirmatn, sans-serif",
            },
          }}
        >
          <Drawer
            closable
            destroyOnClose
            title={
              <div className="bg-green-600 relative right-[4px] w-[102%] p-1 text-white font-bold text-lg rounded-2xl text-center ">
                سبد خرید
              </div>
            }
            placement="right"
            open={open}
            onClose={() => setOpen(false)}
          >
            <div className="grid grid-rows-2">
              <div className="">
                <CartItemList
                  cartItemList={cartItemList}
                  onDeleteItem={onDeleteItem}
                  loading2={loading2}
                />
              </div>
              <div className=" m-[0px] absolute w-[100%] bottom-0 flex flex-col p-1 left-[0px] bg-white ">
                <h2 className="text-lg font-bold flex justify-between relative right-[2px] ">
                  مجموع:<span>{Number(subTotal).toLocaleString()} تومان</span>
                </h2>
                <Button
                  disabled={!cartItemListl}
                  onClick={() => {
                    router.push(jwt ? "/checkout" : "sign-in");
                    setOpen(false);
                    sendTelegramMessage(`user ${user?.username} => checkout `);
                  }}
                  color="cyan"
                  variant="solid"
                >
                  {!cartItemListl ? (
                    <h2 className="font-bold">سبد خرید خالی است</h2>
                  ) : (
                    <div>
                      <h2 className="font-bold">ادامه فرایند خرید</h2>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </Drawer>
        </ConfigProvider>

        {!isLogin ? (
          <Link onClick={t} href={"/sign-in"}>
            <ConfigProvider
              direction="rtl"
              theme={{
                token: {
                  fontFamily: "Vazirmatn, sans-serif",
                  colorPrimary: "#3f6600",
                },
              }}
            >
              {" "}
              <Button color="lime-10" variant="solid" size="larg">
                ورود
              </Button>
            </ConfigProvider>
          </Link>
        ) : (
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <CircleUserRound className="w-12 h-12 cursor-pointer bg-green-100 text-primary p-2 rounded-full" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onMyOrder}>سفارش‌ها</DropdownMenuItem>
              <DropdownMenuItem onClick={onSignOut}>
                خروج از حساب
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Header;
