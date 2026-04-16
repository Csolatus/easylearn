import Link from "next/link";

type Props = {
  questionText: string;
  linkText: string;
  linkHref: string;
};

export default function AuthHeader({ questionText, linkText, linkHref }: Props) {
  return (
    <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 dark:border-gray-200">
      <span className="text-white dark:text-gray-900 font-bold text-sm">EasyLearn</span>
      <div className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
        <span>{questionText}</span>
        <Link href={linkHref} className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          {linkText}
        </Link>
      </div>
    </div>
  );
}
