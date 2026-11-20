"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useTheme } from "@/context/theme-context";
import { Link } from "@/i18n/navigation";
import { MenuTwoIcon, MoonIcon, SparkIcon, SunIcon, XIcon } from "@/icons";
import { useTranslations } from "next-intl";

export default function AppHeader() {
  const t = useTranslations("osShell");
  const { toggleSidebar, openMobile, open, isMobile } = useSidebar();
  const { toggleTheme, theme } = useTheme();
  const navigationOpen = isMobile ? openMobile : open;

  return (
    <header className="sticky top-0 z-50 flex min-h-20 w-full items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 md:px-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label={
            navigationOpen ? t("closeNavigation") : t("openNavigation")
          }
          aria-expanded={navigationOpen}
          onClick={toggleSidebar}
        >
          {openMobile ? (
            <XIcon aria-hidden="true" />
          ) : (
            <MenuTwoIcon aria-hidden="true" />
          )}
        </Button>
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 text-base font-semibold text-gray-900 focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-brand-500 xl:hidden dark:text-white"
        >
          <SparkIcon
            className="size-5 text-brand-500 dark:text-brand-400"
            aria-hidden="true"
          />
          {t("brand")}
        </Link>
        <p className="hidden text-sm text-gray-500 xl:block dark:text-gray-400">
          {t("tagline")}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <span className="hidden rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 xsm:inline-flex dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300">
          {t("demo")}
        </span>
        <Button
          variant="outline"
          size="icon-lg"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? t("switchLight") : t("switchDark")}
        >
          {theme === "dark" ? (
            <SunIcon aria-hidden="true" />
          ) : (
            <MoonIcon aria-hidden="true" />
          )}
        </Button>
      </div>
    </header>
  );
}
