import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Profession } from "@prisma/client";

const PROFESSIONS: { value: Profession; label: string; emoji: string }[] = [
  { value: "DEVELOPER", label: "Developer", emoji: "💻" },
  { value: "CYBERSECURITY", label: "Cybersecurity", emoji: "🛡️" },
  { value: "STUDENT", label: "Student", emoji: "📚" },
  { value: "TEACHER", label: "Teacher", emoji: "🍎" },
  { value: "DESIGNER", label: "Designer", emoji: "🎨" },
  { value: "PROFESSIONAL", label: "Professional", emoji: "💼" },
  { value: "OTHER", label: "Other", emoji: "✨" },
];

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  async function completeOnboarding(formData: FormData) {
    "use server";

    const profession = formData.get("profession") as Profession;
    const currentSession = await auth();

    if (!currentSession?.user?.id) {
      redirect("/signin");
    }

    await prisma.user.update({
      where: { id: currentSession.user.id },
      data: {
        profession,
        onboardingCompleted: true,
      },
    });

    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-8">
        <h1 className="mb-1 text-2xl font-semibold text-white">
          One quick thing 👋
        </h1>
        <p className="mb-6 text-sm text-neutral-400">
          What best describes you? This shapes the kind of consequences
          you&apos;ll get when you miss a goal.
        </p>

        <form action={completeOnboarding}>
          <div className="grid grid-cols-2 gap-3">
            {PROFESSIONS.map((p) => (
              <label
                key={p.value}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-3 text-sm text-neutral-200 transition hover:border-neutral-600 has-[:checked]:border-white has-[:checked]:bg-neutral-800"
              >
                <input
                  type="radio"
                  name="profession"
                  value={p.value}
                  defaultChecked={p.value === "OTHER"}
                  className="sr-only"
                />
                <span>{p.emoji}</span>
                <span>{p.label}</span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-white py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}