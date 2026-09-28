import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/admin/metrics/route';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';

// Mock dependencies
vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));
vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      count: vi.fn(),
    },
    analyticsEvent: { count: vi.fn() },
    goal: { count: vi.fn() },
    message: { count: vi.fn() },
    auditLog: { create: vi.fn() },
  },
}));
vi.mock('@/lib/auth', () => ({ authOptions: {} }));

import { prisma } from '@/lib/db';

describe('Admin Metrics API', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockRequest = () => new NextRequest('http://localhost:3000/api/admin/metrics');

  it('rejects unauthenticated requests', async () => {
    (getServerSession as any).mockResolvedValueOnce(null);
    const res = await GET(mockRequest());
    expect(res.status).toBe(401);
  });

  it('rejects users without required role (USER attempting SUPPORT)', async () => {
    (getServerSession as any).mockResolvedValueOnce({ user: { id: 'u1' } });
    (prisma.user.findUnique as any).mockResolvedValueOnce({ role: 'USER' });
    const res = await GET(mockRequest());
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toContain("Forbidden");
  });

  it('allows SUPPORT or ADMIN to view metrics', async () => {
    (getServerSession as any).mockResolvedValueOnce({ user: { id: 'a1' } });
    (prisma.user.findUnique as any).mockResolvedValueOnce({ role: 'ADMIN' });
    
    (prisma.user.count as any).mockResolvedValueOnce(10);
    (prisma.analyticsEvent.count as any).mockResolvedValueOnce(5);
    (prisma.goal.count as any).mockResolvedValueOnce(20);
    (prisma.message.count as any).mockResolvedValueOnce(50);

    const res = await GET(mockRequest());
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.totalUsers).toBe(10);
    expect(data.aiRequestVolume).toBe(50);
  });
});
