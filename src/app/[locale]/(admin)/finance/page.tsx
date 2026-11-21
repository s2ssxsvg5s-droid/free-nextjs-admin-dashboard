import FinanceDashboard from "@/components/personal-os/finance";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Finance | Personal AI OS",
  description:
    "Explore a mock personal finance overview. All figures are fictional.",
};

export default async function FinancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FinanceDashboard />;
}
