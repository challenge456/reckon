"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type DeleteAccountResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Permanently delete the currently authenticated user's account and data.
 *
 * Identity is taken only from the server session. The client may send the
 * confirmation string, never a userId.
 */
export async function deleteAccount(
  confirmation: string
): Promise<DeleteAccountResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "You must be signed in to delete your account.",
    };
  }

  if (typeof confirmation !== "string" || confirmation.trim() !== "DELETE") {
    return {
      success: false,
      error: "Type DELETE to confirm.",
    };
  }

  const userId = session.user.id;

  try {
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!existing) {
      return {
        success: false,
        error: "This account has already been deleted.",
      };
    }

    await prisma.$transaction(async (tx) => {
      // ConsequenceAssignment.userId historically had no User relation, so
      // delete those rows first. Catalog Consequence / Achievement rows are
      // shared and must not be touched.
      await tx.consequenceAssignment.deleteMany({ where: { userId } });
      await tx.user.delete({ where: { id: userId } });
    });

    return { success: true };
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return {
        success: false,
        error: "This account has already been deleted.",
      };
    }

    console.error("Account deletion failed");
    return {
      success: false,
      error: "We couldn't delete your account. Please try again.",
    };
  }
}
