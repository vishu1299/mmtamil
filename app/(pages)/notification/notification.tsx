"use client";

import { useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

type EventData = {
  userId: number;
  message: string;
  isGlobal: boolean;
};

interface User {
  id: number | string;
}

interface NotificationsProps {
  user: User | null;
}

const Notifications = ({ user }: NotificationsProps) => {
  useEffect(() => {
    // Skip SSE connection if no user
    if (!user) return;

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_BASE_URL}notifications/receive`
    );

    const notificationEventHandler = (event: MessageEvent<string>) => {
      const notification = JSON.parse(event.data) as EventData;

      if (notification.isGlobal) {
        if (notification.userId !== user?.id) {
          window.alert("Notification get")
          toast.info(
            <div>
              <p>{notification.message}</p>
            </div>,
            {
              className: "bg-stone-200  text-stone-700",
            }
          );
        }
      } else if (notification.userId === user?.id) {
        toast.info(
          <div>
            <p>{notification.message}</p>
          </div>,
          {
            className: "bg-stone-200 text-stone-700",
          }
        );
      }
    };

    eventSource.addEventListener("notification", notificationEventHandler);

    return () => {
      eventSource.removeEventListener("notification", notificationEventHandler);
      eventSource.close();
    };
  }, [user, user?.id]);

  return (
    <Link
      href={{ pathname: "/notifications", query: { page: 1 } }}
      className="home-notifications-menu flex cursor-pointer items-center gap-2.5 py-2.5 font-semibold text-gray-400 duration-300 hover:text-blue-600 rtl:justify-end rtl:gap-2 rtl:pr-1"
    >
      Notifications
    </Link>
  );
};

export default Notifications;
