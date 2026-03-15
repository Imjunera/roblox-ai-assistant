import { useState, useRef, KeyboardEvent } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const SUGGESTIONS = [
  "Create a door with a proximity prompt",
  "Make a leaderboard with kill count",
  "Build a shop GUI with purchase system",
  "Script a sword with slash animation",
  "Create a round-based game system",
  "Add a spectator mode for dead players",
];

export function ChatInput({ onSend, disabled, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled || isLoading) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  };

  const handleSuggestion = (s: string) => {
    setValue(s);
    textareaRef.current?.focus();
  };

  const canSend = value.trim().length > 0 && !disabled && !isLoading;

  return (
    <div className="space-y-3">
      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2 px-1">
        {SUGGESTIONS.slice(0, 3).map((s) => (
          <button
            key={s}
            onClick={() => handleSuggestion(s)}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-3 w-3" />
            {s}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="relative flex items-end gap-3 rounded-2xl border border-white/10 bg-[#111118] p-3 shadow-xl shadow-black/30 focus-within:border-blue-500/50 focus-within:shadow-blue-500/10 transition-all duration-300">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          placeholder="Describe the Roblox script you need... (e.g. 'Create a coin pickup system')"
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ maxHeight: "160px" }}
        />

        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
            canSend
              ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
              : "bg-white/5 text-gray-600 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>

      <p className="px-1 text-center text-[11px] text-gray-600">
        Press <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono text-[10px]">Enter</kbd> to send ·{" "}
        <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono text-[10px]">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}
