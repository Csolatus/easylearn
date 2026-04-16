-- ============================================================
-- EasyLearn — Schéma PostgreSQL
-- Architecture Option C : teacher indépendant, invité par école
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- UTILISATEURS
-- ============================================================

CREATE TABLE users (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255) NOT NULL,
    last_name  VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(50)  NOT NULL CHECK (role IN ('student', 'teacher', 'school_admin', 'super_admin')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- ÉCOLES
-- ============================================================

CREATE TABLE schools (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255),
    website    VARCHAR(255),
    address    TEXT,
    is_active  BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Relation école ↔ teacher (Option C : invitation)
CREATE TABLE school_teachers (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id  UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status     VARCHAR(50) NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'active', 'suspended', 'removed')),
    invited_at TIMESTAMP DEFAULT NOW(),
    joined_at  TIMESTAMP,
    UNIQUE (school_id, teacher_id)
);

-- ============================================================
-- CLASSES
-- ============================================================

CREATE TABLE classrooms (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id   UUID REFERENCES schools(id) ON DELETE SET NULL,
    name        VARCHAR(255) NOT NULL,
    invite_code VARCHAR(32) NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
    is_archived BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE student_classrooms (
    student_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    joined_at    TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (student_id, classroom_id)
);

-- ============================================================
-- COURS & MODULES
-- ============================================================

CREATE TABLE courses (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title      VARCHAR(255) NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    visibility VARCHAR(50) NOT NULL DEFAULT 'private' CHECK (visibility IN ('public', 'school', 'private')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE classroom_courses (
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    course_id    UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    assigned_at  TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (classroom_id, course_id)
);

CREATE TABLE school_course_whitelists (
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    PRIMARY KEY (school_id, course_id)
);

CREATE TABLE lessons (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id  UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title      VARCHAR(255) NOT NULL,
    docs       TEXT,
    ordre      INT NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- EXERCICES PRATIQUES
-- ============================================================

CREATE TABLE practical_exercises (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id       UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    instructions    TEXT NOT NULL,
    expected_output TEXT NOT NULL
);

CREATE TABLE coding_sessions (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id    UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    exercise_id  UUID REFERENCES practical_exercises(id) ON DELETE SET NULL,
    code_content TEXT,
    updated_at   TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- QUIZ
-- ============================================================

CREATE TABLE quizzes (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE TABLE questions (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id   UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    statement TEXT NOT NULL,
    ordre     INT NOT NULL
);

CREATE TABLE choices (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    text        VARCHAR(255) NOT NULL,
    is_correct  BOOLEAN DEFAULT FALSE
);

CREATE TABLE quiz_results (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id      UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score        FLOAT NOT NULL,
    submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE student_answers (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_result_id UUID NOT NULL REFERENCES quiz_results(id) ON DELETE CASCADE,
    question_id    UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    choice_id      UUID NOT NULL REFERENCES choices(id) ON DELETE CASCADE
);

-- ============================================================
-- PROGRESSION
-- ============================================================

CREATE TABLE course_progress (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id    UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed    BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    UNIQUE (student_id, lesson_id)
);

-- ============================================================
-- IA GÉNÉRATIVE
-- ============================================================

CREATE TABLE conversations (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_generations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id       UUID REFERENCES courses(id) ON DELETE CASCADE,
    prompt          TEXT NOT NULL,
    output          TEXT,
    pending         BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);
