export type RobloxService =
  | "ServerScriptService"
  | "ReplicatedStorage"
  | "StarterPlayerScripts"
  | "StarterGui";

export type RobloxScriptType = "Script" | "LocalScript" | "ModuleScript";

export interface RobloxScript {
  service: RobloxService;
  type: RobloxScriptType;
  name: string;
  code: string;
}

export type MessageRole = "user" | "assistant" | "error";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  script?: RobloxScript;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface GenerateRequest {
  prompt: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface GenerateResponse {
  script: RobloxScript;
  raw: string;
}
