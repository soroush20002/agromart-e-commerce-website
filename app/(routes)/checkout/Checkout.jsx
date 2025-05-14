"use client";
import LoadingOverlay from "@/app/_components/LoadingOverlay";
import GlobalApi, {
  sendTelegramMessage,
  verifyZarinpalPayment,
} from "@/app/_utils/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { Atom, BlinkBlur, OrbitProgress } from "react-loading-indicators";

import { usePathname } from "next/navigation";
import UpdateCartContext from "@/app/_context/UpdateCartContext";
import { toast } from "sonner";
import PaymentRedirectGuard from "@/app/_components/PaymentRedirectGuard";
import { ConfigProvider, Radio } from "antd";

function Checkout() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [totalCartItem, setTotalCartItem] = useState(0);
  const [cartItemList, setCartItemList] = useState([]);
  const { updateCart, setUpdateCart } = useContext(UpdateCartContext);
  const [loading, setLoading] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [ones, setones] = useState(true);
  const [placement, setPlacement] = useState("PP");
  const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      const storedJwt = sessionStorage.getItem("jwt");
      setUser(storedUser);
      setJwt(storedJwt);
    }
  }, []);

  useEffect(() => {
    getCartItems();
  }, [updateCart]);

  useEffect(() => {
    getCartItems();
  }, [pathname]);

  useEffect(() => {
    getCartItems();
  }, [user, jwt]);

  const getCartItems = async () => {
    if (user && jwt && user.id) {
      setLoading3(true);
      try {
        const CartItemsList_ = await GlobalApi.getCartItems(user.id, jwt);
        console.log("CRT3", CartItemsList_);
        setTotalCartItem(CartItemsList_ ? CartItemsList_.length : 0);
        setCartItemList(CartItemsList_);
      } catch (err) {
        console.error("F:", err);
      } finally {
        setLoading3(false);
        setones(false);
      }
    }
  };

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

  useEffect(() => {
    let total = 0;
    cartItemList.forEach((element) => {
      total += element.amount;
    });

    const formattedTotal = parseFloat(total.toFixed(0));
    setSubTotal(formattedTotal);

    if (placement === "PP") {
      setFinalAmount(formattedTotal * 10 + 500000);
    } else {
      setFinalAmount(formattedTotal * 10);
    }
  }, [cartItemList, placement]);

  useEffect(() => {
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");

    if ((status === "OK" || status === "NOK") && authority) {
      setLoading(true);
      const storedFinalAmount = sessionStorage.getItem("finalAmount");
      const storedPlacement = sessionStorage.getItem("placement");

      if (status === "OK" && parseFloat(subTotal) > 0) {
        const timer = setTimeout(() => {
          verifyZarinpalPayment({
            authority,
            amount: parseFloat(storedFinalAmount),
          })
            .then(async (res) => {
              if (res.data.code === 100) {
                console.log("PPPP:", res.data);
                sendTelegramMessage(`user ${user?.username} => 100 `);
                const paymentId = res.data.ref_id;

                const orderInfo = JSON.parse(
                  sessionStorage.getItem("orderInfo")
                );

                if (orderInfo) {
                  const finalPayload = {
                    data: {
                      ...orderInfo,
                      totalOrderAmount: Number(orderInfo.totalOrderAmount),
                      paymentId: String(paymentId + " ( در حال پردازش ) "),
                    },
                  };

                  console.log("FP", finalPayload);
                  sendTelegramMessage(`user ${user?.username} => Ordered`);

                  try {
                    const resp = await GlobalApi.createOrder(
                      finalPayload,
                      jwt
                    ).then((resp) => {
                      cartItemList.forEach((item, index) => {
                        GlobalApi.deleteCartItem(item.documentId, jwt).then(
                          (resp) => {
                            setUpdateCart(!updateCart);
                          }
                        );
                      });
                      router.replace("/order-confirmation");
                    });

                    console.log("OC::", resp);

                    sessionStorage.removeItem("orderInfo");
                    sessionStorage.removeItem("finalAmount");
                    sessionStorage.removeItem("placement");
                  } catch (err) {
                    console.error("Error sending data", err);
                    sessionStorage.removeItem("orderInfo");
                    sessionStorage.removeItem("finalAmount");
                    sessionStorage.removeItem("placement");

                    sendTelegramMessage(
                      `user ${user?.username} => ERROR in payment verify`
                    );
                  }
                } else {
                  console.warn("OS!");
                  sessionStorage.removeItem("orderInfo");
                  sessionStorage.removeItem("finalAmount");
                  sessionStorage.removeItem("placement");
                }
              } else {
                toast(" پرداخت ناموفق❌ ");
                sendTelegramMessage(
                  `user ${user?.username} => ERROR in payment verify`
                );
                sessionStorage.removeItem("orderInfo");
                sessionStorage.removeItem("finalAmount");
                sessionStorage.removeItem("placement");
              }
            })
            .catch((err) => {
              console.error("PERR", err);
              toast("خطا هنگام وریفای پرداخت❌");
              sendTelegramMessage(
                `user ${user?.username} => ERROR in payment verify `
              );
              sessionStorage.removeItem("orderInfo");
              sessionStorage.removeItem("finalAmount");
              sessionStorage.removeItem("placement");
            })
            .finally(() => {
              setLoading(false);
            });
        }, 1000);

        return () => clearTimeout(timer);
      } else if (status === "NOK") {
        toast("پرداخت توسط کاربر لغو شد❌");
        sendTelegramMessage(
          `user ${user?.username} => payment canceled by user `
        );
        sessionStorage.removeItem("orderInfo");
        sessionStorage.removeItem("finalAmount");
        sessionStorage.removeItem("placement");

        setLoading(false);
      }
    }
  }, [subTotal]);

  const handlePayment = async () => {
    const orderItemList = cartItemList.map((item) => ({
      quantity: item.quantity,
      price: item.amount,
      product: item.product,
    }));

    const payload = {
      data: {
        totalOrderAmount: subTotal,
        username: username,
        email: email,
        phone: phone,
        zip: zip,
        address: address,
        orderItemList,
        userId: user.id,
      },
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(payload.data));
    sendTelegramMessage(`user ${user?.username} =>  
totalOrderAmount:${JSON.stringify(payload.data.totalOrderAmount)}
username: ${payload.data.username}
phone: ${payload.data.phone}
zip: ${payload.data.zip}
address: ${payload.data.address}
email: ${payload.data.email}`);

    console.log(
      "🔍 Sending payload to Strapi:",
      JSON.stringify(payload, null, 2)
    );
    setLoading2(true);
    try {
      const res = await fetch("/api/zarinpal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          callback_url: "https://agrm.ir/checkout",
          description: "توضیحات پرداخت",
        }),
      });

      const data = await res.json();

      if (data.data?.code === 100) {
        sendTelegramMessage(
          `user ${user?.username} => transferd to the payment`
        );
        sessionStorage.setItem("finalAmount", finalAmount.toString());
        sessionStorage.setItem("placement", placement);

        window.location.href = `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`;
      } else {
        console.error("PN:", data);
        sendTelegramMessage(`user ${user?.username} => ERROR in transfer`);
      }
    } catch (error) {
      console.error("PN:", error);
      sendTelegramMessage(`user ${user?.username} => ERROR in transfer`);
    } finally {
      setLoading2(false);
    }
  };

  if (ones)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 scale-100 backdrop-blur-md z-50">
        <BlinkBlur color={["#32cd32"]} />
      </div>
    );

  return (
    <div dir="rtl" className="w-full">
      <PaymentRedirectGuard />
      <h2 className="p-3 bg-green-800 text-xl font-bold text-center text-white">
        پرداخت
      </h2>

      {!totalCartItem ? (
        <div className="flex flex-col items-center justify-center mt-13 ">
          <img src="/shopping.png" alt="" width={200} height={200} />
          <h2>سبد خرید شما خالی است!</h2>
        </div>
      ) : (
        <div>
          {" "}
          <div className="p-5 sm:p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
            <div className="lg:col-span-2 lg:px-10">
              <h2 className="font-bold text-2xl sm:text-3xl mb-6 text-center lg:text-right">
                تکمیل اطلاعات برای پرداخت و ارسال
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  placeholder="نام و نام خانوادگی"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  hidden={placement == "hh"}
                  placeholder="ایمیل (اختیاری)"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="شماره تلفن همراه"
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  hidden={placement == "hh"}
                  placeholder="کد پستی"
                  onChange={(e) => setZip(e.target.value)}
                />
                <Input
                  hidden={placement == "PP"}
                  placeholder="کد ملی"
                  onChange={(e) => setZip(e.target.value)}
                />
                <div className="md:col-span-2">
                  <Input
                    hidden={placement == "hh"}
                    placeholder="آدرس"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full mt-4">
                <ConfigProvider
                  direction="rtl"
                  theme={{
                    token: {
                      fontFamily: "Vazirmatn, sans-serif",
                      colorPrimary: "#3f6600",
                      color: "lime-10",
                    },
                  }}
                >
                  {" "}
                  <Radio.Group
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value)}
                    className="w-full flex mt-4"
                    style={{
                      width: "100%",
                      display: "flex",
                      marginTop: "16px",
                    }}
                  >
                    <Radio.Button value="PP" className="flex-1 text-center">
                      ارسال با پست
                    </Radio.Button>
                    <Radio.Button value="hh" className="flex-1 text-center">
                      تحویل حضوری
                    </Radio.Button>
                  </Radio.Group>
                </ConfigProvider>
                <div className="mt-4" hidden={placement == "PP"}>
                  <h2>
                    شما می‌توانید با انتخاب گزینه "تحویل حضوری"، بدون پرداخت
                    هزینه ارسال، با مراجعه به فروشگاه سفارش خود را مستقیماً
                    دریافت نمایید. برای این منظور، کافی‌ست با مراجعه به گیلان،
                    صومعه‌سرا، تولم‌شهر، جنب پل، خدمات کشاورزی غفوری، سفارش خود
                    را تحویل بگیرید.
                  </h2>
                </div>
                <div className="mt-4" hidden={placement == "hh"}>
                  <h2>
                    سفارش شما از طریق پست پیشتاز ارسال می‌شود. پس از ثبت سفارش،
                    وضعیت ارسال و کد رهگیری را می‌توانید در بخش سفارشات من در
                    حساب کاربری‌تان مشاهده کنید.
                  </h2>
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4 sm:p-6 shadow-md h-fit">
              <h2 className="p-3 bg-gray-200 font-bold text-center rounded mb-4">
                جزئیات پرداخت
              </h2>

              <div className="flex flex-col gap-4 text-sm sm:text-base">
                <div className="font-bold flex justify-between">
                  <span>جمع کل :</span>{" "}
                  {!loading3 ? (
                    <span> {subTotal.toLocaleString()} تومان</span>
                  ) : (
                    <div className=" scale-50 ">
                      <OrbitProgress
                        variant="spokes"
                        dense
                        color="#32cd32"
                        size="small"
                        text=""
                        textColor="#0c0b0a"
                      />
                    </div>
                  )}
                </div>
                <hr />
                <div className="flex justify-between">
                  <span>هزینه ارسال :</span>{" "}
                  {!loading3 ? (
                    <span>
                      {" "}
                      {placement == "hh" ? (
                        <h2>0 تومان</h2>
                      ) : (
                        <h2>50,000 تومان</h2>
                      )}{" "}
                    </span>
                  ) : (
                    <div className=" scale-50 ">
                      <OrbitProgress
                        variant="spokes"
                        dense
                        color="#32cd32"
                        size="small"
                        text=""
                        textColor="#0c0b0a"
                      />
                    </div>
                  )}
                </div>
                <hr />
                <div className="font-bold flex justify-between text-lg">
                  <span>مبلغ نهایی :</span>{" "}
                  {!loading3 ? (
                    <span> {(parseFloat(finalAmount)/10).toLocaleString()} تومان</span>
                  ) : (
                    <div className=" scale-50 ">
                      <OrbitProgress
                        variant="spokes"
                        dense
                        color="#32cd32"
                        size="small"
                        text=""
                        textColor="#0c0b0a"
                      />
                    </div>
                  )}
                </div>
                <Button
                  className="mt-4 flex items-center justify-center gap-2 font-bold w-full"
                  onClick={handlePayment}
                  disabled={loading3 || placement == "hh" ? !(phone && username && zip) : !(address && zip && phone && username)}
                >
                  {loading2 ? "در حال انتقال..." : "پرداخت"}
                </Button>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="  flex-col font-extrabold fixed inset-0 flex items-center justify-center bg-black/60 scale-200 backdrop-blur-md z-50">
              <BlinkBlur color="#32cd32" text="" textColor="" />
              <p className=" text-emerald-950  mt-6 translate-x-[-5px] ">
                در حال برسی تراکنش{" "}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default Checkout;
