export interface Course {
  id: "typescript" | "design" | "portuguese";
  minutes: number;
  totalMinutes: number;
  color: string;
}

export const courses: Course[] = [
  {
    id: "typescript",
    minutes: 45,
    totalMinutes: 120,
    color:
      "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
  },
  {
    id: "design",
    minutes: 90,
    totalMinutes: 180,
    color:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
  {
    id: "portuguese",
    minutes: 30,
    totalMinutes: 90,
    color:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
];

export interface LearningSession {
  id: number;
  courseId: Course["id"];
  minutes: number;
}
