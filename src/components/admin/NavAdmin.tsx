"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { MODULOS } from "@/data/modulosAdmin";
import { cx } from "@/lib/formato";
import { Logo } from "@/components/ui/Elementos";

/**
 * Menú lateral del CMS. `grupos` limita lo que se muestra según el rol;
 * `null` significa acceso total (administrador).
 */
export function NavAdmin({
  grupos,
  rol,
}: {
  grupos: string[] | null;
  rol: string;
}) {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);

  const visibles = MODULOS.filter((g) => grupos === null || grupos.includes(g.grupo));

  const contenido = (
    <>
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/admin" aria-label="Panel de administración">
          <Logo variante="blanco" className="h-8 w-auto" />
        </Link>
        <button
          type="button"
          onClick={() => setAbierto(false)}
          aria-label="Cerrar menú"
          className="grid h-9 w-9 place-items-center rounded-full text-white/70 hover:bg-white/10 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <p className="mx-5 mb-4 rounded-full bg-white/10 px-3 py-1.5 text-center text-[0.62rem] font-bold uppercase tracking-[0.12em] text-naranja-300">
        {rol}
      </p>

      <nav
        className="flex-1 space-y-6 overflow-y-auto px-3 pb-6"
        aria-label="Módulos del CMS"
      >
        {visibles.map((g) => (
          <div key={g.grupo}>
            <p className="px-3 pb-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-petroleo-100/50">
              {g.grupo}
            </p>
            <ul className="space-y-0.5">
              {g.enlaces.map((e) => {
                const activo =
                  e.href === "/admin" ? ruta === "/admin" : ruta.startsWith(e.href);
                return (
                  <li key={e.href}>
                    <Link
                      href={e.href}
                      onClick={() => setAbierto(false)}
                      className={cx(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-[0.82rem] font-medium transition-colors",
                        activo
                          ? "bg-naranja-500 text-white"
                          : "text-petroleo-100/85 hover:bg-white/8 hover:text-white",
                      )}
                    >
                      <e.icono className="h-4 w-4 shrink-0" />
                      <span className="truncate">{e.nombre}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <Link
          href="/"
          className="text-xs font-semibold text-petroleo-100/70 transition-colors hover:text-naranja-300"
        >
          ← Volver a la tienda
        </Link>
      </div>
    </>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-petroleo-900 lg:flex">
        {contenido}
      </aside>

      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-label="Abrir menú del CMS"
        className="fixed bottom-5 left-5 z-50 grid h-12 w-12 place-items-center rounded-full bg-petroleo-900 text-white shadow-elevada lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div
        className={cx(
          "fixed inset-0 z-[90] lg:hidden",
          abierto ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!abierto}
      >
        <button
          type="button"
          tabIndex={abierto ? 0 : -1}
          aria-label="Cerrar"
          onClick={() => setAbierto(false)}
          className={cx(
            "absolute inset-0 bg-petroleo-950/50 transition-opacity duration-300",
            abierto ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cx(
            "absolute left-0 top-0 flex h-full w-72 flex-col bg-petroleo-900 transition-transform duration-300",
            abierto ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {contenido}
        </div>
      </div>
    </>
  );
}
