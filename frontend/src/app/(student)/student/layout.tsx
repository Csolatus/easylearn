"use client";

import { useState } from "react";
import AppSidebar from "@/components/nav/AppSidebar";
import AppBottomNav from "@/components/nav/AppBottomNav";
import Navbar from "@/components/layout/Navbar";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatPanel from "@/components/chat/ChatPanel";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0f0f1a] dark:bg-gray-50 text-white dark:text-gray-900 overflow-x-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar accentColor="purple" searchPlaceholder="Rechercher un cours..." />
        <main className="flex-1 pb-16 md:pb-0 overflow-y-auto">{children}</main>
        <AppBottomNav />
      </div>
      <ChatPanel isOpen={chatOpen} />
      <ChatBubble isOpen={chatOpen} onClick={() => setChatOpen((prev) => !prev)} />
    </div>
  );
}
