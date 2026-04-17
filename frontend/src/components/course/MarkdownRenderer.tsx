"use client";

import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

type Props = {
  content: string;
  className?: string;
};

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-foreground mt-6 mb-3 pb-2 border-b border-border">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-bold text-foreground mt-5 mb-2">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-foreground mt-4 mb-1.5">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-gray-300 dark:text-gray-700 mb-3 leading-relaxed">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-gray-300 dark:text-gray-600">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside text-gray-300 dark:text-gray-700 mb-3 space-y-1 pl-2">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside text-gray-300 dark:text-gray-700 mb-3 space-y-1 pl-2">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-gray-300 dark:text-gray-700">{children}</li>
  ),
  code: ({ children, className: codeClass }) => {
    const isBlock = typeof codeClass === "string" && codeClass.includes("language-");
    if (isBlock) {
      return (
        <code className="block bg-[#0a0a14] dark:bg-gray-900 text-green-400 dark:text-green-600 rounded-xl px-4 py-3 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre">
          {children}
        </code>
      );
    }
    return (
      <code className="bg-white/10 dark:bg-gray-200 text-purple-400 dark:text-purple-600 px-1.5 py-0.5 rounded font-mono text-xs">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-4 rounded-xl overflow-hidden">{children}</pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-purple-500 pl-4 my-3 text-muted italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border my-5" />,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-purple-400 dark:text-purple-600 hover:underline"
    >
      {children}
    </a>
  ),
};

export default function MarkdownRenderer({ content, className = "" }: Props) {
  return (
    <div className={`markdown-body text-sm leading-relaxed ${className}`}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
