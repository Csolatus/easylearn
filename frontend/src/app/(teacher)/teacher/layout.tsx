"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/teacher/dashboard", icon: "⊞" },
  { label: "Classes", href: "/teacher/classes", icon: "🏫" },
  { label: "Cours", href: "/teacher/cours", icon: "📖" },
  { label: "Stats", href: "/teacher/stats", icon: "📊" },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-[#0d0d1a] dark:bg-white dark:border-gray-200 px-4 py-6 border-r border-white/5 sticky top-0 self-start overflow-y-auto">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-sm font-bold text-white">
          E
        </div>
        <div>
          <p className="text-sm font-semibold text-white dark:text-gray-900">EasyLearn</p>
          <p className="text-xs text-gray-500">Teacher Portal</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
              pathname === item.href
                ? "bg-green-600 text-white font-medium"
                : "text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 hover:bg-white/5 dark:hover:bg-gray-100"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex flex-col gap-1 mt-4">
        <Link href="/teacher/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 hover:bg-white/5 dark:hover:bg-gray-100 transition-colors">
          <span>⚙️</span> Settings
        </Link>
        <Link href="/teacher/help" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 hover:bg-white/5 dark:hover:bg-gray-100 transition-colors">
          <span>❓</span> Help
        </Link>
      </div>
      <button className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors">
        Nouveau cours
      </button>
    </aside>
  );
}

function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0d0d1a] dark:bg-white dark:border-gray-200 border-t border-white/5 flex justify-around items-center py-3 z-50">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center gap-1 text-xs transition-colors ${
            pathname === item.href ? "text-green-400" : "text-gray-500 dark:text-gray-400 hover:text-white dark:hover:text-gray-900"
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 dark:border-gray-200 bg-[#0f0f1a] dark:bg-white sticky top-0 z-40">
      <div className="relative w-full max-w-xs">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Rechercher..."
          className="w-full bg-[#1a1a2e] dark:bg-gray-100 text-white dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 transition-colors">
          🔔
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-sm font-bold text-white">
          T
        </div>
      </div>
    </header>
  );
}

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0f0f1a] dark:bg-gray-50 text-white dark:text-gray-900 overflow-x-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0 overflow-y-auto">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
