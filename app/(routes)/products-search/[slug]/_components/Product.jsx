"use client";

import GlobalApi, { sendTelegramMessage } from "@/app/_utils/GlobalApi";
import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { OrbitProgress } from "react-loading-indicators";
import UpdateCartContext from "@/app/_context/UpdateCartContext";
import CategoryList from "@/app/_components/CategoryList";
import Image from "next/image";
import Link from "next/link";
import LoadingOverlay from "@/app/_components/LoadingOverlay";
import ProductList from "@/app/_components/ProductList";

function ProductSearchPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [productTotalprice, setProductTotalPrice] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [productInfo, setProductInfo] = useState([]);

  const { updateCart, setUpdateCart } = useContext(UpdateCartContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 10000));
    } catch (error) {
      console.error("eror:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    sessionStorage.removeItem("m")
    sessionStorage.setItem("Slug",slug)

    const fetchProduct = async () => {
      try {
        const res = await GlobalApi.getProductBySlug(decodeURIComponent(slug));
        const res2 = await GlobalApi.getProductInfobySlug(
          decodeURIComponent(slug)
        );
        setProductInfo(res2);
        const fetchedProduct = res?.[0];
        setProduct(fetchedProduct);
        setProductTotalPrice(fetchedProduct?.mrp || 0);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const addToCart = () => {
    const jwt = localStorage.getItem("jwt");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!jwt) {
      router.push("/create-account");
      toast("برای افزودن به سبد خرید لطفا وارد حساب کاربری خود شوید ");
      return;
    }

    setAdding(true);

    const data = {
      data: {
        quantity: quantity,
        amount: (quantity * productTotalprice).toFixed(0),
        products: product.id,
        users_permissions_users: user.id,
        name: product.namefa,
        ui: user.id,
      },
    };

    GlobalApi.addToCart(data, jwt).then(
      (resp) => {
        setUpdateCart(!updateCart);
        setAdding(false);
        toast("محصول به سبد خرید اضافه شد ✅");
        sendTelegramMessage(
          `user (${user?.username})  => ${product?.namefa} => Cart list`
        );
      },
      (e) => {
        toast("مشکلی پیش اومد ❗");
        setAdding(false);
      }
    );
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await GlobalApi.getCategoryList();
      const productList = await GlobalApi.getAllProducts();
      setCategoryList(categories);
      setProductList(productList);
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <LoadingOverlay loading={loading} />;
  }

  if (!product) {
    return <LoadingOverlay loading={true} />;
  }

  return (
    <div className="mt-10 px-4">
      <div className="grid  grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="bg-white lg:col-span-8 p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 border-2 border-neutral-200 rounded-2xl items-stretch">
          <div className="flex justify-center items-center border rounded-2xl p-2">
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${product?.images?.[0]?.url}`}
              alt={product?.namefa || "محصول"}
              width={500}
              height={200}
              className="object-contain max-h-[400px] w-full"
            />
          </div>

          <div dir="rtl" className="flex flex-col justify-between gap-5 h-full">
            <div className="space-y-3">
              <h2 className="font-bold text-lg text-center">
                {product?.namefa}
              </h2>
              <h2 className="font-bold text-sm text-gray-500 whitespace-pre-line">
                {product?.description}
              </h2>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border-b-4 border-r-2 border-r-fuchsia-500 border-t-4 border-t-fuchsia-400 border-b-fuchsia-600 p-3">
              {Number(product?.itemQuantityType) ? (
                <h2>
                  موجود در انبار:{" "}
                  <span className="bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white px-3 pt-1 rounded-full">
                    {product?.itemQuantityType}
                  </span>
                </h2>
              ) : (
                <h2 className="text-xl text-red-600">ناموجود</h2>
              )}
              <h2 className="font-bold">
                <span dir="ltr">
                  قیمت:{" "}
                  <span className="line-through font-bold text-gray-500 ">
                    {product.sellingPrice?.toLocaleString()}
                  </span>
                  <span className="rounded-2xl" >{""}{product?.mrp?.toLocaleString()}{" "}تومان </span> 
                </span>
              </h2>
            </div>
            <div className="flex flex-col items-start gap-4">
              <div className="flex gap-4 items-center flex-wrap">
                <div className="p-2 border flex gap-3 px-3 items-center rounded-2xl">
                  <button
                    className="hover:scale-125 transition-all ease-in-out"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={Number(product?.itemQuantityType) <= quantity}
                  >
                    <img src="/plus.png" alt="افزایش" width={19} height={19} />
                  </button>
                  <h2>{quantity}</h2>
                  <button
                    className="hover:scale-125 transition-all ease-in-out"
                    disabled={quantity === 1}
                    onClick={() => setQuantity(quantity - 1)}
                  >
                    <img src="/minus.png" alt="کاهش" width={19} height={19} />
                  </button>
                </div>
                <h2 className="text-sm font-bold">
                  = {(quantity * productTotalprice).toLocaleString()} تومان
                </h2>
              </div>

              {adding ? (
                <Button
                  className="text-green-600 hover:text-white hover:bg-green-500 flex items-center w-full gap-2"
                  variant="outline"
                >
                  <div className="scale-50">
                    <OrbitProgress
                      variant="spokes"
                      dense
                      color="#32cd32"
                      size="small"
                    />
                  </div>
                </Button>
              ) : (
                <Button
                  className="text-green-600 hover:text-white hover:bg-green-500 w-full"
                  variant="outline"
                  onClick={addToCart}
                  disabled={!Number(product?.itemQuantityType)}
                >
                  افزودن به سبد
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div
            lang="fa"
            dir="rtl"
            className="bg-white border-2 border-gray-200 p-4 h-full  rounded-2xl flex flex-col justify-between"
          >
            <div>
              {productInfo
                .filter((item) => item.Value)
                .map((item, index) => (
                  <div key={index} className="p-2 flex border-b-2 rounded-2xl border-amber-500 justify-between">
                    <h2 className="break-words max-w-[30%]">{item.Key}</h2>
                    <h2 dir="ltr" className="break-words max-w-[70%]">{item.Value}</h2>
                  </div>
                ))}
            </div>

            <div className="flex flex-col-reverse mt-2">
              {productInfo
                .filter((item) => item.Des)
                .map((item, index) => (
                  <div key={index} className="p-2 border-e-2 border-b-2 rounded-2xl  border-e-gray-700 border-b-blue-900 my-1 ">
                    <h2 className="break-words">{item.Des}</h2>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <h2 className='font-bold text-emerald-950 flex justify-end b text-2xl text-right mt-10 '> دیگر محصول ها</h2>
      <div className="border-t-3 border-t-emerald-900 rounded-l-3xl h-8 -translate-y-4 w-[calc(100%-10rem)] " ></div>
      <div className="-translate-y-4" >
        <ProductList productList={productList} />
      </div>
    </div>
  );
}

export default ProductSearchPage;
