"use client";

import {
  SidebarMenuItem as UiSidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { NavItem } from "./types";

interface SidebarMenuItemProps {
  nav: NavItem;
  showContent: boolean;
  pathname: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function SidebarMenuItem({
  nav,
  showContent,
  pathname,
}: SidebarMenuItemProps) {
  const t = useTranslations("osShell");
  const { setOpenMobile } = useSidebar();
  const isActive = nav.path === pathname;
  if (!nav.path) return null;

  return (
    <UiSidebarMenuItem>
      <Link
        href={nav.path}
        aria-current={isActive ? "page" : undefined}
        aria-label={t(`navigation.${nav.key}`)}
        title={!showContent ? t(`navigation.${nav.key}`) : undefined}
        onClick={() => setOpenMobile(false)}
        className={cn(
          "menu-item min-h-12 gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-brand-500",
          isActive ? "menu-item-active" : "menu-item-inactive",
          !showContent && "justify-center",
        )}
      >
        <span
          className={
            isActive ? "menu-item-icon-active" : "menu-item-icon-inactive"
          }
        >
          {nav.icon}
        </span>
        {showContent && (
          <span className="menu-item-text">{t(`navigation.${nav.key}`)}</span>
        )}
      </Link>
    </UiSidebarMenuItem>
  );
}
