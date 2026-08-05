"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { nombreDureza } from "@/data/categorias";
import { useTienda } from "@/context/Tienda";
import { cx, normalizar, precio } from "@/lib/formato";

export interface ProductoBuscable {
  slug: string;
  nombre: string;
  dureza: string;
  beneficioPrincipal: string;
  descripcion: string;
  proteinas: string[];
  imagen: string;
  precioDesde: number;
}

const SUGERENCIAS = ["Tráquea", "Oreja", "Patitas de pollo", "Cuerno", "Pejerrey", "BARF"];

export function Buscador({ productos }: { productos: ProductoBuscable[] }) {
  const { buscadorAbierto, setBuscadorAbierto } = useTienda();
  const [consulta, setConsulta] = useState("");
  const entrada = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (buscadorAbierto) {
      setConsulta("");
      const t = setTimeout(() => entrada.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [buscadorAbierto]);

  useEffect(() => {
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBuscadorAbierto(false);
    };
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [setBuscadorAbierto]);

  const resultados = useMemo(() => {
    const q = normalizar(consulta.trim());
    if (q.length < 2) return [];
    return productos
      .filter((p) => {
        const campos = [
          p.nombre,
          p.beneficioPrincipal,
          p.descripcion,
          nombreDureza[p.dureza] ?? "",
          ...p.proteinas,
        ].join(" ");
        return normalizar(campos).includes(q);
      })
      .slice(0, 6);
  }, [consulta, productos]);

  return (
    <div
      className={cx(
        "fixed inset-0 z-[85]",
        buscadorAbierto ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!buscadorAbierto}
    >
      <button
        type="button"
        tabIndex={buscadorAbierto ? 0 : -1}
        aria-label="Cerrar buscador"
        onClick={() => setBuscadorAbierto(false)}
        className={cx(
          "absolute inset-0 bg-petroleo-950/50 backdrop-blur-sm transition-opacity duration-250",
          buscadorAbierto ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        className={cx(
          "absolute inset-x-0 top-0 mx-auto w-full max-w-2xl px-4 pt-[8vh] transition-all duration-300 ease-out",
          buscadorAbierto ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0",
        )}
      >
        <div className="overflow-hidden rounded-3xl bg-white shadow-elevada">
          <div className="flex items-center gap-3 border-b border-petroleo-700/10 px-5">
            <Search className="h-5 w-5 shrink-0 text-naranja-500" />
            <input
              ref={entrada}
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              placeholder="Busca un snack, una proteína o un beneficio…"
              className="h-16 min-w-0 flex-1 bg-transparent text-base text-tinta placeholder:text-grafito/50 focus:outline-none"
              aria-label="Buscar productos"
            />
            <button
              type="button"
              onClick={() => setBuscadorAbierto(false)}
              aria-label="Cerrar"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-grafito transition-colors hover:bg-crema-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[55vh] overflow-y-auto p-3">
            {consulta.trim().length < 2 ? (
              <div className="px-3 py-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-grafito">
                  Búsquedas frecuentes
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGERENCIAS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setConsulta(s)}
                      className="rounded-full bg-crema-100 px-3.5 py-1.5 text-sm font-medium text-petroleo-800 transition-colors hover:bg-naranja-50 hover:text-naranja-700"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : resultados.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-grafito">
                No encontramos nada para «{consulta}». Prueba con «tráquea», «oreja» o
                «res».
              </p>
            ) : (
              <ul>
                {resultados.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/productos/${p.slug}`}
                      onClick={() => setBuscadorAbierto(false)}
                      className="flex items-center gap-4 rounded-2xl px-3 py-2.5 transition-colors hover:bg-crema-50"
                    >
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-crema-50">
                        <Image
                          src={p.imagen}
                          alt=""
                          width={100}
                          height={100}
                          className="h-11 w-11 object-contain"
                          unoptimized={p.imagen.startsWith("http")}
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-petroleo-900">
                          {p.nombre}
                        </span>
                        <span className="block truncate text-xs text-grafito">
                          {nombreDureza[p.dureza]} · {p.beneficioPrincipal}
                        </span>
                      </span>
                      <span className="shrink-0 font-display text-base font-semibold text-petroleo-900">
                        {precio(p.precioDesde)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
