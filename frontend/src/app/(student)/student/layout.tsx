export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0f0f1a] text-white">
      <main className="flex-1">{children}</main>
    </div>
  );
}
