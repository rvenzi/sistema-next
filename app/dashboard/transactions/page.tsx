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
    <div className="flex items-center justify-center min-h-screen bg-linear-to-t from-finance-navy via-finance-dark to-black">
        <div className="bg-white/60 p-8 rounded-2xl shadow-lg md:max-w-xl lg:max-w-7xl backdrop-blur-xl border border-white/20">
            <h1 className="mb-4 text-2xl font-bold text-gray-900">Transações</h1>
            <form
                onSubmit={handleSubmit}
                className="mb-6 space-y-3 rounded-lg border border-black p-4"
            >
                <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setType("expense")}
                    className={`flex-1 rounded p-2 font-medium ${
                    type === "expense"
                        ? "bg-linear-to-r from-red-400 to-red-900 hover:from-red-900 hover:to-red-400 transition-colors duration-300 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                >
                    Despesa
                </button>
                <button
                    type="button"
                    onClick={() => setType("income")}
                    className={`flex-1 rounded p-2 font-medium ${
                    type === "income"
                        ? "bg-linear-to-r from-green-400 to-green-800 hover:from-green-800 hover:to-green-400 transition-colors duration-300 text-white"
                        : "bg-gray-100 text-gray-700"
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
                className="w-full rounded border text-black border-black p-2"
                />

                <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Valor"
                required
                className="w-full rounded border text-black border-black p-2"
                />

                <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full rounded border text-gray-900 border-black p-2"
                >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                    {category.name}
                    </option>
                ))}
                </select>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-indigo-400 to-blue-900 text-white p-2 rounded hover:from-blue-900 hover:to-indigo-400 transition-colors duration-300"
                >
                {loading ? "Salvando..." : "Adicionar"}
                </button>
            </form>

      <ul className="space-y-2">
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            className={`rounded-2xl p-3 ${
              transaction.type === "income"
                ? "bg-gray-300"
                : "bg-gray-300"
            }`}
          >
            {editingId === transaction.id ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditType("expense")}
                    className={`flex-1 rounded p-1 text-sm font-medium ${
                      editType === "expense"
                        ? "bg-red-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    Despesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditType("income")}
                    className={`flex-1 rounded p-1 text-sm font-medium ${
                      editType === "income"
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    Receita
                  </button>
                </div>

                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded border border-black p-1 text-black"
                />

                <input
                  type="number"
                  step="0.01"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full rounded border border-black p-1 text-black"
                />

                <select
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value)}
                  className="w-full rounded border border-black p-1 text-black"
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
                    className="flex-1 rounded bg-blue-900 px-2 py-1 text-sm text-white hover:bg-blue-800"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="flex-1 rounded bg-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-black">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-800">
                    • {transaction.category.name}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-10 sm:justify-end">
                  <span
                    className={`font-bold whitespace-nowrap ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"} R${" "}
                    {transaction.amount.toFixed(2)}
                  </span>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => startEditing(transaction)}
                      className="rounded-xl bg-blue-100 px-2 py-1 text-sm text-blue-700 border hover:bg-blue-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="rounded-xl bg-white px-2 py-1 text-sm text-red-700 border hover:bg-gray-100"
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