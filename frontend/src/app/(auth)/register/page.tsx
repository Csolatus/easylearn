export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Créer un compte
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Rejoignez EasyLearn dès maintenant
        </p>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}
