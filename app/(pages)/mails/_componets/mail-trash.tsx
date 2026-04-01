


"use client";

import React, { useEffect, useState } from "react";
import { LuUserSearch } from "react-icons/lu";
import { MdMail, MdOutlineWatchLater } from "react-icons/md";
import { trashMessage, MessageData } from "./api/api";
import dayjs from "dayjs";

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";

const MailTrash = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const list = await trashMessage();
        setMessages(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error("Error fetching trash:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = dayjs(dateString);
    const now = dayjs();

    if (date.isSame(now, "day")) {
      return `Today, ${date.format("hh:mm A")}`;
    } else if (date.isSame(now.subtract(1, "day"), "day")) {
      return `Yesterday, ${date.format("hh:mm A")}`;
    } else {
      return date.format("MMM DD, YYYY, hh:mm A");
    }
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
      {messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((item) => (
            <div
              key={item.id}
              className="flex lg:flex-row flex-col items-start gap-4 p-4 border border-border-soft rounded-xl bg-white transition-all duration-200 hover:shadow-md hover:border-maroon/20 opacity-75"
            >
              {item.sender?.profile?.profilePicture ? (
                <img
                  src={String(item.sender.profile.profilePicture).startsWith("http") ? item.sender.profile.profilePicture : `${IMAGE_BASE}${item.sender.profile.profilePicture}`}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-border-soft"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-soft-rose flex items-center justify-center">
                  <span className="text-maroon text-sm font-semibold">N/A</span>
                </div>
              )}

              <div className="flex-1">
                <div className="flex justify-between w-full">
                  <div className="flex items-center gap-3">
                    <p className="font-playfair font-semibold text-base text-[#2C2C2C]">
                      {item.sender?.userName || "Unknown User"}
                    </p>
                    <p className="text-xs flex gap-1.5 items-center text-[#6B6B6B]">
                      <MdMail className="text-maroon/60" /> {item.attachment?.length || 0} Attachments
                    </p>
                  </div>
                  <p className="text-xs flex gap-1.5 items-center text-[#6B6B6B]">
                    <MdOutlineWatchLater className="text-maroon/50" /> {formatDate(item.createdAt)}
                  </p>
                </div>

                <div className="mt-3 p-3 bg-cream rounded-lg border-l-4 border-[#6B6B6B]">
                  <p className="text-[#2C2C2C] text-sm">{item.body}</p>
                </div>

                {(item.attachment?.length ?? 0) > 0 && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {item.attachment.map((file: any, index: number) => (
                      <img
                        key={index}
                        src={file?.attachedfile ? `${IMAGE_BASE}${file.attachedfile}` : ""}
                        alt={`Attachment ${index + 1}`}
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
            <MdMail className="text-3xl text-[#6B6B6B]" />
          </div>
          <h2 className="mt-4 font-playfair text-xl font-semibold text-maroon">
            No Trashed Messages
          </h2>
          <p className="text-[#6B6B6B] text-sm mt-1">Your trash is currently empty</p>
          <div className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-maroon text-white rounded-lg hover:bg-maroon/90 cursor-pointer transition-all duration-200 text-sm">
            <p>Go to search</p>
            <LuUserSearch />
          </div>
        </div>
      )}
    </div>
  );
};

export default MailTrash;
