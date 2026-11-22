import type { PersonalContext } from "./schema";

const KEY = "personal-os.conversation-context.v1";
const EVENT = "personal-os-context-changed";
let memory: string | undefined;
let clearBlocked = false;

function readSaved() {
  if (memory !== undefined) return memory;
  try {
    return window.localStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}

export function contextSnapshot() {
  const mode = clearBlocked
    ? "blocked-clear"
    : memory !== undefined
      ? "session"
      : "device";
  return `${window.location.hash}\u0000${mode}\u0000${readSaved()}`;
}
export const contextServerSnapshot = () => "\u0000device\u0000";

export function subscribeContext(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("hashchange", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("hashchange", callback);
    window.removeEventListener(EVENT, callback);
  };
}

function removeImportFragment() {
  const params = new URLSearchParams(window.location.hash.slice(1));
  if (params.has("context"))
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
}

export function saveContext(value: PersonalContext): boolean {
  const raw = JSON.stringify(value);
  let persistent = true;
  clearBlocked = false;
  try {
    window.localStorage.setItem(KEY, raw);
    memory = undefined;
  } catch {
    memory = raw;
    persistent = false;
  }
  removeImportFragment();
  window.dispatchEvent(new Event(EVENT));
  return persistent;
}

export function clearContext(): boolean {
  let removed = true;
  try {
    window.localStorage.removeItem(KEY);
    memory = undefined;
  } catch {
    memory = "";
    removed = false;
  }
  clearBlocked = !removed;
  removeImportFragment();
  window.dispatchEvent(new Event(EVENT));
  return removed;
}

export function cancelContextImport() {
  removeImportFragment();
  window.dispatchEvent(new Event(EVENT));
}
