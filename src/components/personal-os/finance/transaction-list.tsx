"use client";

import EmptyState from "@/components/personal-os/shared/empty-state";
import { Button } from "@/components/ui/button";
import { TagIcon } from "@/icons";
import { useTranslations } from "next-intl";
import { formatMoney, type Transaction } from "./data";

interface TransactionListProps {
  transactions: Transaction[];
  onClear: () => void;
}

export default function TransactionList({
  transactions,
  onClear,
}: TransactionListProps) {
  const t = useTranslations("osSections.finance");
  if (!transactions.length)
    return (
      <EmptyState
        title={t("emptyTitle")}
        description={t("emptyDescription")}
        action={
          <Button variant="outline" size="lg" onClick={onClear}>
            {t("clearSearch")}
          </Button>
        }
      />
    );

  return (
    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
      {transactions.map((transaction) => (
        <li
          key={transaction.id}
          className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <TagIcon className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {transaction.merchant}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t(`categories.${transaction.category}`)} ·{" "}
              <time dateTime={transaction.date}>
                {new Date(`${transaction.date}T12:00:00Z`).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", timeZone: "UTC" },
                )}
              </time>
            </p>
          </div>
          <span className="shrink-0 text-sm font-medium text-gray-800 tabular-nums dark:text-gray-100">
            −{formatMoney(transaction.amount)}
          </span>
        </li>
      ))}
    </ul>
  );
}
