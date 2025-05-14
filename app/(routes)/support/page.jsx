import React from "react";

function Page() {
  return (
    <div dir="rtl" className="mt-10 px-4 md:px-10">
      <h2 className="font-bold text-green-600 text-2xl text-right"></h2>
      <div className="bg-white p-4 md:p-6 flex flex-col gap-4 border rounded-2xl shadow-md">
        <h2 className="text-xl text-center text-emerald-700 font-semibold">
          پشتیبانی آنلاین
        </h2>

        <p className="text-justify leading-relaxed">
          در صورت بروز هرگونه مشکل در فرآیند ثبت سفارش، پرداخت آنلاین ،فراموشی
          رمز عبور یا استفاده از خدمات وب‌سایت، می‌توانید از طریق پشتیبانی
          آنلاین ما اقدام نمایید. همچنین از طریق تلگرام نیز در دسترس هستیم تا در
          سریع‌ترین زمان ممکن به سوالات و مشکلات شما رسیدگی کنیم. کارشناسان ما
          آماده‌اند تا در تمام مراحل خرید همراه شما باشند و بهترین خدمات را
          ارائه دهند.
        </p>

        <hr className="border-gray-300" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">
            پشتیبانی از طریق تماس تلفنی:
          </h2>
          <div className="flex items-center gap-2">
            <span dir="ltr" className="text-base font-bold">
              +989924999095
            </span>
            <img className="w-8 h-8" src="telephone-call.png" alt="تماس" />
          </div>
        </div>

        <hr className="border-gray-300" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">پشتیبانی از طریق تلگرام:</h2>
          <div className="flex items-center gap-2">
            <a
              href="https://t.me/sgrm21"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 font-bold"
              dir="ltr"
            >
              @sgrm21
            </a>
            <a
              href="https://t.me/sgrm21"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="w-8 h-8 cursor-pointer"
                src="telegram2.png"
                alt="تلگرام"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
