import { useState } from "react";
import { Copy, Check, Code2, Server, Package, Monitor, User } from "lucide-react";
import { RobloxScript } from "../types/script";

interface ScriptCardProps {
  script: RobloxScript;
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  ServerScriptService: <Server className="h-3.5 w-3.5" />,
  ReplicatedStorage: <Package className="h-3.5 w-3.5" />,
  StarterGui: <Monitor className="h-3.5 w-3.5" />,
  StarterPlayerScripts: <User className="h-3.5 w-3.5" />,
};

const SERVICE_COLORS: Record<string, string> = {
  ServerScriptService: "bg-green-500/10 text-green-400 border-green-500/20",
  ReplicatedStorage: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  StarterGui: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  StarterPlayerScripts: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

const TYPE_COLORS: Record<string, string> = {
  Script: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  LocalScript: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  ModuleScript: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

function highlightLua(code: string): string {
  const keywords = [
    "local", "function", "end", "if", "then", "else", "elseif",
    "for", "do", "while", "repeat", "until", "return", "break",
    "and", "or", "not", "nil", "true", "false", "in", "pairs",
    "ipairs", "pcall", "xpcall", "error", "print", "require",
  ];

  const lines = code.split("\n");
  return lines
    .map((line) => {
      // Escape HTML
      let escaped = line
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      // Comments
      escaped = escaped.replace(
        /(--.*)$/,
        '<span class="text-gray-500 italic">$1</span>'
      );

      // Strings
      escaped = escaped.replace(
        /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
        '<span class="text-amber-300">$1</span>'
      );

      // Numbers
      escaped = escaped.replace(
        /\b(\d+\.?\d*)\b/g,
        '<span class="text-purple-400">$1</span>'
      );

      // Keywords
      keywords.forEach((kw) => {
        escaped = escaped.replace(
          new RegExp(`\\b(${kw})\\b`, "g"),
          '<span class="text-blue-400 font-semibold">$1</span>'
        );
      });

      // Roblox APIs (game, workspace, script, Players, etc.)
      escaped = escaped.replace(
        /\b(game|workspace|script|Players|RunService|TweenService|UserInputService|ReplicatedStorage|ServerStorage|StarterGui|StarterPack|Teams|Lighting|SoundService|CollectionService|HttpService|DataStoreService|PhysicsService|MarketplaceService|BadgeService)\b/g,
        '<span class="text-cyan-400">$1</span>'
      );

      return `<span>${escaped}</span>`;
    })
    .join("\n");
}

export function ScriptCard({ script }: ScriptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const highlighted = highlightLua(script.code);

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#0d0d14] shadow-xl shadow-black/40">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/5 bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Code2 className="h-4 w-4 text-blue-400 flex-shrink-0" />
          <span className="font-mono text-sm font-semibold text-white">{script.name}</span>

          <span
            className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${SERVICE_COLORS[script.service] ?? "bg-white/10 text-white border-white/10"}`}
          >
            {SERVICE_ICONS[script.service]}
            {script.service}
          </span>

          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${TYPE_COLORS[script.type] ?? "bg-white/10 text-white border-white/10"}`}
          >
            {script.type}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-gray-400 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-200 flex-shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-xs leading-relaxed">
          <code
            className="font-mono text-gray-300"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    </div>
  );
}
