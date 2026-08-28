# RECKON

### Set the goal. Set the deadline. Reckon with the consequence.

**Reckon** is a goal-achievement and accountability platform built around a simple idea: setting a goal should mean committing to it.

Instead of only reminding users about unfinished tasks, Reckon creates an accountability loop. Users define their own goals and deadlines, and when a goal is missed, the platform assigns a consequence tailored to their profession and available difficulty options.

The result is a productivity system focused not just on **what you want to achieve**, but on **following through**.

---

## What is Reckon?

Most productivity applications stop at:

> Create a task → Set a reminder → Mark it complete.

Reckon adds another layer:

> **Create a goal → Set a deadline → Complete it → Otherwise face a constructive consequence.**

Consequences are designed to remain useful rather than arbitrary. Depending on the user's profession, they can involve coding, cybersecurity learning, study exercises, design challenges, teaching activities, research, writing, or other skill-building tasks.

---

## How It Works

```text
                  ┌─────────────────┐
                  │   Create Goal   │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Set Deadline    │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Work on Goal    │
                  └────────┬────────┘
                           │
                    ┌──────┴──────┐
                    │             │
                 COMPLETED      MISSED
                    │             │
                    ▼             ▼
             ┌────────────┐  ┌─────────────┐
             │ Goal Done  │  │ Consequence │
             └────────────┘  └──────┬──────┘
                                    │
                                    ▼
                             Complete / Skip
                             with Lifeline
```

---

# Core Features

## Goal Management

* Create personal goals
* Add descriptions and categories
* Set custom deadlines
* Track active, completed, and missed goals
* Record completion time
* Associate goals with consequence assignments

Goals belong to the authenticated user, keeping each user's productivity data separate.

---

## Profession-Based Consequences

Reckon adapts its consequence pool according to the user's profession.

Currently supported profession categories include:

| Profession    | Example consequences                                      |
| ------------- | --------------------------------------------------------- |
| Developer     | LeetCode challenge, debugging, SQL, Git workflow          |
| Cybersecurity | Security quiz, networking, Linux, authorized CTF practice |
| Student       | Subject quizzes, practice questions, revision             |
| Teacher       | Quiz creation, lesson planning, concept explanation       |
| Designer      | UI recreation, typography, design critique, UX case study |
| Professional  | Research, writing, problem-solving                        |
| Other         | Logic, memory, knowledge and writing challenges           |

The consequence catalog is seeded into the database and can be expanded as the platform grows.

---

# Difficulty System

Every consequence belongs to one of three difficulty levels:

* **Easy**
* **Medium**
* **Hard**

Reckon intentionally limits the availability of easier consequences during a week.

### Current weekly rules

* **2 Easy** consequences per week
* **2 Medium** consequences per week
* **Hard** consequences remain available

This prevents users from repeatedly selecting only the easiest option while still keeping an available challenge when the easier limits have been reached.

---

# Consequence Escalation

Missing a consequence does not simply reset the accountability cycle.

Reckon tracks an **escalation level** for consequence assignments.

The current system supports:

```text
Original consequence
        ↓
Missed
        ↓
Escalation 1
        ↓
Missed
        ↓
Escalation 2
```

The current implementation allows up to **two escalations after the original assignment**, giving a maximum of three attempts in the escalation chain.

Escalated consequences receive a new deadline and are selected from the user's currently eligible consequence pool.

---

# External Challenges

Some consequences connect users with external learning platforms.

For example, developer consequences can direct users to a LeetCode problem set, while cybersecurity consequences can direct users toward authorized cybersecurity learning activities.

Reckon acts as the **accountability layer** around these activities.

External platforms remain responsible for the actual challenge experience.

> Reckon does not claim automatic completion verification for an external platform unless such verification is explicitly implemented.

---

# Lifelines

Reckon includes a limited **lifeline system** that gives users a way to recover from a consequence without completing it.

New users receive:

**7 lifelines**

A lifeline can be used to skip a consequence.

When a lifeline is used:

1. One lifeline is deducted.
2. The usage is recorded.
3. The associated consequence is marked completed through the lifeline.
4. The remaining lifeline count is updated.

This makes lifelines a limited resource rather than a permanent escape mechanism.

---

# Achievements

Reckon includes an achievement system designed to recognize user progress and consistency.

