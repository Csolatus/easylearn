import Link from "next/link";

export default function HeroSection() {
  return (
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
  );
}
