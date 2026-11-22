import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "zh-TW"],
  defaultLocale: "zh-TW",
  localePrefix: "never",
});

export type Locale = (typeof routing.locales)[number];
