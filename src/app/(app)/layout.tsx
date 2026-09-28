import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientLayout from "./client-layout";
import { ReactNode } from "react";
import { UserProvider } from "@/lib/UserContext";

export default function AppLayout({ children }: { children: ReactNode }) {
  // Authentication disabled for now
  return (
    <UserProvider>
      <ClientLayout>{children}</ClientLayout>
    </UserProvider>
  );
}
