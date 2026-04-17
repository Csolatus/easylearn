import { Inbox } from "lucide-react";

type EmptyStateProps = {
  message: string;
  className?: string;
};

export default function EmptyState({ message, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      <Inbox size={40} className="text-muted mb-3" />
      <p className="text-muted text-sm">{message}</p>
    </div>
  );
}
