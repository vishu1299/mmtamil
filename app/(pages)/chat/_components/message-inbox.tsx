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
import { PiChatCircleDotsLight } from "react-icons/pi";
import { format } from "date-fns";
import OnlineIndicator from "@/app/(pages)/chat/_components/OnlineIndicator";
import EmptyChatScreen from "./EmptyChatScreen";
import MessageChat from "./message";

const MessageInbox = () => {
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
          // `user-web/messages/${loggedInUserId}/${activeUser.id}`
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
              status: msg.status || "sent", 
            });
          
            if (msg.senderId === activeUser.id && msg.status !== "read") {
              unreadMessages.push(msg.id);
            }
          });
         
          if (
            unreadMessages.length > 0 &&
            wsRef.current?.readyState === WebSocket.OPEN
          ) {
            wsRef.current.send(
              JSON.stringify({
                type: "mark_messages_read",
                messageIds: unreadMessages,
                readerId: loggedInUserId,
                senderId: activeUser.id,
              })
            );
          }
          // Convert Map values to array
          const formattedMessages = Array.from(messageMap.values());
          setMessages(formattedMessages);

          // setTimeout(() => {
          //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          // }, 100);
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
    const connectWebSocket = () => {
      const wsUrl =
        process.env.NEXT_PUBLIC_WS_URL ||
        "wss://matchmeetandmarry.com/api/mmm/";
      console.log("Connecting to WebSocket:", wsUrl); // Add this log

      // Check if WebSocket is already connected
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log("WebSocket already connected.");
        return;
      }

      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
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
                  if (
                    newMessage.senderId === activeUser.id &&
                    document.visibilityState === "visible"
                  ) {
                    // Send read receipt
                    ws?.send(
                      JSON.stringify({
                        type: "mark_message_read",
                        messageId: newMessage.id,
                        readerId: loggedInUserId,
                        senderId: activeUser.id,
                      })
                    );
                    newMessage.status = "read";
                  }

                  requestAnimationFrame(() => {
                    messagesEndRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "end",
                      inline: "nearest",
                    });
                  });
                  return [...prev, newMessage];
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

      ws.onerror = (event) => {
        console.error("WebSocket error:", {
          error: event,
          readyState: ws?.readyState,
          url: wsUrl,
        });
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        // Check if WebSocket is in OPEN state before sending
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
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

    //Adding the Event Listener
    document.addEventListener("visibilitychange", handleVisibilityChange);

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
  // Instead, create a function to process message statuses that can be called when needed
  const processMessageStatuses = (messagesToProcess: any[]) => {
    if (!messagesToProcess.length) return messagesToProcess;

    try {
      const currentUser = JSON.parse(
        localStorage.getItem("access-token") || "{}"
      ).data.result;
      const selectedUser = activeUser;

      if (!currentUser || !selectedUser) return messagesToProcess;

      // Get the utility functions from the global object
      const { isMessageRead, isMessageSeen } = (window as any)
        .messageStatusUtils || {
        isMessageRead: () => false,
        isMessageSeen: () => false,
      };

      // Process messages with their status
      return Array.from(
        new Map(
          messagesToProcess.map((msg: any) => {
            // First check if the message is seen
            if (msg.senderId === currentUser.id && isMessageSeen(msg.id)) {
              return [msg.id, { ...msg, status: "read" }];
            }
            // Then check if it's read but not seen
            else if (msg.senderId === currentUser.id && isMessageRead(msg.id)) {
              return [msg.id, { ...msg, status: "delivered" }];
            }
            // For received messages that were previously marked as read
            else if (
              selectedUser?.id &&
              msg.senderId === selectedUser.id &&
              (isMessageRead(msg.id) || msg.status === "read")
            ) {
              return [msg.id, { ...msg, status: "read" }];
            }
            // For messages without status or new messages
            return [msg.id, { ...msg, status: msg.status || "sent" }];
          })
        ).values()
      );
    } catch (error) {
      console.error("Error processing message statuses:", error);
      return messagesToProcess;
    }
  };

  // Use this function in your existing useEffects where you set messages
  // For example, in the fetchPreviousMessages function:
  useEffect(() => {
    if (!loggedInUserId || !activeUser) return;

    const fetchPreviousMessages = async () => {
      try {
        const response = await customAxios().get(
          `chat/messages/${loggedInUserId}/${activeUser.id}`
        );
        if (response?.data?.success) {
          // Create a Map to deduplicate messages by ID
          const messageMap = new Map();

          response.data.messages.forEach((msg: any) => {
            messageMap.set(msg.id, {
              type: "message",
              id: msg.id,
              senderId: msg.senderId,
              receiverId: msg.receiverId,
              content: msg.body,
              sentAt: msg.sentAt,
              status: msg.status || "sent",
            });
          });

          // Convert Map values to array
          const formattedMessages = Array.from(messageMap.values());

          // Process message statuses before setting state
          const processedMessages = processMessageStatuses(formattedMessages);
          setMessages(processedMessages);

          setTimeout(() => {
            const chatContainer = messagesEndRef.current?.parentElement;
            if (chatContainer) {
              chatContainer.scrollTop = chatContainer.scrollHeight;
            }
          }, 100);
        }
      } catch (error) {
        console.error("Error fetching previous messages:", error);
      }
    };

    fetchPreviousMessages();
  }, [loggedInUserId, activeUser]);

  // Update the handleSendMessage function to properly format the message for WebSocket
  const handleSendMessage = async () => {
    if (!messageText.trim() || !wsRef.current || !activeUser || !loggedInUserId)
      return;

    try {
      // Create a temporary message ID to track this message
      const tempId = `temp-${Date.now()}`;
      const currentTime = new Date().toISOString();

      // Add message to local state immediately with "sending" status
      setMessages((prev) => {
        const newMessages = [
          ...prev,
          {
            type: "message",
            id: tempId,
            senderId: loggedInUserId,
            receiverId: activeUser.id,
            content: messageText.trim(),
            sentAt: currentTime,
            status: "sending",
          },
        ];

        // Scroll to bottom after state update
        requestAnimationFrame(() => {
          const chatContainer = messagesEndRef.current?.parentElement;
          if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
          }
        });

        return newMessages;
      });

      setMessageText("");
      // Send message to server
      const response = await customAxios().post("user-web/message/send", {
        senderId: loggedInUserId,
        receiverId: activeUser.id,
        body: messageText.trim(),
        subject: null,
      });

      if (response.data.success) {
        // Format the message properly for WebSocket transmission
        const dbMessage = {
          type: "message",
          id: response.data.message.id,
          senderId: loggedInUserId,
          receiverId: activeUser.id,
          content: messageText.trim(),
          body: messageText.trim(), // Add body field for compatibility
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
          msg.id.toString().startsWith("temp-") &&
          msg.content === messageText.trim()
            ? { ...msg, status: "error" }
            : msg
        )
      );
    }
  };

  if (!activeUser) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center mt-42">
        <EmptyChatScreen />
      </div>
    );
  }

  return (
    <div className="border border-border-soft border-l-0 rounded-r-2xl w-full flex-1 mr-0 lg:mr-6 bg-white overflow-hidden">
      <div className="flex bg-white justify-between items-center px-4 py-3 border-b border-border-soft">
        <div className="flex gap-3 items-center w-full">
          <div className="relative">
            <Image
              className="w-11 h-11 rounded-full object-cover border-2 border-soft-rose"
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
          <div>
            <p className="font-playfair font-semibold text-base text-maroon">
              {activeUser.userName}
            </p>
          </div>
        </div>
        <Button className="bg-maroon hover:bg-maroon/90 text-white rounded-lg text-sm px-4">
          <MdMail className="text-lg" /> <MessageChat id={activeUser.id} />
        </Button>
      </div>

      <div className="bg-soft-rose/30 h-[380px] flex flex-col">
        <div
          className="w-full h-full px-4 py-3 overflow-y-auto"
          style={{
            scrollBehavior: "smooth",
            overflowAnchor: "none",
          }}
        >
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
                    ? "bg-maroon text-white"
                    : "bg-white text-[#2C2C2C]"
                } rounded-2xl p-3 max-w-[70%] shadow-sm`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className={`text-xs ${message.senderId === loggedInUserId ? "text-white/70" : "text-[#6B6B6B]"}`}>
                    {format(new Date(message.sentAt), "MMM d, yyyy h:mm a")}
                  </span>
                  {message.senderId === loggedInUserId && (
                    <span className="ml-1">
                      {message.status === "sending" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="rgba(255,255,255,0.6)"
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
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#D4AF37"
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
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="rgba(255,255,255,0.7)"
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
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="rgba(255,255,255,0.6)"
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
          <div ref={messagesEndRef} style={{ height: "1px" }} />
        </div>
      </div>

      <div className="flex gap-2 px-3 py-3 border-t border-border-soft">
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && sendWithEnter) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="w-full h-14 rounded-xl bg-cream border border-border-soft px-4 pt-3 pb-2 outline-none text-sm focus:border-maroon/40 transition-colors duration-200 resize-none"
          placeholder="Type your message..."
        />
        <Button className="h-14 bg-maroon hover:bg-maroon/90 text-white rounded-xl px-5" onClick={handleSendMessage}>
          <IoSend className="text-lg" />
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-3 pb-2">
        <Button variant="outline" className="w-full h-10 rounded-lg border-border-soft text-[#6B6B6B] hover:bg-soft-rose hover:text-maroon hover:border-maroon/20 transition-all duration-200 text-xs">
          <PiChatCircleDotsLight className="text-base" /> <p>{`Let's talk`}</p>
        </Button>
        <Button variant="outline" className="w-full h-10 rounded-lg border-border-soft text-[#6B6B6B] hover:bg-soft-rose hover:text-maroon hover:border-maroon/20 transition-all duration-200 text-xs">
          <PiChatCircleDotsLight className="text-base" /> Stickers
        </Button>
        <Button variant="outline" className="w-full h-10 rounded-lg border-border-soft text-[#6B6B6B] hover:bg-soft-rose hover:text-maroon hover:border-maroon/20 transition-all duration-200 text-xs">
          <PiChatCircleDotsLight className="text-base" /> Send media
        </Button>
        <div className="w-full rounded-lg flex items-center gap-1.5 justify-center text-xs text-[#6B6B6B] bg-cream border border-border-soft">
          <input
            type="checkbox"
            checked={sendWithEnter}
            onChange={(e) => setSendWithEnter(e.target.checked)}
            className="h-4 w-4 accent-maroon"
          />
          Send with Enter
        </div>
      </div>

      <div className="flex flex-col gap-y-2 py-3 px-3 lg:flex-row justify-between items-center gap-x-6 bg-cream border-t border-border-soft mt-2">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col gap-y-0.5 px-2 py-1">
            <p className="text-[#2C2C2C] font-semibold text-xs">Attachment</p>
            <p className="text-xs text-[#6B6B6B]">10 credits/picture</p>
          </div>
          <div className="flex flex-col gap-y-0.5 px-2 py-1">
            <p className="text-[#2C2C2C] font-semibold text-xs">Sticker</p>
            <p className="text-xs text-[#6B6B6B]">5 credits/sticker</p>
          </div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="w-full h-full flex">
            <Button variant="outline" className="h-auto rounded-l-lg rounded-r-none border-border-soft text-maroon hover:bg-soft-rose">
              <HiInformationCircle />
            </Button>
            <div className="flex flex-col bg-soft-rose gap-y-0.5 px-3 py-1.5 rounded-r-lg border border-l-0 border-border-soft">
              <p className="text-maroon font-semibold text-xs">Chat</p>
              <p className="text-xs text-[#6B6B6B]">2 credits/min</p>
            </div>
          </div>
          <Button className="h-auto bg-white border border-gold text-gold hover:bg-gold hover:text-white rounded-lg transition-all duration-200 text-xs px-3 py-1.5">
            <HiCircleStack /> Get Credits
          </Button>
        </div>
      </div>
    </div>
  );
};
export default MessageInbox;
