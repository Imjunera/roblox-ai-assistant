import { RobloxScript } from "../types/script";

// In-browser storage for the latest generated script
// Mirrors /storage/latestScript.json concept from the Next.js architecture
const STORAGE_KEY = "robolua_latest_script";

export function saveLatestScript(script: RobloxScript): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(script));
  } catch (err) {
    console.error("Failed to save script to storage:", err);
  }
}

export function getLatestScript(): RobloxScript | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RobloxScript;
  } catch {
    return null;
  }
}

export function clearLatestScript(): void {
  localStorage.removeItem(STORAGE_KEY);
}
