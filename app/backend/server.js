const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory store
let expenses = [
  { id: uuidv4(), title: "Groceries", amount: 85.5,  category: "Food",          date: "2025-04-10", note: "Weekly shopping" },
  { id: uuidv4(), title: "Netflix",   amount: 15.99, category: "Entertainment", date: "2025-04-08", note: "Monthly subscription" },
  { id: uuidv4(), title: "Gym",       amount: 40.0,  category: "Health",        date: "2025-04-05", note: "Monthly membership" },
];

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Categories
app.get("/api/categories", (req, res) => {
  res.json(["Food", "Transport", "Health", "Entertainment", "Shopping", "Bills", "Education", "Other"]);
});

// GET all expenses
app.get("/api/expenses", (req, res) => {
  const { category, sort } = req.query;
  let result = [...expenses];
  if (category && category !== "All") result = result.filter((e) => e.category === category);
  if (sort === "amount_asc")  result.sort((a, b) => a.amount - b.amount);
  else if (sort === "amount_desc") result.sort((a, b) => b.amount - a.amount);
  else if (sort === "date_asc")    result.sort((a, b) => new Date(a.date) - new Date(b.date));
  else result.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(result);
});

// GET summary
app.get("/api/expenses/summary", (req, res) => {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const count = expenses.length;
  const byCategory = expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {});
  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  res.json({ total, count, avgPerExpense: count ? total / count : 0, byCategory, topCategory });
});

// GET single
app.get("/api/expenses/:id", (req, res) => {
  const e = expenses.find((e) => e.id === req.params.id);
  if (!e) return res.status(404).json({ error: "Not found" });
  res.json(e);
});

// POST create
app.post("/api/expenses", (req, res) => {
  const { title, amount, category, date, note } = req.body;
  if (!title || !amount || !category || !date)
    return res.status(400).json({ error: "title, amount, category and date are required" });
  if (isNaN(amount) || Number(amount) <= 0)
    return res.status(400).json({ error: "amount must be a positive number" });
  const e = { id: uuidv4(), title: title.trim(), amount: parseFloat(amount), category, date, note: note?.trim() || "" };
  expenses.push(e);
  res.status(201).json(e);
});

// PUT update
app.put("/api/expenses/:id", (req, res) => {
  const idx = expenses.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const { title, amount, category, date, note } = req.body;
  if (amount !== undefined && (isNaN(amount) || Number(amount) <= 0))
    return res.status(400).json({ error: "amount must be a positive number" });
  expenses[idx] = {
    ...expenses[idx],
    ...(title    && { title: title.trim() }),
    ...(amount   && { amount: parseFloat(amount) }),
    ...(category && { category }),
    ...(date     && { date }),
    ...(note !== undefined && { note: note.trim() }),
  };
  res.json(expenses[idx]);
});

// DELETE one
app.delete("/api/expenses/:id", (req, res) => {
  const idx = expenses.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const deleted = expenses.splice(idx, 1)[0];
  res.json({ message: "Deleted", expense: deleted });
});

// DELETE all
app.delete("/api/expenses", (req, res) => {
  const count = expenses.length;
  expenses = [];
  res.json({ message: `Deleted ${count} expenses` });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
