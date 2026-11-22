import { z } from "zod";

export const contextSchema = z
  .object({
    version: z.literal(1),
    source: z.literal("current-conversation"),
    asOf: z.iso.date(),
    facts: z
      .array(
        z
          .object({
            id: z.string().min(1).max(60),
            label: z.string().min(1).max(80),
            value: z.string().min(1).max(1000),
            evidence: z.string().max(500).optional(),
          })
          .strict(),
      )
      .max(50),
    projects: z
      .array(
        z
          .object({
            name: z.string().min(1).max(100),
            description: z.string().min(1).max(1500),
            areas: z.array(z.string().min(1).max(80)).max(20),
          })
          .strict(),
      )
      .max(10),
    notProvided: z.array(z.string().min(1).max(150)).max(20),
  })
  .strict()
  .refine((value) => value.facts.length + value.projects.length > 0)
  .refine(
    (value) =>
      new Set(value.facts.map((fact) => fact.id)).size === value.facts.length,
  );

export type PersonalContext = z.infer<typeof contextSchema>;
export type ContextResult =
  | { ok: true; value: PersonalContext }
  | { ok: false; reason: "invalid" | "tooLarge" };
const MAX_JSON_BYTES = 6000;
const MAX_ENCODED_LENGTH = 8000;

export function parseContext(raw: string): ContextResult {
  if (new TextEncoder().encode(raw).length > MAX_JSON_BYTES)
    return { ok: false, reason: "tooLarge" };
  try {
    const parsed = contextSchema.safeParse(JSON.parse(raw));
    return parsed.success
      ? { ok: true, value: parsed.data }
      : { ok: false, reason: "invalid" };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}

export function encodeContext(value: PersonalContext): string {
  const raw = JSON.stringify(value);
  if (!parseContext(raw).ok) throw new Error("Invalid personal context");
  const bytes = new TextEncoder().encode(raw);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeContext(encoded: string): ContextResult {
  if (encoded.length > MAX_ENCODED_LENGTH)
    return { ok: false, reason: "tooLarge" };
  if (!/^[A-Za-z0-9_-]+$/.test(encoded))
    return { ok: false, reason: "invalid" };
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
    const bytes = Uint8Array.from(binary, (character) =>
      character.charCodeAt(0),
    );
    return parseContext(
      new TextDecoder("utf-8", { fatal: true }).decode(bytes),
    );
  } catch {
    return { ok: false, reason: "invalid" };
  }
}
