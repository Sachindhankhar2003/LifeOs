import { z } from "zod";

export const goalSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  status: z.enum(["In Progress", "Completed", "Not Started"]).default("Not Started"),
  dueDate: z.string().datetime().optional().nullable(),
});

export const milestoneSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  done: z.boolean().default(false),
});

export const decisionSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  budget: z.string().max(100).optional().nullable(),
  deadline: z.string().datetime().optional().nullable(),
  status: z.enum(["Pending", "Decided"]).default("Pending"),
});

export const decisionOptionSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional().nullable(),
});

export const savedPlanSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  type: z.enum(["Decision", "Plan"]),
  status: z.enum(["Decided", "Active", "Pending", "Draft"]),
  summary: z.string().optional().nullable(),
});
