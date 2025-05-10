"use client";
import GlobalApi from "@/app/_utils/GlobalApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Collapse, ConfigProvider } from "antd";
import moment from "moment-jalaali";
import LoadingOverlay from "@/app/_components/LoadingOverlay";

function Page() {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [orderList, setOrderList] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const storedJwt = sessionStorage.getItem("jwt");
    setUser(storedUser);
    setJwt(storedJwt);
  }, []);

  useEffect(() => {
    if (!user || !jwt) return;
    getMyOrder();
  }, [user, jwt]);

  const getMyOrder = async () => {
    setLoading(true)
    try {
      const orderList_ = await GlobalApi.getMyOrders(user.id, jwt);
      console.log(orderList_);
      setOrderList(orderList_);
    } catch (err) {
      console.error("Failed to get orders:", err);
    }finally{
      setLoading(false)
    }
  };

  return (
    <div dir="rtl">
      <h2 className="p-3 bg-green-800 text-xl font-bold text-center text-white">
        سفارش ها
      </h2>
      {!orderList?.length ? (
        <div className="flex flex-col items-center justify-center mt-13 ">
          <img src="/shopping.png" alt="" width={200} height={200} />
          <h2>تا کنون سفارشی ثبت نکرده اید!</h2>
        </div>
      ) : (

        <div className=" mt-10 mx-7 md:mx-20 shadow-xl rounded-[10px] bg-gray-100">
          <ConfigProvider
            direction="rtl"
            theme={{
              token: {
                fontFamily: "Vazirmatn, sans-serif",
                colorPrimary: "#3f6600",
              },
            }}
          >
            <Collapse
              accordion
              items={orderList.map((order) => ({
                key: order.id,
                label: `سفارش ${order?.paymentId}`,
                children: (
                  <div>
                    <p>
                      مبلغ کل: {order?.totalOrderAmount?.toLocaleString()} تومان
                    </p>
                    <p>
                      تاریخ ثبت سفارش:{" "}
                      {moment(order.createdAt).format("jYYYY/jMM/jDD HH:mm")}{" "}
                    </p>
                    {order.address == "" ? null : <p>آدرس: {order?.address}</p>}
                    <p>کد پستی: {order?.zip}</p>
                    <p>به نام: {order?.username}</p>
                    <p>شماره تماس: {order?.phone}</p>

                    <ul className="mr-0">
                      <div className="h-[1px] bg-gray-300 my-4" />
                      {order.orderItemList.map((item, index) => (
                        <li key={item.id} className="mb-4">
                          <div className="flex gap-3 items-center">
                            <img
                              src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${item?.image}`}
                              alt="icon"
                              width="100"
                              height="100"
                              className="border p-0 rounded-2xl shadow-2xl mt-2"
                            />
                            <div>
                              <p>{item?.product?.namefa}</p>
                              <p>تعداد: {item?.quantity}</p>
                              <p>
                                قیمت: {item?.product?.mrp.toLocaleString()} تومان
                              </p>
                            </div>
                          </div>

                          {index < order.orderItemList.length - 1 && (
                            <div className="h-[1px] bg-gray-300 my-4" />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              }))}
            />
          </ConfigProvider>
        </div>
      )}
      <LoadingOverlay loading={loading} />
    </div>
  );
}

export default Page;
