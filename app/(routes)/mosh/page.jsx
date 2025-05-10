"use client";

import { sendTelegramMessage } from "@/app/_utils/GlobalApi";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [jwt, setJwt] = useState("");
  const [user, setUser] = useState("");
  const [userChat, setUserChat] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const chatContainerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      const storedJwt = sessionStorage.getItem("jwt");
      setUser(storedUser);
      setJwt(storedJwt);
    }
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current && shouldAutoScroll) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [userChat, userResponse]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setShouldAutoScroll(isAtBottom);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setIsSending(true);
      setMessages([
        ...messages,
        { id: messages.length + 1, text: newMessage, sender: "user" },
      ]);
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/sups`, {
          data: {
            uText: newMessage,
            users_permissions_users: user.id,
            ui: user.id,
          },
        });
        getUserChat();
        sendTelegramMessage(`User ${user.id} : ${newMessage}`);
        setNewMessage("");
      } catch (error) {
        toast("مشکلی در ارسال پیام پیش آمده!");
      } finally {
        setIsSending(false);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const jwtToken = sessionStorage.getItem("jwt");
      if (!jwtToken) {
        router.push("/sign-in");
        toast('ابتدا وارد حساب کاربری خود شوید')
      }
    }
  }, []);

  useEffect(() => {
    getUserChat();
    console.log(userChat);
  }, [newMessage]);

  const getUserChat = async () => {
    try {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/sups?filters[ui][$eq]=${storedUser.id}&pagination[limit]=1000`
      );
      setUserChat(response.data);
    } catch (error) {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        toast("مشکلی پیش آمده!");
      }
    }
  };

  const getUserResponse = async () => {
    try {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/Sup-responses?filters[ui][$eq]=${storedUser.id}&pagination[limit]=1000`
      );
      setUserResponse(response.data);
    } catch (error) {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        toast("مشکلی پیش آمده!");
      }
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      getUserResponse();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-2 py-8 md:pb-0  md:translate-y-[0px] lg:translate-y-[-15px] translate-y-[-30px] ">
      <div className="lg:order-2 lg:w-full">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-green-600 p-4">
            <h1 className="text-white text-lg md:text-xl font-semibold text-center">
              مشاوره رایگان{" "}
            </h1>
          </div>

          <div
            className="h-[550px] md:h-[300px] lg:h-[400px] overflow-y-auto p-4 space-y-4"
            ref={chatContainerRef}
            onScroll={handleScroll}
            dir="rtl"
          >
            {[...(userResponse?.data || []), ...(userChat?.data || [])]
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((message, index) => (
                <div
                  key={`${message.id}-${index}`}
                  className={`flex ${
                    message.rText ? "justify-end" : "justify-start" 
                  }`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 text-sm md:text-base ${
                      message.rText
                        ? "bg-gray-200 text-gray-800"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {message.rText || message.uText}
                  </div>
                </div>
              ))}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t animate-[slideInUp_0.5s_ease-in-out]"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="پیام خود را بنویسید..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 hover:shadow-md text-sm md:text-base"
                dir="rtl"
              />
              <button
                type="submit"
                disabled={isSending}
                className={`bg-green-600 text-white px-4 md:px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center min-w-[70px] md:min-w-[80px] text-sm md:text-base ${
                  isSending
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-green-700 hover:scale-105 active:scale-95"
                }`}
              >
                {isSending ? (
                  <div className="w-4 md:w-5 h-4 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "ارسال"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div dir="rtl" className="lg:order-1 lg:w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <img src="/customer-service.png" alt="مشاوره" className="w-5 h-5" />
          <h2 className="font-semibold">مشاوره رایگان کشاورزی آنلاین</h2>
        </div>
        <p className="mb-4 text-gray-700 leading-relaxed">
          گاهی ممکن است به متخصصین امور کشاورزی دسترسی نداشته باشید و یا مثلاً
          سوال یا مشکل شما نیاز به پاسخ سریع به سوالات کشاورزی داشته باشد. در
          این شرایط نیاز به پرسش و پاسخ آنلاین کشاورزی دارید. پرسش و پاسخ آنلاین
          کشاورزی می‌تواند مشاوره آنلاین باغبانی، مشاوره کشاورزی رایگان، مشاوره
          تخصصی کشاورزی و ... را در بر بگیرد.
        </p>
        <p className="mb-6 text-gray-700 leading-relaxed">
          سامانه مشاوره آنلاین کشاورزی غفوری، با هدف پشتیبانی تخصصی در زمینه‌های مختلف
          کشاورزی از جمله انتخاب بذر، روش‌های کاشت، مدیریت آبیاری، تغذیه گیاهی و
          کنترل آفات راه‌اندازی شده است. کاربران می‌توانند سوالات خود را در هر
          زمینه‌ای ثبت کرده و از تجربه کارشناسان بهره‌مند شوند.
        </p>
        <div className="flex items-center gap-2 mb-4">
          <img src="/customer-service.png" alt="زمان پاسخ‌گویی" className="w-5 h-5" />
          <h2 className="font-semibold">مدت زمان پاسخ‌گویی</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          پس از ثبت پیام، درخواست‌ها توسط تیم مشاوره بررسی شده و پاسخ اولیه
          معمولاً بین ۱۰ دقیقه تا حداکثر ۱ ساعت ارسال می‌شود. این زمان بسته به
          تعداد پیام‌های دریافتی متغیر است، اما کلیه پرسش‌ها با دقت و در
          سریع‌ترین زمان ممکن پیگیری خواهند شد.
        </p>
      </div>
    </div>
  );
}
