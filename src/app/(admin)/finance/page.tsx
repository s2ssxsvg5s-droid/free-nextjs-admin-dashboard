import FinanceDashboard from "@/components/personal-os/finance";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Finance | Personal AI OS",
  description:
    "Explore a mock personal finance overview. All figures are fictional.",
};

export default function FinancePage() {
  setRequestLocale("en");
  return <FinanceDashboard />;
}
