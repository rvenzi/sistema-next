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
        <div className="flex items-center justify-center min-h-screen bg-linear-to-l from-white via-indigo-400 to-blue-900">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md backdrop:blur-md"
            >
                <h1 className="text-lg text-gray-500 mb-2 text-center">Não tem conta?</h1>
                <h2 className="text-2xl text-black mb-6 text-center">Cadastre-se agora!</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <label htmlFor="name" className="text-gray-500 block mb-2">
                        Nome
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border text-gray-500 border-gray-500 rounded"
                        required
                        placeholder="Digite seu nome inteiro"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="text-gray-500 block mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border text-gray-500 border-gray-500 rounded"
                        required
                        placeholder="Digite um email válido"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="text-gray-500 block mb-2">
                        Senha
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border text-gray-500 border-gray-500 rounded"
                        required
                        placeholder="********"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-linear-to-r from-indigo-400 to-blue-900 text-white p-2 rounded hover:from-blue-900 hover:to-indigo-400 transition-colors duration-300"
                >
                    {loading ? "Cadastrando..." : "Cadastrar"}
                </button>
                <p className="text-center text-sm mt-4 text-gray-600">
                    Já tem conta?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                    Entrar
                </a>
        </p>
            </form>
        </div>
    );
}