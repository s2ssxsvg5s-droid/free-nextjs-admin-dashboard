import { CheckCircleIcon } from "@/icons";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-5 py-10 text-center dark:border-gray-700 dark:bg-gray-900">
      <CheckCircleIcon
        aria-hidden="true"
        className="mb-3 size-8 text-brand-500 dark:text-brand-300"
      />
      <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
