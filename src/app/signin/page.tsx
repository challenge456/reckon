"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-900 p-8 text-center">
        <h1 className="mb-2 text-2xl font-semibold text-white">
          Welcome to Reckon
        </h1>
        <p className="mb-6 text-sm text-neutral-400">
          Set the goal. Own the deadline.
        </p>
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full rounded-lg bg-white py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}