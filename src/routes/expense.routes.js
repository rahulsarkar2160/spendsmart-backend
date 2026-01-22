console.log("✅ expense.routes.js loaded");

import express from "express";
import auth from "../middleware/auth.js";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  exportExpensesCSV
} from "../controllers/expense.controller.js";

const router = express.Router();

router.use(auth);

router.get("/", getExpenses);
router.get("/export", exportExpensesCSV);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
