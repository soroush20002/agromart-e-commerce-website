"use client";

import { sendTelegramMessage } from "@/app/_utils/GlobalApi";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { StarOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Upload } from "antd";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { BlinkBlur } from "react-loading-indicators";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [jwt, setJwt] = useState("");
  const [user, setUser] = useState("");
  const [userChat, setUserChat] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [mediaId, setMediaId] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [uniqueUserMessages, setUniqueUserMessages] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState("");
  const chatContainerRef = useRef(null);
  const [usersData, setUsersData] = useState([]);
  const [userUi, setUserUi] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const storedJwt = localStorage.getItem("jwt");
      setUser(storedUser);
      setJwt(storedJwt);
      if(!storedJwt){
        router.push('/create-account')
      }
      if (window.innerWidth < 768) {
        window.scrollTo({
          top: 200,
          behavior: "smooth",
        });
      }
      if (window.innerWidth > 768) {
        window.scrollTo({
          top: 50,
          behavior: "smooth",
        });
      }
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
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/Sup-responses`,
          {
            data: {
              rText: newMessage,
              ui: userUi,
              image: mediaId,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        getUserResponse();
        sendTelegramMessage(`User ${user.id} : ${newMessage}`);
        setNewMessage("");
        setFileList([]);
        setMediaId([]);
      } catch (error) {
        toast("مشکلی در ارسال پیام پیش آمده!");
      } finally {
        setIsSending(false);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const jwtToken = localStorage.getItem("jwt");
      if (!jwtToken) {
        router.push("/create-account");
        toast("ابتدا وارد حساب کاربری خود شوید");
      }
    }
  }, []);

  useEffect(() => {
    getUserChat();
  }, [newMessage]);

  const getUserChat = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/sups?filters[ui][$eq]=${userUi}&pagination[limit]=1000&populate=image`
      );
      setUserChat(response.data);
    } catch (error) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        toast("مشکلی پیش آمده!");
      }
    }
  };

  const getUserResponse = async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/Sup-responses?filters[ui][$eq]=${userUi}&pagination[limit]=1000&populate=*`
      );
      setUserResponse(response.data);
      setLoading(false);
    } catch (error) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        toast("مشکلی پیش آمده!");
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!userUi) return;

    const interval = setInterval(() => {
      getUserResponse();
    }, 60000);

    return () => clearInterval(interval);
  }, [userUi]);

  const uploadProps = {
    name: "files",
    action: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/upload`,
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    fileList,
    onChange({ file, fileList: newFileList }) {
      setFileList(newFileList);
      if (file.status === "done" && file.response) {
        const uploadedFile = file.response[0];
        setMediaId((prev) => [...prev, uploadedFile.id]);
      }
      if (file.status === "error") {
        toast("مشکلی در اپلود فایل پیش امده ❗");
      }
    },
    defaultFileList: [],
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));

      if (file.response && file.response[0]?.id) {
        setMediaId((prev) => prev.filter((id) => id !== file.response[0].id));
      }
      return true;
    },
    showUploadList: {
      extra: ({ size = 0 }) => (
        <span style={{ color: "#cccccc" }}>
          ({(size / 1024 / 1024).toFixed(2)}MB)
        </span>
      ),
      showDownloadIcon: true,
      downloadIcon: "Download",
      showRemoveIcon: true,
      removeIcon: (
        <Trash2Icon
          onClick={(e) => console.log(e, "custom removeIcon event")}
        />
      ),
    },
  };

  const getUserChatList = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/sups?populate=users_permissions_users&pagination[limit]=1000`
      );
      const data = res.data.data;
      setUsersData(data);
      const uniqueUsernames = Array.from(
        new Set(
          data
            .map((item) => item.users_permissions_users?.[0]?.username)
            .filter(Boolean)
        )
      );
      setUniqueUserMessages(uniqueUsernames);
      return uniqueUsernames;
    } catch (error) {
      toast("مشکلی پیش امده ❗");
      return [];
    }
  };

  useEffect(() => {
    getUserChatList();
  }, []);

  useEffect(() => {
    if (!selectedUsername) return;
    const userMatch = usersData.find(
      (item) => item.users_permissions_users?.[0]?.username === selectedUsername
    );
    if (userMatch) {
      const matchedUi = userMatch.ui;
      setUserUi(matchedUi);
      console.log(matchedUi);
    } else {
      toast("مشکلی پیش امده ❗");
    }
  }, [selectedUsername]);

  useEffect(() => {
    if (userUi) {
      getUserChat();
      getUserResponse();
    }
  }, [userUi]);

  const Update = () => {
    getUserChat();
    getUserResponse();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-2 py-8 md:pb-0  md:translate-y-[0px] lg:translate-y-[-15px] translate-y-[-30px] ">
      <div className="lg:order-2 lg:w-full">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div onClick={Update} className="bg-green-600 p-4">
            <h1 className="text-white text-lg md:text-xl font-semibold text-center">
              {selectedUsername}
            </h1>
          </div>

          <div
            className="h-[550px] bg-green-50 md:h-[300px] lg:h-[300px] overflow-y-auto p-4 space-y-4"
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
                    message.rText ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 text-sm md:text-base ${
                      message.rText
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.rText || message.uText}

                    {message.image && message.image.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.image.map((img, idx) => (
                          <Image
                            key={idx}
                            width={100}
                            height={100}
                            src={
                              `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${img?.url}` ||
                              img
                            }
                            alt={`image-${idx}`}
                            className="max-w-[100px] max-h-[100px] object-cover rounded-md"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t animate-[slideInUp_0.5s_ease-in-out]"
          >
            <div className="flex flex-col gap-3 md:gap-2 items-stretch">
              <ConfigProvider
                direction="ltr"
                theme={{
                  token: {
                    fontFamily: "Vazirmatn, sans-serif",
                    colorPrimary: "#3f6600",
                    color: "lime-10",
                  },
                }}
              >
                <div className="mb-0 overflow-hidden  ">
                  <Upload {...uploadProps}>
                    <Button
                      style={{
                        backgroundColor: "#16a34a",
                        color: "white",
                        borderRadius: "0.5rem",
                        padding: "0.5rem 1rem",
                        height: "100%",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        minWidth: "120px",
                      }}
                      icon={<UploadOutlined />}
                    >
                      آپلود فایل
                    </Button>
                  </Upload>
                </div>
              </ConfigProvider>

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
      <div
        dir="ltr"
        className="lg:order-1 lg:w-full bg-white rounded-lg shadow-lg p-6"
      >
        {uniqueUserMessages.map((entry, index) => (
          <div
            key={index}
            onClick={() => setSelectedUsername(entry)}
            className="p-2 shadow-xl flex flex-row gap-2 cursor-pointer mb-1 transition-colors duration-200 ease-in-out bg-green-100 hover:bg-green-900 rounded-2xl border-b"
          >
            <Image width={25} height={25} src="/user.png" alt="" /> {entry}{" "}
            <span className="text-gray-600"></span>
          </div>
        ))}
      </div>
      {loading ? (
        <div className="  flex-col font-extrabold fixed inset-0 flex items-center justify-center bg-black/60 scale-100 backdrop-blur-md z-50">
          <BlinkBlur color="#32cd32" text="" textColor="" />
        </div>
      ) : null}
    </div>
  );
}
