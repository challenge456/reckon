import Link from "next/link";

const FAQS = [
  {
    q: "How is this different from a to-do app?",
    a: "To-do apps let you skip things quietly. Reckon doesn't. Miss your own deadline and you get a real, profession-relevant consequence — not just a red badge nobody sees.",
  },
  {
    q: "What actually happens if I miss a deadline?",
    a: "The system picks your profession's consequence pool (e.g. a LeetCode problem for developers) and shows you 3–4 options. You choose one, complete it, and get back on track.",
  },
  {
    q: "Can I just ignore the consequence too?",
    a: "You can try — but missing a consequence escalates to another one, up to a sensible cap. You also have 7 lifelines to skip a consequence when you genuinely need to.",
  },
  {
    q: "Do I need to set up my punishments manually?",
    a: "No. You only pick your profession once, during onboarding. The consequence pool is generated for you automatically every time you miss a goal.",
  },
  {
    q: "Is it free to use?",
    a: "Yes, Reckon is free to sign up and use with Google — no credit card required.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-lg font-semibold">Reckon</span>
        <Link
          href="/signin"
          className="rounded-lg border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-900"
        >
          Sign in
        </Link>
      </header>

      {/* Hero — CTA above the fold */}
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-20 pt-16 text-center">
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          Set the goal. Own the deadline.
        </h1>
        <p className="mt-5 max-w-xl text-neutral-400">
          Reckon is the accountability platform that gives your missed
          deadlines real, profession-relevant consequences — so procrastination
          finally costs something.
        </p>
        <Link
          href="/signin"
          className="mt-8 rounded-lg bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
        >
          Get started — it&apos;s free
        </Link>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-10 text-center text-2xl font-semibold">
          How it works
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              emoji: "🎯",
              title: "Set your goal",
              body: "Pick a title and your own deadline. No templates, no forced schedule.",
            },
            {
              emoji: "⏱️",
              title: "The clock is real",
              body: "Miss it, and Reckon automatically detects it — no need to check in.",
            },
            {
              emoji: "⚡",
              title: "Face the consequence",
              body: "Choose from 3–4 options built around your profession, then get back to it.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-6"
            >
              <div className="mb-3 text-3xl">{step.emoji}</div>
              <h3 className="mb-2 font-semibold">{step.title}</h3>
              <p className="text-sm text-neutral-400">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-8 text-center text-2xl font-semibold">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="group rounded-lg border border-neutral-800 bg-neutral-900 p-4"
            >
              <summary className="cursor-pointer list-none font-medium">
                {item.q}
              </summary>
              <p className="mt-3 text-sm text-neutral-400">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-neutral-500 sm:flex-row">
          <span>© {new Date().getFullYear()} Reckon</span>
          <nav className="flex gap-6">
            <Link href="/about" className="hover:text-neutral-300">
              About
            </Link>
            <Link href="/contact" className="hover:text-neutral-300">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}