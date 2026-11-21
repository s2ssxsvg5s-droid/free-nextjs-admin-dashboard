"use client";

import SectionCard from "@/components/personal-os/shared/section-card";
import { BrainIcon, CheckCircleIcon, ClockIcon } from "@/icons";
import { useTranslations } from "next-intl";
import type { AgentJob } from "./data";

interface AgentCardProps {
  job: AgentJob;
}

export default function AgentCard({ job }: AgentCardProps) {
  const t = useTranslations("osAgents");
  return (
    <SectionCard title={t(`jobs.${job.id}.name`)}>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            <BrainIcon aria-hidden="true" />
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t(`status.${job.status}`)}
          </span>
          {job.status === "running" && (
            <span
              aria-hidden="true"
              className="size-2 animate-pulse rounded-full bg-brand-500 motion-reduce:animate-none"
            />
          )}
        </div>
        <p className="min-h-12 text-sm leading-6 text-gray-500 dark:text-gray-400">
          {t(`jobs.${job.id}.description`)}
        </p>
        <div className="flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          {job.status === "completed" ? (
            <CheckCircleIcon
              className="size-4 text-emerald-600 dark:text-emerald-400"
              aria-hidden="true"
            />
          ) : (
            <ClockIcon className="size-4" aria-hidden="true" />
          )}
          {t("localOnly")}
        </div>
      </div>
    </SectionCard>
  );
}
