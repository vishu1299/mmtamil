import { Image } from "lucide-react";
import type { ReactNode } from "react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { MdMail } from "react-icons/md";
import { RiVipDiamondFill } from "react-icons/ri";

interface PaidItem {
  title: string;
  titleTa: string;
  icon: ReactNode;
}

export const PaidItem: PaidItem[] = [
  {
    title: "Chat instantly with matched profiles",
    titleTa: "பொருந்திய சுயவிவரங்களுடன் உடனடியாக அரட்டை அடிக்கலாம்",
    icon: <IoChatbubbleEllipsesOutline className="text-xl" />,
  },
  {
    title: "Send and receive unlimited messages",
    titleTa: "வரம்பற்ற செய்திகளை அனுப்பி பெறலாம்",
    icon: <MdMail className="text-xl" style={{ color: "#FAD1A8" }} />,
  },
  {
    title: "Access all premium plans and priority feature",
    titleTa: "அனைத்து பிரீமியம் திட்டங்கள் மற்றும் முன்னுரிமை சிறப்பம்சங்களை அணுகலாம்",
    icon: <RiVipDiamondFill className="text-xl" style={{ color: "#55A6EE" }} />,
  },
  {
    title: "See gallery images of the profiles",
    titleTa: "சுயவிவரங்களின் கேலரி படங்களைக் காணலாம்",
    icon: <Image className="text-xl" style={{ color: "#55A6EE" }} />,
  },
];


  
