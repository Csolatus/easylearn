import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-border">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-purple-500/20">
          E
        </div>
        <span className="font-semibold text-foreground">EasyLearn</span>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
        >
          Connexion
        </Link>
        <Link
          href="/register"
          className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-lg shadow-purple-500/20"
        >
          Commencer
        </Link>
      </div>
    </header>
  );
}
