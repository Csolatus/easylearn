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

const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: "Advanced Modern JavaScript & Patterns",
    description: "Master advanced JavaScript patterns, closures, prototypes and modern ES2024 features.",
    instructor: "Marc Dupont",
    level: "ADVANCED",
    rating: 4.8,
    lessons: 42,
    duration: "18h",
    enrolled: 1240,
    category: "Web Development",
  },
  {
    id: 2,
    title: "Neural Networks from Ground Zero",
    description: "Build and train neural networks from scratch using Python and NumPy.",
    instructor: "Sarah Connor",
    level: "INTERMEDIATE",
    rating: 4.6,
    lessons: 38,
    duration: "14h",
    enrolled: 980,
    category: "AI & ML",
  },
  {
    id: 3,
    title: "Visual Storytelling with Big Data",
    description: "Transform complex datasets into compelling visual narratives.",
    instructor: "Jean Miller",
    level: "INTERMEDIATE",
    rating: 4.7,
    lessons: 27,
    duration: "10h",
    enrolled: 760,
    category: "Data Science",
  },
  {
    id: 4,
    title: "Kubernetes for Cloud Native Apps",
    description: "Deploy and manage containerized applications at scale with Kubernetes.",
    instructor: "Thomas Lee",
    level: "ADVANCED",
    rating: 4.9,
    lessons: 35,
    duration: "16h",
    enrolled: 540,
    category: "Web Development",
  },
  {
    id: 5,
    title: "Introduction to Python",
    description: "Learn Python from scratch with hands-on projects and exercises.",
    instructor: "Alice Martin",
    level: "BEGINNER",
    rating: 4.5,
    lessons: 30,
    duration: "12h",
    enrolled: 3200,
    category: "Data Science",
  },
  {
    id: 6,
    title: "Machine Learning Fundamentals",
    description: "Understand the core concepts of machine learning algorithms and applications.",
    instructor: "David Chen",
    level: "BEGINNER",
    rating: 4.4,
    lessons: 24,
    duration: "9h",
    enrolled: 2100,
    category: "AI & ML",
  },
];

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
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_COURSES.filter((course) => {
            const matchSearch = course.title.toLowerCase().includes(search.toLowerCase());
            const matchFilter =
              activeFilter === "All Courses" ||
              course.category === activeFilter ||
              course.level === activeFilter.toUpperCase();
            return matchSearch && matchFilter;
          }).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
