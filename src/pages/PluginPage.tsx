import { useState } from "react";
import { Code2, Copy, Check, Download, Server, RefreshCw, ExternalLink } from "lucide-react";
import { getLatestScript } from "../lib/storage";
import { RobloxScript } from "../types/script";

const LUA_PLUGIN_CODE = `-- RoboLua AI Studio Plugin
-- Paste this into a Plugin Script in Roblox Studio

local HttpService = game:GetService("HttpService")
local ServerStorage = game:GetService("ServerStorage")
local Selection = game:GetService("Selection")

local ENDPOINT = "http://localhost:5173/api/latest-script"
-- Change port to match your running dev server

local toolbar = plugin:CreateToolbar("RoboLua AI")
local button = toolbar:CreateButton(
    "Fetch Script",
    "Fetch the latest AI-generated script",
    "rbxassetid://4458901886"
)

button.Click:Connect(function()
    local success, result = pcall(function()
        local response = HttpService:GetAsync(ENDPOINT)
        local data = HttpService:JSONDecode(response)
        
        -- Find or create the target service
        local targetService = game:GetService(data.service)
        
        -- Create the script instance
        local scriptInstance
        if data.type == "Script" then
            scriptInstance = Instance.new("Script")
        elseif data.type == "LocalScript" then
            scriptInstance = Instance.new("LocalScript")
        else
            scriptInstance = Instance.new("ModuleScript")
        end
        
        scriptInstance.Name = data.name
        scriptInstance.Source = data.code
        scriptInstance.Parent = targetService
        
        Selection:Set({scriptInstance})
        return data.name
    end)
    
    if success then
        print("[RoboLua] Script inserted: " .. result)
    else
        warn("[RoboLua] Failed to fetch script: " .. tostring(result))
    end
end)`;

export function PluginPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [latestScript, setLatestScript] = useState<RobloxScript | null>(getLatestScript);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRefresh = () => {
    setLatestScript(getLatestScript());
    setRefreshKey((k) => k + 1);
  };

  const handleDownload = () => {
    if (!latestScript) return;
    const blob = new Blob([JSON.stringify(latestScript, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${latestScript.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#07070d] pt-20 pb-16 px-4">
      {/* Gradient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-purple-600/8 blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 h-96 w-96 rounded-full bg-blue-600/8 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-xl shadow-purple-500/20">
            <Code2 className="h-7 w-7 text-white" />
          </div>
          <h1 className="mb-3 text-4xl font-bold text-white">Plugin API</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Connect your Roblox Studio to RoboLua AI. Fetch generated scripts directly
            into your game without copy-pasting.
          </p>
        </div>

        {/* API Endpoint Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-5">
            <Server className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">REST Endpoint</h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/8 bg-black/30 p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-green-500/20 px-2 py-0.5 text-xs font-bold text-green-400 font-mono">GET</span>
                  <code className="text-sm text-white font-mono">/api/latest-script</code>
                </div>
                <button
                  onClick={() => handleCopy("/api/latest-script", "endpoint")}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all"
                >
                  {copied === "endpoint" ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                  Copy
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Returns the most recently generated Roblox script as a JSON object. 
                Poll this endpoint from your Roblox Studio plugin.
              </p>
            </div>

            {/* Response schema */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Response Schema</p>
              <div className="rounded-xl border border-white/8 bg-black/30 overflow-hidden">
                <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="text-xs text-gray-500 font-mono">200 OK · application/json</span>
                </div>
                <pre className="p-4 text-xs font-mono text-gray-300 leading-relaxed overflow-x-auto">
{`{
  "service": "ServerScriptService | ReplicatedStorage | StarterPlayerScripts | StarterGui",
  "type": "Script | LocalScript | ModuleScript",
  "name": "string (PascalCase)",
  "code": "string (Lua source code)"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Script Preview */}
        <div className="rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-xl">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <h2 className="text-lg font-semibold text-white">Latest Generated Script</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshKey > 0 ? "animate-spin" : ""}`} style={{ animationDuration: "0.5s", animationIterationCount: 1 }} />
                Refresh
              </button>
              {latestScript && (
                <>
                  <button
                    onClick={() => handleCopy(JSON.stringify(latestScript, null, 2), "json")}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:text-blue-400 hover:border-blue-500/40 transition-all"
                  >
                    {copied === "json" ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                    Copy JSON
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:text-green-400 hover:border-green-500/40 transition-all"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                </>
              )}
            </div>
          </div>

          {latestScript ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs text-blue-400 font-mono">
                  {latestScript.service}
                </span>
                <span className="rounded-full border border-purple-500/25 bg-purple-500/10 px-3 py-1 text-xs text-purple-400 font-mono">
                  {latestScript.type}
                </span>
                <span className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400 font-mono">
                  {latestScript.name}
                </span>
              </div>
              <div className="rounded-xl border border-white/8 bg-black/30 overflow-x-auto">
                <pre className="p-4 text-xs font-mono text-gray-300 leading-relaxed max-h-64">
                  {JSON.stringify(latestScript, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                <Code2 className="h-6 w-6 text-gray-600" />
              </div>
              <p className="text-sm text-gray-500">No script generated yet.</p>
              <p className="text-xs text-gray-600 mt-1">
                Go to the{" "}
                <a href="/chat" className="text-blue-400 hover:underline">
                  chat page
                </a>{" "}
                and generate a script first.
              </p>
            </div>
          )}
        </div>

        {/* Roblox Studio Plugin Code */}
        <div className="rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-xl">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-orange-400" />
              <h2 className="text-lg font-semibold text-white">Roblox Studio Plugin Code</h2>
            </div>
            <button
              onClick={() => handleCopy(LUA_PLUGIN_CODE, "plugin")}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:text-blue-400 hover:border-blue-500/40 transition-all"
            >
              {copied === "plugin" ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Plugin Code
                </>
              )}
            </button>
          </div>

          <div className="mb-4 rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 text-xs text-orange-300">
            <strong>Setup:</strong> In Roblox Studio, enable{" "}
            <code className="rounded bg-orange-500/20 px-1">HttpService.HttpEnabled</code> and create
            a Plugin Script. Paste the code below, adjusting the endpoint URL to match your
            running dev server port.
          </div>

          <div className="rounded-xl border border-white/8 bg-black/40 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-gray-600 font-mono ml-1">RoboLuaPlugin.lua</span>
            </div>
            <div className="overflow-x-auto max-h-96">
              <pre className="p-4 text-xs font-mono text-gray-300 leading-relaxed">
                {LUA_PLUGIN_CODE}
              </pre>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-5">How to Connect</h2>
          <ol className="space-y-4">
            {[
              { step: "1", title: "Generate a Script", desc: "Use the Chat page to describe and generate your Roblox script." },
              { step: "2", title: "Open Roblox Studio", desc: "Enable HttpService in Studio settings (AllowHttpRequests = true)." },
              { step: "3", title: "Create a Plugin Script", desc: "In the Plugins ribbon → Plugin Editor → New Plugin. Paste the plugin code." },
              { step: "4", title: "Run the Dev Server", desc: "Make sure your RoboLua app is running locally. The plugin will GET /api/latest-script." },
              { step: "5", title: "Click 'Fetch Script'", desc: "The plugin button appears in the Studio toolbar. Click it to insert the AI script." },
            ].map((item) => (
              <li key={item.step} className="flex items-start gap-4">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-bold text-white">
                  {item.step}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
