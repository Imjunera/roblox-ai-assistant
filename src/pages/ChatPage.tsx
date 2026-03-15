import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Bot, Trash2, Download, Zap } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { ChatInput } from "../components/ChatInput";
import { ChatMessageComponent } from "../components/ChatMessage";

const WELCOME_SUGGESTIONS = [
  "Create a coin pickup system that awards points",
  "Build a tycoon money collection loop",
  "Make a sword combat script with animations",
  "Create an admin commands system",
  "Build a checkpoint save system",
  "Script a day/night cycle with lighting changes",
  "Make a leaderboard with DataStore persistence",
  "Create a team-based round system",
];

export function ChatPage() {
  const { messages, isLoading, sendMessage, clearChat, latestScript } = useChat();
  const [searchParams] = useSearchParams();
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasAutoSent = useRef(false);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-send prompt from URL (e.g., from landing page example links)
  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (prompt && !hasAutoSent.current && messages.length === 0) {
      hasAutoSent.current = true;
      sendMessage(decodeURIComponent(prompt));
    }
  }, [searchParams, sendMessage, messages.length]);

  const handleDownload = () => {
    if (!latestScript) return;
    const blob = new Blob([JSON.stringify(latestScript, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${latestScript.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-screen flex-col bg-[#07070d] pt-16">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/5 bg-[#0a0a0f]/80 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">RoboLua AI</p>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              <p className="text-[10px] text-gray-500">Llama 3.3 70B · Groq LPU</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {latestScript && (
            <button
              onClick={handleDownload}
              title="Download latest script as JSON"
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-200"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
          )}
          {!isEmpty && (
            <button
              onClick={clearChat}
              title="Clear conversation"
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl">
          {isEmpty ? (
            <WelcomeScreen onSuggestion={sendMessage} />
          ) : (
            <div className="space-y-6">
              {messages.map((msg) => (
                <ChatMessageComponent key={msg.id} message={msg} />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-white/5 bg-[#0a0a0f]/80 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto max-w-3xl">
          <ChatInput
            onSend={sendMessage}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({ onSuggestion }: { onSuggestion: (s: string) => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4 py-8">
      {/* Icon */}
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-2xl shadow-blue-500/30">
          <Bot className="h-10 w-10 text-white" />
        </div>
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-cyan-400 animate-pulse ring-2 ring-[#07070d]" />
      </div>

      <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
        What script can I build for you?
      </h2>
      <p className="mb-10 max-w-md text-sm text-gray-400 leading-relaxed">
        Describe your Roblox script in plain English. I'll generate complete, production-ready
        Lua code placed in the correct Roblox service.
      </p>

      {/* Suggestion grid */}
      <div className="grid w-full max-w-2xl gap-2.5 sm:grid-cols-2">
        {WELCOME_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestion(suggestion)}
            className="group flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3.5 text-left hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-200"
          >
            <Zap className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5 group-hover:text-blue-300" />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              {suggestion}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
