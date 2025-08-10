export async function GET() {
  const res = await fetch(
    "https://agri.liara.run/api/orders?filters[paymentId][$null]=true",
    {
      method: "GET",
      headers: {
        Authorization:
          `Bearer ${process.env.VERIFYTOKEN}`,
      },
    }
  );

  const json = await res.json();
  const orders = json.data;

  for (const order of orders) {
    const authority = order.authority;
    const amount = order.totalOrderAmount;
    const orderId = order.documentId;

    try {
      const verifyRes = await fetch(
        "https://api.zarinpal.com/pg/v4/payment/verify.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            merchant_id: process.env.ZARINPAL_MERCHANT_ID,
            amount: amount,
            authority,
          }),
        }
      );

      const result = await verifyRes.json();
      console.log(result)

      if (result?.data?.code === 100 || result?.data?.code === 101) {
        const ref_id = result.data.ref_id;

        await fetch(`https://agri.liara.run/api/orders/${orderId}`, {
          method: "PUT",
          headers: {
            Authorization:
              `Bearer ${process.env.VERIFYTOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              paymentId: `${ref_id} (در حال پردازش) `,
            },
          }),
        });
      } else if (
        result?.errors?.code === -51 &&
        result?.errors?.message?.includes("session is not active")
      ) {
        
        await fetch(`https://agri.liara.run/api/orders/${orderId}`, {
          method: "PUT",
          headers: {
            Authorization:
              `Bearer ${process.env.VERIFYTOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              paymentId: "پرداخت نشده", 
            },
          }),
        });
      }
    } catch (error) {
      console.error(`Error verifying order ${orderId}`, error);
    }
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
