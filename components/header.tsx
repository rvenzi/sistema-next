"use client";

import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="absolute top-0 left-0 w-full z-50 px-5 md:px-20 py-4 flex items-center justify-between border-b bg-white/60 backdrop-blur-xl shadow-sm">
      <h1 className="text-lg font-bold text-gray-900">Controle Financeiro</h1>

      {session?.user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            Olá, {session.user.name}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-xl bg-blue-900 border-2 border-black px-3 py-1 text-sm text-white hover:bg-red-600"
          >
            Sair
          </button>
        </div>
      )}
    </header>
  );
}