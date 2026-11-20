export interface FocusTask {
  id: string;
  label: string;
  category: string;
  done: boolean;
}
export const initialTasks: FocusTask[] = [
  { id: "budget", label: "budget", category: "finance", done: false },
  { id: "packing", label: "packing", category: "travel", done: false },
  { id: "lesson", label: "lesson", category: "learning", done: false },
  { id: "weekly", label: "weekly", category: "personal", done: true },
];
export const weeklyMinutes = [20, 45, 30, 0, 45, 0, 0];
export const weekDays = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;
