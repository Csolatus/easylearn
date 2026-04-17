import Link from "next/link";

type Props = {
  questionText: string;
  linkText: string;
  linkHref: string;
};

export default function AuthHeader({ questionText, linkText, linkHref }: Props) {
  return (
    <div className="flex items-center justify-between px-8 py-4 border-b border-border">
      <span className="text-foreground font-bold text-sm">EasyLearn</span>
      <div className="flex items-center gap-1 text-sm text-muted">
        <span>{questionText}</span>
        <Link href={linkHref} className="text-accent hover:opacity-80 font-medium transition-opacity">
          {linkText}
        </Link>
      </div>
    </div>
  );
}
