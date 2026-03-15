import { Bot, User, AlertTriangle, Loader2 } from "lucide-react";
import { ChatMessage as ChatMessageType } from "../types/script";
import { ScriptCard } from "./ScriptCard";

interface ChatMessageProps {
  message: ChatMessageType;
}

function StreamingDots() {
  return (
    <span className="inline-flex items-center gap-1 ml-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce"
          style={{ animationDelay: `${i * 150}ms`, animationDuration: "0.8s" }}
        />
      ))}
    </span>
  );
}

export function ChatMessageComponent({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isError = message.role === "error";
  const isStreaming = message.isStreaming;

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 group">
        <div className="max-w-[80%] space-y-1">
          <div className="rounded-2xl rounded-tr-sm bg-gradient-to-br from-blue-600 to-blue-700 px-4 py-3 text-sm text-white shadow-lg shadow-blue-500/20">
            {message.content}
          </div>
          <p className="text-right text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {formatTime(message.timestamp)}
          </p>
        </div>
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-500/30 mt-1">
          <User className="h-4 w-4 text-white" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex gap-3 group">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-500/20 border border-red-500/30 mt-1">
          <AlertTriangle className="h-4 w-4 text-red-400" />
        </div>
        <div className="max-w-[85%] space-y-1">
          <div className="rounded-2xl rounded-tl-sm border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
            <p className="font-semibold text-red-400 mb-1">Error</p>
            <p className="whitespace-pre-wrap text-xs leading-relaxed">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex gap-3 group">
      {/* Avatar */}
      <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-md shadow-blue-500/30 mt-1">
        {isStreaming ? (
          <Loader2 className="h-4 w-4 text-white animate-spin" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
        {isStreaming && (
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
        )}
      </div>

      <div className="max-w-[85%] space-y-1 flex-1">
        <div className="rounded-2xl rounded-tl-sm border border-white/5 bg-[#111118] px-4 py-3 shadow-lg">
          {isStreaming && !message.content ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Generating script</span>
              <StreamingDots />
            </div>
          ) : message.content ? (
            <>
              {/* Show streaming indicator if still generating */}
              {isStreaming ? (
                <div className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
                  <span className="text-blue-400">Streaming response...</span>
                </div>
              ) : null}

              {/* If we have a parsed script, show the card */}
              {message.script ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">
                    ✅ Script generated successfully. Copy it into Roblox Studio.
                  </p>
                  <ScriptCard script={message.script} />
                </div>
              ) : isStreaming ? (
                /* While streaming, show raw JSON building up */
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>Building JSON</span>
                    <StreamingDots />
                  </p>
                  <pre className="overflow-x-auto rounded-lg bg-black/40 p-3 text-xs text-gray-300 font-mono leading-relaxed max-h-48 whitespace-pre-wrap break-all">
                    {message.content}
                  </pre>
                </div>
              ) : (
                /* Fallback: show raw content */
                <pre className="whitespace-pre-wrap text-xs text-gray-300 font-mono">
                  {message.content}
                </pre>
              )}
            </>
          ) : null}
        </div>

        <p className="text-[10px] text-gray-600 pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          RoboLua AI · {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}
