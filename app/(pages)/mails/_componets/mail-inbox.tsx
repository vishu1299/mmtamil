"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import { LuUserSearch } from "react-icons/lu";
import {
  MessageData,
  receivedMessage,
  updateStarredMessage,
  updatetrasshedMessage,
} from "./api/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MdMail } from "react-icons/md";
import MessageChat from "@/app/(pages)/chat/_components/message";

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";
const DEFAULT_AVATAR = "/assets/images/search/DefaultAvatar.svg";

interface MailInboxProps {
  searchQuery?: string;
}

const MailInbox: React.FC<MailInboxProps> = ({ searchQuery = "" }) => {
  const t = useTranslations("mails");
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [composeReceiverId, setComposeReceiverId] = useState<number | null>(
    null
  );
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const fetchReceiveMessage = async () => {
    try {
      setLoading(true);
      const list = await receivedMessage();
      setMessages(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceiveMessage();
  }, []);

  const formatTime = (dateString: string) => {
    const date = dayjs(dateString);
    const now = dayjs();

    if (date.isSame(now, "day")) {
      return date.format("h:mm A");
    } else if (date.isSame(now.subtract(1, "day"), "day")) {
      return "Yesterday";
    } else {
      return date.format("MMM DD");
    }
  };

  const handleStarToggle = async (
    messageId: number,
    isCurrentlyStarred: boolean
  ) => {
    try {
      const updated = await updateStarredMessage(
        messageId.toString(),
        !isCurrentlyStarred
      );
      const newStarred = (updated as any)?.data?.starred ?? (updated as any)?.starred ?? !isCurrentlyStarred;
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, starred: newStarred } : msg
        )
      );
    } catch (error) {
      console.error("Failed to update starred status", error);
    }
  };

  const confirmDeleteMessage = (messageId: number) => {
    setDeleteId(messageId);
  };

  const handleDeleteMessage = async () => {
    if (deleteId !== null) {
      try {
        await updatetrasshedMessage(deleteId.toString(), true);
        setMessages((prev) => prev.filter((msg) => msg.id !== deleteId));
      } catch (error) {
        console.error("Failed to delete message", error);
      }
      setDeleteId(null);
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      (m.sender?.userName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (m.subject || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (m.body || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-10 h-10 border-2 border-maroon/30 border-t-maroon rounded-full animate-spin" />
      </div>
    );
  }

  if (filteredMessages.length === 0) {
    return (
      <div className="flex flex-col min-h-[60vh] justify-center items-center text-center p-4">
        <div className="w-16 h-16 bg-soft-rose rounded-full flex items-center justify-center">
          <MdMail className="text-3xl text-maroon" />
        </div>
        <h2 className="mt-4 font-playfair text-xl font-semibold text-maroon">
          {t("inboxEmptyTitle")}
        </h2>
        <p className="text-[#6B6B6B] text-sm mt-1">
          {t("inboxEmptyHint")}
        </p>
        <div className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-maroon text-white rounded-lg hover:bg-maroon/90 cursor-pointer transition-all duration-200 text-sm">
          <p>{t("inboxGoToSearch")}</p>
          <LuUserSearch />
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <h3 className="px-4 py-3 text-[15px] font-semibold text-[#2C2C2C]">
        Messages
      </h3>
      <div className="divide-y divide-gray-100">
        {filteredMessages.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedId(item.id);
              setComposeReceiverId(item.senderId);
              setIsComposeOpen(true);
            }}
            className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors ${
              selectedId === item.id ? "bg-[#FFF0ED]" : "hover:bg-gray-50"
            }`}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {item.sender?.profile?.profilePicture ? (
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={item.sender.profile.profilePicture.startsWith("http") ? item.sender.profile.profilePicture : `${IMAGE_BASE}${item.sender.profile.profilePicture}`}
                    alt={item.sender.userName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-soft-rose flex items-center justify-center">
                  <span className="text-maroon text-sm font-semibold">
                    {(item.sender?.userName || "?")[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-[15px] text-[#2C2C2C] truncate">
                  {item.sender?.userName || "Unknown User"}
                </h4>
                <span className="text-xs text-[#9CA3AF] flex-shrink-0 ml-2">
                  {formatTime(item.createdAt)}
                </span>
              </div>
              <p className="text-sm text-[#6B6B6B] truncate mt-0.5">
                {item.body}
              </p>
            </div>
          </button>
        ))}
      </div>

      <MessageChat
        id={composeReceiverId ?? undefined}
        open={isComposeOpen}
        onOpenChange={setIsComposeOpen}
        hideTrigger
      />

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="p-6 rounded-2xl bg-white border border-border-soft">
          <DialogHeader>
            <DialogTitle className="font-playfair text-xl font-semibold text-maroon">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-[#6B6B6B] text-sm">
              Are you sure you want to delete this message? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="border-border-soft text-[#6B6B6B] hover:bg-soft-rose hover:text-maroon rounded-lg transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMessage}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MailInbox;
