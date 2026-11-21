import Agents from "@/components/personal-os/agents";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "AI Agents | Personal AI OS",
  description:
    "Explore a deterministic local agent simulation using mock data.",
};

export default function AgentsPage() {
  setRequestLocale("en");
  return <Agents />;
}
