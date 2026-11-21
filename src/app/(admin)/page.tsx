import TodayDashboard from "@/components/personal-os/today";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Today · Personal OS",
  description:
    "Your day, finances, travel, learning and local agent demos in one personal workspace.",
};

export default function TodayPage() {
  setRequestLocale("en");
  return <TodayDashboard />;
}