Achievements are stored separately from the user's normal goal data and are unlocked when their corresponding criteria are satisfied.

The system is designed to make long-term accountability feel more rewarding than simply checking boxes.

---

# Streaks & Progress

Reckon maintains user streak information including:

* Current streak
* Longest streak
* Last completion time

This provides another way to visualize consistency over time.

---

# Notifications

The application includes a notification model associated with each user.

Notifications can contain:

* Notification type
* Message
* Read/unread state
* Creation timestamp

This provides the foundation for keeping users informed about important accountability events.

---

# AI Assistant

Reckon includes an AI assistant layer backed by Anthropic's SDK.

The application also stores AI conversation messages per authenticated user, allowing the assistant experience to maintain user-specific conversation history.

The AI assistant is intended to complement the accountability system rather than replace the core goal/consequence engine.

---

# Authentication

Reckon uses **Auth.js / NextAuth** with the Prisma adapter.

Currently supported authentication:

**Google Sign-In**

The application uses database-backed sessions, and authenticated users receive a user-specific identity that is used throughout the application's server-side operations.

---

# Data Model

The application uses PostgreSQL through Prisma.

The core data model contains entities for:

* Users
* Authentication accounts
* Sessions
* Goals
* Consequences
* Consequence assignments
* Weekly consequence limits
* Lifelines
* Lifeline usage
* Achievements
* User achievements
* Streaks
* Notifications
* AI messages

User-owned data uses relational ownership and cascading behavior where appropriate.

---

# Architecture

At a high level, Reckon follows this structure:

```text
┌─────────────────────────────┐
│          Browser            │
│     React / Next.js UI      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Next.js App Router    │
│      Pages / Components     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Server Actions / Auth       │
│ Business Logic              │
└───────┬───────────┬─────────┘
        │           │
        ▼           ▼
┌────────────┐ ┌───────────────┐
│ Consequence│ │ AI Assistant  │
│ Engine     │ │ / Anthropic   │
└─────┬──────┘ └───────────────┘
      │
      ▼
┌─────────────────────────────┐
│          Prisma             │
│        ORM / Client         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│         PostgreSQL          │
└─────────────────────────────┘
```

---

# Tech Stack

| Technology               | Purpose                     |
| ------------------------ | --------------------------- |
| **Next.js 16**           | Full-stack React framework  |
| **React 19**             | User interface              |
| **TypeScript**           | Type-safe development       |
| **PostgreSQL**           | Application database        |
| **Prisma**               | ORM and database access     |
| **Auth.js / NextAuth**   | Authentication and sessions |
| **Google OAuth**         | Sign-in provider            |
| **Anthropic SDK**        | AI assistant integration    |
| **Tailwind CSS**         | Styling                     |
| **shadcn**               | UI component foundation     |
| **Lucide React**         | Interface icons             |
| **Zod**                  | Schema validation           |
| **TanStack React Query** | Client-side data management |
| **date-fns**             | Date/time utilities         |

The current repository uses Next.js `16.3.2`, React `19.2.8`, TypeScript 5, Prisma, PostgreSQL tooling, Auth.js/NextAuth, Tailwind CSS, and the other dependencies listed above.

---

# Project Structure

The main application is organized around the Next.js App Router, reusable components, server-side business logic, authentication, and Prisma.

```text
reckon/
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   │   ├── actions/
│   │   └── ...
│   ├── auth.config.ts
│   ├── auth.ts
│   └── proxy.ts
│
├── auth.ts
├── next.config.ts
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── components.json
├── vercel.json
│
├── DEPLOYMENT.md
├── TESTING_DEPLOYMENT.md
└── README.md
```

The repository currently contains dedicated Prisma, application, component, library, authentication, deployment, and testing documentation/configuration files.

---

# Getting Started

## Prerequisites

Make sure you have:

* Node.js
* npm
* PostgreSQL
* A Google OAuth application for Google Sign-In
* An Anthropic API key if using the AI functionality

---

## 1. Clone the Repository

```bash
git clone https://github.com/challenge456/reckon.git
cd reckon
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create your local environment file:

```bash
.env.local
```

Configure the environment variables required by your local setup.

At minimum, the application expects database and Google authentication configuration through:

```env
DATABASE_URL="your-postgresql-connection-string"
DIRECT_URL="your-direct-postgresql-connection-string"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

