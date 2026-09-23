"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
};

type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  category: Category;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState<"income" | "expense">("expense");
  const [editCategoryId, setEditCategoryId] = useState("");

  async function loadData() {
    const [transactionsRes, categoriesRes] = await Promise.all([
      fetch("/api/transactions"),
      fetch("/api/categories"),
    ]);

    setTransactions(await transactionsRes.json());
    setCategories(await categoriesRes.json());
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, amount, type, categoryId }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erro ao criar transação.");
      return;
    }

    setDescription("");
    setAmount("");
    setCategoryId("");
    loadData();
  }

  function startEditing(transaction: Transaction) {
    setEditingId(transaction.id);
    setEditDescription(transaction.description);
    setEditAmount(String(transaction.amount));
    setEditType(transaction.type);
    setEditCategoryId(transaction.category.id);
    setError("");
  }

  function cancelEditing() {
    setEditingId(null);
  }

  async function handleUpdate(id: string) {
    setError("");

    const res = await fetch(`/api/transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: editDescription,
        amount: editAmount,
        type: editType,
        categoryId: editCategoryId,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erro ao atualizar transação.");
      return;
    }

    setEditingId(null);
    loadData();
  }

  async function handleDelete(id: string) {
    setError("");

    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta transação?"
    );
    if (!confirmed) return;

    const res = await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erro ao excluir transação.");
      return;
    }

    loadData();
  }

  return (
    <div className="flex flex-1 items-start justify-center bg-bg p-4 pt-10 sm:items-center sm:pt-4">
        <div className="bg-surface p-8 rounded-2xl shadow-lg md:max-w-xl lg:max-w-7xl border border-border">
            <h1 className="mb-4 text-2xl font-bold text-text">Transações</h1>
            <form
                onSubmit={handleSubmit}
                className="mb-6 space-y-3 rounded-lg border border-border p-4"
            >
                <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setType("expense")}
                    className={`flex-1 rounded p-2 font-medium transition-colors duration-300 ${
                    type === "expense"
                        ? "bg-danger text-text"
                        : "bg-bg border border-border text-text-muted"
                    }`}
                >
                    Despesa
                </button>
                <button
                    type="button"
                    onClick={() => setType("income")}
                    className={`flex-1 rounded p-2 font-medium transition-colors duration-300 ${
                    type === "income"
                        ? "bg-accent text-bg"
                        : "bg-bg border border-border text-text-muted"
                    }`}
                >
                    Receita
                </button>
                </div>

                <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição"
                required
                className="w-full rounded border text-text bg-bg border-border p-2 focus:outline-none focus:border-accent"
                />

                <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Valor"
                required
                className="w-full rounded border text-text bg-bg border-border p-2 focus:outline-none focus:border-accent"
                />

                <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full rounded border text-text bg-bg border-border p-2 focus:outline-none focus:border-accent"
                >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                    {category.name}
                    </option>
                ))}
                </select>

                {error && (
                  <p className="text-sm text-danger bg-danger/10 border border-danger rounded p-2">
                    {error}
                  </p>
                )}

                <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-bg font-semibold p-2 rounded hover:bg-accent-hover transition-colors duration-300"
                >
                {loading ? "Salvando..." : "Adicionar"}
                </button>
            </form>

      <ul className="space-y-2">
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            className="rounded-2xl border border-border bg-bg p-3"
          >
            {editingId === transaction.id ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditType("expense")}
                    className={`flex-1 rounded p-1 text-sm font-medium transition-colors ${
                      editType === "expense"
                        ? "bg-danger text-text"
                        : "bg-surface border border-border text-text-muted"
                    }`}
                  >
                    Despesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditType("income")}
                    className={`flex-1 rounded p-1 text-sm font-medium transition-colors ${
                      editType === "income"
                        ? "bg-accent text-bg"
                        : "bg-surface border border-border text-text-muted"
                    }`}
                  >
                    Receita
                  </button>
                </div>

                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded border border-border bg-surface p-1 text-text focus:outline-none focus:border-accent"
                />

                <input
                  type="number"
                  step="0.01"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full rounded border border-border bg-surface p-1 text-text focus:outline-none focus:border-accent"
                />

                <select
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value)}
                  className="w-full rounded border border-border bg-surface p-1 text-text focus:outline-none focus:border-accent"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(transaction.id)}
                    className="flex-1 rounded bg-accent px-2 py-1 text-sm text-bg font-semibold hover:bg-accent-hover"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="flex-1 rounded border border-border px-2 py-1 text-sm text-text-muted hover:bg-surface"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-text">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-text-muted">
                    • {transaction.category.name}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-10 sm:justify-end">
                  <span
                    className={`font-bold whitespace-nowrap ${
                      transaction.type === "income"
                        ? "text-accent"
                        : "text-danger"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"} R${" "}
                    {transaction.amount.toFixed(2)}
                  </span>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => startEditing(transaction)}
                      className="rounded-xl border border-border px-2 py-1 text-sm text-text-muted hover:border-accent hover:text-accent transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="rounded-xl border border-border px-2 py-1 text-sm text-text-muted hover:border-danger hover:text-danger transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}