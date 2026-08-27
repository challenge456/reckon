import { z } from "zod";

export const createGoalSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120, "Title is too long"),
  description: z.string().trim().max(1000, "Description is too long").optional().or(z.literal("")),
  category: z.string().trim().max(50).optional().or(z.literal("")),
  deadline: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date.getTime() > Date.now();
  }, "Deadline must be a valid date and time in the future"),
});