"use server";

import { auth } from "@/auth";
import { useLifeline } from "@/lib/lifelines";
import { revalidatePath } from "next/cache";

export async function useLifelineAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    console.error("No session for lifeline usage");
    return;
  }

  const consequenceAssignmentId = formData.get("consequenceAssignmentId");
  if (typeof consequenceAssignmentId !== "string") {
    console.error("Missing consequence assignment id");
    return;
  }

  const success = await useLifeline(session.user.id, consequenceAssignmentId);

  if (success) {
    revalidatePath("/dashboard/goals");
  } else {
    console.error("Failed to use lifeline (none remaining)");
  }
}
