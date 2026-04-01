"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
import { customAxios } from "@/utils/axios-interceptor";
import { User } from "@/app/(pages)/news-feed/type";
import { MdMail } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { HiCircleStack, HiInformationCircle } from "react-icons/hi2";
import { PiChatCircleDotsLight, PiHandWavingDuotone } from "react-icons/pi";
import { format } from "date-fns";
import OnlineIndicator from "@/app/(pages)/chat/_components/OnlineIndicator";
import { BsPhoneFlip } from "react-icons/bs";
import { toast } from "react-hot-toast";
import MessageChat from "@/app/(pages)/chat/_components/message";
import Link from "next/link";

interface ChatInboxProps {
  id: number;
}

const ChatInbox: React.FC<ChatInboxProps> = ({ id }: { id: number }) => {
  // const router = useRouter();
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const userId =
    pathnameParts.length > 2 ? parseInt(pathnameParts[2], 10) : null;
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [sendWithEnter, setSendWithEnter] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const response = await customAxios().get(`mmm/user-web/getById/${userId}`);
        if (response?.data?.data) {
          setActiveUser(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    if (!loggedInUserId || !activeUser) return;

    // In the fetchPreviousMessages function
    const fetchPreviousMessages = async () => {
      try {
        const response = await customAxios().get(
          `chat/messages/${loggedInUserId}/${activeUser.id}`
        );
        if (response?.data?.success) {
          // Create a Map to deduplicate messages by ID
          const messageMap = new Map();
          const unreadMessages: number[] = [];

          response.data.messages.forEach((msg: any) => {
            messageMap.set(msg.id, {
              type: "message",
              id: msg.id,
              senderId: msg.senderId,
              receiverId: msg.receiverId,
              content: msg.body,
              sentAt: msg.sentAt,
              status: msg.status || "sent", // Include status
            });
            // Collect unread messages from the other user
            if (msg.senderId === activeUser.id && msg.status !== "read") {
              unreadMessages.push(msg.id);
            }
          });

          // Convert Map values to array
          const formattedMessages = Array.from(messageMap.values());
          setMessages(formattedMessages);

          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      } catch (error) {
        console.error("Error fetching previous messages:", error);
      }
    };

    fetchPreviousMessages();
  }, [loggedInUserId, activeUser]);

  // Update the WebSocket connection setup
  useEffect(() => {
    if (!loggedInUserId || !activeUser) return;

    let ws: WebSocket | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const connectWebSocket = () => {
      try {
        const wsUrl =
          process.env.NEXT_PUBLIC_WS_URL ||
          "wss://matchmeetandmarry.com/api/mmm/";
        console.log(`Attempting to connect to WebSocket at: ${wsUrl}`);

        ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log("WebSocket connected successfully");
          reconnectAttempts = 0; // Reset reconnect attempts on successful connection

          // Identify the user to the WebSocket server
          if (ws && loggedInUserId) {
            ws.send(
              JSON.stringify({
                type: "user_connected",
                userId: loggedInUserId,
              })
            );
          }
        };

        // Update the WebSocket onmessage handler to properly handle status updates
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("WebSocket message received:", data);

            if (data.type === "message") {
              const isRelevantMessage =
                (data.senderId === loggedInUserId &&
                  data.receiverId === activeUser?.id) ||
                (data.receiverId === loggedInUserId &&
                  data.senderId === activeUser?.id);

              if (isRelevantMessage) {
                setMessages((prev) => {
                  const newMessage = {
                    type: "message",
                    id: data.id,
                    senderId: Number(data.senderId),
                    receiverId: Number(data.receiverId),
                    content: data.content || data.body,
                    sentAt: data.sentAt,
                    status: data.status || "sent", // Add status tracking
                  };

                  // More robust duplicate check
                  const isDuplicate = prev.some(
                    (msg) =>
                      msg.id === newMessage.id ||
                      (msg.senderId === newMessage.senderId &&
                        msg.content === newMessage.content &&
                        // Use string comparison instead of Date math operations
                        msg.sentAt === newMessage.sentAt)
                  );

                  if (!isDuplicate) {
                    // If this is a message from the other user, mark it as read
                    if (newMessage.senderId === activeUser.id) {
                      // Send read receipt
                      ws?.send(
                        JSON.stringify({
                          type: "mark_message_read",
                          messageId: newMessage.id,
                          readerId: loggedInUserId,
                          senderId: activeUser.id,
                        })
                      );
                    }

                    requestAnimationFrame(() => {
                      messagesEndRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "end",
                      });
                    });
                    return [...prev, newMessage];
                  }

                  // If it's a duplicate but has updated status, update the status
                  if (data.status) {
                    return prev.map((msg) =>
                      msg.id === data.id ||
                      (msg.senderId === data.senderId &&
                        msg.content === data.content &&
                        Math.abs(
                          new Date(msg.sentAt).getTime() -
                            new Date(data.sentAt).getTime()
                        ) < 5000)
                        ? { ...msg, status: data.status }
                        : msg
                    );
                  }

                  return prev;
                });
              }
            } else if (data.type === "message_status") {
              // Handle message status updates
              console.log("Message status update received:", data);
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === data.messageId
                    ? { ...msg, status: data.status }
                    : msg
                )
              );
            } else if (data.type === "online_users") {
              // When we receive online users list, mark messages as delivered if recipient is online
              if (Array.isArray(data.users) && activeUser) {
                const isRecipientOnline = data.users.includes(
                  activeUser.id.toString()
                );
                if (isRecipientOnline) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.senderId === loggedInUserId && msg.status === "sent"
                        ? { ...msg, status: "delivered" }
                        : msg
                    )
                  );
                }
              }
            }
          } catch (error) {
            console.error("Error processing message:", error);
          }
        };

        // Add reconnection logic
        ws.onclose = () => {
          console.log("WebSocket disconnected. Attempting to reconnect...");
          setTimeout(() => {
            if (wsRef.current === ws) {
              // Only reconnect if this is still the current connection
              connectWebSocket();
            }
          }, 3000);
        };

        ws.onerror = (error) => {
          let errorDetails = "Unknown error";

          if (error instanceof ErrorEvent) {
            errorDetails = error.message;
          } else if (error instanceof Event) {
            const ws = error.target as WebSocket;
            if (ws.readyState !== WebSocket.OPEN) {
              errorDetails = `WebSocket state: ${ws.readyState}`;
            }
          }

          console.error("WebSocket error:", {
            details: errorDetails,
            readyState: ws?.readyState,
            url: wsUrl,
          });

          toast.error(`Connection error: ${errorDetails}`);
          console.log("Attempting to reconnect...");
        };

        // Improved reconnection logic with exponential backoff
        ws.onclose = (event) => {
          console.log(
            `WebSocket disconnected. Code: ${event.code}, Reason: ${
              event.reason || "No reason provided"
            }`
          );

          if (reconnectAttempts < maxReconnectAttempts) {
            const delay = Math.min(
              3000 * Math.pow(1.5, reconnectAttempts),
              30000
            );
            reconnectAttempts++;

            console.log(
              `Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts}) in ${
                delay / 1000
              } seconds...`
            );

            setTimeout(() => {
              if (wsRef.current === ws) {
                // Only reconnect if this is still the current connection
                connectWebSocket();
              }
            }, delay);
          } else {
            console.error(
              "Maximum reconnection attempts reached. Please refresh the page."
            );
            // You might want to show a UI message to the user here
          }
        };
      } catch (connectionError) {
        console.error(
          "Error establishing WebSocket connection:",
          connectionError
        );
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        // Only send disconnect message if connection is open
        try {
          wsRef.current.send(
            JSON.stringify({
              type: "user_disconnected",
              userId: loggedInUserId,
            })
          );
        } catch (error) {
          console.error("Error sending disconnect message:", error);
        }

        // Close the connection
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [loggedInUserId, activeUser]);

  // Add this useEffect to mark messages as read when the chat is opened
  useEffect(() => {
    if (!loggedInUserId || !activeUser || !wsRef.current) return;

    // Mark all unread messages from this user as read
    const markMessagesAsRead = () => {
      if (!wsRef.current || !activeUser || !loggedInUserId) return;

      // Check if WebSocket is in OPEN state before proceeding
      if (wsRef.current.readyState !== WebSocket.OPEN) {
        console.log(
          "WebSocket not ready yet, will mark messages as read when connected"
        );
        // We could set a flag to mark messages as read once connected
        return;
      }

      setMessages((prev) => {
        let hasChanges = false;
        const updatedMessages = prev.map((msg) => {
          // Only mark messages from the active user that aren't already read
          if (msg.senderId === activeUser.id && msg.status !== "read") {
            hasChanges = true;
            // Send read status to WebSocket
            wsRef.current?.send(
              JSON.stringify({
                type: "mark_message_read",
                messageId: msg.id,
                readerId: loggedInUserId,
                senderId: activeUser.id,
              })
            );

            return { ...msg, status: "read" };
          }
          return msg;
        });

        if (hasChanges) {
          console.log("Messages marked as read");
        }

        return updatedMessages;
      });
    };

    // Mark messages as read when the chat is opened
    markMessagesAsRead();

    // Also set up a visibility change listener to mark messages as read when the user returns to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        markMessagesAsRead();
      }
    };

    // document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loggedInUserId, activeUser]);

  // Add this useEffect to get the logged-in user's ID
  useEffect(() => {
    const token = localStorage.getItem("access-token");
    if (token) {
      const userData = JSON.parse(token);
      setLoggedInUserId(userData.data.result.id);
    }
  }, []);

  useEffect(() => {
    // This will only run on the client side after messages update
    if (messages.length > 0 && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages]);

  // Update the handleSendMessage function to properly format the message for WebSocket
  const handleSendMessage = async (initialMessage?: string) => {
    const textToSend = initialMessage || messageText.trim();
    if (!textToSend || !wsRef.current || !activeUser || !loggedInUserId) return;

    try {
      // Create a temporary message ID to track this message
      const tempId = `temp-${Date.now()}`;
      const currentTime = new Date().toISOString();

      // Add message to local state immediately with "sending" status
      setMessages((prev) => [
        ...prev,
        {
          type: "message",
          id: tempId,
          senderId: loggedInUserId,
          receiverId: activeUser.id,
          content: textToSend,
          sentAt: currentTime,
          status: "sending",
        },
      ]);

      // Clear the input field immediately for better UX
      setMessageText("");

      // Send to server
      const response = await customAxios().post("chat/message/send", {
      // const response = await customAxios().post("user-web/message/send", {
        senderId: loggedInUserId,
        receiverId: activeUser.id,
        body: textToSend,
        subject: null,
      });

      if (response.data.success) {
        // Format the message properly for WebSocket transmission
        const dbMessage = {
          type: "message",
          id: response.data.message.id,
          senderId: loggedInUserId,
          receiverId: activeUser.id,
          content: textToSend, // Use textToSend instead of messageText.trim()
          body: textToSend, // Use textToSend instead of messageText.trim()
          sentAt: response.data.message.sentAt || currentTime,
          status: "sent",
          room: `chat_${Math.min(loggedInUserId, activeUser.id)}_${Math.max(
            loggedInUserId,
            activeUser.id
          )}`,
        };

        // Send through WebSocket
        wsRef.current.send(JSON.stringify(dbMessage));

        // Update the temporary message with the real ID
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...dbMessage, status: "sent" } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Update the temporary message to show error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id.toString().startsWith("temp-") && msg.content === textToSend // Use textToSend instead of messageText.trim()
            ? { ...msg, status: "error" }
            : msg
        )
      );
    }
  };

  if (!activeUser) {
    return (
      <div>
        <h1>Loading....</h1>
      </div>
    );
  }

  return (
    <div className="shadow-xl border-x rounded-md w-full">
      <div className="flex bg-white justify-between items-center px-4 py-2">
        <div className="flex gap-2 items-center w-full">
          <div className="relative">
            <Image
              className="w-12 h-12 rounded-full object-cover"
              src={
                activeUser.profile?.profilePicture
                  ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${activeUser.profile.profilePicture}`
                  : "/assets/images/avatar-placeholder.png"
              }
              alt={activeUser.userName}
              width={60}
              height={60}
            />
            <div className="absolute bottom-0 right-0">
              <OnlineIndicator userId={activeUser.id} size="sm" />
            </div>
          </div>
          <div className="w-full">
            <p className="text-dark-mmm font-semibold text-lg">
              {activeUser.userName}
            </p>
          </div>
        </div>
        <Button variant="secondary" size="secondary">
          <MdMail className="text-xl" /> <MessageChat id={id} />
        </Button>
      </div>

      <div className="bg-[#b7ddf3] h-[400px] flex flex-col">
        <div
          className="w-full h-full px-4 overflow-y-auto"
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full">
              <div className="bg-[#D5E9F4] flex justify-center items-center w-[110px] h-[110px] rounded-full">
                <BsPhoneFlip className="text-6xl" />
              </div>
              <p className="text-2xl font-semibold mt-3">Dare to make a move</p>
              <div className="flex flex-col items-center text-[#333333] text-base font-normal mt-2">
                <p>Say hello to send a</p>
                <p>ready text paid as our usual message.</p>
                <div className="w-full flex gap-2 mt-3">
                  <Button
                    className="w-full h-11"
                    onClick={() => handleSendMessage("Hello")}
                  >
                    <PiHandWavingDuotone className="mr-2" />
                    Say hello
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.senderId === loggedInUserId
                      ? "justify-end"
                      : "justify-start"
                  } mb-3`}
                >
                  <div
                    className={`${
                      message.senderId === loggedInUserId
                        ? "bg-white"
                        : "bg-white"
                    } rounded-lg p-3 max-w-[70%] shadow-sm`}
                  >
                    <p className="text-gray-800">{message.content}</p>
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-xs text-gray-500">
                        {format(new Date(message.sentAt), "MMM d, yyyy h:mm a")}
                      </span>
                      {message.senderId === loggedInUserId && (
                        <span className="ml-1">
                          {message.status === "sending" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#9ca3af"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                          ) : message.status === "read" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6L7 17L2 12" />
                              <path d="M22 10L11 21L9 19" />
                            </svg>
                          ) : message.status === "delivered" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6L7 17L2 12" />
                              <path d="M22 10L11 21L9 19" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12l5 5L20 7" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2 px-2 py-3">
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && sendWithEnter) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="w-full h-16 rounded-md shadow-md bg-[#f5f5f5] px-4 pt-1 pb-2 outline-none"
          placeholder="Type your message..."
        />
        <Button className="h-16" onClick={() => handleSendMessage()}>
          Send <IoSend />
        </Button>
      </div>
      <div className=" flex  justify-between items-center gap-2 px-2  flex-wrap ">
        <div className=" flex gap-2">
          <Button variant="secondary" size="secondary" className="l h-11 ">
            <PiChatCircleDotsLight /> Stickers
          </Button>
          <Button variant="secondary" size="secondary" className=" h-11 ">
            <PiChatCircleDotsLight /> Send media
          </Button>
        </div>

        <div>
          <div className="w-full rounded-md flex items-center px-2 py-2 gap-1 justify-center text-xs bg-[#FAFAFA]">
            <input
              type="checkbox"
              checked={sendWithEnter}
              onChange={(e) => setSendWithEnter(e.target.checked)}
              className="h-5 w-5"
            />
            Send with Enter
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-2 py-3 px-2 lg:flex-row jyustify-between items-center gap-x-8 bg-[#FAFAFA] mt-4">
        <div className="flex justify-between items-center w-full ">
          <div className="flex flex-col gap-y-1 px-2 py-1">
            <p className="text-[#333333] font-semibold text-xs">Attachment</p>
            <p className="text-xs text-[#333333] font-normal">
              10 credits/picture
            </p>
          </div>
          <div className="flex flex-col gap-y-1 px-2 py-1">
            <p className="text-[#333333] font-semibold text-xs">Sticker</p>
            <p className="text-xs text-[#333333] font-normal">
              5 credits/sticker
            </p>
          </div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="w-full h-full flex ">
            <Button variant="secondary" className="h-auto">
              <HiInformationCircle />
            </Button>
            <div className="flex flex-col bg-[#FFF4E9] gap-y-1 px-2 py-1 rounded-r-md">
              <p className="text-[#333333] font-semibold text-xs">Chat</p>
              <p className="text-xs text-[#333333] font-normal">
                2 credits/min
              </p>
            </div>
          </div>

          <Link href="/credits/feture">
          <Button variant="secondary" className="h-auto">
            <HiCircleStack /> Get Coins
          </Button></Link>
         
        </div>
      </div>
    </div>
  );
};
export default ChatInbox;
