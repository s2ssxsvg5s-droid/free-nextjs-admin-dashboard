"use client";

import MetricCard from "@/components/personal-os/shared/metric-card";
import PageHeading from "@/components/personal-os/shared/page-heading";
import { Button } from "@/components/ui/button";
import {
  BrainIcon,
  CheckCircleIcon,
  ClockIcon,
  PlayIcon,
  RegenerateIcon,
} from "@/icons";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import AgentCard from "./agent-card";
import { initialJobs } from "./data";
import ResultList from "./result-list";

export default function Agents() {
  const t = useTranslations("osAgents");
  const [jobs, setJobs] = useState(initialJobs);
  const [paused, setPaused] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const running = jobs.some((job) => job.status === "running");
  const completed = jobs.filter((job) => job.status === "completed");
  const queued = jobs.filter((job) => job.status === "queued");

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function runNext() {
    if (running || paused || !queued.length) return;
    const next = queued[0];
    setJobs((items) =>
      items.map((job) =>
        job.id === next.id ? { ...job, status: "running" } : job,
      ),
    );
    setAnnouncement(
      t("runningAnnouncement", { name: t(`jobs.${next.id}.name`) }),
    );
    timer.current = setTimeout(() => {
      setJobs((items) =>
        items.map((job) =>
          job.id === next.id ? { ...job, status: "completed" } : job,
        ),
      );
      setAnnouncement(
        t("completeAnnouncement", { name: t(`jobs.${next.id}.name`) }),
      );
      timer.current = null;
    }, 900);
  }

  function togglePause() {
    setPaused((value) => !value);
    setAnnouncement(
      paused ? t("resumedAnnouncement") : t("pausedAnnouncement"),
    );
  }

  function reset() {
    setJobs(initialJobs);
    setPaused(false);
    setAnnouncement(t("resetAnnouncement"));
  }

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        action={
          <div className="flex flex-wrap gap-2">
            {completed.length === jobs.length ? (
              <Button size="lg" variant="outline" onClick={reset}>
                <RegenerateIcon aria-hidden="true" />
                {t("reset")}
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  disabled={running}
                  onClick={togglePause}
                  aria-pressed={paused}
                >
                  {paused ? t("resume") : t("pause")}
                </Button>
                <Button
                  size="lg"
                  onClick={runNext}
                  disabled={paused || running || !queued.length}
                >
                  <PlayIcon aria-hidden="true" />
                  {running ? t("running") : t("runNext")}
                </Button>
              </>
            )}
          </div>
        }
      />
      <div className="rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm leading-6 text-brand-800 dark:border-brand-900 dark:bg-brand-500/10 dark:text-brand-200">
        {t("demoNotice")}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label={t("agentsLabel")}
          value="3"
          detail={paused ? t("pausedDetail") : t("agentsDetail")}
          icon={<BrainIcon />}
        />
        <MetricCard
          label={t("queuedLabel")}
          value={String(queued.length)}
          detail={t("queuedDetail")}
          icon={<ClockIcon />}
        />
        <MetricCard
          label={t("completedLabel")}
          value={String(completed.length)}
          detail={t("completedDetail")}
          icon={<CheckCircleIcon />}
        />
      </div>
      <div
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
        aria-busy={running}
      >
        {jobs.map((job) => (
          <AgentCard key={job.id} job={job} />
        ))}
      </div>
      <p
        role="status"
        className="text-sm text-brand-700 empty:hidden dark:text-brand-300"
      >
        {announcement}
      </p>
      <ResultList completed={completed} />
    </div>
  );
}
