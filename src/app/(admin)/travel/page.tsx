import TravelDashboard from "@/components/personal-os/travel";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "zh-TW", namespace: "osMeta" });
  return { title: t("travelTitle"), description: t("travelDescription") };
}

export default function TravelPage() {
  setRequestLocale("zh-TW");
  return <TravelDashboard />;
}
