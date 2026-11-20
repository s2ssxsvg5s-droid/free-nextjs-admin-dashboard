import { Card } from "@/components/ui/card";
import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
  icon?: ReactNode;
}

export default function MetricCard({
  label,
  value,
  detail,
  icon,
}: MetricCardProps) {
  return (
    <Card className="min-w-0 gap-3 rounded-2xl">
      <div className="flex items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
        <span>{label}</span>
        {icon && (
          <span className="rounded-lg bg-brand-50 p-2 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
            {icon}
          </span>
        )}
      </div>
      <p className="text-3xl font-semibold tracking-tight text-gray-900 tabular-nums dark:text-white">
        {value}
      </p>
      <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
        {detail}
      </p>
    </Card>
  );
}
