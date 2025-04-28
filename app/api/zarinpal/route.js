// app/api/zarinpal/route.js

import { createZarinpalRequest } from "@/app/_utils/GlobalApi";

export async function POST(req) {
  try {
    const body = await req.json();

    const result = await createZarinpalRequest({
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      ...body,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API?ROUTE ERROR', error);
    return new Response(JSON.stringify({ error: 'API?ROUTE ERROR' }), {
      status: 500,
    });
  }
}
