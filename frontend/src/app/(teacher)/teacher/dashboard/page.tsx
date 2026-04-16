"use client";

import { useState } from "react";
import Link from "next/link";

const STATS = [
  { label: "Classes actives", value: "4", icon: "🏫", color: "from-green-600 to-green-400" },
  { label: "Étudiants", value: "87", icon: "👥", color: "from-emerald-600 to-emerald-400" },
  { label: "Cours créés", value: "12", icon: "📖", color: "from-teal-600 to-teal-400" },
  { label: "Exercices", value: "34", icon: "💻", color: "from-cyan-600 to-cyan-400" },
];

const CLASSES = [
  { id: 1, name: "JS Avancé — Groupe A", students: 24, courses: 3, completion: 72 },
  { id: 2, name: "Python Débutant — Groupe B", students: 18, courses: 5, completion: 45 },
  { id: 3, name: "React Fondamentaux", students: 30, courses: 4, completion: 88 },
  { id: 4, name: "SQL & Bases de données", students: 15, courses: 2, completion: 30 },
];

const ACTIVITY = [
  { text: "Lucas Martin a soumis l'exercice 3 — JS Avancé", time: "il y a 5 min", icon: "💻" },
  { text: "Emma Dupont a terminé le cours React Hooks", time: "il y a 22 min", icon: "✅" },
  { text: "3 nouvelles inscriptions dans Python Débutant", time: "il y a 1h", icon: "👥" },
  { text: "Quiz Closures — 18/24 étudiants ont répondu", time: "il y a 2h", icon: "📝" },
];

// 30-day progression mock data (% moyen de complétion par jour)
const TODAY = new Date();
const PROGRESSION_30D = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(TODAY);
  date.setDate(TODAY.getDate() - (29 - i));
  const base = 38 + i * 1.1;
  const noise = Math.sin(i * 1.7) * 6 + Math.cos(i * 0.9) * 4;
  return {
    date,
    label: date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
    value: Math.min(100, Math.max(0, Math.round(base + noise))),
  };
});

function ProgressionChart() {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; value: number } | null>(null);

  const W = 600;
  const H = 140;
  const PAD = { top: 12, right: 12, bottom: 24, left: 32 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const values = PROGRESSION_30D.map((d) => d.value);
  const minV = Math.max(0, Math.min(...values) - 8);
  const maxV = Math.min(100, Math.max(...values) + 8);

  const toX = (i: number) => PAD.left + (i / (PROGRESSION_30D.length - 1)) * chartW;
  const toY = (v: number) => PAD.top + chartH - ((v - minV) / (maxV - minV)) * chartH;

  const linePath = PROGRESSION_30D.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(d.value)}`).join(" ");
  const areaPath = `${linePath} L ${toX(PROGRESSION_30D.length - 1)} ${PAD.top + chartH} L ${toX(0)} ${PAD.top + chartH} Z`;

  // Y axis ticks
  const yTicks = [minV, Math.round((minV + maxV) / 2), maxV].map(Math.round);
  // X axis: show label every 7 days
  const xLabels = PROGRESSION_30D.filter((_, i) => i === 0 || i === 14 || i === 29);

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((tick) => (
          <line
            key={tick}
            x1={PAD.left}
            x2={W - PAD.right}
            y1={toY(tick)}
            y2={toY(tick)}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="4 4"
          />
        ))}

        {/* Y axis labels */}
        {yTicks.map((tick) => (
          <text
            key={tick}
            x={PAD.left - 6}
            y={toY(tick) + 4}
            textAnchor="end"
            fontSize="9"
            fill="rgba(156,163,175,0.8)"
          >
            {tick}%
          </text>
        ))}

        {/* X axis labels */}
        {xLabels.map((d, i) => (
          <text
            key={i}
            x={toX(PROGRESSION_30D.indexOf(d))}
            y={H - 4}
            textAnchor="middle"
            fontSize="9"
            fill="rgba(156,163,175,0.8)"
          >
            {d.label}
          </text>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Invisible hover targets */}
        {PROGRESSION_30D.map((d, i) => (
          <rect
            key={i}
            x={toX(i) - chartW / (2 * (PROGRESSION_30D.length - 1))}
            y={PAD.top}
            width={chartW / (PROGRESSION_30D.length - 1)}
            height={chartH}
            fill="transparent"
            onMouseEnter={() => setTooltip({ x: toX(i), y: toY(d.value), label: d.label, value: d.value })}
          />
        ))}

        {/* Hover dot */}
        {tooltip && (
          <circle cx={tooltip.x} cy={tooltip.y} r="4" fill="#22c55e" stroke="#0f0f1a" strokeWidth="2" />
        )}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full -mt-2 bg-[#0f0f1a] dark:bg-gray-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs shadow-lg"
          style={{
            left: `${(tooltip.x / W) * 100}%`,
            top: `${(tooltip.y / (140)) * 100}%`,
          }}
        >
          <p className="text-gray-400">{tooltip.label}</p>
          <p className="text-green-400 font-bold">{tooltip.value}%</p>
        </div>
      )}
    </div>
  );
}

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-gray-900">
              Bonjour, Professeur 👋
            </h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Voici un aperçu de vos classes et de l&apos;activité récente.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/teacher/classes"
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              + Nouvelle classe
            </Link>
            <Link
              href="/teacher/cours"
              className="bg-white/5 dark:bg-gray-200 hover:bg-white/10 dark:hover:bg-gray-300 text-white dark:text-gray-900 text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              + Nouveau cours
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-5 flex flex-col gap-3"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-white dark:text-gray-900">{stat.value}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 30-day progression chart */}
        <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white dark:text-gray-900">Progression — 30 derniers jours</h2>
            <span className="text-xs text-gray-500">% complétion moyen</span>
          </div>
          <ProgressionChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Classes */}
          <div className="lg:col-span-2 bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white dark:text-gray-900">Mes classes</h2>
              <Link
                href="/teacher/classes"
                className="text-green-400 hover:text-green-300 text-xs"
              >
                Voir tout →
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {CLASSES.map((cls) => (
                <Link
                  key={cls.id}
                  href={`/teacher/classes/${cls.id}`}
                  className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 dark:bg-gray-50 hover:bg-white/10 dark:hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white dark:text-gray-900">{cls.name}</p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {cls.students} élèves · {cls.courses} cours
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${cls.completion}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 w-8 text-right">
                      {cls.completion}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Activité récente */}
          <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-white dark:text-gray-900">Activité récente</h2>
            <div className="flex flex-col gap-4">
              {ACTIVITY.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-xs text-gray-300 dark:text-gray-700 leading-snug">
                      {item.text}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
