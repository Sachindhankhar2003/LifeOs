import { NextRequest, NextResponse } from "next/server";
import { requireRole, logAudit, Role } from "@/lib/rbac";
import { prisma } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireRole("ADMIN");
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id: targetUserId } = await context.params;
    if (auth.user?.id === targetUserId) {
      return NextResponse.json({ error: "Cannot modify your own role" }, { status: 403 });
    }

    const body = await req.json();
    const { role } = body;

    const validRoles: Role[] = ["USER", "SUPPORT", "ADMIN"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role },
      select: { id: true, name: true, role: true }
    });

    await logAudit(
      auth.user!.id, 
      "UPDATE_ROLE", 
      targetUserId, 
      `Changed role to ${role}`
    );

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Admin Update Role Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
