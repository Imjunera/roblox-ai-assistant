import { RobloxScript } from "../types/script";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface StreamChunk {
  type: "delta" | "done" | "error";
  content?: string;
  error?: string;
}

function getApiKey(): string {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key) {
    throw new Error(
      "GROQ API key is not configured. Please set VITE_GROQ_API_KEY in your .env.local file."
    );
  }
  return key;
}

export async function* generateRobloxScriptStream(
  prompt: string,
  history: Array<{ role: "user" | "assistant"; content: string }> = []
): AsyncGenerator<StreamChunk> {
  const apiKey = getApiKey();

  const messages: GroqMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: buildUserPrompt(prompt) },
  ];

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.3,
      max_tokens: 4096,
      stream: true,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMsg = `GROQ API error (${response.status})`;
    try {
      const parsed = JSON.parse(errorText);
      errorMsg = parsed?.error?.message || errorMsg;
    } catch {}
    yield { type: "error", error: errorMsg };
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    yield { type: "error", error: "No response body from GROQ API." };
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === "data: [DONE]") continue;
        if (!trimmed.startsWith("data: ")) continue;

        try {
          const json = JSON.parse(trimmed.slice(6));
          const delta = json?.choices?.[0]?.delta?.content;
          if (delta) {
            yield { type: "delta", content: delta };
          }
        } catch {
          // skip malformed SSE chunks
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  yield { type: "done" };
}

export function parseRobloxScript(raw: string): RobloxScript {
  const VALID_SERVICES = [
    "ServerScriptService",
    "ReplicatedStorage",
    "StarterPlayerScripts",
    "StarterGui",
  ];
  const VALID_TYPES = ["Script", "LocalScript", "ModuleScript"];

  let cleaned = raw.trim();

  // Strip markdown code fences if the model ignored instructions
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  // Extract JSON object if there's surrounding text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("AI response is not valid JSON. Please try again.");
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("AI response is not a JSON object.");
  }

  const obj = parsed as Record<string, unknown>;

  if (!obj.service || !VALID_SERVICES.includes(obj.service as string)) {
    throw new Error(`Invalid or missing "service" field: ${obj.service}`);
  }
  if (!obj.type || !VALID_TYPES.includes(obj.type as string)) {
    throw new Error(`Invalid or missing "type" field: ${obj.type}`);
  }
  if (!obj.name || typeof obj.name !== "string" || !obj.name.trim()) {
    throw new Error('Invalid or missing "name" field.');
  }
  if (!obj.code || typeof obj.code !== "string" || !obj.code.trim()) {
    throw new Error('Invalid or missing "code" field.');
  }

  return {
    service: obj.service as RobloxScript["service"],
    type: obj.type as RobloxScript["type"],
    name: obj.name as string,
    code: obj.code as string,
  };
}
