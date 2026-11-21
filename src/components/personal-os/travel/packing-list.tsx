"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress-bar";
import { useTranslations } from "next-intl";
import { packingItems } from "./data";

interface PackingListProps {
  checked: string[];
  onToggle: (id: string, value: boolean) => void;
}

export default function PackingList({ checked, onToggle }: PackingListProps) {
  const t = useTranslations("osSections.travel");
  return (
    <div>
      <p
        aria-live="polite"
        className="mb-3 text-sm text-gray-500 dark:text-gray-400"
      >
        {t("packed", { count: checked.length, total: packingItems.length })}
      </p>
      <Progress
        aria-label={t("packingProgress")}
        value={(checked.length / packingItems.length) * 100}
      />
      <ul className="mt-5 space-y-1">
        {packingItems.map((item) => (
          <li key={item.id}>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Checkbox
                aria-label={t(`packing.${item.id}`)}
                checked={checked.includes(item.id)}
                onCheckedChange={(value) => onToggle(item.id, value)}
              />
              <span
                className={
                  checked.includes(item.id)
                    ? "text-sm text-gray-500 line-through dark:text-gray-400"
                    : "text-sm text-gray-800 dark:text-gray-100"
                }
              >
                {t(`packing.${item.id}`)}
              </span>
            </label>
          </li>
        ))}
      </ul>
      {checked.length === packingItems.length && (
        <p
          role="status"
          className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
        >
          {t("packingComplete")}
        </p>
      )}
    </div>
  );
}
