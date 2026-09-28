import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const reminders = await prisma.reminder.findMany({
      where: { userId: session.user.id },
      orderBy: { scheduledFor: 'asc' }
    });

    return NextResponse.json(reminders);
  } catch (error) {
    console.error("Reminders GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, targetType, targetId, scheduledFor } = body;

    if (!title || !scheduledFor) {
      return NextResponse.json({ error: "Title and scheduledFor are required" }, { status: 400 });
    }

    const scheduledDate = new Date(scheduledFor);
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId: session.user.id,
        title,
        targetType,
        targetId,
        scheduledFor: scheduledDate,
        status: "PENDING"
      }
    });

    return NextResponse.json(reminder);
  } catch (error) {
    console.error("Reminders POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
