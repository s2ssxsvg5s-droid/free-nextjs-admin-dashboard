"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress-bar";
import { Link } from "@/i18n/navigation";
import {
  AiIcon,
  ArrowRightIcon,
  CalendarIcon,
  DollarIcon,
  TargetIcon,
  TimeIcon,
} from "@/icons";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { courses } from "../learning/data";
import MetricCard from "../shared/metric-card";
import PageHeading from "../shared/page-heading";
import SectionCard from "../shared/section-card";
import { initialTasks } from "./data";
import FocusList from "./focus-list";
import WeeklyChart from "./weekly-chart";

export default function TodayDashboard() {
  const t = useTranslations("os");
  const [tasks, setTasks] = useState(initialTasks);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshed, setRefreshed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const course = courses[0];
  const coursePercent = Math.round(
    (course.minutes / course.totalMinutes) * 100,
  );
  const completed = tasks.filter((task) => task.done).length;
  function refreshBrief() {
    setRefreshing(true);
    timer.current = setTimeout(() => {
      setRefreshing(false);
      setRefreshed(true);
    }, 650);
  }
  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow={t("date")}
        title={t("greeting")}
        description={t("intro")}
        action={
          <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {t("workspace")}
          </span>
        }
      />
      <section
        className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand-950 via-brand-900 to-brand-700 p-5 text-white sm:p-7"
        aria-labelledby="brief-title"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-12 -top-16 size-72 rounded-full border border-white/10 bg-white/5"
        />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-brand-100">
              <AiIcon aria-hidden="true" className="size-5" />
              {t("briefEyebrow")}
              <span className="rounded-full bg-white/10 px-2 py-1">
                {t("localDemo")}
              </span>
            </div>
            <h2
              id="brief-title"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              {t("briefTitle")}
            </h2>
            <p className="mt-3 text-sm leading-7 text-brand-100">
              {t("briefDescription", { remaining: tasks.length - completed })}
            </p>
            <p
              role="status"
              aria-live="polite"
              className="mt-3 text-xs text-brand-200"
            >
              {t(
                refreshing
                  ? "refreshing"
                  : refreshed
                    ? "refreshed"
                    : "briefNote",
              )}
            </p>
          </div>
          <Button
            variant="outline"
            size="lg"
            disabled={refreshing}
            onClick={refreshBrief}
            className="border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white dark:border-white/25 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            {t(refreshing ? "refreshingButton" : "refreshBrief")}
          </Button>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={t("netWorth")}
          value="$48,250"
          detail={t("netWorthDetail")}
          icon={<DollarIcon className="size-5" aria-hidden="true" />}
        />
        <MetricCard
          label={t("focus")}
          value={`${completed}/${tasks.length}`}
          detail={t("focusDetail")}
          icon={<TargetIcon className="size-5" aria-hidden="true" />}
        />
        <MetricCard
          label={t("nextTrip")}
          value={t("sixDays")}
          detail={t("tripDate")}
          icon={<CalendarIcon className="size-5" aria-hidden="true" />}
        />
        <MetricCard
          label={t("learningTime")}
          value={t("learningValue")}
          detail={t("learningDetail")}
          icon={<TimeIcon className="size-5" aria-hidden="true" />}
        />
      </div>
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-5">
        <div className="min-w-0 space-y-6 xl:col-span-3">
          <FocusList
            tasks={tasks}
            onToggle={(id) =>
              setTasks((current) =>
                current.map((task) =>
                  task.id === id ? { ...task, done: !task.done } : task,
                ),
              )
            }
            onAdd={(label) =>
              setTasks((current) => [
                ...current,
                {
                  id: `focus-${Date.now()}-${current.length}`,
                  label,
                  category: "custom",
                  done: false,
                },
              ])
            }
          />
          <SectionCard
            title={t("weeklyTitle")}
            description={t("weeklyDescription")}
            action={
              <span className="rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                {t("weeklyTotal")}
              </span>
            }
          >
            <WeeklyChart />
          </SectionCard>
        </div>
        <div className="min-w-0 space-y-6 xl:col-span-2">
          <SectionCard title={t("tripTitle")} description={t("tripSubtitle")}>
            <div className="rounded-xl bg-linear-to-br from-cyan-50 to-brand-50 p-5 dark:from-cyan-950 dark:to-brand-950">
              <p className="text-xs font-medium tracking-widest text-brand-600 uppercase dark:text-brand-300">
                {t("portugal")}
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {t("lisbon")}
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {t("tripDate")}
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                <span className="size-2 rounded-full bg-emerald-500" />
                {t("tripReady")}
              </div>
            </div>
            <Link
              href="/travel"
              className="inline-flex min-h-11 items-center justify-between gap-2 text-sm font-medium text-brand-600 hover:underline dark:text-brand-300"
            >
              {t("viewTrip")}
              <ArrowRightIcon
                aria-hidden="true"
                className="size-4 rtl:rotate-180"
              />
            </Link>
          </SectionCard>
          <SectionCard
            title={t("keepLearning")}
            description={t("courseSubtitle")}
          >
            <div className="flex items-center gap-3">
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-xl dark:bg-amber-950"
                aria-hidden="true"
              >
                ✦
              </span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {t("courseTitle")}
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t("courseLesson")}
                </p>
              </div>
            </div>
            <Progress
              value={coursePercent}
              aria-label={t("courseProgress", { percent: coursePercent })}
            />
            <div className="flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span>{t("courseProgress", { percent: coursePercent })}</span>
              <span>{t("courseDuration")}</span>
            </div>
            <Link
              href="/learning"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand-600 hover:underline dark:text-brand-300"
            >
              {t("continueLearning")}
              <ArrowRightIcon
                aria-hidden="true"
                className="size-4 rtl:rotate-180"
              />
            </Link>
          </SectionCard>
          <p className="px-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
            {t("privacyNote")}
          </p>
        </div>
      </div>
    </div>
  );
}
