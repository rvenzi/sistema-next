"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function loadCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erro ao criar categoria.");
      return;
    }

    setName("");
    loadCategories();
  }

  function startEditing(category: Category) {
    setEditingId(category.id);
    setEditName(category.name);
    setError("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditName("");
  }

  async function handleUpdate(id: string) {
    setError("");

    const res = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erro ao atualizar categoria.");
      return;
    }

    setEditingId(null);
    loadCategories();
  }

  async function handleDelete(id: string) {
    setError("");

    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta categoria?"
    );
    if (!confirmed) return;

    const res = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erro ao excluir categoria.");
      return;
    }

    loadCategories();
  }

  return (
    <div className="flex flex-1 items-start justify-center bg-bg p-4 pt-10 sm:items-center sm:pt-4">
      <div className="bg-surface p-8 rounded-2xl shadow-lg w-full max-w-md border border-border">
        <h1 className="mb-4 text-2xl font-bold text-text">Categorias</h1>

        <form onSubmit={handleSubmit} className="mb-6 flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nova categoria"
            required
            className="min-w-0 flex-1 rounded border text-text bg-bg border-border p-2 focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 bg-accent text-bg font-semibold px-3 sm:px-4 py-2 rounded hover:bg-accent-hover transition-colors duration-300"
          >
            {loading ? "..." : "Adicionar"}
          </button>
        </form>

        {error && (
          <p className="mb-4 text-sm text-danger bg-danger/10 border border-danger rounded p-2">
            {error}
          </p>
        )}

        <ul className="space-y-2">
          {categories.map((category) => (
            <li
              key={category.id}
              className="rounded border border-border bg-bg p-2 text-text"
            >
              {editingId === category.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 rounded border border-border bg-surface p-1 text-text focus:outline-none focus:border-accent"
                  />
                  <button
                    onClick={() => handleUpdate(category.id)}
                    className="rounded-xl bg-accent px-2 py-1 text-sm text-bg font-semibold hover:bg-accent-hover"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="rounded-xl border border-border px-2 py-1 text-sm text-text-muted hover:bg-surface"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(category)}
                      className="rounded-xl border border-border px-2 py-1 text-sm text-text-muted hover:border-accent hover:text-accent transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="rounded-xl border border-border px-2 py-1 text-sm text-text-muted hover:border-danger hover:text-danger transition-colors"
                    >
                      Excluir
                    </button>
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