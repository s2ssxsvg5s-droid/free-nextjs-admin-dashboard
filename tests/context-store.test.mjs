import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import {
  contextSnapshot,
  contextServerSnapshot,
  saveContext,
  clearContext,
  cancelContextImport,
  subscribeContext,
} from "../src/components/personal-os/personal-context/store.ts";

const storageKey = "personal-os.conversation-context.v1";
const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");

function fictionalContext(value = "Fictional pottery practice") {
  return {
    version: 1,
    source: "current-conversation",
    asOf: "2026-11-22",
    facts: [{ id: "fictional-hobby", label: "Example hobby", value }],
    projects: [],
    notProvided: ["No account details supplied"],
  };
}

class FakeWindow extends EventTarget {
  constructor() {
    super();
    this.location = new URL("https://example.test/dashboard?view=demo");
    this.values = new Map();
    this.storageWrites = [];
    this.historyWrites = [];
    this.denyRead = false;
    this.denyWrite = false;
    this.denyClear = false;
    this.localStorage = {
      getItem: (key) => {
        if (this.denyRead) throw new DOMException("Denied", "SecurityError");
        return this.values.get(key) ?? null;
      },
      setItem: (key, value) => {
        this.storageWrites.push({ action: "set", key, value });
        if (this.denyWrite) throw new DOMException("Denied", "SecurityError");
        this.values.set(key, String(value));
      },
      removeItem: (key) => {
        this.storageWrites.push({ action: "remove", key });
        if (this.denyClear) throw new DOMException("Denied", "SecurityError");
        this.values.delete(key);
      },
    };
    this.history = {
      replaceState: (state, unused, target) => {
        this.historyWrites.push({ state, target });
        this.location = new URL(target, this.location);
      },
    };
  }

  importFragment(value = fictionalContext("Fictional imported note")) {
    this.location.hash = `context=${Buffer.from(JSON.stringify(value)).toString("base64url")}`;
  }
}

let fake;
beforeEach(() => {
  fake = new FakeWindow();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    writable: true,
    value: fake,
  });
  // Reset only module-local fallback state against empty, permitted test storage.
  clearContext();
  fake.storageWrites.length = 0;
  fake.historyWrites.length = 0;
});
afterEach(() => {
  fake.denyRead = false;
  fake.denyWrite = false;
  fake.denyClear = false;
  clearContext();
  if (previousWindow)
    Object.defineProperty(globalThis, "window", previousWindow);
  else delete globalThis.window;
});

test("reading an import preview never persists it or removes the fragment", () => {
  const saved = JSON.stringify(fictionalContext("Fictional earlier note"));
  fake.values.set(storageKey, saved);
  fake.importFragment();
  const hash = fake.location.hash;

  assert.equal(contextSnapshot(), `${hash}\u0000device\u0000${saved}`);
  assert.equal(contextSnapshot(), `${hash}\u0000device\u0000${saved}`);
  assert.equal(fake.location.hash, hash);
  assert.equal(fake.values.get(storageKey), saved);
  assert.deepEqual(fake.storageWrites, []);
  assert.deepEqual(fake.historyWrites, []);
  assert.equal(contextServerSnapshot(), "\u0000device\u0000");
});

test("explicit save persists the chosen packet and strips only the import fragment", () => {
  fake.importFragment();
  const chosen = fictionalContext("Fictional explicitly accepted note");
  let notifications = 0;
  const unsubscribe = subscribeContext(() => notifications++);
  try {
    assert.equal(saveContext(chosen), true);
    assert.equal(fake.values.get(storageKey), JSON.stringify(chosen));
    assert.deepEqual(fake.storageWrites, [
      { action: "set", key: storageKey, value: JSON.stringify(chosen) },
    ]);
    assert.equal(fake.location.hash, "");
    assert.equal(fake.location.pathname, "/dashboard");
    assert.equal(fake.location.search, "?view=demo");
    assert.deepEqual(fake.historyWrites, [
      { state: null, target: "/dashboard?view=demo" },
    ]);
    assert.equal(
      contextSnapshot(),
      `\u0000device\u0000${JSON.stringify(chosen)}`,
    );
    assert.equal(notifications, 1);
  } finally {
    unsubscribe();
  }
});

test("canceling an import preserves an already saved context without any storage writes", () => {
  const saved = JSON.stringify(fictionalContext("Fictional saved note"));
  fake.values.set(storageKey, saved);
  fake.importFragment(fictionalContext("Fictional unwanted replacement"));
  cancelContextImport();

  assert.equal(fake.location.hash, "");
  assert.equal(fake.values.get(storageKey), saved);
  assert.equal(contextSnapshot(), `\u0000device\u0000${saved}`);
  assert.deepEqual(fake.storageWrites, []);
  assert.equal(fake.historyWrites.length, 1);
});

test("denied save keeps a stable session snapshot across repeated reads and resubscription", () => {
  const oldSaved = JSON.stringify(
    fictionalContext("Fictional old device copy"),
  );
  fake.values.set(storageKey, oldSaved);
  fake.denyWrite = true;
  fake.importFragment();
  const accepted = fictionalContext("Fictional session-only note");

  assert.equal(saveContext(accepted), false);
  assert.equal(fake.values.get(storageKey), oldSaved);
  assert.equal(fake.location.hash, "");
  const expected = `\u0000session\u0000${JSON.stringify(accepted)}`;
  const unmount = subscribeContext(() => {});
  assert.equal(contextSnapshot(), expected);
  unmount();
  const remount = subscribeContext(() => {});
  try {
    assert.equal(contextSnapshot(), expected);
    fake.denyRead = true;
    assert.equal(contextSnapshot(), expected);
  } finally {
    remount();
  }
  assert.equal(fake.storageWrites.length, 1);
});

test("blocked deletion hides context but retains a stable warning until an allowed retry", () => {
  const saved = JSON.stringify(fictionalContext("Fictional device copy"));
  fake.values.set(storageKey, saved);
  fake.importFragment();
  fake.denyClear = true;

  assert.equal(clearContext(), false);
  assert.equal(fake.values.get(storageKey), saved);
  assert.equal(fake.location.hash, "");
  assert.equal(contextSnapshot(), "\u0000blocked-clear\u0000");
  const unmount = subscribeContext(() => {});
  unmount();
  assert.equal(contextSnapshot(), "\u0000blocked-clear\u0000");
  assert.equal(clearContext(), false);
  assert.equal(contextSnapshot(), "\u0000blocked-clear\u0000");
  assert.equal(fake.values.get(storageKey), saved);

  fake.denyClear = false;
  assert.equal(clearContext(), true);
  assert.equal(fake.values.has(storageKey), false);
  assert.equal(contextSnapshot(), "\u0000device\u0000");
});

test("subscriptions cover import and cross-tab changes and unsubscribe cleanly", () => {
  let notifications = 0;
  const unsubscribe = subscribeContext(() => notifications++);
  fake.dispatchEvent(new Event("hashchange"));
  fake.dispatchEvent(new Event("storage"));
  assert.equal(notifications, 2);
  unsubscribe();
  fake.dispatchEvent(new Event("hashchange"));
  fake.dispatchEvent(new Event("storage"));
  saveContext(fictionalContext());
  assert.equal(notifications, 2);
});

test("context actions preserve unrelated URL anchors", () => {
  fake.location.hash = "help";
  assert.equal(saveContext(fictionalContext()), true);
  assert.equal(fake.location.hash, "#help");
  cancelContextImport();
  assert.equal(fake.location.hash, "#help");
  assert.deepEqual(fake.historyWrites, []);
});
