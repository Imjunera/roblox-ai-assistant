import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./pages/LandingPage";
import { ChatPage } from "./pages/ChatPage";
import { PluginPage } from "./pages/PluginPage";

export function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <div className="min-h-screen bg-[#07070d]">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/plugin" element={<PluginPage />} />
            {/* Catch-all redirect to home */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </div>
      </ChatProvider>
    </BrowserRouter>
  );
}
