// app/api/zarinpal/verify/route.js

export async function POST(req) {
    const { authority, amount } = await req.json();
  
    const res = await fetch("https://sandbox.zarinpal.com/pg/v4/payment/verify.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        authority,
        amount,
      }),
    });
  
    const result = await res.json();
  
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  