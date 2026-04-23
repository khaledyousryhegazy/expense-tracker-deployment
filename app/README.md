# 💸 Spendly – Expense Tracker

A full-stack Expense Tracker with a **Node.js/Express** backend and a **React** frontend.

---

## Project Structure

```
expense-tracker/
├── backend/
│   ├── server.js       ← Express API (in-memory, no DB)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    ├── public/
    │   └── index.html
    └── package.json
```

---

## Running the App

### 1. Start the backend

```bash
cd backend
npm install
npm start        # runs on http://localhost:5000
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm start        # runs on http://localhost:3000
```

The frontend's `package.json` has `"proxy": "http://localhost:5000"` so all `/api` calls are forwarded to Express automatically.

Open **http://localhost:3000** in your browser.

---

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/categories` | All categories |
| GET | `/api/expenses` | List expenses (`?category=Food&sort=date_desc`) |
| GET | `/api/expenses/summary` | Totals & breakdown |
| GET | `/api/expenses/:id` | Single expense |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| DELETE | `/api/expenses` | Delete all |

### Sort options
`date_desc` · `date_asc` · `amount_desc` · `amount_asc`

### POST body example
```json
{
  "title": "Lunch",
  "amount": 12.50,
  "category": "Food",
  "date": "2025-04-15",
  "note": "Falafel place"
}
```

### Categories
`Food` · `Transport` · `Health` · `Entertainment` · `Shopping` · `Bills` · `Education` · `Other`
