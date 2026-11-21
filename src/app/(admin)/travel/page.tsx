import TravelDashboard from "@/components/personal-os/travel";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Travel | Personal AI OS",
  description:
    "A fictional Lisbon itinerary and interactive packing checklist.",
};

export default function TravelPage() {
  setRequestLocale("en");
  return <TravelDashboard />;
}