Keep all secrets out of Git.

---

## 4. Generate Prisma Client

```bash
npx prisma generate
```

---

## 5. Set Up the Database

Apply your development migrations:

```bash
npx prisma migrate dev
```

The repository also contains a Prisma seed configuration for `prisma/seed.ts`.

If seed data is required:

```bash
npx prisma db seed
```

The seed currently populates the profession-specific consequence catalog.

---

## 6. Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Available Scripts

The current `package.json` provides the following scripts:

```bash
npm run dev
```

Starts the Next.js development server.

```bash
npm run build
```

Creates a production build.

```bash
npm start
```

Starts the production Next.js server.

```bash
npm run lint
```

Runs ESLint.

---

# Production Build

Before deploying, verify that the application can build successfully:

```bash
npm run lint
npm run build
```

If both commands succeed, the application is ready for the deployment stage.

---

# Deployment

Reckon is designed to run as a Next.js application and can be deployed through Vercel.

The basic deployment flow is:

```text
GitHub Repository
        ↓
      Vercel
        ↓
Install Dependencies
        ↓
   Build Next.js
        ↓
Configure Environment Variables
        ↓
     PostgreSQL
        ↓
 Google OAuth Configuration
        ↓
   Production App
```

For the detailed deployment procedure, see:

**[DEPLOYMENT.md](./DEPLOYMENT.md)**

For deployment testing guidance:

**[TESTING_DEPLOYMENT.md](./TESTING_DEPLOYMENT.md)**

---

# Environment Variables

Never commit real secrets to GitHub.

The main environment configuration used by the current application includes:

| Variable                | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| `DATABASE_URL`          | PostgreSQL connection used by Prisma            |
| `DIRECT_URL`            | Direct PostgreSQL connection                    |
| `GOOGLE_CLIENT_ID`      | Google OAuth client ID                          |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth client secret                      |
| Anthropic configuration | Required by the AI integration where configured |

The Prisma schema explicitly reads `DATABASE_URL` and `DIRECT_URL`, while the authentication configuration reads `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

> Keep production credentials in Vercel Environment Variables rather than committing them to the repository.

---

# Security Considerations

Reckon uses server-side authentication and user-specific database relationships to keep application data associated with the correct account.

Important security principles include:

* Authentication is handled server-side.
* User-owned records are associated with authenticated users.
* Database access is performed through Prisma.
* OAuth credentials are supplied through environment variables.
* API credentials should remain server-side.
* User-related records use relational constraints and cascading behavior where appropriate.

---

# Current Status

## Implemented

* [x] Next.js application
* [x] Google authentication
* [x] PostgreSQL + Prisma data layer
* [x] User profiles and professions
* [x] Goal creation and tracking
* [x] Goal deadlines
* [x] Goal completion/missed states
* [x] Profession-specific consequence catalog
* [x] Easy / Medium / Hard consequence system
* [x] Weekly Easy/Medium limits
* [x] Consequence escalation
* [x] External challenge links
* [x] Seven starting lifelines
* [x] Lifeline usage tracking
* [x] Achievements data model
* [x] Streak tracking
* [x] Notifications data model
* [x] AI assistant data model/integration
* [x] Responsive Next.js UI
* [x] Production build configuration

---

# Roadmap

Future development can expand Reckon's accountability system with capabilities such as:

* [ ] Account settings and account deletion
* [ ] More profession-specific consequence pools
* [ ] More external challenge integrations
* [ ] Stronger completion verification for external challenges
* [ ] Expanded notification and reminder capabilities
* [ ] More achievement types
* [ ] More advanced progress analytics
* [ ] Expanded AI assistant capabilities
* [ ] Further PWA/mobile improvements

These are roadmap items rather than claims about the current implementation.

---

# Why Reckon?

Reckon is built around a different approach to productivity:

> **Motivation gets you started. Accountability helps you finish.**

Instead of making users feel productive because they created another task list, Reckon makes the commitment itself meaningful.

You choose the goal.

You choose the deadline.

Then you reckon with the outcome.

---

# Project

**Reckon**
Goal Achievement & Accountability Platform

GitHub:
https://github.com/challenge456/reckon

---

## License

No explicit open-source license is currently provided in the repository.

Unless a license is added, the source code should not be assumed to be freely reusable, modified, or redistributed.
