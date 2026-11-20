"use client";

import SectionCard from "@/components/personal-os/shared/section-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress-bar";
import { CheckCircleIcon, PlayIcon } from "@/icons";
import { useTranslations } from "next-intl";
import type { Course } from "./data";

interface CourseCardProps {
  course: Course;
  onLog: (id: Course["id"]) => void;
}

export default function CourseCard({ course, onLog }: CourseCardProps) {
  const t = useTranslations("osLearning");
  const percent = Math.round((course.minutes / course.totalMinutes) * 100);
  const completed = percent === 100;
  return (
    <SectionCard
      title={t(`courses.${course.id}.title`)}
      description={t(`courses.${course.id}.subtitle`)}
    >
      <div className="flex flex-col gap-5">
        <span
          className={`w-fit rounded-lg px-3 py-1 text-xs font-medium ${course.color}`}
        >
          {t(`courses.${course.id}.category`)}
        </span>
        <p className="min-h-12 text-sm leading-6 text-gray-500 dark:text-gray-400">
          {t(`courses.${course.id}.description`)}
        </p>
        <div className="space-y-2">
          <div className="flex flex-wrap justify-between gap-2 text-sm text-gray-600 dark:text-gray-300">
            <span>
              {t("minutes", {
                current: course.minutes,
                total: course.totalMinutes,
              })}
            </span>
            <span className="font-medium">{percent}%</span>
          </div>
          <Progress
            value={percent}
            aria-label={t("progressLabel", {
              course: t(`courses.${course.id}.title`),
            })}
          />
        </div>
        <Button
          size="lg"
          variant={completed ? "outline" : "default"}
          className="w-full"
          disabled={completed}
          onClick={() => onLog(course.id)}
        >
          {completed ? (
            <CheckCircleIcon aria-hidden="true" />
          ) : (
            <PlayIcon aria-hidden="true" />
          )}
          {completed ? t("completed") : t("logSession")}
        </Button>
      </div>
    </SectionCard>
  );
}
