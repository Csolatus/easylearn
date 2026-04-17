import Link from "next/link";

export default function HomeHeroSection() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
      <h1 className="text-5xl font-bold tracking-tight mb-6 max-w-2xl leading-tight text-foreground">
        Apprendre, c&apos;est{" "}
        <span className="text-purple-500 dark:text-purple-400">plus simple</span> que tu ne le penses
      </h1>
      <p className="text-muted-foreground text-lg max-w-xl mb-10">
        EasyLearn est une plateforme éducative pour les écoles. Cours interactifs,
        suivi de progression et tuteur IA intégré.
      </p>
      <div className="flex gap-4">
        <Link
          href="/register"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-purple-500/20"
        >
          Créer un compte
        </Link>
        <Link
          href="/login"
          className="border border-border hover:bg-muted text-foreground px-6 py-3 rounded-xl transition-colors"
        >
          Se connecter
        </Link>
      </div>
    </main>
  );
}
