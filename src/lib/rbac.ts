/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth/next";import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type Role = "USER" | "SUPPORT" | "ADMIN";

export async function requireRole(requiredRole: Role) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { authorized: false, status: 401, error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!user) {
    return { authorized: false, status: 404, error: "User not found" };
  }

  if (requiredRole === "ADMIN" && user.role !== "ADMIN") {
    return { authorized: false, status: 403, error: "Forbidden: Admin access required" };
  }

  if (requiredRole === "SUPPORT" && user.role !== "ADMIN" && user.role !== "SUPPORT") {
    return { authorized: false, status: 403, error: "Forbidden: Support access required" };
  }

  return { authorized: true, user: { id: session.user.id, role: user.role } };
}

export async function logAudit(adminId: string, action: string, targetId?: string, details?: string) {
  await prisma.auditLog.create({
    data: {
      adminId,
      action,
      targetId,
      details,
    }
  });
}

export async function trackEvent(eventName: string, userId?: string, metadata?: any) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        eventName,
        userId,
        metadata: metadata ? JSON.stringify(metadata) : undefined
      }
    });
  } catch (error) {
    console.error("Failed to track event:", error);
  }
}
