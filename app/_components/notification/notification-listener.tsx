"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToastNotification from "./toast-notification";
import Link from "next/link";
import { useRouter } from "next/navigation";

type EventData = {
  userId: number;
  targetId?: number;
  message: string;
  isGlobal: boolean;
  recipients?: number[];
};


export default function NotificationListener() {
  const [userId, setUserId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const tokens = localStorage.getItem("access-token");
    if (tokens) {
      const t = JSON.parse(tokens);
      setUserId(t.data.result.id);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    const es = new EventSource(
      `${process.env.NEXT_PUBLIC_BASE_URL}notifications/receive`
    );
    const handler = (e: MessageEvent<string>) => {
      const n = JSON.parse(e.data) as EventData;
      console.log("This is n", n);
      console.log("Logged in", userId);
      console.log("Recepient",n.recipients);
      

      if (n.recipients && n.recipients.includes(userId)) {
        toast(<ToastNotification userId={n.userId} message={n.message} />);
      }


      // if (n.isGlobal && n.userId !== userId) {
      //   // <ToastWrapper userId={n.userId} message={n.message} />
      //     toast(
      //       <div onClick={() => router.push(`/profile/${n.userId}`) }>
      //         <ToastNotification  userId={n.userId} message={n.message}/>
      //     </div>
      //   );
      //   // toast.info(n.message, { className: "bg-stone-200 text-stone-700" });
      // }
      // else if (n.targetId && n.targetId === userId) {
      //   // <ToastWrapper userId={n.userId} message={n.message} />
      //   toast(<ToastNotification  userId={n.userId} message={n.message}/>);
      // }
      //   else if (n.userId === userId) {
      //     toast(<ToastNotification  userId={n.userId} message={n.message}/>);
      //     // toast.info(n.message, { className: "bg-stone-200 text-stone-700" });
      //   }
    };

    es.addEventListener("notification", handler);
    return () => {
      es.removeEventListener("notification", handler);
      es.close();
    };
  }, [userId]);

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        toastClassName="toast-top-down"
      />

      {/* {notifications && <ToastWrapper
        key={`${notifications.userId}-${notifications.message}`} // ensure unique key if message changes
        userId={notifications.userId}
        message={notifications.message}
      />} */}
    </>
  );
}
