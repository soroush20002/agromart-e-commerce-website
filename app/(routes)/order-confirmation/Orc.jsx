"use client"
import { sendTelegramMessage } from '@/app/_utils/GlobalApi'
import { Button, ConfigProvider } from 'antd'
import { Link } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'


function page() {
  const router= useRouter()
  const order=()=>{
    router.push('/my-order')
    sendTelegramMessage(`user => order-page`)
  }
  return (
    <div className='flex font-bold justify-center items-center mt-15 ' >
        <div className=' border-1 flex flex-col justify-center items-center gap-7 p-10  shadow-lg rounded-3xl ' >
        <img src="successful.png" alt="s" width={150} height={150} />
        
        <h2 className="font-bold text-2xl ">سفارش با موفقیت ثبت شد </h2>

            <ConfigProvider
              direction="rtl"
              theme={{
                token: {
                  fontFamily: "Vazirmatn, sans-serif",
                  colorPrimary: "#3f6600",
                },
              }}
            >
              {" "}
              <Button onClick={order} block size="large" style={{ fontSize: "18px" }} color="lime-10" variant="solid">
                پیگیری سفارش
              </Button>
            </ConfigProvider>

        </div>

          
    </div>
  )
}

export default page