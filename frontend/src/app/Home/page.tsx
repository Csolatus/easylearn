import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d1a] text-white">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">
            E
          </div>
          <span className="font-semibold text-white">EasyLearn</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors font-medium"
          >
            Commencer
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-5xl font-bold tracking-tight mb-6 max-w-2xl leading-tight">
          Apprendre, c&apos;est{" "}
          <span className="text-purple-400">plus simple</span> que tu ne le penses
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-10">
          EasyLearn est une plateforme éducative pour les écoles. Cours interactifs,
          suivi de progression et tuteur IA intégré.
        </p>
        <div className="flex gap-4">
          <Link
            href="/register"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Créer un compte
          </Link>
          <Link
            href="/login"
            className="border border-white/10 hover:border-white/20 hover:bg-white/5 text-white px-6 py-3 rounded-xl transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-600 py-6 border-t border-white/5">
        © {new Date().getFullYear()} EasyLearn
      </footer>
    </div>
  );
}
