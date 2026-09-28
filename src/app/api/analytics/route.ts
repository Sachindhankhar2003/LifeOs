import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { trackEvent } from "@/lib/rbac";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id; // Optional for anonymous events
    
    const body = await req.json();
    const { eventName, metadata } = body;

    if (!eventName) {
      return NextResponse.json({ error: "Missing eventName" }, { status: 400 });
    }

    // Optional: filter out invalid event names here for security
    const allowedEvents = [
      "SIGNUP_COMPLETED", 
      "SIMULATION_STARTED", 
      "SIMULATION_COMPLETED", 
      "GOAL_CREATED", 
      "PLAN_SAVED",
      "CHAT_STARTED"
    ];

    if (!allowedEvents.includes(eventName)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    await trackEvent(eventName, userId, metadata);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
