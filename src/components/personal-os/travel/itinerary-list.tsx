"use client";

import { useTranslations } from "next-intl";
import { itinerary } from "./data";

export default function ItineraryList() {
  const t = useTranslations("osSections.travel");
  return (
    <ol className="space-y-5">
      {itinerary.map((item) => (
        <li key={item.day} className="flex gap-4">
          <time
            dateTime={`2026-11-${item.day}`}
            className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
          >
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t(`weekdays.${item.weekday}`)}
            </span>
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {item.day}
            </span>
          </time>
          <div className="min-w-0 pt-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {t(`itinerary.${item.title}`)}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {item.time}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {t(`itinerary.${item.detail}`)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
