"use client";

import { useRef, useState, useTransition } from "react";
import { createGoal } from "@/lib/actions/goals";

const CATEGORIES = ["Study", "Coding", "Project", "Work", "Personal", "Other"];

export function CreateGoalForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await createGoal(formData);
      formRef.current?.reset();
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
      >
        + Create Goal
      </button>
    );
  }

  // Minimum value for the datetime-local input so the browser itself
  // discourages picking a past deadline (server still re-validates this).
  const minDateTime = new Date(Date.now() + 60_000).toISOString().slice(0, 16);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-900 p-5"
    >
      <div className="space-y-3">
        <input
          name="title"
          placeholder="Goal title"
          required
          maxLength={120}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-500"
        />
        <textarea
          name="description"
          placeholder="Optional description"
          maxLength={1000}
          rows={2}
          className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-500"
        />
        <select
          name="category"
          defaultValue=""
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-500"
        >
          <option value="">No category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          name="deadline"
          required
          min={minDateTime}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-500"
        />
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-lg bg-white py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create Goal"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}