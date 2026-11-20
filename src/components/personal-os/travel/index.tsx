"use client";

import EmptyState from "@/components/personal-os/shared/empty-state";
import MetricCard from "@/components/personal-os/shared/metric-card";
import PageHeading from "@/components/personal-os/shared/page-heading";
import SectionCard from "@/components/personal-os/shared/section-card";
import { CalendarIcon, DollarIcon, GlobeIcon, MapIcon } from "@/icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { packingItems } from "./data";
import ItineraryList from "./itinerary-list";
import PackingList from "./packing-list";

export default function TravelDashboard() {
  const t = useTranslations("osSections.travel");
  const [checked, setChecked] = useState<string[]>(
    packingItems.filter((item) => item.checked).map((item) => item.id),
  );

  function toggleItem(id: string, value: boolean) {
    setChecked((previous) =>
      value
        ? [...new Set([...previous, id])]
        : previous.filter((item) => item !== id),
    );
  }

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <section
        className="relative isolate overflow-hidden rounded-2xl bg-linear-to-br from-brand-700 via-brand-600 to-brand-500 p-6 text-white sm:p-8"
        aria-labelledby="trip-title"
      >
        <div
          aria-hidden="true"
          className="absolute -end-16 -top-16 -z-10 size-80 rounded-full border border-white/15 bg-white/5"
        />
        <div
          aria-hidden="true"
          className="absolute -end-6 top-24 -z-10 size-48 rounded-full border border-white/15"
        />
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5">
            {t("nextTrip")}
          </span>
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5">
            {t("countdown")}
          </span>
        </div>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-sm text-brand-100">
              {t("destinationCountry")}
            </p>
            <h2
              id="trip-title"
              className="text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              Lisbon
            </h2>
            <p className="mt-3 flex items-center gap-2 text-sm text-brand-100">
              <CalendarIcon aria-hidden="true" className="size-4" />
              {t("tripDates")}
            </p>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-brand-100">
            {t("tripNote")}
          </p>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label={t("tripBudget")}
          value="$1,650"
          detail={t("budgetDetail")}
          icon={<DollarIcon className="size-5" />}
        />
        <MetricCard
          label={t("booked")}
          value="$925"
          detail={t("bookedDetail")}
          icon={<CalendarIcon className="size-5" />}
        />
        <MetricCard
          label={t("available")}
          value="$725"
          detail={t("availableDetail")}
          icon={<GlobeIcon className="size-5" />}
        />
      </div>
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <SectionCard
          className="xl:col-span-2"
          title={t("itineraryTitle")}
          description={t("itineraryDescription")}
        >
          <ItineraryList />
        </SectionCard>
        <SectionCard
          title={t("packingTitle")}
          description={t("packingDescription")}
        >
          <PackingList checked={checked} onToggle={toggleItem} />
        </SectionCard>
      </div>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <SectionCard title={t("stayTitle")} description={t("stayDescription")}>
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
              <MapIcon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-100">
                Alfama Studio
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t("stayLocation")}
              </p>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                {t("stayDates")}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t("stayMock")}
              </p>
            </div>
          </div>
        </SectionCard>
        <SectionCard title={t("otherTripsTitle")}>
          <EmptyState
            title={t("emptyTitle")}
            description={t("emptyDescription")}
          />
        </SectionCard>
      </div>
    </div>
  );
}
