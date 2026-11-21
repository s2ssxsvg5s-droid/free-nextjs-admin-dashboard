import Learning from "@/components/personal-os/learning";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Learning | Personal AI OS",
  description: "Build a steady learning habit with a local demo learning plan.",
};

export default function LearningPage() {
  setRequestLocale("en");
  return <Learning />;
}
