import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { decisionSchema } from "@/lib/validations";
import { z } from "zod";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decisions = await prisma.decision.findMany({
      where: { userId: session.user.id },
      include: { options: { include: { results: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(decisions);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = decisionSchema.parse(body);

    const decision = await prisma.decision.create({
      data: {
        userId: session.user.id,
        title: parsed.title,
        budget: parsed.budget,
        deadline: parsed.deadline ? new Date(parsed.deadline) : null,
        status: parsed.status,
      },
      include: { options: true },
    });

    return NextResponse.json(decision, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation Error", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
