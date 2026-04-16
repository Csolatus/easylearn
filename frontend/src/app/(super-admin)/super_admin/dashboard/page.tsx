"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useSchoolStore } from "@/store/schoolStore";
import { SuperAdminKpiCards } from "./SuperAdminKpiCards";
import { RecentSchoolsTable } from "./RecentSchoolsTable";

export default function SuperAdminDashboardPage() {
  const token = useAuthStore((s) => s.token);
  const { schools, fetchSchools } = useSchoolStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetchSchools().finally(() => setIsLoading(false));
  }, [token, fetchSchools]);

  const activeSchools = schools.filter((s) => s.is_active !== false);

  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Vue d&apos;ensemble de toutes les écoles
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <SuperAdminKpiCards total={schools.length} active={activeSchools.length} />
          <RecentSchoolsTable schools={schools} />
        </>
      )}
    </div>
  );
}
