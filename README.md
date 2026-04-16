# EasyLearn

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)

EasyLearn is a Learning Management System built during the EFREI Hackathon 2025–2026. The idea was straightforward: most existing LMS platforms are limited to passive content. We wanted students to be able to read a lesson, take a quiz, write and run code, and ask questions to an AI assistant — all without leaving the same page.

The platform supports four roles — student, teacher, school admin and super admin — and is designed to run in a multi-school environment.

---

## Table of contents

1. [What the platform does](#what-the-platform-does)
2. [Tech stack](#tech-stack)
3. [Architecture](#architecture)
4. [Getting started](#getting-started)
5. [Environment variables](#environment-variables)
6. [Pages by role](#pages-by-role)
7. [API](#api)
8. [Database](#database)
9. [Technical decisions](#technical-decisions)

---

## What the platform does

Depending on the user's role, the experience is quite different.

A **student** follows courses lesson by lesson. Each lesson has three tabs: theory (Markdown content), a multiple-choice quiz, and a coding exercise with an editor embedded directly in the page. If they get stuck, they can open the AI assistant which responds in streaming and tries to guide them without giving away the answer.

A **teacher** creates courses, structures lessons, defines quizzes and coding exercises. They manage their classes via an invitation code, assign courses to classes, and monitor student progress through analytics.

A **school admin** oversees an entire institution: they invite teachers, control which courses are accessible within their school (via a whitelist), and track enrolled students.

The **super admin** has a global view of all schools on the platform. They can create, activate or suspend institutions.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript 5 |
| UI | HeroUI v3, Tailwind CSS v4 |
| State management | Zustand v5 with `persist` middleware |
| Code editor | CodeMirror 6 — JS, Python, SQL |
| Backend | FastAPI 0.115, Uvicorn, Python 3.11 |
| Database | PostgreSQL 16 via SQLAlchemy 2.0 async + asyncpg |
| Authentication | JWT (`python-jose`), bcrypt |
| AI assistant | Ollama (self-hosted), SSE streaming |
| Code sandbox | Piston API (self-hosted) |
| Testing | pytest (backend), Jest 30 + Testing Library (frontend) |
| Infrastructure | Docker Compose |

---

## Architecture

Five Docker services, one shared bridge network (`easylearn-network`), and that's it.

| Service | Port | Role |
|---|---|---|
| `frontend` | 3000 | Next.js interface |
| `backend` | 8000 | FastAPI REST API |
| `postgres` | 5432 | Database |
| `piston` | 2000 | Code execution sandbox |
| `piston-setup` | — | One-shot: installs Python 3.10 and Node 18.15 into Piston on first startup |

On the frontend side, the application is split into separate spaces using Next.js route groups. Each role has its own space and cannot access other roles' routes.

```
app/
  (auth)/          login, register
  (student)/       dashboard, catalogue, cours, profil
  (teacher)/       dashboard, cours, classes, stats
  (admin)/         dashboard, eleves, professeurs, catalogue, parametres
  (super-admin)/   dashboard, ecoles
```

The `middleware.ts` intercepts every request, decodes the JWT and redirects the user to the right space based on their role. If the token is missing or invalid, it redirects to `/login`.

---

## Getting started

### Requirements

- Docker and Docker Compose
- [Ollama](https://ollama.ai) installed and running on the host machine (required for the AI assistant)

### Setup

```bash
git clone https://gitlab.com/Csolatus/easylearn.git
cd easylearn

cp .env.example .env
# Fill in the values in .env (see next section)

docker-compose up --build
```

Once running:

| | URL |
|---|---|
| Application | http://localhost:3000 |
| API | http://localhost:8000 |
| Swagger | http://localhost:8000/docs |

> On first startup, `piston-setup` installs the runtimes into the Piston container via its API. This takes about 30 seconds — the backend service waits automatically for Piston to be ready.

---

## Environment variables

```env
# Database
POSTGRES_USER=easylearn
POSTGRES_PASSWORD=easylearn
POSTGRES_DB=easylearn
DATABASE_URL=postgresql+asyncpg://easylearn:easylearn@postgres:5432/easylearn

# Authentication
SECRET_KEY=change-this-value-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60

# Ollama
OLLAMA_BASE_URL=http://host.docker.internal:11434
OLLAMA_MODEL=llama3
OLLAMA_SYSTEM_PROMPT="You are a supportive educational mentor. Guide the student without directly giving them the answer."

# Piston
PISTON_API_URL=http://piston:2000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Pages by role

### Student

| Page | URL |
|---|---|
| Dashboard | `/student/dashboard` |
| Course catalogue | `/student/catalogue` |
| Course overview | `/student/cours/[courseId]` |
| Lesson — theory, quiz, practice | `/student/cours/[courseId]/[lessonId]` |
| Profile | `/student/profil` |

### Teacher

| Page | URL |
|---|---|
| Dashboard | `/teacher/dashboard` |
| My courses | `/teacher/cours` |
| Course editor | `/teacher/cours/[courseId]/edit` |
| My classes | `/teacher/classes` |
| Class detail | `/teacher/classes/[classId]` |
| Statistics | `/teacher/stats` |

### School admin

| Page | URL |
|---|---|
| Dashboard | `/school_admin/dashboard` |
| Catalogue (whitelist) | `/school_admin/catalogue` |
| Students | `/school_admin/eleves` |
| Teachers | `/school_admin/professeurs` |
| Settings | `/school_admin/parametres` |

### Super admin

| Page | URL |
|---|---|
| Dashboard | `/super_admin/dashboard` |
| Schools management | `/super_admin/ecoles` |

---

## API

Full documentation is available via Swagger at `http://localhost:8000/docs`.

| Domain | Prefix | What it covers |
|---|---|---|
| Authentication | `/auth` | register, login, me, logout |
| Schools | `/schools` | CRUD schools, teacher invitations, course whitelist |
| Classrooms | `/classrooms` | CRUD classrooms, course assignment |
| Courses & Lessons | `/courses` | CRUD courses and lessons, school filtering |
| Quiz | `/lessons/{id}/quiz` | Creation, submission, results |
| Progress | `/lessons/{id}/complete` | Mark lesson complete, student activity |
| Analytics | `/analytics` | School and teacher statistics |
| Code execution | `/execute` | Run code via Piston |
| AI assistant | `/agent` | Conversations, messages, SSE streaming |

---

## Database

The full schema is in [`database/init.sql`](./database/init.sql). It is applied automatically on first startup via `docker-entrypoint-initdb.d` — no manual migration needed.

| Table | Description |
|---|---|
| `users` | All users, role: `student`, `teacher`, `school_admin`, `super_admin` |
| `schools` | Educational institutions |
| `school_teachers` | Teacher/school relationship, status: `invited`, `active`, `suspended`, `removed` |
| `classrooms` | Classes with a unique invitation code |
| `student_classrooms` | Student enrollment in a classroom |
| `courses` | Courses, visibility: `public`, `school`, `private` |
| `classroom_courses` | Course assigned to a classroom |
| `school_course_whitelists` | Courses allowed within a school |
| `lessons` | Lessons ordered by `ordre`, Markdown content |
| `practical_exercises` | Coding exercise attached to a lesson |
| `coding_sessions` | Student's current code, auto-saved |
| `quizzes / questions / choices` | Quiz structure |
| `quiz_results / student_answers` | Student submissions and answers |
| `course_progress` | Completion per lesson, unique per `(student, lesson)` |
| `conversations / ai_generations` | AI assistant conversation history |

---

## Technical decisions

**Raw SQL instead of ORM**

We use SQLAlchemy only for async connection management, but all queries are written in raw SQL via `text()`. In a hackathon where the schema evolves quickly, this is often faster than fighting an ORM. It also gives full control over what gets sent to PostgreSQL.

**Teachers are not tied to a school**

A teacher exists at the platform level. They can be invited into one or several schools, and their status in each school is independent (`invited`, `active`, `suspended`, `removed`). This means they don't lose their courses if they leave an institution, and they can easily be invited elsewhere.

**AI responds in streaming**

Ollama's responses are sent token by token to the browser via Server-Sent Events. The full response is only saved to the database once the stream is complete. This avoids persisting partial responses and makes the experience feel much more fluid on the student's end.

**Piston for code execution**

We didn't want arbitrary code running on the main server. Piston runs in its own container, with no network access and no access to the host filesystem. The interface is simple: send the language and the code, get back the output.

**No migrations**

The schema is defined once in `init.sql`. In a hackathon context, this simplifies setup and avoids managing an additional migration tool. The trade-off is that any schema change requires recreating the Docker volume.

---

*EFREI Hackathon 2025–2026*
