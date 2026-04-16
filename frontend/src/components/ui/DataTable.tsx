type Props = {
  headers: string[];
  children: React.ReactNode;
  className?: string;
};

export default function DataTable({ headers, children, className = "" }: Props) {
  return (
    <div className={`rounded-2xl border border-white/10 dark:border-gray-300 bg-[#111118] dark:bg-white shadow-md overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 dark:border-gray-200">
              {headers.map((h) => (
                <th
                  key={h}
                  className={`text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                    h === "" ? "text-right" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 dark:divide-gray-200">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}
