"use client";

interface Props {
  schoolName: string;
  email: string;
  website: string;
  address: string;
  onSchoolNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onWebsiteChange: (v: string) => void;
  onAddressChange: (v: string) => void;
}

const inputClass = "bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-300 text-white dark:text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500";
const labelClass = "text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider";

export function SchoolInfoForm({ schoolName, email, website, address, onSchoolNameChange, onEmailChange, onWebsiteChange, onAddressChange }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 dark:border-gray-300 bg-[#111118] dark:bg-white shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50">
        <h2 className="text-sm font-semibold text-white dark:text-gray-900">Informations de l&apos;école</h2>
      </div>
      <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Nom de l&apos;école</label>
          <input value={schoolName} onChange={(e) => onSchoolNameChange(e.target.value)} className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Email de contact</label>
          <input value={email} onChange={(e) => onEmailChange(e.target.value)} className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Site web</label>
          <input value={website} onChange={(e) => onWebsiteChange(e.target.value)} className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Adresse</label>
          <input value={address} onChange={(e) => onAddressChange(e.target.value)} className={inputClass} />
        </div>
      </div>
    </div>
  );
}
