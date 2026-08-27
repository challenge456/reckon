import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Reckon",
  description:
    "Reckon is a goal-accountability platform that turns missed deadlines into constructive, profession-relevant consequences.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-neutral-400 hover:text-white">
          ← Back home
        </Link>
        <h1 className="mb-4 mt-6 text-3xl font-semibold">About Reckon</h1>
        <p className="mb-4 text-neutral-400">
          Most productivity apps let you quietly miss a deadline and move on.
          Reckon doesn&apos;t. You set your own goals and your own timelines —
          the platform&apos;s only job is to hold you to them.
        </p>
        <p className="text-neutral-400">
          When you miss a deadline, Reckon assigns a small, constructive
          consequence based on your profession — a coding challenge for
          developers, a quiz for students, a design critique for designers,
          and so on. Complete it, and you&apos;re back on track. The goal is
          accountability, not punishment for its own sake.
        </p>
      </div>
    </div>
  );
}