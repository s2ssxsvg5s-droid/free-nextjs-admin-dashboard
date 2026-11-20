"use client";

import { Button } from "@/components/ui/button";
import { SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import { SparkIcon, XIcon } from "@/icons";
import { useTranslations } from "next-intl";
import { cn } from "@/utils";

interface AppSidebarHeaderProps {
  showContent: boolean;
}

export default function AppSidebarHeader({
  showContent,
}: AppSidebarHeaderProps) {
  const t = useTranslations("osShell");
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <SidebarHeader className="mb-6 flex-row items-center justify-between gap-1 px-5 py-5">
      <Link
        href="/"
        aria-label={t("brand")}
        onClick={() => setOpenMobile(false)}
        className={cn(
          "flex min-h-11 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-brand-500",
          !showContent && "w-full justify-center",
        )}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white dark:bg-brand-500">
          <SparkIcon className="size-6" aria-hidden="true" />
        </span>
        {showContent && (
          <span>
            <span className="block text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
              {t("brand")}
            </span>
            <span className="block text-xs text-gray-500 dark:text-gray-400">
              {t("version")}
            </span>
          </span>
        )}
      </Link>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label={t("closeNavigation")}
          onClick={() => setOpenMobile(false)}
        >
          <XIcon aria-hidden="true" />
        </Button>
      )}
    </SidebarHeader>
  );
}
