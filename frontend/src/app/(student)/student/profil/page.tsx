"use client";

import { useState } from "react";

const BADGES = [
  { label: "First Steps", icon: "🎯", earned: true },
  { label: "5 Days Streak", icon: "🔥", earned: true },
  { label: "Quiz Master", icon: "🧠", earned: true },
  { label: "Speed Coder", icon: "⚡", earned: false },
  { label: "Top 10%", icon: "🏆", earned: false },
];

const COMPLETED = [
  { title: "Introduction to Python", score: 91, date: "Mars 2025" },
  { title: "HTML & CSS Basics", score: 87, date: "Fév. 2025" },
];

export default function ProfilPage() {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("Lucas Martin");
  const [bio, setBio] = useState("Étudiant en développement web passionné par le frontend et l'IA.");

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">

        {/* Profile card */}
        <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-purple-600 flex items-center justify-center text-3xl font-bold text-white shrink-0">
            {name[0]}
          </div>
          <div className="flex-1 flex flex-col gap-3 text-center sm:text-left">
            {editMode ? (
              <>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 max-w-xs"
                />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="bg-white/5 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </>
            ) : (
              <>
                <h1 className="text-xl font-bold text-white dark:text-gray-900">{name}</h1>
                <p className="text-gray-400 dark:text-gray-500 text-sm">{bio}</p>
              </>
            )}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs bg-purple-500/20 text-purple-400 px-2.5 py-1 rounded-full">Étudiant</span>
              <span className="text-xs text-gray-500">Membre depuis Jan. 2025</span>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-white/5 dark:bg-gray-100 hover:bg-white/10 dark:hover:bg-gray-200 text-gray-300 dark:text-gray-700 text-sm px-4 py-2 rounded-xl transition-colors"
          >
            {editMode ? "Sauvegarder" : "Modifier"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Badges */}
          <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-white dark:text-gray-900">Badges</h2>
            <div className="grid grid-cols-3 gap-3">
              {BADGES.map((badge) => (
                <div
                  key={badge.label}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl ${badge.earned ? "bg-purple-500/10" : "bg-white/5 dark:bg-gray-50 opacity-40"}`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 text-center leading-tight">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Completed courses */}
          <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-white dark:text-gray-900">Cours terminés</h2>
            {COMPLETED.map((course) => (
              <div key={course.title} className="flex items-center justify-between p-3 rounded-xl bg-white/5 dark:bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-white dark:text-gray-900">{course.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{course.date}</p>
                </div>
                <span className={`text-sm font-bold ${course.score >= 80 ? "text-green-400" : "text-yellow-400"}`}>
                  {course.score}/100
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
