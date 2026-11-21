"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "@/layout/app-layout/header";
import AppSidebar from "@/layout/app-layout/sidebar";
import { useTranslations } from "next-intl";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("osShell");
  return (
    <SidebarProvider className="bg-gray-50 dark:bg-gray-900">
      <a
        href="#main-content"
        className="sr-only z-99 rounded-lg bg-brand-500 p-3 text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      >
        {t("skipNavigation")}
      </a>
      <AppSidebar />
      <SidebarInset className="bg-gray-50 outline-none dark:bg-gray-900">
        <AppHeader />
        <div
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-(--breakpoint-2xl) p-4 pb-8 md:p-6 md:pb-10"
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
