"use client";

import { SparkIcon } from "@/icons";
import { useTranslations } from "next-intl";

export default function SidebarWidget() {
  const t = useTranslations("osShell");
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
      <SparkIcon
        className="mb-3 size-5 text-brand-500 dark:text-brand-400"
        aria-hidden="true"
      />
      <p className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
        {t("workspace")}
      </p>
      <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        {t("workspaceDescription")}
      </p>
    </div>
  );
}
