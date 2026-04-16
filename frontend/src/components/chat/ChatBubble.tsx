"use client";

type Props = {
  isOpen: boolean;
  onClick: () => void;
  unread?: number;
};

export default function ChatBubble({ isOpen, onClick, unread = 0 }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Fermer le chat IA" : "Ouvrir le chat IA"}
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
        isOpen
          ? "bg-gray-700 dark:bg-gray-200 rotate-0 scale-95"
          : "bg-purple-600 hover:bg-purple-700 hover:scale-110"
      }`}
    >
      {isOpen ? (
        <span className="text-white dark:text-gray-900 text-xl font-bold leading-none">✕</span>
      ) : (
        <>
          <span className="text-2xl">✦</span>
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unread}
            </span>
          )}
        </>
      )}
    </button>
  );
}
