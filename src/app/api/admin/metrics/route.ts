import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireRole("SUPPORT");
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // 1. Fetch distinct user counts
    const totalUsers = await prisma.user.count();

    // 2. Fetch specific analytics
    const totalSimulations = await prisma.analyticsEvent.count({
      where: { eventName: "SIMULATION_COMPLETED" }
    });

    const totalGoals = await prisma.goal.count();

    // 3. Provider/AI Metrics (In a real app this would query logs/DataDog, here we use DB proxy proxy events if we had them or simple aggregation)
    const totalMessages = await prisma.message.count({ where: { role: "ai" }});

    return NextResponse.json({
      totalUsers,
      totalSimulations,
      totalGoals,
      aiRequestVolume: totalMessages, // Mocking AI Request Volume based on messages
    });
  } catch (error) {
    console.error("Admin Metrics Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
