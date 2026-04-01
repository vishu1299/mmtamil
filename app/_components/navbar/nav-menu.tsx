"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CgProfile } from "react-icons/cg";
import { myProfilePic } from "./api/api";
import { User } from "./api/type";

export function NavMenu() {
  const t = useTranslations("navMenu");
  const router = useRouter();
  const [data, setData] = useState<User | null>(null);
  const [open, setOpen] = useState(false);  // Add this state

  const fetchData = async () => {
    try {
      const response = await myProfilePic();
      const fetchedData = response?.data?.data;
      console.log("myprofilePic:", JSON.stringify(fetchedData, null, 2));
      if (fetchedData) {
        setData(fetchedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const logout = () => {
    // Notify WebSocket server about logout before clearing localStorage
    const token = localStorage.getItem("access-token");
    if (token) {
      try {
        const userData = JSON.parse(token);
        const currentUserId = userData.data.result.id;

        // Dispatch the user-logout event that OnlineIndicator listens for
        window.dispatchEvent(new Event("user-logout"));

        // If we have direct access to WebSocket connections, also send directly
        if (window.globalWs && window.globalWs.readyState === WebSocket.OPEN) {
          window.globalWs.send(
            JSON.stringify({
              type: "user_disconnected",
              userId: currentUserId,
            })
          );
        }

        console.log("Sent logout notification to WebSocket server");
      } catch (error) {
        console.error("Error sending logout notification:", error);
      }
    }

    // Continue with normal logout process
    localStorage.clear();
    router.push("/login");
  };

  const handleItemClick = (path: string) => {
    setOpen(false);  // Close dropdown
    router.push(path);
  };

  const handleLogout = () => {
    setOpen(false);  // Close dropdown
    logout();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-col justify-center items-center py-4 w-[75px] xl:w-[90px] gap-y-1 cursor-pointer">
          {data?.profile?.profilePicture ? (
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${data.profile.profilePicture}`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            /> 
          ) : (
            <CgProfile className="text-4xl text-[#aeadb3]" />
          )}

          <p className="hidden lg:block text-sm xl:text-base font-semibold text-[#5e6266]">
            {t("myProfile")}
          </p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuSeparator className="p-0" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="py-2 font-semibold">
            <div onClick={() => handleItemClick('/profile')}>{t("yourProfile")}</div>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-2 font-semibold">
            <div onClick={() => handleItemClick('/settings')}>{t("settings")}</div>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-2 font-semibold">
            <div onClick={() => handleItemClick('/payments')}>{t("myPayments")}</div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-2 font-semibold text-pink-mmm"
            onClick={handleLogout}
          >
            {t("logOut")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
