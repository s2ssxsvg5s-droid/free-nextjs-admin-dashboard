"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import ContextPanel from "./context-panel";
import { decodeContext, parseContext, type PersonalContext } from "./schema";
import {
  cancelContextImport,
  clearContext,
  contextServerSnapshot,
  contextSnapshot,
  saveContext,
  subscribeContext,
} from "./store";

export default function PersonalContextCard() {
  const snapshot = useSyncExternalStore(
    subscribeContext,
    contextSnapshot,
    contextServerSnapshot,
  );
  const source = useMemo(() => {
    const separator = snapshot.indexOf("\u0000");
    const hash = snapshot.slice(0, separator);
    const modeEnd = snapshot.indexOf("\u0000", separator + 1);
    const mode = snapshot.slice(separator + 1, modeEnd);
    const savedRaw = snapshot.slice(modeEnd + 1);
    const encoded = new URLSearchParams(hash.slice(1)).get("context");
    const imported = encoded === null ? null : decodeContext(encoded);
    const saved = savedRaw ? parseContext(savedRaw) : null;
    return {
      key: encoded !== null ? `import:${encoded}` : `stored:${savedRaw}`,
      imported: imported?.ok ? imported.value : null,
      saved: saved?.ok ? saved.value : null,
      invalidImport: imported !== null && !imported.ok,
      invalidSaved: saved !== null && !saved.ok,
      sessionOnly: mode === "session",
      clearBlocked: mode === "blocked-clear",
    };
  }, [snapshot]);
  const [draft, setDraft] = useState<{
    key: string;
    value: PersonalContext;
  } | null>(null);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [status, setStatus] = useState<{ key: string; message: string } | null>(
    null,
  );
  const base = source.imported ?? source.saved;
  const context = draft?.key === source.key ? draft.value : base;
  const pending = source.imported !== null;
  const message =
    status?.key === source.key
      ? status.message
      : source.clearBlocked
        ? "clearFailed"
        : source.invalidSaved
          ? "savedInvalid"
          : null;

  function edit() {
    if (!context) return;
    setDraft({ key: source.key, value: context });
    setEditKey(source.key);
    setStatus(null);
  }
  function changeFact(id: string, value: string) {
    if (!context) return;
    setDraft({
      key: source.key,
      value: {
        ...context,
        facts: context.facts.map((fact) =>
          fact.id === id ? { ...fact, value } : fact,
        ),
      },
    });
    setStatus(null);
  }
  function changeProject(
    index: number,
    key: "name" | "description",
    value: string,
  ) {
    if (!context) return;
    setDraft({
      key: source.key,
      value: {
        ...context,
        projects: context.projects.map((project, i) =>
          i === index ? { ...project, [key]: value } : project,
        ),
      },
    });
    setStatus(null);
  }
  function save() {
    if (!context) return;
    const result = parseContext(JSON.stringify(context));
    if (!result.ok) {
      setStatus({ key: source.key, message: "invalidDraft" });
      return;
    }
    const persistent = saveContext(result.value);
    const key = `stored:${JSON.stringify(result.value)}`;
    setStatus({ key, message: persistent ? "saved" : "sessionOnly" });
    setDraft(null);
    setEditKey(null);
  }
  function cancel() {
    setDraft(null);
    setEditKey(null);
    setStatus(null);
    cancelContextImport();
  }
  function clear() {
    const removed = clearContext();
    setDraft(null);
    setEditKey(null);
    setStatus({ key: "stored:", message: removed ? "cleared" : "clearFailed" });
  }

  return (
    <ContextPanel
      context={context}
      pending={pending}
      persisted={!source.sessionOnly}
      editing={pending || editKey === source.key}
      message={message}
      invalidImport={source.invalidImport}
      onStartEdit={edit}
      onChangeFact={changeFact}
      onChangeProject={changeProject}
      onSave={save}
      onCancel={cancel}
      onClear={clear}
    />
  );
}
