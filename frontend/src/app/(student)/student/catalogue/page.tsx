"use client";

import { useState } from "react";

type Course = {
  id: number;
  title: string;
  description: string;
  instructor: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  rating: number;
  lessons: number;
  duration: string;
  enrolled: number;
  category: string;
};

function CourseCard({ course }: { course: Course }) {
  const levelColors = {
    BEGINNER: "bg-green-500",
    INTERMEDIATE: "bg-yellow-500",
    ADVANCED: "bg-red-500",
  };

  return (
    <div className="bg-[#1a1a2e] rounded-2xl overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all">
      <div className="h-36 bg-gradient-to-br from-purple-900 to-blue-900" />
      <div className="p-4 flex flex-col gap-2">
        <span className={`text-xs font-bold px-2 py-1 rounded-full w-fit ${levelColors[course.level]}`}>
          {course.level}
        </span>
        <h3 className="font-semibold text-white text-sm leading-snug">{course.title}</h3>
        <p className="text-gray-400 text-xs line-clamp-2">{course.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs">
            {course.instructor[0]}
          </div>
          <span className="text-gray-400 text-xs">{course.instructor}</span>
          <span className="ml-auto text-yellow-400 text-xs">★ {course.rating}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-500 text-xs mt-1">
          <span>📚 {course.lessons} leçons</span>
          <span>⏱ {course.duration}</span>
          <span>👥 {course.enrolled}</span>
        </div>
      </div>
    </div>
  );
}

export default function CataloguePage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Courses");

  const filters = [
    "All Courses",
    "Web Development",
    "Data Science",
    "AI & ML",
    "Beginner",
    "Intermediate",
  ];

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Explore Knowledge</h1>
        <p className="text-gray-400 text-sm">
          More than 1,000 courses to build your skills designed for the future
          of industry and technology.
        </p>
        <div className="mt-6 relative w-full max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a2e] text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-purple-600 text-white"
                  : "bg-[#1a1a2e] text-gray-400 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
