"use client";

import EmptyState from "@/components/personal-os/shared/empty-state";
import MetricCard from "@/components/personal-os/shared/metric-card";
import PageHeading from "@/components/personal-os/shared/page-heading";
import SectionCard from "@/components/personal-os/shared/section-card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress-bar";
import { DollarIcon, PieChartIcon, TargetIcon } from "@/icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import CashflowChart from "./cashflow-chart";
import { budget, formatMoney, transactions } from "./data";
import TransactionList from "./transaction-list";

export default function FinanceDashboard() {
  const t = useTranslations("osSections.finance");
  const [query, setQuery] = useState("");
  const visibleTransactions = transactions.filter((transaction) =>
    `${transaction.merchant} ${t(`categories.${transaction.category}`)}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label={t("netWorth")}
          value="$48,250"
          detail={t("netWorthDetail")}
          icon={<PieChartIcon className="size-5" />}
        />
        <MetricCard
          label={t("cash")}
          value="$12,450"
          detail={t("cashDetail")}
          icon={<DollarIcon className="size-5" />}
        />
        <MetricCard
          label={t("invested")}
          value="$35,800"
          detail={t("investedDetail")}
          icon={<TargetIcon className="size-5" />}
        />
      </div>
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <SectionCard
          title={t("cashflowTitle")}
          description={t("cashflowDescription")}
          className="min-w-0 xl:col-span-2"
        >
          <CashflowChart />
        </SectionCard>
        <SectionCard
          title={t("budgetTitle")}
          description={t("budgetDescription")}
        >
          <p className="text-3xl font-semibold text-gray-900 tabular-nums dark:text-white">
            {formatMoney(budget.limit - budget.spent)}
            <span className="ms-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              {t("remaining")}
            </span>
          </p>
          <div className="mt-5">
            <Progress
              aria-label={t("budgetProgress")}
              value={Math.round((budget.spent / budget.limit) * 100)}
            />
          </div>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {t("budgetSummary", {
              spent: formatMoney(budget.spent),
              limit: formatMoney(budget.limit),
            })}
          </p>
          <dl className="mt-6 space-y-4 border-t border-gray-100 pt-5 text-sm dark:border-gray-800">
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500 dark:text-gray-400">
                {t("income")}
              </dt>
              <dd className="font-medium text-gray-800 dark:text-gray-100">
                {formatMoney(budget.income)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500 dark:text-gray-400">{t("saved")}</dt>
              <dd className="font-medium text-emerald-700 dark:text-emerald-400">
                {formatMoney(budget.income - budget.spent)}
              </dd>
            </div>
          </dl>
        </SectionCard>
      </div>
      <SectionCard
        title={t("transactionsTitle")}
        description={t("transactionsDescription")}
        action={
          <div className="w-full sm:w-64">
            <label htmlFor="transaction-search" className="sr-only">
              {t("searchLabel")}
            </label>
            <Input
              id="transaction-search"
              type="search"
              className="text-base"
              placeholder={t("searchPlaceholder")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        }
      >
        <div
          aria-live="polite"
          className="mb-4 text-xs text-gray-500 dark:text-gray-400"
        >
          {t("results", { count: visibleTransactions.length })}
        </div>
        <TransactionList
          transactions={visibleTransactions}
          onClear={() => setQuery("")}
        />
      </SectionCard>
      <SectionCard title={t("connectionsTitle")}>
        <EmptyState
          title={t("connectionsEmptyTitle")}
          description={t("connectionsEmptyDescription")}
        />
      </SectionCard>
    </div>
  );
}
