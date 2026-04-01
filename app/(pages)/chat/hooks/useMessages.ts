"use client"
import { customAxios } from '@/utils/axios-interceptor';
import { useState, useEffect } from 'react';


interface Message {
  type: string;
  id: string;
  senderId: number;
  receiverId: number;
  content: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'read';  // Add status field
}

export const useMessages = (userId: number, activeUserId: number | null) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeUserId) return;

      try {
        const response = await customAxios().get(`user-web/messages/${userId}/${activeUserId}`);
        if (response?.data?.success) {
          const formattedMessages = response.data.messages.map((msg: any) => ({
            type: "message",
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            content: msg.body,
            sentAt: msg.sentAt
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [userId, activeUserId]);

  const addMessage = (newMessage: Message) => {
    setMessages(prev => {
      const messageExists = prev.some(msg => 
        msg.senderId === newMessage.senderId && 
        msg.content === newMessage.content && 
        msg.sentAt === newMessage.sentAt
      );
      
      if (!messageExists) {
        return [...prev, newMessage];
      }
      return prev;
    });
  };

  return {
    messages,
    setMessages,
    addMessage
  };
};