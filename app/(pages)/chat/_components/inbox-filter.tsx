"use client";
import React, { useState, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import AllChats from "./all-chats";
import { User } from "@/app/(pages)/search/type/type";


const InboxFilter = () => {
  
  const [activeInbox, setActiveInbox] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const chat = ["All chats", "Active", "Requests"];

  useEffect(() => {
    const token = localStorage.getItem("access-token");
    if (token) {
      const userData = JSON.parse(token);
      setLoggedInUserId(userData.data.result.id);
    }
  }, []);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    // Update URL without page reload using history API
    window.history.pushState({}, "", `/chat/${user.id}`);
  };

  return (
    <div className="min-w-[295px] w-[295px] bg-white border border-border-soft rounded-l-2xl h-full flex flex-col">
      <div className="px-3 py-3">
        <div className="flex bg-cream gap-2 text-[#6B6B6B] hover:border-maroon/30 border border-border-soft rounded-lg items-center px-3 py-2.5 w-full transition-colors duration-200">
          <IoSearchSharp className="text-lg text-maroon/60" />
          <input
            type="text"
            className="placeholder:text-[#6B6B6B] text-sm w-full outline-none bg-transparent"
            placeholder="Search by name"
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mt-2">
          {chat.map((item, index) => (
            <div
              key={index}
              className={`cursor-pointer pb-2 w-full text-center transition-all duration-200 ${
                activeInbox === index
                  ? "text-maroon font-semibold border-b-2 border-maroon"
                  : "text-[#6B6B6B] border-b border-border-soft font-medium hover:text-maroon"
              }`}
              onClick={() => setActiveInbox(index)}
            >
              <div className="flex items-center gap-1 w-full justify-center">
                <p className="text-sm">{item}</p>
                {index === 1 && (
                  <p className="w-5 h-5 bg-maroon text-white rounded-full text-xs flex items-center justify-center">
                    1
                  </p>
                )}
                {index === 2 && (
                  <p className="w-5 h-5 bg-[#6B6B6B] text-white rounded-full text-xs flex items-center justify-center">
                    2
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div>
          {activeInbox === 0 && (
            <AllChats
              onSelectUser={handleSelectUser}
              selectedUserId={selectedUser?.id ?? 0}
              loggedInUserId={loggedInUserId}
            />
          )}
          {activeInbox === 1 && <p className="p-4 text-sm text-[#6B6B6B]">No active chats</p>}
          {activeInbox === 2 && <p className="p-4 text-sm text-[#6B6B6B]">No requests</p>}
        </div>
      </div>
    </div>
  );
};

export default InboxFilter;
