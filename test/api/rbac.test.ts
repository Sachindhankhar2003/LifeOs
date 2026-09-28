import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PUT } from '@/app/api/admin/users/[id]/route';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));
vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    auditLog: { create: vi.fn() },
  },
}));
vi.mock('@/lib/auth', () => ({ authOptions: {} }));

describe('Admin Users API (Update Role)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockRequest = (body: any) => new NextRequest('http://localhost:3000/api/admin/users/TARGET', {
    method: 'PUT',
    body: JSON.stringify(body)
  });

  it('rejects SUPPORT from updating roles (requires ADMIN)', async () => {
    (getServerSession as any).mockResolvedValueOnce({ user: { id: 's1' } });
    (prisma.user.findUnique as any).mockResolvedValueOnce({ role: 'SUPPORT' });
    
    const res = await PUT(mockRequest({ role: "ADMIN" }), { params: Promise.resolve({ id: "TARGET" }) });
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toContain("Forbidden");
  });

  it('prevents ADMIN from modifying their own role', async () => {
    (getServerSession as any).mockResolvedValueOnce({ user: { id: 'a1' } });
    (prisma.user.findUnique as any).mockResolvedValueOnce({ role: 'ADMIN' });
    
    const res = await PUT(mockRequest({ role: "USER" }), { params: Promise.resolve({ id: "a1" }) });
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toContain("Cannot modify your own role");
  });

  it('allows ADMIN to update another role and logs audit event', async () => {
    (getServerSession as any).mockResolvedValueOnce({ user: { id: 'a1' } });
    (prisma.user.findUnique as any).mockResolvedValueOnce({ role: 'ADMIN' });
    (prisma.user.update as any).mockResolvedValueOnce({ id: 'TARGET', role: 'SUPPORT' });
    
    const res = await PUT(mockRequest({ role: "SUPPORT" }), { params: Promise.resolve({ id: "TARGET" }) });
    expect(res.status).toBe(200);
    
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "TARGET" },
      data: { role: "SUPPORT" },
      select: { id: true, name: true, role: true }
    });
    expect(prisma.auditLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ action: "UPDATE_ROLE", adminId: 'a1', targetId: 'TARGET' })
    }));
  });
});
