import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let prefs = await prisma.notificationPreference.findUnique({
      where: { userId: session.user.id }
    });

    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: { userId: session.user.id }
      });
    }

    return NextResponse.json(prefs);
  } catch (error) {
    console.error("Preferences GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const prefs = await prisma.notificationPreference.upsert({
      where: { userId: session.user.id },
      update: {
        emailEnabled: body.emailEnabled,
        pushEnabled: body.pushEnabled,
        quietHoursStart: body.quietHoursStart,
        quietHoursEnd: body.quietHoursEnd,
        timezone: body.timezone,
      },
      create: {
        userId: session.user.id,
        emailEnabled: body.emailEnabled,
        pushEnabled: body.pushEnabled,
        quietHoursStart: body.quietHoursStart,
        quietHoursEnd: body.quietHoursEnd,
        timezone: body.timezone,
      }
    });

    return NextResponse.json(prefs);
  } catch (error) {
    console.error("Preferences PUT Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
