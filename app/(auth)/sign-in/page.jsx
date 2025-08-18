"use client";
import LoadingOverlay from "@/app/_components/LoadingOverlay";
import GlobalApi, { sendTelegramMessage } from "@/app/_utils/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Statistic } from "antd";
function SignIn() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState([]);
  const { Timer } = Statistic;
  const [deadlineTime, setDeadlineTime] = useState(1000 * 60 * 2);
  const [active, setActive] = useState(false);
  const [deadline, setDeadline] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    const phone = localStorage.getItem("phone");
    if (jwt) {
      router.push("/");
    } else {
      setPhone(phone);
    }
  }, []);

  const onSignIn = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_VERIFY_OTP_BASE_URL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone: phone, code: password }),
        }
      );
      if (response.status == 200) {
        GlobalApi.registerUser(phone, password, username).then(
          (resp) => {
            localStorage.setItem("user", JSON.stringify(resp.data.user));
            localStorage.setItem("jwt", resp.data.jwt);
            toast("حساب شما با موفقیت ایجاد شد✅");
            const Slug = sessionStorage.getItem("Slug");
            const m = sessionStorage.getItem("m");
            if (Slug) {
              window.location.href = `/products-search/${Slug}`;
            } else if (m) {
              window.location.href = `/${m}`;
            } else {
              window.location.href = "/";
            }
            setLoading(false);
          },
          (e) => {
            GlobalApi.signIn(phone, password).then(
              (resp) => {
                localStorage.setItem("user", JSON.stringify(resp.data.user));
                localStorage.setItem("jwt", resp.data.jwt);
                toast("ورود با موفقیت انجام شد✅");
                const Slug = sessionStorage.getItem("Slug");
                const m = sessionStorage.getItem("m");
                if (Slug) {
                  window.location.href = `/products-search/${Slug}`;
                } else if (m) {
                  window.location.href = `/${m}`;
                } else {
                  window.location.href = "/";
                }
                setLoading(false);
              },
              (e) => {
                console.log(e);
                toast("مشکلی پیش امده ❗");
                setLoading(false);
              }
            );
          }
        );
      } else if (response.status == 401) {
        toast("کد تایید اشتباه است ❌");
        setLoading(false);
      } else {
        toast("کد تایید اشتباه است ❌");
        setLoading(false);
      }
    } catch (error) {
      toast("مشکلی پیش امده ❗");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const t = () => {
    sendTelegramMessage(`user => phone`);
  };

  const v = async () => {
    if (!active) {
      toast("هر دو دقیقه یک بار میتوانید کد ارسال کنید ❗");
    } else {
      setLoading(true);
      if (/^(09\d{9}|98\d{10})$/.test(phone)) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_OTP_BASE_URL}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ phone: phone }),
          });
          const data = await res.json();
          if (data.ok) {
            toast("کد با موفقیت ارسال شد ✅");
            setDeadlineTime(1000 * 60 * 2);
            setActive(false);
            localStorage.setItem("phone", email);
          } else {
            toast("ارسال کد با خطا مواجه شد ❗");
          }
        } catch (err) {
          console.error(err);
          toast("مشکلی پیش آمد ❗");
        } finally {
          setLoading(false);
        }
      } else {
        toast("شماره موبایل نادرست است ❌");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setActive(false);
  }, []);
  useEffect(() => {
    if (deadlineTime > 0) {
      setDeadline(Date.now() + deadlineTime);
    }
  }, [deadlineTime]);
  const onFinish = () => {
    setActive(true);
    setDeadlineTime(0);
  };

  return (
    <div
      lang="fa"
      dir="rtl"
      className="flex items-center justify-center mt-5 px-2 "
    >
      <div className="w-[400px] h-[380px] relative">
        <div className="absolute w-[85px] h-[85px] flex items-center justify-center border-2 border-green-500 rounded-full bg-white z-10 left-1/2 -translate-x-1/2 shadow-lg">
          <i className="fa fa-user text-[50px] text-green-500"></i>
        </div>
        <div className="absolute bottom-0 w-full h-[340px] bg-white border-2 border-green-200 rounded-[30px] p-[25px] flex flex-col shadow-xl">
          <h2 className="text-green-600 text-xl font-bold mt-[40px] mb-[5px] text-center">
            کد تایید را وارد کنید
          </h2>
          <h2 className="text-gray-600 font-bold mt-[0px] mb-[15px] text-center">
            کد تایید برای شماره {phone} پیامک شد
          </h2>

          {/* <div className="relative w-full">
            <Input
              dir="rtl"
              placeholder="  نام کاربری"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-none border-b-2 border-green-200 text-gray-700 text-base px-2 py-[10px] focus:outline-none focus:border-green-500 placeholder:text-gray-400"
            />
            <i className="fa fa-user absolute left-2 bottom-[10px] text-green-500 text-sm"></i>
          </div> */}

          <div className="relative w-full mt-[25px]">
            <Input
              dir="rtl"
              type="tel"
              inputMode="numeric"
              placeholder="کد تایید"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (
                  !/[0-9]/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight" &&
                  e.key !== "Tab"
                ) {
                  e.preventDefault();
                }
              }}
              onFocus={(e) =>
                (e.target.nextElementSibling.style.display = "none")
              }
              onBlur={(e) =>
                (e.target.nextElementSibling.style.display = "block")
              }
              className="w-full text-center tracking-[10px] bg-transparent border-none border-b-2 border-green-200 text-gray-700 text-lg px-2 py-[10px] focus:outline-none focus:border-green-500 placeholder:text-gray-400"
            />
            <i className="fa fa-lock absolute left-2 bottom-[10px] text-green-500 text-sm"></i>
          </div>

          {/* <div className="flex justify-between items-center mt-[25px] text-sm">

            <Link href="/support" className="text-green-600 hover:text-green-700">فراموشی رمز عبور؟</Link>
          </div> */}

          <div className="mt-[25px]">
            <Button
              onClick={() => onSignIn()}
              disabled={!password}
              className="w-full py-[5px] px-[20px] bg-green-500 text-white font-semibold text-base rounded-[15px] hover:bg-green-600 transition-all duration-300"
            >
              ورود
            </Button>
          </div>
          <div className="flex justify-between mt-[10px] text-gray-600 text-md">
            <p className="text-right mt-[10px] text-gray-600">
              <Link
                onClick={t}
                href={"/create-account"}
                className="text-green-600 mr-1 hover:text-green-700 transition-colors duration-300"
              >
                ویرایش شماره
              </Link>
            </p>

            {/* <h2 className={ `translate-y-5 -translate-x-1 text-gray-500 ${active ? "hidden" : ""}`} >مانده تا ارسال دوباره کد</h2> */}

            <div className="text-left mt-[10px] text-gray-600">
              <button
                onClick={v}
                className={` mr-1   transition-colors duration-300 ${
                  !active
                    ? "text-gray-500"
                    : "cursor-pointer text-green-600 hover:text-green-700"
                }`}
              >
                ارسال دوباره کد
              </button>
              <Timer
                className={`scale-75 -translate-y-[10px] -translate-x-1 ${
                  active ? "hidden" : ""
                }`}
                type="countdown"
                value={deadline}
                onFinish={onFinish}
              />
            </div>
          </div>
        </div>
      </div>

      <LoadingOverlay loading={loading} />

      <style jsx global>{`
        @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
      `}</style>
    </div>
  );
}

export default SignIn;
