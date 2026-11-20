"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { navItems } from "./data";
import AppSidebarHeader from "./sidebar-header";
import SidebarMenuItem from "./sidebar-menu-item";
import SidebarWidget from "./sidebar-widget";

export default function AppSidebar() {
  const { open, isMobile, isHovered } = useSidebar();
  const pathname = usePathname();
  const t = useTranslations("osShell");
  const showContent = open || isHovered || isMobile;

  return (
    <Sidebar side="left" collapsible="icon">
      <AppSidebarHeader showContent={showContent} />
      <SidebarContent className="px-5">
        <nav aria-label={t("navigationLabel")}>
          {showContent && (
            <p className="mb-3 px-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
              {t("navigationHeading")}
            </p>
          )}
          <SidebarMenu className="gap-2">
            {navItems.map((nav) => (
              <SidebarMenuItem
                key={nav.key}
                nav={nav}
                showContent={showContent}
                pathname={pathname}
              />
            ))}
          </SidebarMenu>
        </nav>
      </SidebarContent>
      {showContent && (
        <SidebarFooter className="p-5">
          <SidebarWidget />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
