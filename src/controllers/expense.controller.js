import Expense from "../models/Expense.js";
import { expenseSchema } from "../utils/validate.js";
import { Parser } from "json2csv";


export const createExpense = async (req, res) => {
  try {
    const parsed = expenseSchema.parse(req.body);

    const expense = await Expense.create({
      ...parsed,
      user: req.user.id
    });

    res.status(201).json({
      message: "Expense created successfully",
      expense
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      month,
      sort = "desc"
    } = req.query;

    const query = { user: req.user.id };

    // Filter by category (if provided)
    if (category) {
      query.category = category;
    }

    // Filter by month (if provided)
    if (month) {
      const start = new Date(`${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

      query.date = { $gte: start, $lt: end };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const expenses = await Expense.find(query)
      .sort({ date: sort === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Expense.countDocuments(query);

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
      expenses
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the expense first
    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Ownership check: only the creator can update
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this expense" });
    }

    // Validate new data
    const parsed = expenseSchema.parse(req.body);

    // Update expense
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      parsed,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Expense updated successfully",
      expense: updatedExpense
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Ownership check: only the creator can delete
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this expense" });
    }

    await Expense.findByIdAndDelete(id);

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const exportExpensesCSV = async (req, res) => {
  console.log("✅ EXPORT ROUTE HIT");

  try {
    const userId = req.user.id;
    const { category, month, sort = "desc" } = req.query;

    const filter = { user: userId };

    if (category) filter.category = category;

    if (month) {
      const start = new Date(`${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const expenses = await Expense.find(filter)
      .sort({ date: sort === "asc" ? 1 : -1 })
      .lean();

    const fields = ["title", "amount", "category", "date"];
    const parser = new Parser({ fields });
    const csv = parser.parse(expenses);

    res.header("Content-Type", "text/csv");
    res.attachment("expenses.csv");
    res.send(csv);
  } catch (error) {
    console.error("CSV export error:", error);
    res.status(500).json({ message: "Failed to export expenses" });
  }
};

