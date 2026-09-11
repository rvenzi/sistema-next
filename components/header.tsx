"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Início" },
    { href: "/dashboard/transactions", label: "Transações" },
    { href: "/dashboard/categories", label: "Categorias" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-5 md:px-20 py-4 border-b-3 bg-white/60 backdrop-blur-xl shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">
          Controle Financeiro
        </h1>

        {session?.user && (
          <>
            {/* Navegação normal - some no mobile */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl px-3 py-1.5 text-md font-medium text-gray-900 hover:bg-gray-400 hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <span className="text-md text-black">
                Olá, {session.user.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded-xl bg-blue-900 border-2 border-black px-3 py-1 text-sm text-white hover:bg-red-600"
              >
                Sair
              </button>
            </div>

            {/* Botão hambúrguer - só aparece no mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Abrir menu"
            >
              <span className="block h-0.5 w-6 bg-gray-900" />
              <span className="block h-0.5 w-6 bg-gray-900" />
              <span className="block h-0.5 w-6 bg-gray-900" />
            </button>
          </>
        )}
      </div>

      {/* Menu mobile expandido */}
      {session?.user && menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2 pb-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-md font-medium text-gray-900 hover:bg-gray-400"
            >
              {link.label}
            </Link>
          ))}
          <span className="px-3 py-2 text-md text-black">
            Olá, {session.user.name}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mx-3 rounded-xl bg-blue-900 border-2 border-black px-3 py-1.5 text-sm text-white hover:bg-red-600"
          >
            Sair
          </button>
        </div>
      )}
    </header>
  );
}