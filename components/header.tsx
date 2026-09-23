"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/transactions", label: "Transações" },
    { href: "/dashboard/categories", label: "Categorias" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-5 md:px-20 py-4 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wide md:text-3xl" style={{ fontFamily: "var(--font-bebas-neue)" }}>
          <span className="text-text">Controle</span>{" "}
          <span className="text-accent">Financeiro</span>
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
                    className="rounded-xl px-3 py-1.5 text-md font-medium text-text-muted border border-transparent hover:border-accent hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <span className="text-sm text-text-muted">
                Olá, {session.user.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded-xl bg-danger/10 border border-danger px-3 py-1 text-sm text-danger hover:bg-danger hover:text-text transition-colors"
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
              <span className="block h-0.5 w-6 bg-text" />
              <span className="block h-0.5 w-6 bg-text" />
              <span className="block h-0.5 w-6 bg-text" />
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
              className="px-3 py-2 text-md font-medium text-text-muted border-b border-border hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
          <span className="px-3 py-2 text-md text-text-muted">
            Olá, {session.user.name}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mx-3 rounded-xl bg-danger/10 border border-danger px-3 py-1.5 text-sm text-danger hover:bg-danger hover:text-text transition-colors"
          >
            Sair
          </button>
        </div>
      )}
    </header>
  );
}