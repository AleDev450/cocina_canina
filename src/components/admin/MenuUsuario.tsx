"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { salirDelAdmin } from "@/server/acciones/auth";
import { AvatarMascota } from "@/components/ui/Elementos";
import { cx } from "@/lib/formato";

export function MenuUsuario({
  nombre,
  correo,
  rol,
}: {
  nombre: string;
  correo: string;
  rol: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const alClicar = (e: MouseEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener("mousedown", alClicar);
    return () => document.removeEventListener("mousedown", alClicar);
  }, []);

  return (
    <div ref={contenedor} className="relative border-l border-petroleo-700/10 pl-3">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-crema-100"
      >
        <AvatarMascota nombre={nombre} className="h-9 w-9" />
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-semibold leading-tight text-petroleo-900">
            {nombre}
          </span>
          <span className="block text-[0.68rem] text-grafito">{rol}</span>
        </span>
        <ChevronDown
          className={cx(
            "h-4 w-4 text-grafito transition-transform",
            abierto && "rotate-180",
          )}
        />
      </button>

      {abierto ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-petroleo-700/10 bg-white shadow-elevada"
        >
          <div className="border-b border-petroleo-700/10 px-4 py-3">
            <p className="truncate text-sm font-semibold text-petroleo-900">{nombre}</p>
            <p className="truncate text-xs text-grafito">{correo}</p>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-petroleo-800 transition-colors hover:bg-crema-50"
            role="menuitem"
          >
            <ExternalLink className="h-4 w-4" />
            Ver la tienda
          </Link>

          <form action={salirDelAdmin}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-coral-500 transition-colors hover:bg-coral-100"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
