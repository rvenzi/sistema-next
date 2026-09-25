"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

  try {
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
      redirect: false,
    });

    if (res?.error) {
      setError("Email ou senha inválidos.");
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  } catch {
    setError("Não foi possível entrar. Tente novamente.");
  } finally {
    setLoading(false);
  }
  }

  return (
    <div className="flex flex-1 items-start justify-center bg-bg p-4 pt-10 sm:items-center sm:pt-4">
      <form
        onSubmit={handleSubmit}
        className="bg-surface p-8 rounded-2xl shadow-lg w-full max-w-md border border-border"
      >
        <h1 className="text-lg text-text-muted mb-2 text-center">Bem vindo(a)!</h1>
        <h2 className="text-2xl text-text mb-6 text-center">Faça login para continuar</h2>
        {error && (
          <p className="rounded bg-danger/10 border border-danger p-2 text-sm text-danger mb-4">
            {error}
          </p>
        )}
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
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-center text-sm mt-4 text-text-muted">
          Não tem conta?{" "}
          <a href="/register" className="text-accent hover:underline">
            Cadastre-se
          </a>
        </p>
      </form>
    </div>
  );
}