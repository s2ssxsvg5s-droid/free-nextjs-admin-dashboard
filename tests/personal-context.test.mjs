import assert from "node:assert/strict";
import test from "node:test";
import {
  contextSchema,
  parseContext,
  encodeContext,
  decodeContext,
} from "../src/components/personal-os/personal-context/schema.ts";

function sampleContext(overrides = {}) {
  return {
    version: 1,
    source: "current-conversation",
    asOf: "2026-11-22",
    facts: [
      {
        id: "sample-preference",
        label: "示範偏好",
        value: "週末想練習陶藝 🏺，保留 Café 的重音。",
        evidence: "僅供測試的虛構對話文字。",
      },
    ],
    projects: [
      {
        name: "虛構的閱讀角落",
        description: "整理書單與筆記，保留換行\n以及標點「」。",
        areas: ["閱讀", "Learning"],
      },
    ],
    notProvided: ["沒有提供任何帳戶資料"],
    ...overrides,
  };
}

function assertRejected(value, reason = "invalid") {
  const result = parseContext(JSON.stringify(value));
  assert.deepEqual(result, { ok: false, reason });
}

test("conversation context round-trips Unicode without changing its provenance or date", () => {
  const original = sampleContext();
  assert.equal(contextSchema.safeParse(original).success, true);
  const parsed = parseContext(JSON.stringify(original));
  assert.equal(parsed.ok, true);
  assert.deepEqual(parsed.value, original);
  const encoded = encodeContext(original);
  assert.match(encoded, /^[A-Za-z0-9_-]+$/);
  assert.ok(encoded.length <= 8000);
  const decoded = decodeContext(encoded);
  assert.equal(decoded.ok, true);
  assert.deepEqual(decoded.value, original);
  assert.equal(decoded.value.source, "current-conversation");
  assert.equal(decoded.value.asOf, "2026-11-22");
});

test("a context may contain facts or projects independently, but cannot be empty", () => {
  assert.equal(
    parseContext(JSON.stringify(sampleContext({ projects: [] }))).ok,
    true,
  );
  assert.equal(
    parseContext(JSON.stringify(sampleContext({ facts: [] }))).ok,
    true,
  );
  assertRejected(sampleContext({ facts: [], projects: [] }));
  assertRejected(
    sampleContext({
      facts: [],
      projects: [],
      notProvided: ["No profile supplied"],
    }),
  );
});

test("imports reject other-chat provenance, unsupported versions, and unknown credential fields", () => {
  assertRejected(sampleContext({ source: "another-conversation" }));
  assertRejected(sampleContext({ source: "external-account" }));
  assertRejected(sampleContext({ version: 2 }));
  assertRejected(sampleContext({ version: "1" }));
  assertRejected(sampleContext({ apiKey: "fabricated-test-key" }));
  assertRejected(
    sampleContext({
      facts: [
        {
          id: "example",
          label: "Example",
          value: "Fictional",
          accessToken: "fabricated-token",
        },
      ],
    }),
  );
  assertRejected(
    sampleContext({
      projects: [
        {
          name: "Example",
          description: "Fictional",
          areas: [],
          password: "fabricated-password",
        },
      ],
    }),
  );
});

test("malformed JSON and non-object imports return structured failures", () => {
  for (const raw of ["", "{", "null", "[]", "42", '"example"'])
    assert.deepEqual(parseContext(raw), { ok: false, reason: "invalid" }, raw);
});

test("malformed base64url and invalid UTF-8 are rejected without throwing", () => {
  for (const encoded of ["", "A", "not-valid-base64!", "e30=", "e30\n", "e30+"])
    assert.deepEqual(
      decodeContext(encoded),
      { ok: false, reason: "invalid" },
      encoded,
    );

  // If UTF-8 decoding silently inserted replacement characters, this would
  // otherwise remain valid JSON with a valid, non-empty fact value.
  const raw = JSON.stringify(
    sampleContext({
      facts: [{ id: "utf8", label: "Example", value: "INVALID_UTF8_MARKER" }],
    }),
  );
  const [before, after] = raw.split("INVALID_UTF8_MARKER");
  const invalidUtf8 = Buffer.concat([
    Buffer.from(before),
    Buffer.from([0xc3, 0x28]),
    Buffer.from(after),
  ]);
  assert.deepEqual(decodeContext(invalidUtf8.toString("base64url")), {
    ok: false,
    reason: "invalid",
  });
});

