"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/student/dashboard", icon: "⊞" },
  { label: "Courses", href: "/student/catalogue", icon: "📖" },
  { label: "AI Lab", href: "/student/ai-lab", icon: "🤖" },
  { label: "Profile", href: "/student/profil", icon: "👤" },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-[#0d0d1a] px-4 py-6 border-r border-white/5">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">
          E
        </div>
        <div>
          <p className="text-sm font-semibold text-white">EasyLearn</p>
          <p className="text-xs text-gray-500">Student Portal</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
              pathname === item.href
                ? "bg-purple-600 text-white font-medium"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex flex-col gap-1 mt-4">
        <Link href="/student/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
          <span>⚙️</span> Settings
        </Link>
        <Link href="/student/help" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
          <span>❓</span> Help
        </Link>
      </div>
      <button className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors">
        Start Learning
      </button>
    </aside>
  );
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0f0f1a] text-white">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
