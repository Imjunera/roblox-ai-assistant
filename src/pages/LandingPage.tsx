import { Link } from "react-router-dom";
import {
  Bot,
  Zap,
  Code2,
  Shield,
  ArrowRight,
  Sparkles,
  Server,
  Package,
  Monitor,
  User,
  ChevronRight,
  Star,
} from "lucide-react";

const FEATURES = [
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Instant Generation",
    desc: "Powered by Llama 3.3 70B via Groq's ultra-fast LPU inference engine. Get scripts in seconds.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    icon: <Code2 className="h-5 w-5" />,
    title: "Roblox Native APIs",
    desc: "Every script uses only official Roblox APIs. No deprecated methods, no third-party modules.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Production Ready",
    desc: "Scripts are structured, clean, and drop into any Roblox Studio project without modification.",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
  {
    icon: <Server className="h-5 w-5" />,
    title: "Plugin Compatible",
    desc: "Built-in REST endpoint at /api/latest-script lets a Roblox Studio plugin pull scripts directly.",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
];

const SERVICES = [
  { name: "ServerScriptService", icon: <Server className="h-4 w-4" />, color: "text-green-400", desc: "Server-side logic" },
  { name: "ReplicatedStorage", icon: <Package className="h-4 w-4" />, color: "text-purple-400", desc: "Shared modules" },
  { name: "StarterGui", icon: <Monitor className="h-4 w-4" />, color: "text-orange-400", desc: "Client-side UI" },
  { name: "StarterPlayerScripts", icon: <User className="h-4 w-4" />, color: "text-cyan-400", desc: "Player logic" },
];

const EXAMPLES = [
  { prompt: "Create a coin collection system", service: "ServerScriptService", type: "Script" },
  { prompt: "Build an animated shop GUI", service: "StarterGui", type: "LocalScript" },
  { prompt: "Make a round-based game manager", service: "ServerScriptService", type: "Script" },
  { prompt: "Proximity prompt door script", service: "StarterPlayerScripts", type: "LocalScript" },
  { prompt: "Shared utility module for math", service: "ReplicatedStorage", type: "ModuleScript" },
  { prompt: "Leaderboard with DataStore", service: "ServerScriptService", type: "Script" },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07070d] text-white overflow-x-hidden">
      {/* Gradient orbs background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-cyan-500/8 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-blue-800/10 blur-[100px]" />
      </div>

      <div className="relative">
        {/* Hero */}
        <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-16 text-center">
          {/* Badge */}
          <div className="mb-8 flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-2 text-sm">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-blue-300">Powered by Groq · Llama 3.3 70B</span>
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
          </div>

          {/* Heading */}
          <h1 className="mb-6 max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-white">Generate Roblox Scripts</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              With AI Precision
            </span>
          </h1>

          <p className="mb-10 max-w-2xl text-lg text-gray-400 leading-relaxed sm:text-xl">
            RoboLua AI is your expert Roblox Lua engineer. Describe what you need
            and get a complete, production-ready script — placed in the right service,
            with the right type — instantly.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/chat"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
            >
              <Bot className="h-5 w-5" />
              Start Generating Scripts
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              to="/plugin"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-base font-semibold text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300"
            >
              <Code2 className="h-5 w-5" />
              Plugin API Docs
            </Link>
          </div>

          {/* Hero stats */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 border-t border-white/5 pt-10">
            {[
              { value: "4", label: "Roblox Services" },
              { value: "3", label: "Script Types" },
              { value: "<1s", label: "Generation Time" },
              { value: "∞", label: "Script Variety" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Everything a Roblox dev needs
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                From simple scripts to complex game systems — RoboLua handles it all.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className={`group rounded-2xl border ${f.bg} p-6 hover:scale-[1.02] transition-transform duration-300`}
                >
                  <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border ${f.bg} ${f.color}`}>
                    {f.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Supported Services */}
        <section className="px-4 py-20 bg-white/[0.02] border-y border-white/5">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold text-white">All Roblox Services Supported</h2>
              <p className="text-gray-500">Scripts are automatically placed in the correct Roblox service.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((s) => (
                <div key={s.name} className="rounded-xl border border-white/8 bg-white/[0.03] p-5 text-center hover:border-white/15 transition-colors duration-300">
                  <div className={`mb-3 flex justify-center ${s.color}`}>{s.icon}</div>
                  <p className="font-mono text-sm font-semibold text-white">{s.name}</p>
                  <p className="mt-1 text-xs text-gray-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Example prompts */}
        <section className="px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold text-white">What can you build?</h2>
              <p className="text-gray-500">Click any example to try it in the chat.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {EXAMPLES.map((ex) => (
                <Link
                  key={ex.prompt}
                  to={`/chat?prompt=${encodeURIComponent(ex.prompt)}`}
                  className="group flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300"
                >
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/15">
                    <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">{ex.prompt}</p>
                    <p className="mt-1 text-xs text-gray-600">{ex.service} · {ex.type}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-blue-400 flex-shrink-0 group-hover:translate-x-0.5 transition-all duration-200 mt-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* JSON Output section */}
        <section className="px-4 py-20 bg-white/[0.02] border-y border-white/5">
          <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
                Structured JSON Output
              </h2>
              <p className="mb-6 text-gray-400 leading-relaxed">
                Every script is returned as a validated JSON object, making it trivial
                to integrate with your Roblox Studio plugin, CI/CD pipeline, or
                custom tooling.
              </p>
              <ul className="space-y-3">
                {[
                  "Service placement is auto-detected",
                  "Script type is intelligently chosen",
                  "Code is complete and ready to run",
                  "Name is descriptive and PascalCase",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0d0d14] p-5 shadow-2xl shadow-blue-500/5 font-mono text-sm overflow-x-auto">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-gray-600">script.json</span>
              </div>
              <pre className="text-xs leading-relaxed">
                <span className="text-gray-500">{"{"}</span>{"\n"}
                {"  "}<span className="text-blue-400">"service"</span><span className="text-gray-500">: </span><span className="text-amber-300">"ServerScriptService"</span><span className="text-gray-500">,</span>{"\n"}
                {"  "}<span className="text-blue-400">"type"</span><span className="text-gray-500">: </span><span className="text-amber-300">"Script"</span><span className="text-gray-500">,</span>{"\n"}
                {"  "}<span className="text-blue-400">"name"</span><span className="text-gray-500">: </span><span className="text-amber-300">"CoinCollector"</span><span className="text-gray-500">,</span>{"\n"}
                {"  "}<span className="text-blue-400">"code"</span><span className="text-gray-500">: </span><span className="text-green-400">"local Players = game:GetService..."</span>{"\n"}
                <span className="text-gray-500">{"}"}</span>
              </pre>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="px-4 py-24 text-center">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-2xl shadow-blue-500/30">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Ready to build your game?
            </h2>
            <p className="mb-8 text-gray-400">
              Stop writing boilerplate. Let RoboLua AI generate your Roblox scripts while you focus on game design.
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
            >
              <Bot className="h-5 w-5" />
              Start Generating Scripts
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 px-4 py-8 text-center text-sm text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bot className="h-4 w-4 text-blue-500" />
            <span className="font-semibold text-gray-400">RoboLua AI</span>
          </div>
          <p>Powered by Groq · Llama 3.3 70B · Built for Roblox developers</p>
        </footer>
      </div>
    </div>
  );
}
