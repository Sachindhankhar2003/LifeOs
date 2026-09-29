import { Shield } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPPORT")) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[var(--card)] border-r border-[var(--border)] flex flex-col pt-6 shrink-0 h-screen sticky top-0 overflow-y-auto hidden md:flex">
        <div className="px-6 mb-8 flex items-center gap-2">
          <Shield className="w-6 h-6 text-[var(--foreground)]" />
          <span className="font-bold tracking-tight text-lg text-[var(--foreground)]">LifeOS Admin</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/admin" className="block px-4 py-2.5 text-sm font-medium text-[var(--foreground)] rounded-xl hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)] transition-colors">
            Overview
          </Link>
          <Link href="/admin/users" className="block px-4 py-2.5 text-sm font-medium text-[var(--foreground)] rounded-xl hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)] transition-colors">
            Users & Roles
          </Link>
          <Link href="/dashboard" className="block px-4 py-2.5 text-sm font-medium text-[var(--muted)] rounded-xl hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)] transition-colors mt-8">
            ← Back to App
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
