"use client";

import { useTheme } from "@/context/theme-context";
import type { ApexOptions } from "apexcharts";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { cashflow, formatMoney } from "./data";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function CashflowChart() {
  const t = useTranslations("osSections.finance");
  const { theme } = useTheme();
  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      animations: { enabled: false },
      fontFamily: "inherit",
      foreColor: theme === "dark" ? "#98a2b3" : "#667085",
    },
    colors: ["#465fff", "#9cb9ff"],
    plotOptions: { bar: { borderRadius: 4, columnWidth: "52%" } },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    grid: {
      borderColor: theme === "dark" ? "#1d2939" : "#eaecf0",
      strokeDashArray: 4,
    },
    xaxis: {
      categories: cashflow.months.map((month) => t(`months.${month}`)),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        formatter: (value: number) => t("axisAmount", { count: value / 1000 }),
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      markers: { size: 5 },
      fontSize: "13px",
    },
    tooltip: { theme, y: { formatter: formatMoney } },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: { fontSize: "12px" },
          yaxis: { labels: { minWidth: 24, maxWidth: 32 } },
        },
      },
    ],
  };

  return (
    <figure className="min-w-0" aria-label={t("chartLabel")}>
      <div aria-hidden="true" className="min-h-72">
        <ReactApexChart
          type="bar"
          height={288}
          options={options}
          series={[
            { name: t("income"), data: cashflow.income },
            { name: t("spending"), data: cashflow.expenses },
          ]}
        />
      </div>
      <figcaption className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        {t("chartCaption")}
      </figcaption>
      <details className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        <summary className="cursor-pointer py-3">{t("chartData")}</summary>
        <table className="w-full table-fixed text-start">
          <caption>{t("chartLabel")}</caption>
          <thead>
            <tr>
              <th scope="col" className="py-2 text-start">
                {t("month")}
              </th>
              <th scope="col" className="text-start">
                {t("income")}
              </th>
              <th scope="col" className="text-start">
                {t("spending")}
              </th>
            </tr>
          </thead>
          <tbody>
            {cashflow.months.map((month, index) => (
              <tr key={month}>
                <th scope="row" className="py-1 text-start font-normal">
                  {t(`months.${month}`)}
                </th>
                <td>{formatMoney(cashflow.income[index])}</td>
                <td>{formatMoney(cashflow.expenses[index])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
