import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const API = "/api";

const CAT_COLORS = {
  Food: "#f0c94d", Transport: "#4ecb71", Health: "#e07b4f",
  Entertainment: "#a78bfa", Shopping: "#f472b6", Bills: "#60a5fa",
  Education: "#34d399", Other: "#94a3b8",
};
const CAT_ICONS = {
  Food: "🍽️", Transport: "🚗", Health: "💊", Entertainment: "🎬",
  Shopping: "🛍️", Bills: "📄", Education: "📚", Other: "📦",
};

const fmt  = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const fmtD = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/* ── Modal ── */
function Modal({ open, onClose, children }) {
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  if (!open) return null;
  return (
    <div className="backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

/* ── ExpenseForm ── */
function ExpenseForm({ initial, categories, onSave, onCancel, loading }) {
  const today = new Date().toISOString().split("T")[0];
  const [f, setF] = useState(initial || { title: "", amount: "", category: "Food", date: today, note: "" });
  const [err, setErr] = useState("");
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!f.title.trim()) return setErr("Title is required.");
    if (!f.amount || isNaN(f.amount) || Number(f.amount) <= 0) return setErr("Enter a valid positive amount.");
    if (!f.date) return setErr("Date is required.");
    setErr("");
    await onSave(f);
  };

  return (
    <div className="form-wrap">
      <h2 className="form-title">{initial ? "Edit Expense" : "New Expense"}</h2>
      {err && <div className="form-err">{err}</div>}

      <label className="lbl">Title</label>
      <input className="inp" placeholder="e.g. Coffee" value={f.title} onChange={(e) => set("title", e.target.value)} />

      <div className="row">
        <div>
          <label className="lbl">Amount ($)</label>
          <input className="inp" type="number" min="0" step="0.01" placeholder="0.00" value={f.amount} onChange={(e) => set("amount", e.target.value)} />
        </div>
        <div>
          <label className="lbl">Date</label>
          <input className="inp" type="date" value={f.date} onChange={(e) => set("date", e.target.value)} />
        </div>
      </div>

      <label className="lbl">Category</label>
      <div className="cat-grid">
        {categories.map((c) => (
          <button key={c}
            className={`cat-chip${f.category === c ? " cat-chip--on" : ""}`}
            style={f.category === c ? { borderColor: CAT_COLORS[c], color: CAT_COLORS[c] } : {}}
            onClick={() => set("category", c)}>
            {CAT_ICONS[c]} {c}
          </button>
        ))}
      </div>

      <label className="lbl">Note (optional)</label>
      <textarea className="inp inp--ta" placeholder="Any details…" value={f.note} onChange={(e) => set("note", e.target.value)} />

      <div className="form-actions">
        <button className="btn btn--ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn--primary" onClick={submit} disabled={loading}>{loading ? "Saving…" : initial ? "Save Changes" : "Add Expense"}</button>
      </div>
    </div>
  );
}

/* ── SummaryBar ── */
function SummaryBar({ s }) {
  if (!s) return null;
  return (
    <div className="summary-bar">
      <div className="s-card s-card--accent"><span className="s-lbl">Total Spent</span><span className="s-val">{fmt(s.total)}</span></div>
      <div className="s-card"><span className="s-lbl">Expenses</span><span className="s-val">{s.count}</span></div>
      <div className="s-card"><span className="s-lbl">Avg / Item</span><span className="s-val">{fmt(s.avgPerExpense)}</span></div>
      <div className="s-card"><span className="s-lbl">Top Category</span><span className="s-val" style={{ color: CAT_COLORS[s.topCategory] }}>{CAT_ICONS[s.topCategory]} {s.topCategory}</span></div>
    </div>
  );
}

