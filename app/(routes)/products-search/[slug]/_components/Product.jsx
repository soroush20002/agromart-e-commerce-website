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
  const [productList, setProductList]=useState([]);

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

    const fetchProduct = async () => {
      try {
        const res = await GlobalApi.getProductBySlug(decodeURIComponent(slug));
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
    const jwt = sessionStorage.getItem("jwt");
    const user = JSON.parse(sessionStorage.getItem("user"));

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
        sendTelegramMessage(`user (${user?.username})  => ${product?.namefa} => Cart list`);
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
      const productList=await GlobalApi.getAllProducts();
      setCategoryList(categories);
      setProductList(productList)
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="bg-white lg:col-span-8 p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 border rounded-2xl">
          <div className="flex justify-center items-center">
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${product?.images?.[0]?.url}`}
              alt=""
              width="500"
              height="200"
              className="h-full w-[340px] object-contain border rounded-2xl"
            />
          </div>
          <div dir="rtl" className="flex flex-col justify-between  gap-3 h-full">
            <h2 className="font-bold text-lg text-center">{product?.namefa}</h2>
            <h2 className="font-bold text-sm text-gray-500 whitespace-pre-line ">
              {product?.description}
            </h2> 
            { Number(product?.itemQuantityType) ? <h2>موجود در انبار : {product?.itemQuantityType} </h2> : <h2 className="text-xl  text-red-600 " >ناموجود</h2> }
            <h2>وزن/حجم : {product?.weight} گرم</h2>
            <h2 className="font-bold">
              <span dir="ltr">قیمت:<span className="line-through font-bold text-gray-500" >{product.sellingPrice?.toLocaleString()}</span> {product?.mrp?.toLocaleString()} تومان</span>
            </h2>
            <div className="flex flex-col items-start gap-3 mt-3">
              <div className="flex gap-3 items-center flex-wrap">
                <div className="p-2 border flex gap-5 px-3 items-center rounded-2xl">
                  <button
                    className="hover:scale-150 transition-all ease-in-out"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={Number(product?.itemQuantityType) <= quantity }
                  >
                    <img src="/plus.png" alt="" width={19} height={19} />
                  </button>
                  <h2>{quantity}</h2>
                  <button
                    className="hover:scale-150 transition-all ease-in-out"
                    disabled={quantity === 1}
                    onClick={() => setQuantity(quantity - 1)}
                  >
                    <img src="/minus.png" alt="" width={19} height={19} />
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
          <div lang="fa" dir="rtl" className="">
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 gap-4">
              {categoryList.map((category, index) => (
                <Link
                  onClick={load}
                  href={"/products-category/" + category.name}
                  key={index}
                  className="flex flex-col items-center bg-green-200 gap-2 p-3 rounded-lg group cursor-pointer hover:bg-green-400"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${category?.image?.[0]?.url}`}
                    alt=""
                    width={50}
                    height={50}
                    className="group-hover:scale-125 transition-all ease-in-out"
                  />
                  <h2 className="text-green-800 text-sm text-center">
                    {category?.namefa}
                  </h2>
                </Link>
              ))}
              {categoryList.length % 2 !== 0 ? (<div  className="hidden md:block flex-col items-center bg-green-200 gap-2 p-3 rounded-lg group cursor-pointer hover:bg-green-400" />) : null}

            </div>
          </div>
        </div>
      </div>
      <h2 className='font-bold text-green-600  flex justify-center b text-2xl text-right mt-10 '> دیگر محصولات</h2>
      <div>
        <ProductList productList={productList} />
      </div>
    </div>
  );
}

export default ProductSearchPage;
