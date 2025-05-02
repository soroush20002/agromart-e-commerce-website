"use client";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBasket } from "lucide-react";
import React, { useContext, useState } from "react";
import LoadingOverlay from "./LoadingOverlay";
import { useRouter } from "next/navigation";
import GlobalApi, { sendTelegramMessage } from "../_utils/GlobalApi";
import { toast } from "sonner";
import UpdateCartContext from "../_context/UpdateCartContext";
import { OrbitProgress } from "react-loading-indicators";

function ProductItemDetail({ product }) {
  const [loading, setLoading] = useState(false);

  const jwt = sessionStorage.getItem("jwt");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [productTotalprice, setProductTotalPrice] = useState(product?.mrp);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { updateCart, setUpdateCart } = useContext(UpdateCartContext);

  const addToCart = () => {
    setLoading(true);

    if (!jwt) {
      router.push("/sign-in");
      setLoading(false);
      return;
    }

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
    console.log("Product ID:", product?.id);
    console.log(data);
    GlobalApi.addToCart(data, jwt).then(
      (resp) => {
        console.log(resp);
        setUpdateCart(!updateCart);
        setLoading(false);
        toast("محصول به سبد خرید اضافه شد✅");
        sendTelegramMessage(`user ${user?.username} => ${product?.namefa} (${quantity}) => CartList `);
      },
      (e) => {
        toast("مشکلی پیش امده❗");
        setLoading(false);
      }
    );
    console.log("POST:", JSON.stringify(data, null, 2));
  };

  return (
    <div
      lang="fa"
      dir="rtl"
      className="grid grid-cols-1 md:grid-cols-2 p-3 text-black gap-5 rounded-2xl  "
    >
      <img
        src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${product?.images?.[0]?.url}`}
        alt="icon"
        width="300"
        height="300"
        className="h-full w-full object-contain  rounded-2xl  "
      />
      <div className="flex flex-col gap-3 flex-1 text-right">
        <h2 className="font-bold text-2xl">{product?.namefa}</h2>
        <h2 className="font-bold text-sm text-gray-500 whitespace-pre-line ">
          {product?.description}
        </h2>
        { Number(product?.itemQuantityType) ? <h2>موجود در انبار : {product?.itemQuantityType} </h2> : <h2 className="text-xl  text-red-600 " >ناموجود</h2> }
        
        <h2 className="font-bold text-2xl">{product?.mrp.toLocaleString()} تومان</h2>
        <div>
          {/* <h2 className='font-medium text-lg mb-[5px] ' >Quantity:{product?.itemQuantityType}</h2> */}
          <div className="flex flex-col items-baseline gap-3">
            <div className="flex gap-3 items-center ">
              <div className="p-2 border flex gap-5 px-3 items-center rounded-2xl ">
                <button
                  className="hover:scale-150 transition-all ease-in-out "
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={Number(product?.itemQuantityType) <= quantity }
                >
                  <img src="/plus.png" alt="plus" width={19} height={19} />
                </button>
                <h2>{quantity}</h2>
                <button
                  className="hover:scale-150 transition-all ease-in-out "
                  disabled={quantity == 1}
                  onClick={() => setQuantity(quantity - 1)}
                >
                  <img src="/minus.png" alt="plus" width={19} height={19} />
                </button>
              </div>
              <h2 className="text-sm font-bold">
                = {(quantity * productTotalprice).toLocaleString()} تومان
              </h2>
            </div>
            {loading ? (
              <Button
                lang="fa"
                dir="rtl"
                className="flex gap-3 self-start "
                onClick={() => addToCart()}
              >
                <div className=" scale-50" >
                <OrbitProgress variant="spokes" dense color="#32cd32" size="small" text="" textColor="#0c0b0a" />
                </div>
                
              </Button>
            ) : (
                <Button
                lang="fa"
                dir="rtl"
                className="flex gap-3 self-start  "
                onClick={() => addToCart()}
                disabled={!Number(product?.itemQuantityType)}
              >
                <ShoppingBasket />
                افزودن به سبد
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductItemDetail;
