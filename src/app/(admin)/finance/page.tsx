import FinanceDashboard from "@/components/personal-os/finance";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "zh-TW", namespace: "osMeta" });
  return { title: t("financeTitle"), description: t("financeDescription") };
}

export default function FinancePage() {
  setRequestLocale("zh-TW");
  return <FinanceDashboard />;
}
