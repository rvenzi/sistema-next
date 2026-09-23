"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao cadastrar usuário.");
    }
  }

  return (
    <div className="flex flex-1 items-start justify-center bg-bg p-4 pt-10 sm:items-center sm:pt-4">
      <form
        onSubmit={handleSubmit}
        className="bg-surface p-8 rounded-2xl shadow-lg w-full max-w-md border border-border"
      >
        <h1 className="text-lg text-text-muted mb-2 text-center">Não tem conta?</h1>
        <h2 className="text-2xl text-text mb-6 text-center">Cadastre-se agora!</h2>
        {error && (
          <p className="rounded bg-danger/10 border border-danger p-2 text-sm text-danger mb-4">
            {error}
          </p>
        )}
        <div className="mb-4">
          <label htmlFor="name" className="text-text-muted block mb-2">
            Nome
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border text-text bg-bg border-border rounded focus:outline-none focus:border-accent"
            required
            placeholder="Digite seu nome inteiro"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="text-text-muted block mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border text-text bg-bg border-border rounded focus:outline-none focus:border-accent"
            required
            placeholder="Digite um email válido"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="text-text-muted block mb-2">
            Senha
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border text-text bg-bg border-border rounded focus:outline-none focus:border-accent"
            required
            placeholder="********"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-bg font-semibold p-2 rounded hover:bg-accent-hover transition-colors duration-300"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
        <p className="text-center text-sm mt-4 text-text-muted">
          Já tem conta?{" "}
          <a href="/login" className="text-accent hover:underline">
            Entrar
          </a>
        </p>
      </form>
    </div>
  );
}