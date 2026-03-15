import { Link, useLocation } from "react-router-dom";
import { Bot, Code2, MessageSquare, Zap } from "lucide-react";

export function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow duration-300">
            <Bot className="h-5 w-5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-white tracking-wide">RoboLua</span>
            <span className="text-[10px] text-blue-400 font-medium tracking-widest uppercase">AI</span>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden sm:flex items-center gap-1">
          <NavLink to="/" active={pathname === "/"} icon={<Zap className="h-3.5 w-3.5" />}>
            Home
          </NavLink>
          <NavLink to="/chat" active={pathname === "/chat"} icon={<MessageSquare className="h-3.5 w-3.5" />}>
            Chat
          </NavLink>
          <NavLink to="/plugin" active={pathname === "/plugin"} icon={<Code2 className="h-3.5 w-3.5" />}>
            Plugin API
          </NavLink>
        </div>

        {/* CTA */}
        <Link
          to="/chat"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Start Generating</span>
          <span className="sm:hidden">Chat</span>
        </Link>
      </div>
    </nav>
  );
}

function NavLink({
  to,
  active,
  icon,
  children,
}: {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-blue-500/15 text-blue-400"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}
