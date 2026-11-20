"use client";

import MetricCard from "@/components/personal-os/shared/metric-card";
import PageHeading from "@/components/personal-os/shared/page-heading";
import { ClockIcon, TargetIcon, TaskIcon } from "@/icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import CourseCard from "./course-card";
import {
  courses as initialCourses,
  type Course,
  type LearningSession,
} from "./data";
import SessionList from "./session-list";

export default function Learning() {
  const t = useTranslations("osLearning");
  const [courses, setCourses] = useState(initialCourses);
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const loggedMinutes = sessions.reduce(
    (total, session) => total + session.minutes,
    0,
  );

  function logSession(id: Course["id"]) {
    const course = courses.find((item) => item.id === id);
    if (!course || course.minutes >= course.totalMinutes) return;
    const minutes = Math.min(15, course.totalMinutes - course.minutes);
    setCourses((items) =>
      items.map((item) =>
        item.id === id ? { ...item, minutes: item.minutes + minutes } : item,
      ),
    );
    setSessions((items) => [
      { id: items.length + 1, courseId: id, minutes },
      ...items,
    ]);
    setAnnouncement(
      t("sessionAnnouncement", { course: t(`courses.${id}.title`), minutes }),
    );
  }

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label={t("weeklyLabel")}
          value={t("minuteValue", { minutes: 140 + loggedMinutes })}
          detail={t("weeklyDetail")}
          icon={<ClockIcon />}
        />
        <MetricCard
          label={t("coursesLabel")}
          value={String(
            courses.filter((course) => course.minutes < course.totalMinutes)
              .length,
          )}
          detail={t("coursesDetail")}
          icon={<TaskIcon />}
        />
        <MetricCard
          label={t("goalLabel")}
          value={`${Math.min(100, Math.round(((140 + loggedMinutes) / 180) * 100))}%`}
          detail={t("goalDetail")}
          icon={<TargetIcon />}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} onLog={logSession} />
        ))}
      </div>
      <p
        role="status"
        className="text-sm text-emerald-700 empty:hidden dark:text-emerald-300"
      >
        {announcement}
      </p>
      <SessionList sessions={sessions} />
    </div>
  );
}
