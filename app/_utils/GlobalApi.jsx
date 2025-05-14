const { default: axios } = require("axios");

const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

// export const sendTelegramMessage = async (message) => {
//   if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
//     console.error('TOKEN!');
//     return;
//   }

//   const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
//   const text = `${message}`;

//   try {
//     const response = await axios.post(url, {
//       chat_id: TELEGRAM_CHAT_ID,
//       text,
//     });

//     if (response.data.ok) {
//       console.log('MS',response.data);
//     } else {
//       console.error('MS!');
//     }
//   } catch (error) {
//     console.error('ERROR', error);
//   }
// };

export const sendTelegramMessage = async (message) => {
  try {
    const response = await fetch('https://agrishop-1vpe.vercel.app/api/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    if (data.success) {
      console.log('MS', data);
    } else {
      console.error('MF', data);
    }
  } catch (error) {
    console.error('MF', error);
  }
};


export async function createZarinpalRequest(body) {
  const { data } = await axios.post(
    "https://api.zarinpal.com/pg/v4/payment/request.json",
    body,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
}

export const verifyZarinpalPayment = async (data) => {
  const res = await axios.post("/api/verify", data);
  return res.data;
};

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api",
});

const getCategory = () => axiosClient.get("/categories?populate=*");
const getSliders = () =>
  axiosClient.get("/sliders?populate=*").then((resp) => {
    return resp.data.data;
  });
const getCategoryList = () =>
  axiosClient.get("/categories?populate=*").then((resp) => {
    return resp.data.data;
  });
const getAllProducts = () =>
  axiosClient.get("/products?populate=*").then((resp) => {
    return resp.data.data;
  });
const getProductsByCategory = (category) =>
  axiosClient
    .get(
      `/products?filters[categories][name][$in]=${encodeURIComponent(
        category
      )}&populate=*`
    )
    .then((resp) => {
      console.log("resp:", resp.data.data);
      return resp.data.data;
    });
const registerUser = (email, password, username) =>
  axiosClient.post("/auth/local/register", {
    email: email + "@gmail.com",
    password: password,
    username: email,
  });
const signIn = (email, password) =>
  axiosClient.post("/auth/local", {
    identifier: email + "@gmail.com",
    password,
  });

const addToCart = (data, jwt) =>
  axiosClient.post("/user-carts", data, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

const getCartItems = (ui, jwt) =>
  axiosClient
    .get(
      `/user-carts?filters[ui][$eq]=${ui}&populate[products][populate]=images&pagination[limit]=100`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
    .then((resp) => {
      const data = resp.data.data;
      const cartItemsList = data.map((item, index) => ({
        name: item.products[0]?.namefa,
        quantity: item.quantity,
        amount: item.amount,
        image: item.products[0]?.images[0]?.url,
        actual: item.products[0]?.mrp,
        id: item.id,
        documentId: item.documentId,
        product: item.products[0]?.documentId,
      }));

      console.log("Cart", cartItemsList);

      return cartItemsList;
    });

const deleteCartItem = (documentId, jwt) =>
  axiosClient.delete(`/user-carts/${documentId}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

const createOrder = (finalPayload, jwt) =>
  axiosClient.post("/orders", finalPayload, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

const getMyOrders = (userId, jwt) =>
  axiosClient
    .get(
      `/orders?filters[userId][$eq]=${userId}&populate[orderItemList][populate][product][populate]=images`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
    .then((resp) => {
      const responce = resp.data.data;
      const orderList = responce.map((item) => ({
        id: item.id,
        totalOrderAmount: item.totalOrderAmount,
        paymentId: item.paymentId,
        orderItemList: item.orderItemList,
        createdAt: item.createdAt,
        address: item.address,
        zip: item.zip,
        username: item.username,
        phone: item.phone,
        orderItemList: item.orderItemList.map((orderItem) => ({
          ...orderItem,
          image: orderItem.product?.images?.[0]?.url || "",
          namefa: orderItem.product?.namefa || "",
        })),
      }));

      return orderList;
    });

const getProductBySlug = (slug) =>
  axiosClient
    .get(`/products?filters[slug][$eq]=${slug}&populate=*`)
    .then((resp) => {
      return resp.data.data.map((item) => ({
        ...item,
        id: item.id,
      }));
    });

export default {
  getCategory,
  getSliders,
  getCategoryList,
  getAllProducts,
  getProductsByCategory,
  registerUser,
  signIn,
  addToCart,
  getCartItems,
  deleteCartItem,
  createZarinpalRequest,
  verifyZarinpalPayment,
  createOrder,
  getMyOrders,
  getProductBySlug
};
