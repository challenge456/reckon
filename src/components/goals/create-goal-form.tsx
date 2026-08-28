"use client";

import { useRef, useState, useTransition } from "react";
import { createGoal } from "@/lib/actions/goals";
import { X, Plus } from "lucide-react";

const CATEGORIES = ["Study", "Coding", "Project", "Work", "Personal", "Health", "Learning"];

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
        className="btn btn-primary flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Create Goal
      </button>
    );
  }

  const minDateTime = new Date(Date.now() + 60_000).toISOString().slice(0, 16);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md card-lg mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Create Goal</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1 hover:bg-muted rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Goal Title *</label>
            <input
              name="title"
              placeholder="e.g., Complete DSA course"
              required
              maxLength={120}
              className="input w-full"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              placeholder="Optional details about your goal..."
              maxLength={500}
              rows={3}
              className="input w-full resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              defaultValue=""
              className="input w-full"
            >
              <option value="">No category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Deadline *</label>
            <input
              type="datetime-local"
              name="deadline"
              required
              min={minDateTime}
              className="input w-full"
            />
            <p className="text-xs text-muted mt-1">Set a real deadline to make this count.</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary flex-1"
            >
              {isPending ? "Creating..." : "Create Goal"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}