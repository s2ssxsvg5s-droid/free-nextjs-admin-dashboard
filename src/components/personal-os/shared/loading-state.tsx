import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

export default function LoadingState() {
  const t = useTranslations("os");
  return (
    <div role="status" className="space-y-6">
      <span className="sr-only">{t("loading")}</span>
      <Skeleton className="h-10 w-48 bg-gray-200 dark:bg-gray-800" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i}>
            <Skeleton className="h-24 bg-gray-200 dark:bg-gray-800" />
          </Card>
        ))}
      </div>
      <Card>
        <Skeleton className="h-64 bg-gray-200 dark:bg-gray-800" />
      </Card>
    </div>
  );
}