test("payload limits count UTF-8 bytes and reject oversized encoded imports", () => {
  const raw = JSON.stringify(sampleContext());
  const rawBytes = Buffer.byteLength(raw, "utf8");
  assert.ok(rawBytes < 6000);
  assert.equal(parseContext(raw + " ".repeat(6000 - rawBytes)).ok, true);
  assert.deepEqual(parseContext(raw + " ".repeat(6001 - rawBytes)), {
    ok: false,
    reason: "tooLarge",
  });

  const unicodeContext = sampleContext({
    facts: Array.from({ length: 3 }, (_, index) => ({
      id: `example-${index}`,
      label: "虛構",
      value: "測".repeat(700),
    })),
  });
  const unicodeRaw = JSON.stringify(unicodeContext);
  assert.ok(unicodeRaw.length < 6000);
  assert.ok(Buffer.byteLength(unicodeRaw, "utf8") > 6000);
  assertRejected(unicodeContext, "tooLarge");
  assert.throws(() => encodeContext(unicodeContext));
  assert.deepEqual(decodeContext("A".repeat(8001)), {
    ok: false,
    reason: "tooLarge",
  });
});

test("collection limits prevent oversized context records even within the byte budget", () => {
  const facts = Array.from({ length: 50 }, (_, index) => ({
    id: String(index),
    label: "L",
    value: "V",
  }));
  assert.equal(
    parseContext(
      JSON.stringify(sampleContext({ facts, projects: [], notProvided: [] })),
    ).ok,
    true,
  );
  assertRejected(
    sampleContext({
      facts: [...facts, { id: "51", label: "L", value: "V" }],
      projects: [],
      notProvided: [],
    }),
  );

  const projects = Array.from({ length: 10 }, (_, index) => ({
    name: `P${index}`,
    description: "Fictional",
    areas: [],
  }));
  assert.equal(
    parseContext(JSON.stringify(sampleContext({ projects }))).ok,
    true,
  );
  assertRejected(
    sampleContext({
      projects: [
        ...projects,
        { name: "P11", description: "Fictional", areas: [] },
      ],
    }),
  );
  assertRejected(
    sampleContext({ notProvided: Array.from({ length: 21 }, () => "Unknown") }),
  );
  assertRejected(
    sampleContext({
      projects: [
        {
          name: "Example",
          description: "Fictional",
          areas: Array.from({ length: 21 }, () => "Example"),
        },
      ],
    }),
  );
});

test("field limits reject blank required content and unexpectedly long imported text", () => {
  for (const field of ["id", "label", "value"]) {
    const fact = { id: "example", label: "Example", value: "Fictional" };
    assertRejected(sampleContext({ facts: [{ ...fact, [field]: "" }] }));
  }
  for (const [field, length] of [
    ["id", 61],
    ["label", 81],
    ["value", 1001],
    ["evidence", 501],
  ]) {
    const fact = { id: "example", label: "Example", value: "Fictional" };
    assertRejected(
      sampleContext({ facts: [{ ...fact, [field]: "x".repeat(length) }] }),
    );
  }
  assertRejected(
    sampleContext({
      projects: [{ name: "", description: "Fictional", areas: [] }],
    }),
  );
  assertRejected(
    sampleContext({
      projects: [{ name: "Example", description: "", areas: [] }],
    }),
  );
  assertRejected(
    sampleContext({
      projects: [
        { name: "x".repeat(101), description: "Fictional", areas: [] },
      ],
    }),
  );
  assertRejected(
    sampleContext({
      projects: [{ name: "Example", description: "x".repeat(1501), areas: [] }],
    }),
  );
  assertRejected(
    sampleContext({
      projects: [{ name: "Example", description: "Fictional", areas: [""] }],
    }),
  );
  assertRejected(
    sampleContext({
      projects: [
        { name: "Example", description: "Fictional", areas: ["x".repeat(81)] },
      ],
    }),
  );
  assertRejected(sampleContext({ notProvided: [""] }));
  assertRejected(sampleContext({ notProvided: ["x".repeat(151)] }));
});

test("provenance dates must be actual ISO calendar dates", () => {
  for (const asOf of [
    "2026-02-30",
    "2025-02-29",
    "2026-13-01",
    "2026-11-31",
    "2026-2-01",
    "2026/11/22",
    "2026-11-22T00:00:00Z",
    "",
  ])
    assertRejected(sampleContext({ asOf }));
  assert.equal(
    parseContext(JSON.stringify(sampleContext({ asOf: "2028-02-29" }))).ok,
    true,
  );
});

test("duplicate fact identifiers cannot edit multiple records at once", () => {
  const value = {
    version: 1,
    source: "current-conversation",
    asOf: "2026-11-22",
    facts: [
      { id: "same", label: "測試欄位一", value: "甲" },
      { id: "same", label: "測試欄位二", value: "乙" },
    ],
    projects: [],
    notProvided: [],
  };
  assert.equal(parseContext(JSON.stringify(value)).ok, false);
});
