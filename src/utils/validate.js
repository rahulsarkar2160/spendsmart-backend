import { z } from "zod";

export const expenseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  amount: z.number().positive("Amount must be positive"),
  category: z.string().min(2, "Category is required"),
  date: z.string().date("Invalid date format"),
  note: z.string().optional()
});
