type Props = { displayName: string; email: string; initial: string };

export default function ProfileCard({ displayName, email, initial }: Props) {
  return (
    <div className="rounded-2xl border border-white/5 dark:border-gray-200 bg-[#111118] dark:bg-white px-6 py-6 flex items-center gap-5">
      <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
        {initial}
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-white dark:text-gray-900">{displayName}</h2>
        <p className="text-sm text-gray-400 dark:text-gray-500">{email}</p>
        <span className="inline-block mt-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 dark:text-purple-600">
          Étudiant
        </span>
      </div>
    </div>
  );
}
