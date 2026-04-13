"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import { LuUserSearch } from "react-icons/lu";
import { getMessageChat, MessageData } from "./api/api";
import { getuserByid } from "@/app/(pages)/profile/api/api";
import { MdOutlineWatchLater, MdMail } from "react-icons/md";

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";

/** Map user profile sendMessage (no receiver object) to MessageData for display */
function sendMessageToMessageData(raw: any): MessageData {
  return {
    id: raw.id,
    senderId: raw.senderId,
    receiverId: raw.receiverId,
    subject: raw.subject ?? "",
    body: raw.body ?? "",
    deleted: raw.deleted ?? false,
    starred: raw.starred ?? false,
    createdAt: raw.sentAt ?? raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
    attachment: raw.attachment ?? [],
    attachedfile: raw.attachedfile ?? "",
    receiver: {
      id: raw.receiverId,
      profileId: "",
      userName: `User #${raw.receiverId}`,
      email: "",
      password: "",
      role: "user",
      createdAt: "",
      updatedAt: "",
      isActive: true,
      profileViews: 0,
      engagementScore: 0,
      isPremium: false,
      profile: {},
    },
    sender: {} as MessageData["sender"],
  };
}

const MailOutbox = () => {
  const t = useTranslations("mails");
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const list = await getMessageChat();
      if (Array.isArray(list) && list.length > 0) {
        setMessages(list);
        return;
      }
      const userRes = await getuserByid();
      const userData = userRes?.data?.data ?? userRes?.data;
      const sendMessage = userData?.sendMessage ?? userData?.SendMessage ?? [];
      const fromProfile = Array.isArray(sendMessage)
        ? sendMessage.filter((m: any) => !m.deleted).map(sendMessageToMessageData)
        : [];
      setMessages(fromProfile);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const formatDate = (dateString: string) => {
    const date = dayjs(dateString);
    const now = dayjs();
    const time = date.format("hh:mm A");

    if (date.isSame(now, "day")) {
      return t("mailDateToday", { time });
    }
    if (date.isSame(now.subtract(1, "day"), "day")) {
      return t("mailDateYesterday", { time });
    }
    return date.format("MMM DD, YYYY, hh:mm A");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-10 h-10 border-2 border-maroon/30 border-t-maroon rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4">
      {messages?.length > 0 ? (
        <div className="space-y-3">
          {messages.map((item, index) => (
            <div
              key={item.id ?? index}
              className="flex items-start gap-4 p-4 border border-border-soft rounded-xl bg-white transition-all duration-200 hover:shadow-md hover:border-maroon/20"
            >
              {item.receiver?.profile?.profilePicture ? (
                <img
                  src={String(item.receiver.profile.profilePicture).startsWith("http") ? item.receiver.profile.profilePicture : `${IMAGE_BASE}${item.receiver.profile.profilePicture}`}
                  alt={item.receiver?.userName ?? t("receiverAlt")}
                  className="w-10 h-10 rounded-full object-cover border-2 border-soft-rose"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-soft-rose flex items-center justify-center">
                  <span className="text-maroon text-sm font-semibold">
                    {(item.receiver?.userName || "?")[0]}
                  </span>
                </div>
              )}

              <div className="flex-1">
                <div className="flex justify-between w-full">
                  <div className="flex items-center gap-3">
                    <p className="font-playfair font-semibold text-base text-[#2C2C2C]">
                      {item.receiver?.userName || t("unknownUser")}
                    </p>
                    <p className="text-xs flex gap-1.5 items-center text-[#6B6B6B]">
                      <MdMail className="text-maroon/60" />{" "}
                      {t("attachmentsCount", {
                        count: item.attachment?.length || 0,
                      })}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <p className="text-xs flex gap-1.5 items-center text-[#6B6B6B]">
                      <MdOutlineWatchLater className="text-maroon/50" /> {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-cream rounded-lg border-l-4 border-maroon">
                  <p className="text-[#2C2C2C] text-sm">{item.body}</p>
                </div>

                {(item.attachment?.length ?? 0) > 0 && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {item.attachment.map((file: any, i: number) => (
                      <img
                        key={i}
                        src={file?.attachedfile ? `${IMAGE_BASE}${file.attachedfile}` : ""}
                        alt={t("attachmentAlt", { number: i + 1 })}
                        className="w-20 h-20 rounded-lg object-cover border border-border-soft"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col min-h-[60vh] justify-center items-center text-center">
          <div className="w-16 h-16 bg-soft-rose rounded-full flex items-center justify-center">
            <MdMail className="text-3xl text-maroon" />
          </div>
          <h2 className="mt-4 font-playfair text-xl font-semibold text-maroon">
            {t("outboxEmptyTitle")}
          </h2>
          <p className="text-[#6B6B6B] text-sm mt-1">
            {t("outboxEmptyHint")}
          </p>
          <div className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-maroon text-white rounded-lg hover:bg-maroon/90 cursor-pointer transition-all duration-200 text-sm">
            <p>{t("inboxGoToSearch")}</p>
            <LuUserSearch />
          </div>
        </div>
      )}
    </div>
  );
};

export default MailOutbox;
