import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/scheduler/dispatch/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { deliverEmail, deliverWebPush } from '@/lib/delivery';

vi.mock('@/lib/db', () => ({
  prisma: {
    reminder: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
    notification: {
      create: vi.fn(),
    }
  },
}));

vi.mock('@/lib/delivery', () => ({
  deliverEmail: vi.fn(),
  deliverWebPush: vi.fn(),
}));

describe('Scheduler Dispatch API', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockRequest = (secret: string) => {
    return new NextRequest('http://localhost/api/scheduler/dispatch', {
      method: 'POST',
      headers: { 'authorization': `Bearer ${secret}` }
    });
  };

  it('rejects unauthorized requests', async () => {
    const res = await POST(mockRequest('wrong-secret'));
    expect(res.status).toBe(401);
  });

  it('processes due reminders and triggers delivery channels idempotenly', async () => {
    // Setup environment for test logic
    process.env.CRON_SECRET = 'test-secret';
    
    (prisma.reminder.findMany as any).mockResolvedValueOnce([
      {
        id: 'r1',
        userId: 'u1',
        title: 'Review Goal',
        status: 'PENDING',
        user: { 
          id: 'u1', 
          email: 'test@example.com',
          notificationPrefs: { emailEnabled: true, pushEnabled: true } 
        }
      }
    ]);

    const res = await POST(mockRequest('test-secret'));
    expect(res.status).toBe(200);
    
    // Checked if in-app notification created
    expect(prisma.notification.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ userId: 'u1', title: 'Reminder: Review Goal' })
    }));

    // Checked if email sent
    expect(deliverEmail).toHaveBeenCalledWith('test@example.com', 'Review Goal');
    expect(deliverWebPush).toHaveBeenCalledWith('u1', 'Review Goal');

    // Checked if status updated to SENT
    expect(prisma.reminder.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'r1' },
      data: expect.objectContaining({ status: 'SENT' })
    }));
  });
});
