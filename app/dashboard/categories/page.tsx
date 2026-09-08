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
    <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-finance-dark via-finance-navy to-black bg-cover bg-center bg-no-repeat">
            <div className="bg-white/60 p-8 rounded-2xl shadow-lg w-full max-w-md backdrop-blur-xl border border-white/20">
                <h1 className="mb-4 text-2xl font-bold text-gray-900">Categorias</h1>

                <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nova categoria"
                        required
                        className="flex-1 rounded border text-black border-black p-2"
                />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-linear-to-r from-indigo-400 to-blue-900 text-white px-4 py-2 rounded hover:from-blue-900 hover:to-indigo-400 transition-colors duration-300"
                    >
                        {loading ? "..." : "Adicionar"}
                    </button>
                </form>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <ul className="space-y-2">
            {categories.map((category) => (
            <li 
                key={category.id}
                    className="rounded border border-black p-2 text-gray-800"
                >
                    {editingId === category.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 rounded border border-black p-1 text-black"
                        />
                        <button
                          onClick={() => handleUpdate(category.id)}
                          className="rounded-xl bg-green-600 px-2 py-1 text-sm text-white hover:bg-green-700"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="rounded-xl bg-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-400"
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
                            className="rounded-xl bg-blue-100 px-2 py-1 text-sm text-blue-700 border border-blue hover:bg-blue-200"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="rounded-xl bg-red-100 px-2 py-1 text-sm text-red-700 border border-red hover:bg-red-200"
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