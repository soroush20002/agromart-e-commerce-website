import React from 'react'

function Footer() {
  return (
    <footer lang='fa' dir='rtl' className=" mt-[80px] bg-white lg:grid lg:grid-cols-5">
  <div className="relative block h-32 lg:col-span-2 lg:h-full">
    <img
      src="/map.png"
      alt=""
      className="absolute inset-0 h-full w-full object-cover rounded-e-3xl "
    />
  </div>

  <div className=" flex items-center px-4 py-2 sm:px-6 lg:col-span-3 lg:px-8">
    <div className="">
      <div>
        <div className="">
            <img src="/logo.png" className="" />
        </div>
        <p >
          <span className=" font-bold text-xs tracking-wide text-gray-500 uppercase"> تماس با ما</span>

          <a href="#" className="block text-2xl font-medium text-gray-900 hover:opacity-75 sm:text-3xl">
            01344364322
          </a>
        </p>
        <ul className=" font-bold mt-5 space-y-6 text-sm text-gray-700">
            <li>داروخانه و فروشگاه خدمات کشاورزی غفوری با بیش از ۱۰ سال سابقه فعالیت در زمینه تأمین و توزیع انواع کود، بذر، ادوات و سموم کشاورزی، آماده خدمت‌رسانی به کشاورزان و همکاران گرامی می‌باشد. این مجموعه با بهره‌گیری از تجربه و دانش فنی، تلاش می‌کند تا بهترین محصولات و خدمات را با کیفیت بالا و قیمت مناسب ارائه دهد.

ما اینجاییم تا با ارائه مشاوره تخصصی و تأمین نهاده‌های کشاورزی، شما را در مسیر داشتن محصولاتی سالم و پر بازده همراهی کنیم.</li>
          <li className='mt-2'>ادرس فروشگاه: گیلان-صومعه صرا-تولم شهر-جنب پل-خدمات کشاورزی غفوری</li>
          <li className='mt-2'>ساعات کار فروشگاه:شنبه تا پنج شنبه ساعات 8 تا 1 و 4 تا 8</li>
        </ul>
      </div>
    </div>
  </div>
</footer>
  )
}

export default Footer