import { PrismaClient, Profession, Difficulty } from "@prisma/client";

const prisma = new PrismaClient();

type SeedConsequence = {
  profession: Profession;
  name: string;
  description: string;
  difficulty: Difficulty;
  externalPlatform?: string;
  externalUrl?: string;
  estimatedMinutes: number;
};

const consequences: SeedConsequence[] = [
  // DEVELOPER
  { profession: "DEVELOPER", name: "LeetCode Challenge", description: "Solve one coding problem on LeetCode.", difficulty: "MEDIUM", externalPlatform: "leetcode", externalUrl: "https://leetcode.com/problemset/", estimatedMinutes: 30 },
  { profession: "DEVELOPER", name: "Debugging Challenge", description: "Fix a small intentionally-broken code snippet of your choice.", difficulty: "EASY", estimatedMinutes: 15 },
  { profession: "DEVELOPER", name: "Git Workflow Drill", description: "Practice a branching, rebasing, or merge-conflict scenario.", difficulty: "EASY", estimatedMinutes: 15 },
  { profession: "DEVELOPER", name: "SQL Challenge", description: "Write queries to solve a small data problem.", difficulty: "MEDIUM", estimatedMinutes: 30 },
  { profession: "DEVELOPER", name: "CS Fundamentals Quiz", description: "Answer a set of core computer science questions from memory.", difficulty: "HARD", estimatedMinutes: 45 },

  // CYBERSECURITY
  { profession: "CYBERSECURITY", name: "TryHackMe Room", description: "Complete a beginner-friendly authorized TryHackMe room.", difficulty: "MEDIUM", externalPlatform: "tryhackme", externalUrl: "https://tryhackme.com/", estimatedMinutes: 45 },
  { profession: "CYBERSECURITY", name: "Security Quiz", description: "Answer a set of security fundamentals questions.", difficulty: "EASY", estimatedMinutes: 15 },
  { profession: "CYBERSECURITY", name: "Networking Challenge", description: "Work through a subnetting or protocol-analysis exercise.", difficulty: "MEDIUM", estimatedMinutes: 30 },
  { profession: "CYBERSECURITY", name: "Linux Command Drill", description: "Complete a set of Linux CLI tasks.", difficulty: "EASY", estimatedMinutes: 20 },
  { profession: "CYBERSECURITY", name: "Authorized CTF Puzzle", description: "Solve a puzzle from an authorized, legal CTF practice site.", difficulty: "HARD", estimatedMinutes: 60 },

  // STUDENT
  { profession: "STUDENT", name: "Subject Quiz", description: "Take a short quiz on a subject you're studying.", difficulty: "EASY", estimatedMinutes: 15 },
  { profession: "STUDENT", name: "Practice Question Set", description: "Work through a set of practice problems.", difficulty: "MEDIUM", estimatedMinutes: 30 },
  { profession: "STUDENT", name: "Flashcard Review", description: "Review a deck of flashcards on a topic you're learning.", difficulty: "EASY", estimatedMinutes: 15 },
  { profession: "STUDENT", name: "Logic Puzzle", description: "Solve a logic or reasoning puzzle.", difficulty: "MEDIUM", estimatedMinutes: 20 },
  { profession: "STUDENT", name: "Deep Revision Session", description: "Do a full revision pass on your hardest subject.", difficulty: "HARD", estimatedMinutes: 45 },

  // TEACHER
  { profession: "TEACHER", name: "Create a Mini Quiz", description: "Write a short quiz for one of your topics.", difficulty: "EASY", estimatedMinutes: 20 },
  { profession: "TEACHER", name: "Subject Knowledge Challenge", description: "Answer advanced questions in your subject area.", difficulty: "MEDIUM", estimatedMinutes: 30 },
  { profession: "TEACHER", name: "Lesson Planning Sprint", description: "Draft a full lesson plan for an upcoming topic.", difficulty: "MEDIUM", estimatedMinutes: 30 },
  { profession: "TEACHER", name: "Explain a Concept", description: "Write a clear explanation of a difficult concept as if teaching it.", difficulty: "HARD", estimatedMinutes: 40 },

  // DESIGNER
  { profession: "DESIGNER", name: "UI Recreation Challenge", description: "Recreate a UI component from a reference design.", difficulty: "MEDIUM", estimatedMinutes: 40 },
  { profession: "DESIGNER", name: "Typography Challenge", description: "Redesign a text layout using better typographic principles.", difficulty: "EASY", estimatedMinutes: 20 },
  { profession: "DESIGNER", name: "Design Critique", description: "Write a structured critique of a design you admire or dislike.", difficulty: "EASY", estimatedMinutes: 15 },
  { profession: "DESIGNER", name: "UX Case Study", description: "Produce a short UX case study on a real product flow.", difficulty: "HARD", estimatedMinutes: 45 },

  // PROFESSIONAL
  { profession: "PROFESSIONAL", name: "Research Challenge", description: "Research and summarize a topic relevant to your field.", difficulty: "MEDIUM", estimatedMinutes: 30 },
  { profession: "PROFESSIONAL", name: "Writing Challenge", description: "Write a short piece — a memo, proposal, or article outline.", difficulty: "EASY", estimatedMinutes: 20 },
  { profession: "PROFESSIONAL", name: "Problem-Solving Puzzle", description: "Solve a structured business or logic case problem.", difficulty: "MEDIUM", estimatedMinutes: 30 },
  { profession: "PROFESSIONAL", name: "Knowledge Deep-Dive", description: "Deeply research one topic in your field for the full session.", difficulty: "HARD", estimatedMinutes: 45 },

  // OTHER (common pool)
  { profession: "OTHER", name: "Logic Puzzle", description: "Solve a general logic puzzle.", difficulty: "EASY", estimatedMinutes: 15 },
  { profession: "OTHER", name: "Memory Challenge", description: "Complete a short memory-training exercise.", difficulty: "EASY", estimatedMinutes: 15 },
  { profession: "OTHER", name: "Knowledge Quiz", description: "Take a general-knowledge quiz.", difficulty: "MEDIUM", estimatedMinutes: 25 },
  { profession: "OTHER", name: "Short Writing Challenge", description: "Write a short reflective piece on any topic.", difficulty: "MEDIUM", estimatedMinutes: 25 },
  { profession: "OTHER", name: "Research Challenge", description: "Research a topic you know nothing about and summarize it.", difficulty: "HARD", estimatedMinutes: 40 },
];

async function main() {
  for (const c of consequences) {
    await prisma.consequence.upsert({
      where: { profession_name: { profession: c.profession, name: c.name } },
      update: c,
      create: c,
    });
  }
  console.log(`Seeded ${consequences.length} consequences.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());