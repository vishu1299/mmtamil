import { IoMdMail } from 'react-icons/io';
import { MdPersonSearch } from "react-icons/md";
import { FiUsers, FiUser } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";

interface MenuItem {
    id: number;
    label: string;
    icon: React.ReactNode;
    notificationCount?: number; 
    url: string;
  }

export const MenuItems: MenuItem[] = [
    { id: 1, label: "Explore", url: "/search", icon: <MdPersonSearch className="text-xl" /> },
    { id: 2, label: "Matches", url: "/matches", icon: <FiUsers className="text-xl" /> },
    { id: 3, label: "Inbox", url: "/mails", icon: <IoMdMail className="text-xl" /> },
    { id: 4, label: "Premium", url: "/premium", icon: <FaCrown className="text-xl" /> },
    { id: 5, label: "Profile", url: "/profile", icon: <FiUser className="text-xl" /> },
  ];