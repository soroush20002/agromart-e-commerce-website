import cache from "@/lib/cache";
import { sendTelegramMessage } from "@/app/_utils/GlobalApi";

export async function POST(req) {
  const body = await req.json();
  const { phone } = body; 

  if (!phone) {
    return new Response(JSON.stringify({ error: "Phone number" }), {
      status: 400,
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();


  cache.set(`otp:${phone}`, otp, 300); 


  console.log(`OTP for ${phone} : ${otp}`)

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
