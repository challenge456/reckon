"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export type NotificationType =
  | "GOAL_DEADLINE_APPROACHING"
  | "GOAL_EXPIRED"
  | "CONSEQUENCE_ASSIGNED"
  | "CHALLENGE_DEADLINE_APPROACHING"
  | "CHALLENGE_EXPIRED"
  | "ACHIEVEMENT_UNLOCKED"
  | "STREAK_MILESTONE";

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  data?: Record<string, unknown>;
}

/**
 * Create a notification for a user
 */
export async function createNotification(
  userId: string,
  payload: NotificationPayload
) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type: payload.type,
        message: `${payload.title}: ${payload.message}`,
      },
    });

    // In future: send browser/email notification if preferences allow
    // For now, just store in database
  } catch (err) {
    console.error("Error creating notification:", err);
  }
}

/**
 * Get unread notifications for user
 */
export async function getUnreadNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId, read: false },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification || notification.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

/**
 * Trigger goal deadline approaching notification (called via cron or on goal page load)
 */
export async function notifyUpcomingDeadlines() {
  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
  const now = new Date();

  const goals = await prisma.goal.findMany({
    where: {
      status: "ACTIVE",
      deadline: {
        lte: oneHourFromNow,
        gte: now,
      },
    },
    select: { id: true, userId: true, title: true, deadline: true },
  });

  for (const goal of goals) {
    // Check if we already notified about this
    const existingNotif = await prisma.notification.findFirst({
      where: {
        userId: goal.userId,
        type: "GOAL_DEADLINE_APPROACHING",
        message: { contains: goal.id },
      },
    });

    if (!existingNotif) {
      const timeLeft = goal.deadline.getTime() - Date.now();
      const minutesLeft = Math.floor(timeLeft / (1000 * 60));

      await createNotification(goal.userId, {
        type: "GOAL_DEADLINE_APPROACHING",
        title: "⏰ Deadline Approaching",
        message: `"${goal.title}" is due in ${minutesLeft} minutes`,
        link: "/dashboard/goals",
      });
    }
  }
}

/**
 * Trigger achievement unlocked notification
 */
export async function notifyAchievementUnlocked(userId: string, achievementName: string) {
  await createNotification(userId, {
    type: "ACHIEVEMENT_UNLOCKED",
    title: "🏆 Achievement Unlocked",
    message: `You've unlocked "${achievementName}"!`,
    link: "/dashboard/achievements",
  });
}

/**
 * Trigger consequence assigned notification
 */
export async function notifyConsequenceAssigned(userId: string, goalTitle: string) {
  await createNotification(userId, {
    type: "CONSEQUENCE_ASSIGNED",
    title: "⚡ Consequence Assigned",
    message: `A consequence has been assigned for "${goalTitle}"`,
    link: "/dashboard/challenges",
  });
}