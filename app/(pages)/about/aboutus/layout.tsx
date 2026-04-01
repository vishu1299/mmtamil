import { ReactNode } from "react";
import { redirect } from "next/navigation";

export default function AboutUsLayout({ children }: { children: ReactNode }) {
  void children;
  redirect("/");
}
