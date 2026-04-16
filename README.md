# EasyLearn

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)

EasyLearn est une plateforme d'apprentissage en ligne (LMS) construite pendant le Hackathon EFREI 2025–2026. L'idée de départ était simple : la plupart des LMS existants se limitent à du contenu passif. On voulait qu'un étudiant puisse lire une leçon, faire un quiz, écrire et exécuter du code, et poser des questions à un assistant IA, tout ça sans jamais quitter la même page.

La plateforme supporte quatre rôles — étudiant, enseignant, admin école et super admin — et est conçue pour fonctionner dans un environnement multi-école.

---

## Table des matières

1. [Ce que fait la plateforme](#ce-que-fait-la-plateforme)
2. [Stack technique](#stack-technique)
3. [Architecture](#architecture)
4. [Lancer le projet](#lancer-le-projet)
5. [Variables d'environnement](#variables-denvironnement)
6. [Pages par rôle](#pages-par-rôle)
7. [API](#api)
8. [Base de données](#base-de-données)
9. [Pourquoi ces choix techniques](#pourquoi-ces-choix-techniques)

---

## Ce que fait la plateforme

Selon le rôle de l'utilisateur, l'expérience est assez différente.

Un **étudiant** suit ses cours leçon par leçon. Chaque leçon a trois onglets : la théorie (Markdown), un quiz à choix multiples, et un exercice de code avec un éditeur directement dans la page. S'il est bloqué, il peut ouvrir l'assistant IA qui répond en streaming et essaie de le guider sans lui donner la réponse toute faite.

Un **enseignant** crée ses cours, structure ses leçons, définit les quiz et les exercices. Il gère ses classes via un code d'invitation, assigne des cours à ses classes, et consulte les statistiques de progression de ses étudiants.

Un **admin école** supervise l'ensemble d'un établissement : il invite des enseignants, contrôle quels cours sont accessibles dans son école (via une whitelist), et suit les étudiants inscrits.

Le **super admin** a une vue globale sur toutes les écoles de la plateforme. Il peut en créer, les activer ou les suspendre.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript 5 |
| UI | HeroUI v3, Tailwind CSS v4 |
| State management | Zustand v5 avec middleware `persist` |
| Éditeur de code | CodeMirror 6 — JS, Python, SQL |
| Backend | FastAPI 0.115, Uvicorn, Python 3.11 |
| Base de données | PostgreSQL 16 via SQLAlchemy 2.0 async + asyncpg |
| Authentification | JWT (`python-jose`), bcrypt |
| Assistant IA | Ollama (self-hosted), SSE streaming |
| Sandbox de code | Piston API (self-hosted) |
| Tests | pytest (backend), Jest 30 + Testing Library (frontend) |
| Infrastructure | Docker Compose |

---

## Architecture

Cinq services Docker, un réseau bridge commun (`easylearn-network`), et c'est tout.

| Service | Port | Rôle |
|---|---|---|
| `frontend` | 3000 | Interface Next.js |
| `backend` | 8000 | API REST FastAPI |
| `postgres` | 5432 | Base de données |
| `piston` | 2000 | Sandbox d'exécution de code |
| `piston-setup` | — | Installe Python 3.10 et Node 18.15 dans Piston au premier démarrage |

Côté frontend, l'application est découpée en espaces séparés via les route groups Next.js. Chaque rôle a son propre espace et n'a pas accès aux routes des autres.

```
app/
  (auth)/          login, register
  (student)/       dashboard, catalogue, cours, profil
  (teacher)/       dashboard, cours, classes, stats
  (admin)/         dashboard, eleves, professeurs, catalogue, parametres
  (super-admin)/   dashboard, ecoles
```

Le `middleware.ts` intercepte chaque requête, décode le JWT et redirige l'utilisateur vers le bon espace selon son rôle. Si le token est absent ou invalide, il renvoie vers `/login`.

---

## Lancer le projet

### Prérequis

- Docker et Docker Compose
- [Ollama](https://ollama.ai) installé et en cours d'exécution sur la machine hôte (nécessaire pour l'assistant IA)

### Démarrage

```bash
git clone https://gitlab.com/Csolatus/easylearn.git
cd easylearn

cp .env.example .env
# Remplir les valeurs dans .env (voir la section suivante)

docker-compose up --build
```

Une fois lancé :

| | URL |
|---|---|
| Application | http://localhost:3000 |
| API | http://localhost:8000 |
| Swagger | http://localhost:8000/docs |

> Au premier démarrage, `piston-setup` installe les runtimes dans le conteneur Piston via son API. Ça prend une trentaine de secondes, le service backend attend automatiquement que Piston soit prêt.

---

## Variables d'environnement

```env
# Base de données
POSTGRES_USER=easylearn
POSTGRES_PASSWORD=easylearn
POSTGRES_DB=easylearn
DATABASE_URL=postgresql+asyncpg://easylearn:easylearn@postgres:5432/easylearn

# Authentification
SECRET_KEY=changez-cette-valeur-en-production
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60

# Ollama
OLLAMA_BASE_URL=http://host.docker.internal:11434
OLLAMA_MODEL=llama3
OLLAMA_SYSTEM_PROMPT="Tu es un mentor pédagogique bienveillant. Tu guides l'étudiant sans lui donner directement la réponse."

# Piston
PISTON_API_URL=http://piston:2000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Pages par rôle

### Étudiant

| Page | URL |
|---|---|
| Tableau de bord | `/student/dashboard` |
| Catalogue des cours | `/student/catalogue` |
| Vue d'un cours | `/student/cours/[courseId]` |
| Leçon — théorie, quiz, pratique | `/student/cours/[courseId]/[lessonId]` |
| Profil | `/student/profil` |

### Enseignant

| Page | URL |
|---|---|
| Tableau de bord | `/teacher/dashboard` |
| Mes cours | `/teacher/cours` |
| Éditeur de cours | `/teacher/cours/[courseId]/edit` |
| Mes classes | `/teacher/classes` |
| Détail d'une classe | `/teacher/classes/[classId]` |
| Statistiques | `/teacher/stats` |

### Admin école

| Page | URL |
|---|---|
| Tableau de bord | `/school_admin/dashboard` |
| Catalogue (whitelist) | `/school_admin/catalogue` |
| Étudiants | `/school_admin/eleves` |
| Enseignants | `/school_admin/professeurs` |
| Paramètres | `/school_admin/parametres` |

### Super admin

| Page | URL |
|---|---|
| Tableau de bord | `/super_admin/dashboard` |
| Gestion des écoles | `/super_admin/ecoles` |

---

## API

La documentation complète est disponible via Swagger à `http://localhost:8000/docs`.

| Domaine | Préfixe | Ce que ça couvre |
|---|---|---|
| Authentification | `/auth` | register, login, me, logout |
| Écoles | `/schools` | CRUD écoles, invitation enseignants, whitelist |
| Classes | `/classrooms` | CRUD classes, assignation de cours |
| Cours & Leçons | `/courses` | CRUD cours et leçons, filtrage par école |
| Quiz | `/lessons/{id}/quiz` | Création, soumission, résultats |
| Progression | `/lessons/{id}/complete` | Marquer une leçon complète, activité étudiant |
| Analytics | `/analytics` | Statistiques école et enseignant |
| Exécution de code | `/execute` | Exécution via Piston |
| Assistant IA | `/agent` | Conversations, messages, streaming SSE |

---

## Base de données

Le schéma complet est dans [`database/init.sql`](./database/init.sql). Il est appliqué automatiquement au premier démarrage via `docker-entrypoint-initdb.d` — pas de migration à lancer manuellement.

| Table | Description |
|---|---|
| `users` | Tous les utilisateurs, rôle : `student`, `teacher`, `school_admin`, `super_admin` |
| `schools` | Les établissements |
| `school_teachers` | Relation enseignant/école, statut : `invited`, `active`, `suspended`, `removed` |
| `classrooms` | Classes avec code d'invitation unique |
| `student_classrooms` | Inscription d'un étudiant dans une classe |
| `courses` | Cours, visibilité : `public`, `school`, `private` |
| `classroom_courses` | Cours assigné à une classe |
| `school_course_whitelists` | Cours autorisés dans une école |
| `lessons` | Leçons ordonnées par `ordre`, contenu en Markdown |
| `practical_exercises` | Exercice de code d'une leçon |
| `coding_sessions` | Code en cours de l'étudiant, sauvegardé automatiquement |
| `quizzes / questions / choices` | Structure des quiz |
| `quiz_results / student_answers` | Soumissions et réponses des étudiants |
| `course_progress` | Complétion par leçon, unique par `(student, lesson)` |
| `conversations / ai_generations` | Historique des échanges avec l'assistant IA |

---

## Pourquoi ces choix techniques

**Raw SQL à la place d'un ORM**

On utilise SQLAlchemy uniquement pour la gestion des connexions async, mais toutes les requêtes sont écrites en SQL brut via `text()`. Dans un contexte hackathon où le schéma évolue vite, c'est souvent plus rapide que de jongler avec un ORM. Ca donne aussi un contrôle total sur ce qui est envoyé à PostgreSQL.

**Les enseignants ne sont pas liés à une école**

Un enseignant existe au niveau de la plateforme. Il peut être invité dans une ou plusieurs écoles, et son statut dans chaque école est indépendant (`invited`, `active`, `suspended`, `removed`). Ca permet de ne pas perdre ses cours s'il quitte un établissement, et de facilement l'inviter ailleurs.

**L'IA répond en streaming**

Les réponses d'Ollama sont envoyées token par token au navigateur via Server-Sent Events. La réponse complète est sauvegardée en base seulement quand le stream est terminé. Ca évite d'écrire des réponses partielles, et ça rend l'expérience beaucoup plus fluide côté étudiant.

**Piston pour l'exécution de code**

On ne voulait pas exécuter du code arbitraire sur le serveur principal. Piston tourne dans son propre conteneur, sans accès réseau, sans accès au système de fichiers de l'hôte. C'est une API simple : on envoie le langage et le code, on reçoit la sortie.

**Pas de migrations**

Le schéma est défini une seule fois dans `init.sql`. Dans un hackathon, ça simplifie le setup et évite de gérer un outil de migration supplémentaire. La contrepartie, c'est que toute modification de schéma demande de recréer le volume Docker.

---

*Hackathon EFREI 2025–2026*
