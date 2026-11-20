import TravelDashboard from "@/components/personal-os/travel";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Travel | Personal AI OS",
  description:
    "A fictional Lisbon itinerary and interactive packing checklist.",
};

export default async function TravelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TravelDashboard />;
}
