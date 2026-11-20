import Agents from "@/components/personal-os/agents";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "AI Agents | Personal AI OS",
  description:
    "Explore a deterministic local agent simulation using mock data.",
};

export default async function AgentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Agents />;
}
