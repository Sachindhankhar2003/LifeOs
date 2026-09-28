import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { deliverEmail, deliverWebPush } from "@/lib/delivery";

import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  // In a real application, you would secure this endpoint using a secret token 
  // passed by the cron runner (e.g., Vercel Cron or an external service).
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET || "local-dev"}`) {
    logger.warn({ event: "UNAUTHORIZED_CRON_ATTEMPT", endpoint: "/api/scheduler/dispatch" });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  try {
    const now = new Date();

    // 1. Find all pending reminders that are due
    const dueReminders = await prisma.reminder.findMany({
      where: {
        status: "PENDING",
        scheduledFor: { lte: now }
      },
      include: {
        user: {
          select: { id: true, notificationPrefs: true, email: true, name: true }
        }
      },
      take: 100 // Process in batches
    });

    let processedCount = 0;

    // 2. Process them idempotently
    for (const reminder of dueReminders) {
      // Create in-app notification first
      await prisma.notification.create({
        data: {
          userId: reminder.userId,
          title: `Reminder: ${reminder.title}`,
          message: `Your reminder for ${reminder.targetType || "a task"} is due now.`,
          category: "REMINDER",
          link: reminder.targetId ? `/${reminder.targetType?.toLowerCase()}s/${reminder.targetId}` : undefined,
        }
      });

      // External delivery based on preferences
      const prefs = reminder.user.notificationPrefs;
      if (prefs) {
        if (prefs.emailEnabled && reminder.user.email) {
          await deliverEmail(reminder.user.email, reminder.title);
        }
        if (prefs.pushEnabled) {
          await deliverWebPush(reminder.userId, reminder.title);
        }
      }

      // Mark as sent
      await prisma.reminder.update({
        where: { id: reminder.id },
        data: { status: "SENT", updatedAt: new Date() }
      });
      processedCount++;
    }

    const duration = Date.now() - startTime;
    logger.info({ event: "SCHEDULER_DISPATCH_SUCCESS", processedCount, durationMs: duration });
    return NextResponse.json({ success: true, processedCount });
  } catch (error) {
    logger.error({ event: "SCHEDULER_DISPATCH_FAILED", errorMessage: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

