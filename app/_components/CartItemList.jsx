import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";

function CartItemList({ cartItemList, onDeleteItem, loading2 }) {
  
  const [loadingItemIds, setLoadingItemIds] = useState([]);



  const handleDeleteItem = (documentId) => {
    setLoadingItemIds((prev) => [...prev, documentId]);
    onDeleteItem(documentId);
  };

  return (
    <div className="h-screen">
      <div className=" sm:h-[calc(100%-160px)] md:h-[calc(100%-160px)] h-[calc(100%-160px)]   ">
        {cartItemList.map((cart, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-2 mb-7"
          >
            <div className="flex gap-6 items-center ">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${cart?.image}`}
                alt={cart.name}
                width="70"
                height="70"
                className="border p-2"
              />
              <div>
                <h2 className="font-bold">{cart.name}</h2>
                <h2>مقدار:{cart.quantity}</h2>
                <h2 className="text-lg font-bold">قیمت:{cart?.amount.toLocaleString()} تومان </h2>
              </div>
            </div>
            {loadingItemIds.includes(cart.documentId)  ? (
              <div className=" scale-60 translate-x-[-35px] translate-y-[13px] ">
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
              <Image src="/delete.png"  width='28' height='28' alt='delete'
              className=" translate-x-[-20px] translate-y-[13px] cursor-pointer "
              onClick={() => handleDeleteItem(cart?.documentId)} />

            )}
          </div>
        ))}
      </div>

    </div>
  );
}

export default CartItemList;
