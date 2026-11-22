"use client";

import EmptyState from "@/components/personal-os/shared/empty-state";
import SectionCard from "@/components/personal-os/shared/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { useId } from "react";
import type { PersonalContext } from "./schema";

interface ContextPanelProps {
  context: PersonalContext | null;
  pending: boolean;
  persisted: boolean;
  editing: boolean;
  message: string | null;
  invalidImport: boolean;
  onStartEdit: () => void;
  onChangeFact: (id: string, value: string) => void;
  onChangeProject: (
    index: number,
    key: "name" | "description",
    value: string,
  ) => void;
  onSave: () => void;
  onCancel: () => void;
  onClear: () => void;
}

export default function ContextPanel({
  context,
  pending,
  persisted,
  editing,
  message,
  invalidImport,
  onStartEdit,
  onChangeFact,
  onChangeProject,
  onSave,
  onCancel,
  onClear,
}: ContextPanelProps) {
  const t = useTranslations("osContext");
  const id = useId();
  const missingValue = context
    ? context.facts.some((fact) => !fact.value.trim()) ||
      context.projects.some(
        (project) => !project.name.trim() || !project.description.trim(),
      )
    : false;

  return (
    <SectionCard
      title={t("title")}
      description={t("description")}
      action={
        context ? (
          <span className="max-w-full rounded-full bg-brand-50 px-3 py-2 text-xs font-medium break-words text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
            {t(
              pending
                ? "pendingBadge"
                : !persisted
                  ? "sessionBadge"
                  : "savedBadge",
            )}
          </span>
        ) : undefined
      }
    >
      {invalidImport && (
        <div
          role="alert"
          className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 break-words text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
        >
          <p>{t("invalidImport")}</p>
          <Button type="button" variant="outline" size="lg" onClick={onCancel}>
            {t("discardImport")}
          </Button>
        </div>
      )}

      {!context ? (
        <div className="space-y-3">
          <EmptyState
            title={t("emptyTitle")}
            description={t("emptyDescription")}
          />
          {(message === "clearFailed" || message === "savedInvalid") && (
            <Button type="button" size="lg" variant="outline" onClick={onClear}>
              {t("clear")}
            </Button>
          )}
        </div>
      ) : (
        <div className="min-w-0 space-y-6">
          <div className="flex flex-wrap gap-x-5 gap-y-2 rounded-xl bg-gray-50 p-4 text-xs leading-5 text-gray-600 dark:bg-gray-800/50 dark:text-gray-300">
            <p>
              {t("sourceLabel")} {t("currentConversation")}
            </p>
            <p>
              {t("asOfLabel")}{" "}
              <time dateTime={context.asOf}>{context.asOf}</time>
            </p>
          </div>
          {pending && (
            <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
              {t("reviewNotice")}
            </p>
          )}

          {context.facts.length > 0 && (
            <section
              aria-labelledby={`${id}-facts`}
              className="min-w-0 space-y-3"
            >
              <h3
                id={`${id}-facts`}
                className="text-sm font-semibold text-gray-900 dark:text-white"
              >
                {t("factsTitle")}
              </h3>
              <dl className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2">
                {context.facts.map((fact, index) => (
                  <div
                    key={fact.id}
                    className="min-w-0 space-y-2 rounded-xl border border-gray-200 p-4 dark:border-gray-800"
                  >
                    <dt
                      id={`${id}-fact-${index}-label`}
                      className="text-xs font-medium break-words text-gray-500 dark:text-gray-400"
                    >
                      {fact.label}
                    </dt>
                    <dd className="min-w-0 space-y-2">
                      {editing ? (
                        <Textarea
                          aria-labelledby={`${id}-fact-${index}-label`}
                          aria-describedby={
                            fact.evidence
                              ? `${id}-fact-${index}-evidence`
                              : undefined
                          }
                          aria-required="true"
                          value={fact.value}
                          maxLength={1000}
                          rows={2}
                          className="text-base"
                          onChange={(event) =>
                            onChangeFact(fact.id, event.target.value)
                          }
                        />
                      ) : (
                        <p className="text-sm leading-6 break-words whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                          {fact.value}
                        </p>
                      )}
                      {fact.evidence && (
                        <p
                          id={`${id}-fact-${index}-evidence`}
                          className="text-xs leading-5 break-words whitespace-pre-wrap text-gray-500 dark:text-gray-400"
                        >
                          <span className="font-medium">
                            {t("evidenceLabel")}
                          </span>{" "}
                          {fact.evidence}
                        </p>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {context.projects.length > 0 && (
            <section
              aria-labelledby={`${id}-projects`}
              className="min-w-0 space-y-3"
            >
              <h3
                id={`${id}-projects`}
                className="text-sm font-semibold text-gray-900 dark:text-white"
              >
                {t("projectsTitle")}
              </h3>
              <div className="space-y-3">
                {context.projects.map((project, index) => (
                  <fieldset
                    key={index}
                    className="min-w-0 space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-800"
                  >
                    <legend className="sr-only">
                      {t("projectNumber", { index: index + 1 })}
                    </legend>
                    {editing ? (
                      <>
                        <div className="space-y-2">
                          <label
                            htmlFor={`${id}-project-${index}-name`}
                            className="block text-xs font-medium text-gray-500 dark:text-gray-400"
                          >
                            {t("projectName")}
                          </label>
                          <Input
                            id={`${id}-project-${index}-name`}
                            value={project.name}
                            maxLength={100}
                            required
                            className="text-base"
                            onChange={(event) =>
                              onChangeProject(index, "name", event.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor={`${id}-project-${index}-description`}
                            className="block text-xs font-medium text-gray-500 dark:text-gray-400"
                          >
                            {t("projectDescription")}
                          </label>
                          <Textarea
                            id={`${id}-project-${index}-description`}
                            value={project.description}
                            maxLength={1500}
                            required
                            rows={3}
                            className="text-base"
                            onChange={(event) =>
                              onChangeProject(
                                index,
                                "description",
                                event.target.value,
                              )
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <h4 className="text-sm font-medium break-words text-gray-900 dark:text-gray-100">
                          {project.name}
                        </h4>
                        <p className="text-sm leading-6 break-words whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                          {project.description}
                        </p>
                      </>
                    )}
                    {project.areas.length > 0 && (
                      <div className="min-w-0 space-y-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t("projectAreas")}
                        </p>
                        <ul className="flex min-w-0 flex-wrap gap-2">
                          {project.areas.map((area, areaIndex) => (
                            <li
                              key={areaIndex}
                              className="max-w-full rounded-lg bg-gray-100 px-2 py-1 text-xs break-words text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            >
                              {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </fieldset>
                ))}
              </div>
            </section>
          )}

          {context.notProvided.length > 0 && (
            <section
              aria-labelledby={`${id}-missing`}
              className="space-y-2 rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-700"
            >
              <h3
                id={`${id}-missing`}
                className="text-sm font-medium text-gray-800 dark:text-gray-100"
              >
                {t("notProvidedTitle")}
              </h3>
              <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
                {t("notProvidedDescription")}
              </p>
              <ul className="list-disc space-y-1 ps-5 text-sm leading-6 break-words text-gray-600 dark:text-gray-300">
                {context.notProvided.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {editing && missingValue && (
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {t("requiredFields")}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {editing ? (
              <>
                <Button
                  type="button"
                  size="lg"
                  onClick={onSave}
                  disabled={missingValue}
                >
                  {t("save")}
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={onCancel}
                >
                  {t(pending ? "cancelImport" : "cancel")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={onStartEdit}
                >
                  {t("edit")}
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="ghost"
                  onClick={onClear}
                >
                  {t("clear")}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
      {message && (
        <p
          role={
            message === "clearFailed" ||
            message === "savedInvalid" ||
            message === "invalidDraft"
              ? "alert"
              : "status"
          }
          className="text-sm leading-6 break-words text-brand-700 dark:text-brand-200"
        >
          {t.has(message) ? t(message) : message}
        </p>
      )}
      <p className="border-t border-gray-100 pt-4 text-xs leading-6 text-gray-500 dark:border-gray-800 dark:text-gray-400">
        {t("privacyFooter")}
      </p>
    </SectionCard>
  );
}
