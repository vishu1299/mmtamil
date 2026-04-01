"use client";
import { useState, useEffect, useRef } from "react";
import {
  createWebSocketConnection,
  EnhancedWebSocket,
} from "../utils/websocket";

interface UseSocketReturn {
  socket: EnhancedWebSocket | null;
  isConnected: boolean;
  onlineUsers: string[];
  messageCount: Record<string, number>;
  setMessageCount: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  markMessageAsRead: (messageId: string, senderId: string) => void;
  isMessageRead: (messageId: string) => boolean;
  isMessageSeen: (messageId: string) => boolean; // Add this line
  viewChat: (userId: string) => void;
  viewedChats: Set<string>;
  sendMessage: (message: any) => void;
  onNewMessage: (callback: (message: any) => void) => void;
  startConversation: (userId: string) => void;
  isUserOnline: (userId: string) => boolean;
  markChatAsViewed: (userId: string) => void;
  resetMessageCount: (userId: string) => void;
  getMessageCount: (userId: string) => number;
}

// Change the export to be a named export instead of default
export const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<EnhancedWebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [privateOnlineUsers, setPrivateOnlineUsers] = useState<string[]>([]);
  const [messageReadStatus, setMessageReadStatus] = useState<
    Record<string, boolean>
  >({});
  const [messageCount, setMessageCount] = useState<Record<string, number>>({});
  const [viewedChats, setViewedChats] = useState<Set<string>>(new Set());

  // First, add a new state to track seen messages
  const [seenMessages, setSeenMessages] = useState<Record<string, boolean>>({});

  // Add this to the useEffect where you initialize the socket connection
  useEffect(() => {
    const wsConnection = createWebSocketConnection(
      "wss://matchmeetandmarry.com/api/mmm/"
    );
    // Add handlers for user online/offline status
    wsConnection.on("user_connected", (userId: string) => {
      setPrivateOnlineUsers((prev) => [...prev, userId]);
      console.log("connected websocket");
    });

    wsConnection.on("user_disconnected", (userId: string) => {
      setPrivateOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    // Initial online users list
    wsConnection.on("online_users", (users: string[]) => {
      setPrivateOnlineUsers(users);
    });

    // Load stored message read status from localStorage
    const storedReadStatus = localStorage.getItem("messageReadStatus");
    if (storedReadStatus) {
      setMessageReadStatus(JSON.parse(storedReadStatus));
    }

    // Load stored seen messages from localStorage
    const storedSeenMessages = localStorage.getItem("seenMessages");
    if (storedSeenMessages) {
      setSeenMessages(JSON.parse(storedSeenMessages));
    }

    wsConnection.on(
      "message_read",
      ({ messageId, userId }: { messageId: string; userId: string }) => {
        setMessageReadStatus((prev) => {
          const updated = {
            ...prev,
            [messageId]: true,
          };
          // Store updated read status in localStorage
          localStorage.setItem("messageReadStatus", JSON.stringify(updated));
          return updated;
        });

        // Also mark as seen
        setSeenMessages((prev) => {
          const updated = {
            ...prev,
            [messageId]: true,
          };
          localStorage.setItem("seenMessages", JSON.stringify(updated));
          return updated;
        });

        setMessageCount((prev) => {
          const updated = { ...prev };
          if (updated[userId] && updated[userId] > 0) {
            updated[userId]--;
            localStorage.setItem("messageCounts", JSON.stringify(updated));
          }
          return updated;
        });
      }
    );

    wsConnection.socket.onopen = () => {
      setIsConnected(true);

      // When connected, identify the current user
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (currentUser && currentUser.id) {
        wsConnection.emit("user_connected", currentUser.id);
      }
    };

    wsConnection.socket.onclose = () => {
      setIsConnected(false);
    };

    // Set up event listeners
    wsConnection.on("online_users", (users: string[]) => {
      setPrivateOnlineUsers(users);
      console.log("Online users updated:", users);
    });

    wsConnection.on(
      "user_online_status",
      ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
        setPrivateOnlineUsers((prev) => {
          if (isOnline && !prev.includes(userId)) {
            return [...prev, userId];
          } else if (!isOnline && prev.includes(userId)) {
            return prev.filter((id) => id !== userId);
          }
          return prev;
        });
        console.log(`User ${userId} is ${isOnline ? "online" : "offline"}`);
      }
    );

    wsConnection.on(
      "message_read",
      ({ messageId, userId }: { messageId: string; userId: string }) => {
        setMessageReadStatus((prev) => ({
          ...prev,
          [messageId]: true,
        }));

        // Update message count when message is read
        setMessageCount((prev) => {
          const updated = { ...prev };
          if (updated[userId] && updated[userId] > 0) {
            updated[userId]--;
          }
          return updated;
        });
      }
    );

    wsConnection.on("new_message", (message: any) => {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

      // Always add the message to the messages list if it's relevant to this user
      if (
        message.receiverId === currentUser.id ||
        message.senderId === currentUser.id
      ) {
        // Trigger any registered callbacks for new messages
        wsConnection.eventHandlers.get("new_message")?.forEach((callback) => {
          callback(message);
        });
      }

      // Only increment unread count if this user is the recipient and hasn't viewed the chat
      if (
        message.receiverId === currentUser.id &&
        message.senderId !== currentUser.id
      ) {
        // Only increment count if the chat hasn't been viewed
        if (!viewedChats.has(message.senderId)) {
          setMessageCount((prev) => {
            const updated = { ...prev };
            updated[message.senderId] = (prev[message.senderId] || 0) + 1;
            localStorage.setItem("messageCounts", JSON.stringify(updated));
            return updated;
          });
        }
      }
    });

    // Handle user logout event from the app
    const handleUserLogout = () => {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (currentUser && currentUser.id) {
        wsConnection.emit("user_disconnected", currentUser.id);
      }
    };

    // Load initial message counts from localStorage
    const storedCounts = localStorage.getItem("messageCounts");
    if (storedCounts) {
      setMessageCount(JSON.parse(storedCounts));
    }

    window.addEventListener("user-logout", handleUserLogout);
    setSocket(wsConnection);

    return () => {
      window.removeEventListener("user-logout", handleUserLogout);
      wsConnection.disconnect();
    };
  }, []);

  // Function to mark a message as read
  const markMessageAsRead = (messageId: string, senderId: string) => {
    if (socket && isConnected) {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

      socket.emit("mark_message_read", {
        messageId,
        readerId: currentUser.id,
        senderId,
      });

      // Update read status
      setMessageReadStatus((prev) => {
        const updated = {
          ...prev,
          [messageId]: true,
        };
        localStorage.setItem("messageReadStatus", JSON.stringify(updated));
        return updated;
      });

      // Also mark as seen
      setSeenMessages((prev) => {
        const updated = {
          ...prev,
          [messageId]: true,
        };
        localStorage.setItem("seenMessages", JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Function to check if a message is read
  const isMessageRead = (messageId: string) => {
    return !!messageReadStatus[messageId];
  };

  // Add this function after isMessageRead
  const isMessageSeen = (messageId: string) => {
    return !!seenMessages[messageId];
  };

  // Function to view a chat
  // Add this near the top of your hook
  const viewedChatsRef = useRef<Set<string>>(new Set());

  // Update the viewChat function
  const viewChat = (userId: string) => {
    const newViewedChats = new Set([...viewedChatsRef.current, userId]);
    viewedChatsRef.current = newViewedChats;
    setViewedChats(newViewedChats);

    // Reset unread count for this user
    setMessageCount((prev) => {
      const updated = { ...prev };
      updated[userId] = 0;
      localStorage.setItem("messageCounts", JSON.stringify(updated));
      return updated;
    });
  };

  // Add these new functions
  const onNewMessage = (callback: (message: any) => void) => {
    if (socket) {
      socket.on("new_message", callback);
    }
  };

  const sendMessage = (message: any) => {
    if (socket && isConnected) {
      socket.emit("new_message", message);
    }
  };

  const startConversation = (userId: string) => {
    if (socket && isConnected) {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      socket.emit("start_conversation", {
        userId: currentUser.id,
        targetUserId: userId,
      });
    }
  };

  // Update the isUserOnline function to be more robust
  const isUserOnline = (userId: string | number) => {
    if (!userId) return false;

    // Convert to string for consistent comparison
    const userIdStr = userId.toString();
    const isOnline = privateOnlineUsers.includes(userIdStr);
    return isOnline;
  };

  const markChatAsViewed = (userId: string) => {
    viewChat(userId);
  };

  const resetMessageCount = (userId: string) => {
    setMessageCount((prev) => {
      const updated = { ...prev };
      updated[userId] = 0;
      localStorage.setItem("messageCounts", JSON.stringify(updated));
      return updated;
    });
  };

  const getMessageCount = (userId: string) => {
    return messageCount[userId] || 0;
  };

  // Update the return object to include isMessageSeen
  return {
    socket,
    isConnected,
    onlineUsers: privateOnlineUsers,
    messageCount,
    setMessageCount,
    markMessageAsRead,
    isMessageRead,
    isMessageSeen, // Add this line
    viewChat,
    viewedChats,
    onNewMessage,
    sendMessage,
    startConversation,
    isUserOnline,
    markChatAsViewed,
    resetMessageCount,
    getMessageCount,
  };
};
