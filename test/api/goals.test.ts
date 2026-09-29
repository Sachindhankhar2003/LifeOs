/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/goals/route";
import { NextRequest } from "next/server";

// Mock the NextAuth session and Prisma DB
vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    goal: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";

describe("Goals API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/goals", () => {
    it("should return 401 if unauthorized", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce(null);

      const response = await GET();
      expect(response.status).toBe(401);
      
      const data = await response.json();
      expect(data.error).toBe("Unauthorized");
    });

    it("should return user goals if authorized", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: "user-123" },
        expires: "9999",
      });

      const mockGoals = [{ id: "1", title: "Test Goal", userId: "user-123", milestones: [] }];
      vi.mocked(prisma.goal.findMany).mockResolvedValueOnce(mockGoals as any);

      const response = await GET();
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveLength(1);
      expect(data[0].title).toBe("Test Goal");
    });
  });

  describe("POST /api/goals", () => {
    it("should return 401 if unauthorized", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce(null);

      const req = new NextRequest("http://localhost/api/goals", {
        method: "POST",
        body: JSON.stringify({ title: "New Goal" }),
      });

      const response = await POST(req);
      expect(response.status).toBe(401);
    });

    it("should return 400 on validation error", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: "user-123" },
        expires: "9999",
      });

      // Missing title
      const req = new NextRequest("http://localhost/api/goals", {
        method: "POST",
        body: JSON.stringify({ status: "In Progress" }),
      });

      const response = await POST(req);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe("Validation Error");
    });

    it("should create a goal successfully", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: "user-123" },
        expires: "9999",
      });

      const mockGoal = { id: "2", title: "New Goal Phase", userId: "user-123" };
      vi.mocked(prisma.goal.create).mockResolvedValueOnce(mockGoal as any);

      const req = new NextRequest("http://localhost/api/goals", {
        method: "POST",
        body: JSON.stringify({ title: "New Goal Phase" }),
      });

      const response = await POST(req);
      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.title).toBe("New Goal Phase");
    });
  });
});
