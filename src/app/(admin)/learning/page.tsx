import Learning from "@/components/personal-os/learning";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "zh-TW", namespace: "osMeta" });
  return { title: t("learningTitle"), description: t("learningDescription") };
}

export default function LearningPage() {
  setRequestLocale("zh-TW");
  return <Learning />;
}
