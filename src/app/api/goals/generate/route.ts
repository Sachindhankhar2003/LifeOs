import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { trackEvent } from "@/lib/rbac";

export const maxDuration = 30;

const milestonesSchema = z.object({
  milestones: z.array(z.object({
    title: z.string().describe("A specific, actionable milestone title")
  })).describe("List of 4 to 6 milestones to achieve the overarching goal"),
  estimatedDueDate: z.string().describe("A realistic estimated timeline string like 'Dec 2026' or '6 months'")
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { goalTitle } = await req.json();

    if (!goalTitle) {
      return NextResponse.json({ error: "Goal title is required" }, { status: 400 });
    }

    const { object } = await generateObject({
      model: openai("gpt-4o") as any,
      schema: milestonesSchema,
      prompt: `You are a practical life planning assistant. 
The user wants to achieve this goal: "${goalTitle}". 
Break this down into realistic, sequential milestones. Assign a relative estimated timeframe to each milestone (e.g. "Week 1", "Month 1-3").
Don't be overly optimistic. Factor in typical delays or prerequisite setup.`
    });

    await trackEvent("GOAL_CREATED", session.user.id, { goalTitle });

    return NextResponse.json(object);
  } catch (error: any) {
    console.error("Generate Goal API Error:", error);
    return NextResponse.json({ error: "Failed to generate milestones" }, { status: 500 });
  }
}
