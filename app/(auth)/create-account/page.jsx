"use client";
import LoadingOverlay from "@/app/_components/LoadingOverlay";
import GlobalApi, { sendTelegramMessage } from "@/app/_utils/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { lazy, useEffect, useState } from "react";
import { toast } from "sonner";

function CreateAccount() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onCreateAcconut = async () => {
    setLoading(true);
    sendTelegramMessage("user => otp")
    if (/^(09\d{9}|98\d{10})$/.test(email)) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_OTP_BASE_URL}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: email }),
        });
        const data = await res.json();
        if (data.ok) {
          toast("کد با موفقیت ارسال شد ✅");
          router.push('/sign-in')
          sessionStorage.setItem("phone", email);
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
  };


  useEffect(() => {
    const jwt = sessionStorage.getItem("jwt");
    if (jwt) {
      router.push("/");
    }
  }, []);

  return (
    <div
      lang="fa"
      dir="rtl"
      className="flex items-center justify-center mt-5 px-2"
    >
      <div className="w-[400px] h-[350px] relative">
       
        <div className="absolute w-[85px] h-[85px] flex items-center justify-center border-2 border-green-500 rounded-full bg-white z-10 left-1/2 -translate-x-1/2 shadow-lg">
          <i className="fa fa-user-plus text-[50px] text-green-500"></i>
        </div>

       
        <div className="absolute bottom-0 w-full h-[310px] bg-white border-2 border-green-200 rounded-[30px] p-[25px] flex flex-col shadow-xl">
          <h2 className="text-green-600 text-xl font-bold mt-[40px] mb-[5px] text-center">ورود</h2>
          <h2 className="text-gray-600 font-bold mt-[0px] mb-[40px] text-center">برای ورود شماره موبایل خود را وارد کنید</h2>
          
          <div className="relative w-full">
            <Input
              dir="rtl"
              placeholder="شماره همراه"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-none border-b-2 border-green-200 text-gray-700 text-base px-2 py-[10px] focus:outline-none focus:border-green-500 placeholder:text-gray-400"
            />
            <i className="fa fa-phone absolute left-2 bottom-[10px] text-green-500 text-sm"></i>
          </div>

          {/* <div className="relative w-full mt-[25px]">
            <Input
              dir="rtl"
              type="password"
              placeholder="  رمز عبور"
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => document.querySelector('.password-icon').style.display = 'none'}
              onBlur={() => document.querySelector('.password-icon').style.display = 'block'}
              className="w-full bg-transparent border-none border-b-2 border-green-200 text-gray-700 text-base px-2 py-[10px] focus:outline-none focus:border-green-500 placeholder:text-gray-400"
            />
            <i className="fa fa-lock absolute left-2 bottom-[10px] text-green-500 text-sm password-icon"></i>
          </div> */}

          <div className="mt-[25px]">
            <Button 
              onClick={() => onCreateAcconut()}
              disabled={!(email)}
              className="w-full py-[5px] px-[20px] bg-green-500 text-white font-semibold text-base rounded-[15px] hover:bg-green-600 transition-all duration-300"
            >
              ارسال کد تایید
            </Button>
          </div>

          {/* <p className="text-center mt-[20px] text-gray-600">
            قبلا ثبت نام کرده‌اید؟
            <Link
              onClick={t}
              href={"/sign-in"}
              className="text-green-600 mr-1 hover:text-green-700 transition-colors duration-300"
            >
              ورود به حساب کاربری
            </Link>
          </p> */}
        </div>
      </div>

      <LoadingOverlay loading={loading} />

      <style jsx global>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
      `}</style>
    </div>
  );
}

export default CreateAccount;
