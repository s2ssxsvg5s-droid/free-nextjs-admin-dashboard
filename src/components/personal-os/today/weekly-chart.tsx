"use client";
import { useTheme } from "@/context/theme-context";
import type { ApexOptions } from "apexcharts";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { weekDays, weeklyMinutes } from "./data";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-52 animate-pulse rounded-xl bg-gray-100 motion-reduce:animate-none dark:bg-gray-800" />
  ),
});

export default function WeeklyChart() {
  const t = useTranslations("os");
  const { theme } = useTheme();
  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "inherit",
      animations: { enabled: false },
    },
    colors: ["#465fff"],
    plotOptions: { bar: { borderRadius: 5, columnWidth: "36%" } },
    dataLabels: { enabled: false },
    grid: {
      borderColor: theme === "dark" ? "#1e2939" : "#f3f4f6",
      strokeDashArray: 4,
    },
    xaxis: {
      categories: weekDays.map((day) => t(`days.${day}`)),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 60,
      tickAmount: 3,
      labels: { formatter: (value) => `${value}m` },
    },
    theme: { mode: theme },
    tooltip: { y: { formatter: (value) => t("minutes", { count: value }) } },
  };
  return (
    <div>
      <div aria-hidden="true" className="min-w-0" data-testid="weekly-chart">
        <ReactApexChart
          options={options}
          series={[{ name: t("focusTime"), data: weeklyMinutes }]}
          type="bar"
          height={210}
          width="100%"
        />
      </div>
      <details className="text-xs text-gray-500 dark:text-gray-400">
        <summary className="cursor-pointer py-3 focus-visible:outline-brand-500">
          {t("chartData")}
        </summary>
        <table className="mt-2 w-full text-start">
          <caption className="sr-only">{t("weeklyTitle")}</caption>
          <thead>
            <tr>
              <th scope="col" className="py-1 text-start">
                {t("day")}
              </th>
              <th scope="col" className="text-end">
                {t("focusTime")}
              </th>
            </tr>
          </thead>
          <tbody>
            {weekDays.map((day, i) => (
              <tr key={day}>
                <th scope="row" className="py-1 text-start font-normal">
                  {t(`days.${day}`)}
                </th>
                <td className="text-end">
                  {t("minutes", { count: weeklyMinutes[i] })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
