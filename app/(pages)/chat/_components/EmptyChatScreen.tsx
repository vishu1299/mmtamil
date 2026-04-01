"use client";
import { MessageSquare } from "lucide-react";

export default function EmptyChatScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-7rem)] w-full text-center px-6">
      <div className="animate-bounce bg-soft-rose p-6 rounded-full">
        <MessageSquare className="h-16 w-16 text-maroon" />
      </div>

      <h2 className="font-playfair text-2xl font-semibold text-maroon mt-6">
        No Chat Selected
      </h2>
      <p className="text-[#6B6B6B] mt-2 text-sm">
        Select a match to start your conversation.
      </p>
    </div>
  );
}
