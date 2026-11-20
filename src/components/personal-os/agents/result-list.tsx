"use client";

import EmptyState from "@/components/personal-os/shared/empty-state";
import SectionCard from "@/components/personal-os/shared/section-card";
import { CheckCircleIcon } from "@/icons";
import { useTranslations } from "next-intl";
import type { AgentJob } from "./data";

interface ResultListProps {
  completed: AgentJob[];
}

export default function ResultList({ completed }: ResultListProps) {
  const t = useTranslations("osAgents");
  return (
    <SectionCard
      title={t("resultsTitle")}
      description={t("resultsDescription")}
    >
      {completed.length === 0 ? (
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      ) : (
        <ul className="space-y-4">
          {completed.map((job) => (
            <li
              key={job.id}
              className="flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900 dark:bg-emerald-500/5"
            >
              <CheckCircleIcon
                className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {t(`jobs.${job.id}.name`)}
                </h3>
                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {t(`jobs.${job.id}.result`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