/* ── CategoryBar ── */
function CategoryBar({ byCategory, total }) {
  if (!byCategory || !total) return null;
  const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  return (
    <div className="catbar-wrap">
      <div className="catbar-track">
        {entries.map(([c, v]) => (
          <div key={c} className="catbar-seg" style={{ width: `${(v / total) * 100}%`, background: CAT_COLORS[c] }} title={`${c}: ${fmt(v)}`} />
        ))}
      </div>
      <div className="catbar-legend">
        {entries.map(([c, v]) => (
          <div key={c} className="leg-item">
            <span className="leg-dot" style={{ background: CAT_COLORS[c] }} />
            <span>{c}</span>
            <span className="leg-amt">{fmt(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ExpenseRow ── */
function ExpenseRow({ e, onEdit, onDelete }) {
  return (
    <div className="exp-row">
      <div className="exp-icon" style={{ background: CAT_COLORS[e.category] + "22", color: CAT_COLORS[e.category] }}>{CAT_ICONS[e.category]}</div>
      <div className="exp-info">
        <div className="exp-title">{e.title}</div>
        <div className="exp-meta">
          <span style={{ color: CAT_COLORS[e.category], fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{e.category}</span>
          {e.note && <span className="exp-note">· {e.note}</span>}
        </div>
      </div>
      <div className="exp-right">
        <div className="exp-amount">{fmt(e.amount)}</div>
        <div className="exp-date">{fmtD(e.date)}</div>
      </div>
      <div className="exp-actions">
        <button className="ico-btn" onClick={() => onEdit(e)}>✏️</button>
        <button className="ico-btn ico-btn--del" onClick={() => onDelete(e.id)}>🗑️</button>
      </div>
    </div>
  );
}

/* ── App ── */
export default function App() {
  const [expenses,  setExpenses]  = useState([]);
  const [summary,   setSummary]   = useState(null);
  const [categories,setCategories]= useState([]);
  const [filterCat, setFilterCat] = useState("All");
  const [sort,      setSort]      = useState("date_desc");
  const [loading,   setLoading]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [modalAdd,  setModalAdd]  = useState(false);
  const [editTarget,setEditTarget]= useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [toast,     setToast]     = useState(null);
  const [health,    setHealth]    = useState(null);

  const notify = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ sort });
      if (filterCat !== "All") p.set("category", filterCat);
      const [er, sr] = await Promise.all([fetch(`${API}/expenses?${p}`), fetch(`${API}/expenses/summary`)]);
      setExpenses(await er.json());
      setSummary(await sr.json());
    } catch { notify("Failed to load data", "err"); }
    finally { setLoading(false); }
  }, [filterCat, sort]);

  useEffect(() => {
    fetch(`${API}/categories`).then((r) => r.json()).then(setCategories);
    fetch(`${API}/health`).then((r) => r.json()).then((d) => setHealth(d.status)).catch(() => setHealth("offline"));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (form) => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/expenses`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      setModalAdd(false); await load(); notify("Expense added!");
    } catch (e) { notify(e.message || "Error", "err"); }
    finally { setSaving(false); }
  };

  const handleEdit = async (form) => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/expenses/${editTarget.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      setEditTarget(null); await load(); notify("Expense updated!");
    } catch (e) { notify(e.message || "Error", "err"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    setSaving(true);
    try {
      await fetch(`${API}/expenses/${id}`, { method: "DELETE" });
      setDelTarget(null); await load(); notify("Expense deleted");
    } catch { notify("Delete failed", "err"); }
    finally { setSaving(false); }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-mark">$</span>
            <span className="logo-text">Spendly</span>
          </div>
          <div className="hdr-right">
            <div className={`hdot${health === "ok" ? " hdot--ok" : " hdot--err"}`} title={`API: ${health}`} />
            <button className="btn btn--primary" onClick={() => setModalAdd(true)}>+ Add Expense</button>
          </div>
        </div>
      </header>

      <main className="main">
        <SummaryBar s={summary} />
        {summary?.byCategory && Object.keys(summary.byCategory).length > 0 && (
          <CategoryBar byCategory={summary.byCategory} total={summary.total} />
        )}

        {/* Filters */}
        <div className="filters">
          <div className="filter-cats">
            {["All", ...categories].map((c) => (
              <button key={c}
                className={`f-chip${filterCat === c ? " f-chip--on" : ""}`}
                style={filterCat === c && c !== "All" ? { borderColor: CAT_COLORS[c], color: CAT_COLORS[c] } : {}}
                onClick={() => setFilterCat(c)}>
                {c !== "All" && CAT_ICONS[c]} {c}
              </button>
            ))}
          </div>
          <select className="sort-sel" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="date_desc">Newest first</option>
            <option value="date_asc">Oldest first</option>
            <option value="amount_desc">Highest amount</option>
            <option value="amount_asc">Lowest amount</option>
          </select>
        </div>

        {/* List */}
        <div className="exp-list">
          {loading ? (
            <div className="empty">Loading…</div>
          ) : expenses.length === 0 ? (
            <div className="empty"><div style={{ fontSize: 48, marginBottom: 12 }}>💸</div>No expenses yet. Add your first one!</div>
          ) : (
            expenses.map((e) => <ExpenseRow key={e.id} e={e} onEdit={setEditTarget} onDelete={setDelTarget} />)
          )}
        </div>
      </main>

      {/* Modals */}
      <Modal open={modalAdd} onClose={() => setModalAdd(false)}>
        <ExpenseForm categories={categories} loading={saving} onSave={handleAdd} onCancel={() => setModalAdd(false)} />
      </Modal>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)}>
        {editTarget && <ExpenseForm initial={editTarget} categories={categories} loading={saving} onSave={handleEdit} onCancel={() => setEditTarget(null)} />}
      </Modal>

      <Modal open={!!delTarget} onClose={() => setDelTarget(null)}>
        <div className="form-wrap" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🗑️</div>
          <h2 className="form-title">Delete this expense?</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>This cannot be undone.</p>
          <div className="form-actions" style={{ justifyContent: "center" }}>
            <button className="btn btn--ghost" onClick={() => setDelTarget(null)}>Cancel</button>
            <button className="btn btn--danger" onClick={() => handleDelete(delTarget)} disabled={saving}>{saving ? "Deleting…" : "Delete"}</button>
          </div>
        </div>
      </Modal>

      {toast && <div className={`toast toast--${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
