import { sendTelegramMessage } from "@/app/_utils/GlobalApi";
import cache from "@/lib/cache";

export async function POST(req) {
  const body = await req.json();
  const { phone, code } = body;

  const savedOtp = cache.get(`otp:${phone}`);

  if (!savedOtp) {
    return new Response(JSON.stringify({ error: "OTP not found " }), {
      status: 400,
    });
  }

  if (savedOtp !== code) {
    return new Response(JSON.stringify({ error: "Wrong OTP" }), {
      status: 401,
    });
  }


  cache.del(`otp:${phone}`);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
  });
}
