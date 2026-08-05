"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { categoriasFaq, preguntas } from "@/data/contenido";
import { cx, normalizar } from "@/lib/formato";
import { Acordeon } from "@/components/ui/Acordeon";
import { EstadoVacio } from "@/components/ui/Elementos";
import { Boton } from "@/components/ui/Boton";

export function ListaFaq() {
  const [categoria, setCategoria] = useState("todas");
  const [consulta, setConsulta] = useState("");

  const resultados = useMemo(() => {
    const q = normalizar(consulta.trim());
    return preguntas
      .filter((p) => categoria === "todas" || p.categoria === categoria)
      .filter(
        (p) =>
          q.length < 2 || normalizar(`${p.pregunta} ${p.respuesta}`).includes(q),
      );
  }, [categoria, consulta]);

  return (
    <div>
      {/* Buscador */}
      <div className="relative mx-auto max-w-xl">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-[1.125rem] w-[1.125rem] -translate-y-1/2 text-naranja-500" />
        <input
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Busca tu pregunta…"
          aria-label="Buscar en preguntas frecuentes"
          className="h-13 w-full rounded-full border border-petroleo-700/15 bg-white pl-13 pr-5 text-sm text-tinta placeholder:text-grafito/50 focus:border-naranja-500 focus:outline-none"
        />
      </div>

      {/* Categorías */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {categoriasFaq.map((c) => {
          const cantidad =
            c.id === "todas"
              ? preguntas.length
              : preguntas.filter((p) => p.categoria === c.id).length;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoria(c.id)}
              className={cx(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                categoria === c.id
                  ? "bg-petroleo-700 text-white"
                  : "bg-white text-grafito hover:text-petroleo-800",
              )}
            >
              {c.nombre}
              <span className="ml-1.5 opacity-60">{cantidad}</span>
            </button>
          );
        })}
      </div>

      {/* Resultados */}
      <div className="mt-10">
        {resultados.length === 0 ? (
          <div className="rounded-3xl border border-petroleo-700/10 bg-white">
            <EstadoVacio
              pose="mirada"
              titulo="No encontramos esa pregunta"
              texto="Prueba con otras palabras o escríbenos por WhatsApp: respondemos rápido y con gusto."
              accion={
                <Boton
                  variante="contorno"
                  medida="md"
                  onClick={() => {
                    setConsulta("");
                    setCategoria("todas");
                  }}
                >
                  Ver todas las preguntas
                </Boton>
              }
            />
          </div>
        ) : (
          <Acordeon
            items={resultados.map((p) => ({
              id: p.id,
              pregunta: p.pregunta,
              respuesta: p.respuesta,
            }))}
            abiertoInicial={resultados[0]?.id}
          />
        )}
      </div>
    </div>
  );
}
