/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/reminders/route';
import { PUT, DELETE } from '@/app/api/reminders/[id]/route';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    reminder: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
  },
}));

describe('Reminders API', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockContext = (id: string) => ({ params: Promise.resolve({ id }) });

  it('POST creates a reminder with a valid date', async () => {
    (getServerSession as any).mockResolvedValueOnce({ user: { id: 'u1' } });
    (prisma.reminder.create as any).mockResolvedValueOnce({ id: 'r1', title: 'Test' });

    const req = new NextRequest('http://localhost/api/reminders', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test', scheduledFor: '2026-10-01T10:00:00Z' })
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(prisma.reminder.create).toHaveBeenCalled();
  });

  it('PUT blocks updating a reminder owned by another user', async () => {
    (getServerSession as any).mockResolvedValueOnce({ user: { id: 'u1' } });
    (prisma.reminder.findUnique as any).mockResolvedValueOnce({ id: 'r1', userId: 'u2' }); // Mismatch

    const req = new NextRequest('http://localhost/api/reminders/r1', {
      method: 'PUT',
      body: JSON.stringify({ title: 'New Test' })
    });

    const res = await PUT(req, mockContext('r1'));
    expect(res.status).toBe(404);
  });
});
