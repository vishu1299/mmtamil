'use client';

import React from 'react';
import { useEffect, useState } from 'react';

interface OnlineIndicatorProps {
  userId: number;
  size?: 'sm' | 'md' | 'lg';
  isOnline?: boolean;
}

// Create a  WebSocket connection for all indicators
let globalWs: WebSocket | null = null;
let onlineUsersList: string[] = [];
const listeners: Set<(users: string[]) => void> = new Set();

// Function to notify all listeners when online users change
const notifyListeners = () => {
  listeners.forEach(listener => listener(onlineUsersList));
};

// Initialize the global WebSocket if it doesn't exist
const getGlobalWebSocket = () => {
  if (!globalWs || globalWs.readyState === WebSocket.CLOSED) {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://matchmeetandmarry.com/api/mmm/";
    globalWs = new WebSocket(wsUrl);
    
  
    if (typeof window !== 'undefined') {
      window.globalWs = globalWs;
    }
    
    globalWs.onopen = () => {
      console.log("Online status WebSocket connected");
      
      // Identify the current user when connected
      const token = localStorage.getItem("access-token");
      if (token) {
        try {
          const userData = JSON.parse(token);
          const currentUserId = userData.data.result.id;
          
          if (currentUserId) {
            globalWs?.send(JSON.stringify({
              type: "user_connected",
              userId: currentUserId
            }));
          }
        } catch (error) {
          console.error("Error identifying user to WebSocket:", error);
        }
      }
    };
    
    globalWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Online status WebSocket message:", data);
        
        if (data.type === "online_users" && Array.isArray(data.users)) {
          onlineUsersList = data.users;
          notifyListeners();
        } else if (data.type === "user_disconnected" && data.userId) {
          // Remove the disconnected user from the online users list
          onlineUsersList = onlineUsersList.filter(id => id !== data.userId.toString());
          notifyListeners();
          console.log("User disconnected:", data.userId, "Updated online users:", onlineUsersList);
        } else if (data.type === "user_connected" && data.userId) {
          // Add the connected user to the online users list if not already there
          const userIdStr = data.userId.toString();
          if (!onlineUsersList.includes(userIdStr)) {
            onlineUsersList = [...onlineUsersList, userIdStr];
            notifyListeners();
            console.log("User connected:", data.userId, "Updated online users:", onlineUsersList);
          }
        }
      } catch (error) {
        console.error("Error processing online status:", error);
      }
    };
    
    // Add reconnection logic
    globalWs.onclose = () => {
      console.log("Online status WebSocket disconnected. Attempting to reconnect...");
      setTimeout(() => {
        getGlobalWebSocket();
      }, 3000);
    };
  }
  
  return globalWs;
};

const OnlineIndicator: React.FC<OnlineIndicatorProps> = ({ userId, size = 'md' }) => {
  const [isOnline, setIsOnline] = useState(false);
  
  useEffect(() => {
    // Get or create the global WebSocket
    getGlobalWebSocket();
    
    // Create a listener function for this component
    const updateOnlineStatus = (users: string[]) => {
      const userIdStr = userId.toString();
      setIsOnline(users.includes(userIdStr));
    };
    
    // Add this component's listener to the set
    listeners.add(updateOnlineStatus);
    
    // Initial check with current list
    updateOnlineStatus(onlineUsersList);
    
    //remove this component's listener when unmounted
    return () => {
      listeners.delete(updateOnlineStatus);
    };
  }, [userId]);
  
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };
  
  return (
    <div 
      className={`${sizeClasses[size]} rounded-full ${
        isOnline ? 'bg-[#2E7D32]' : 'bg-[#6B6B6B]'
      } border-2 border-white`}
      title={isOnline ? 'Online' : 'Offline'}
    />
  );
};

export default OnlineIndicator;