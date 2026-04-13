import { Image } from "lucide-react";
import type { ReactNode } from "react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { MdMail } from "react-icons/md";
import { RiVipDiamondFill } from "react-icons/ri";

export type PaidFeatureMessageKey =
  | "featureChat"
  | "featureMessages"
  | "featurePlans"
  | "featureGallery";

interface PaidItem {
  messageKey: PaidFeatureMessageKey;
  icon: ReactNode;
}

export const PaidItem: PaidItem[] = [
  {
    messageKey: "featureChat",
    icon: <IoChatbubbleEllipsesOutline className="text-xl" />,
  },
  {
    messageKey: "featureMessages",
    icon: <MdMail className="text-xl" style={{ color: "#FAD1A8" }} />,
  },
  {
    messageKey: "featurePlans",
    icon: <RiVipDiamondFill className="text-xl" style={{ color: "#55A6EE" }} />,
  },
  {
    messageKey: "featureGallery",
    icon: <Image className="text-xl" style={{ color: "#55A6EE" }} />,
  },
];
