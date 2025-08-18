import cache from "@/lib/cache";

export async function POST(req) {
  const body = await req.json();
  const { phone } = body;
  
  const VOTP = cache.get(`otp:${phone}`)

  if(VOTP){
    return new Response(JSON.stringify({ error: "120s" }), {
      status: 429,
    });
  }

  if (!phone) {
    return new Response(JSON.stringify({ error: "Phone number" }), {
      status: 400,
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();


  cache.set(`otp:${phone}`, otp, 120);


  const normalizedPhone = phone.startsWith("+98")
    ? phone
    : phone.replace(/^0/, "+98");


  try {
    const response = await fetch("https://api2.ippanel.com/api/v1/sms/pattern/normal/send", {
      method: "POST",
      headers: {
        "accept": "*/*",
        "apikey": process.env.FARAZ_API_KEY, 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code: "e6gc94j32x7jcal", 
        sender: "3000505",
        recipient: normalizedPhone,
        variable: {
          otp: otp
        }
      })
    });

    const result = await response.json();
    console.log("SMS API response:", result);
  } catch (error) {
    console.error("Error sending OTP:", error);
    return new Response(JSON.stringify({ error: "Failed to send OTP" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
