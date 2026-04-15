"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

const CLASS_DATA: Record<string, {
  name: string; students: number; courses: number; completion: number;
  studentList: { name: string; completion: number; avgScore: number; submissions: number }[];
  courseList: { title: string; lessons: number; completion: number }[];
}> = {
  "1": {
    name: "JS Avancé — Groupe A", students: 24, courses: 3, completion: 72,
    studentList: [
      { name: "Lucas Martin", completion: 92, avgScore: 85, submissions: 18 },
      { name: "Sarah Chen", completion: 75, avgScore: 72, submissions: 14 },
      { name: "Maxime Petit", completion: 60, avgScore: 65, submissions: 11 },
      { name: "Camille Roux", completion: 40, avgScore: 55, submissions: 7 },
    ],
    courseList: [
      { title: "JavaScript Avancé", lessons: 12, completion: 80 },
      { title: "Design Patterns JS", lessons: 8, completion: 65 },
      { title: "Testing avec Jest", lessons: 6, completion: 50 },
    ],
  },
  "2": {
    name: "Python Débutant — Groupe B", students: 18, courses: 5, completion: 45,
    studentList: [
      { name: "Théo Bernard", completion: 40, avgScore: 60, submissions: 9 },
      { name: "Lucie Fontaine", completion: 55, avgScore: 68, submissions: 12 },
    ],
    courseList: [
      { title: "Introduction à Python", lessons: 8, completion: 45 },
    ],
  },
};

const FALLBACK = { name: "Classe inconnue", students: 0, courses: 0, completion: 0, studentList: [], courseList: [] };

export default function ClassDetailPage() {
  const { classId } = useParams<{ classId: string }>();
  const data = CLASS_DATA[classId] ?? FALLBACK;

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        <div>
          <Link href="/teacher/classes" className="text-gray-400 hover:text-white dark:hover:text-gray-900 text-xs transition-colors mb-3 inline-block">
            ← Retour aux classes
          </Link>
          <h1 className="text-3xl font-bold text-white dark:text-gray-900">{data.name}</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            {data.students} étudiants · {data.courses} cours · {data.completion}% de complétion globale
          </p>
        </div>

        <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-5 flex items-center gap-4">
          <span className="text-gray-400 text-sm w-28">Complétion globale</span>
          <div className="flex-1 h-2 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${data.completion}%` }} />
          </div>
          <span className="text-green-400 font-bold text-sm w-10 text-right">{data.completion}%</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-white dark:text-gray-900">Étudiants</h2>
            {data.studentList.length === 0 && <p className="text-gray-500 text-sm">Aucun étudiant.</p>}
            <div className="flex flex-col gap-3">
              {data.studentList.map((student) => (
                <div key={student.name} className="p-3 rounded-xl bg-white/5 dark:bg-gray-50 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-xs text-white font-bold">
                        {student.name[0]}
                      </div>
                      <span className="text-sm font-medium text-white dark:text-gray-900">{student.name}</span>
                    </div>
                    <span className={`text-xs font-semibold ${student.avgScore >= 80 ? "text-green-400" : student.avgScore >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                      {student.avgScore}/100
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${student.completion}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">{student.completion}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-white dark:text-gray-900">Cours assignés</h2>
            {data.courseList.length === 0 && <p className="text-gray-500 text-sm">Aucun cours assigné.</p>}
            {data.courseList.map((course) => (
              <div key={course.title} className="p-3 rounded-xl bg-white/5 dark:bg-gray-50 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white dark:text-gray-900">{course.title}</span>
                  <span className="text-xs text-gray-400">📚 {course.lessons} leçons</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${course.completion}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{course.completion}%</span>
                </div>
              </div>
            ))}
            <button className="mt-2 w-full border border-dashed border-white/10 dark:border-gray-300 text-gray-400 hover:text-white dark:hover:text-gray-900 hover:border-green-500 text-sm py-2.5 rounded-xl transition-colors">
              + Assigner un cours
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
