"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useState } from "react";
import EmptyState from "../shared/empty-state";
import SectionCard from "../shared/section-card";
import type { FocusTask } from "./data";

interface FocusListProps {
  tasks: FocusTask[];
  onToggle: (id: string) => void;
  onAdd: (label: string) => void;
}
export default function FocusList({ tasks, onToggle, onAdd }: FocusListProps) {
  const t = useTranslations("os");
  const [text, setText] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const visible = tasks.filter((task) => showCompleted || !task.done);
  return (
    <SectionCard
      title={t("focusTitle")}
      description={t("taskCount", {
        completed: tasks.filter((task) => task.done).length,
        total: tasks.length,
      })}
      action={
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setShowCompleted(!showCompleted)}
        >
          {t(showCompleted ? "hideCompleted" : "showCompleted")}
        </Button>
      }
    >
      <div className="space-y-2">
        {visible.length === 0 ? (
          <EmptyState
            title={t("allDone")}
            description={t("allDoneDescription")}
          />
        ) : (
          visible.map((task) => (
            <label
              key={task.id}
              className="flex min-h-16 cursor-pointer items-center gap-4 rounded-xl border border-gray-100 p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
            >
              <Checkbox
                checked={task.done}
                onCheckedChange={() => onToggle(task.id)}
                aria-label={
                  task.category === "custom"
                    ? task.label
                    : t(`tasks.${task.label}`)
                }
              />
              <span className="min-w-0 flex-1">
                <span
                  className={`block text-sm font-medium break-words ${task.done ? "text-gray-400 line-through dark:text-gray-500" : "text-gray-800 dark:text-gray-100"}`}
                >
                  {task.category === "custom"
                    ? task.label
                    : t(`tasks.${task.label}`)}
                </span>
                <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                  {t(`categories.${task.category}`)}
                </span>
              </span>
            </label>
          ))
        )}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (text.trim()) {
            onAdd(text.trim());
            setText("");
          }
        }}
      >
        <Input
          aria-label={t("newFocus")}
          placeholder={t("newFocus")}
          value={text}
          maxLength={100}
          onChange={(event) => setText(event.target.value)}
          className="text-base"
        />
        <Button
          type="submit"
          variant="outline"
          size="lg"
          disabled={!text.trim()}
        >
          {t("add")}
        </Button>
      </form>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {t("sessionOnly")}
      </p>
    </SectionCard>
  );
}
