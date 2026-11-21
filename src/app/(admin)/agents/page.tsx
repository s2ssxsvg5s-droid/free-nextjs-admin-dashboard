import Agents from "@/components/personal-os/agents";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "zh-TW", namespace: "osMeta" });
  return { title: t("agentsTitle"), description: t("agentsDescription") };
}

export default function AgentsPage() {
  setRequestLocale("zh-TW");
  return <Agents />;
}
