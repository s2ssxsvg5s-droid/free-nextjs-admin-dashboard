"use client";

import EmptyState from "@/components/personal-os/shared/empty-state";
import SectionCard from "@/components/personal-os/shared/section-card";
import { CheckCircleIcon } from "@/icons";
import { useTranslations } from "next-intl";
import type { LearningSession } from "./data";

interface SessionListProps {
  sessions: LearningSession[];
}

export default function SessionList({ sessions }: SessionListProps) {
  const t = useTranslations("osLearning");
  return (
    <SectionCard
      title={t("sessionsTitle")}
      description={t("sessionsDescription")}
    >
      {sessions.length === 0 ? (
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                <CheckCircleIcon aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {t(`courses.${session.courseId}.title`)}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t("sessionDetail", { minutes: session.minutes })}
                </p>
              </div>
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                {t("logged")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
