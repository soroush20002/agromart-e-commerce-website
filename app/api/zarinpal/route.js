import GlobalApi, { createZarinpalRequest } from "@/app/_utils/GlobalApi";
 
export async function POST(req) {
  try {
    const body = await req.json();

    const CartItems = await GlobalApi.getCartItems(body.userID, body.jwt)
    let total = 0;
    let totalw = 0;
    
    CartItems.forEach((element) => {
      total += Number(element.amount);
      totalw += Number(element.weight);
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_POST_URL}/api/package/GetPriceSadraIR?CityCode=${body.selectedCityCode}&StateCode=${body.province}&Weight=${totalw}&Price=${body.subTotal}&InCash=1`)
    const tax = await res.json()

    const finallamount = (total * 10) + tax.deliveryCost

    if (body.amount == finallamount) {

    } else {
      return new Response(
        JSON.stringify({ status: 51, message: "Validation Error" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await createZarinpalRequest({
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount:body.amount,
      callback_url:body.callback_url,
      description:body.description
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('APIROUTE ERROR', error);
    return new Response(JSON.stringify({ error: 'API?ROUTE ERROR' }), {
      status: 500,
    });
  }
}
