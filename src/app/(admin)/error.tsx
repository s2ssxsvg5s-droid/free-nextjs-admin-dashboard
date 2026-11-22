"use client";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/personal-os/shared/empty-state";
import { useTranslations } from "next-intl";
export default function DashboardError({ reset }: { reset: () => void }) {
  const t = useTranslations("os");
  return (
    <EmptyState
      title={t("errorTitle")}
      description={t("errorDescription")}
      action={
        <Button size="lg" onClick={reset}>
          {t("retry")}
        </Button>
      }
    />
  );
}
