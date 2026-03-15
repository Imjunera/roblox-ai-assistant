import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { ChatMessage, RobloxScript } from "../types/script";
import { generateRobloxScriptStream, parseRobloxScript } from "../lib/groq";
import { saveLatestScript } from "../lib/storage";

interface ChatContextValue {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (prompt: string) => Promise<void>;
  clearChat: () => void;
  latestScript: RobloxScript | null;
}

const ChatContext = createContext<ChatContextValue | null>(null);

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [latestScript, setLatestScript] = useState<RobloxScript | null>(null);
  const abortRef = useRef<boolean>(false);

  const sendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: prompt.trim(),
      timestamp: new Date(),
    };

    const assistantId = generateId();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsLoading(true);
    abortRef.current = false;

    let fullContent = "";

    try {
      // Build conversation history for context
      const history = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-10)
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

      const stream = generateRobloxScriptStream(prompt, history);

      for await (const chunk of stream) {
        if (abortRef.current) break;

        if (chunk.type === "error") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    role: "error" as const,
                    content: chunk.error ?? "Unknown error occurred.",
                    isStreaming: false,
                  }
                : m
            )
          );
          return;
        }

        if (chunk.type === "delta" && chunk.content) {
          fullContent += chunk.content;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: fullContent, isStreaming: true }
                : m
            )
          );
        }

        if (chunk.type === "done") {
          break;
        }
      }

      // Parse and validate the completed JSON response
      try {
        const script = parseRobloxScript(fullContent);
        setLatestScript(script);
        saveLatestScript(script);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: fullContent, script, isStreaming: false }
              : m
          )
        );
      } catch (parseErr) {
        const errMsg =
          parseErr instanceof Error
            ? parseErr.message
            : "Failed to parse AI response.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  role: "error" as const,
                  content: `Parse error: ${errMsg}\n\nRaw response:\n${fullContent}`,
                  isStreaming: false,
                }
              : m
          )
        );
      }
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                role: "error" as const,
                content: errMsg,
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setLatestScript(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{ messages, isLoading, sendMessage, clearChat, latestScript }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
