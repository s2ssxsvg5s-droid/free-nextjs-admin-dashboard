import TodayDashboard from "@/components/personal-os/today";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "zh-TW", namespace: "osMeta" });
  return { title: t("todayTitle"), description: t("todayDescription") };
}

export default function TodayPage() {
  setRequestLocale("zh-TW");
  return <TodayDashboard />;
}
