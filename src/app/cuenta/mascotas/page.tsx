import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, Heart, Plus, Weight } from "lucide-react";
import { mascotasDemo } from "@/data/cuenta";
import { obtenerProducto } from "@/data/productos";
import { AvatarMascota, Pastilla } from "@/components/ui/Elementos";
import { Boton } from "@/components/ui/Boton";
import { edadDesde, fechaCorta } from "@/lib/formato";

export const metadata: Metadata = { title: "Mis mascotas" };

export default function PaginaMascotas() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-petroleo-900">
            Mis mascotas
          </h2>
          <p className="mt-1.5 text-sm text-grafito">
            Guarda el perfil de cada una para recibir recomendaciones más precisas.
          </p>
        </div>
        <Boton variante="primario" medida="md">
          <Plus className="h-4 w-4" />
          Agregar mascota
        </Boton>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {mascotasDemo.map((m) => (
          <article
            key={m.id}
            className="overflow-hidden rounded-3xl border border-petroleo-700/10 bg-white"
          >
            <div className="flex items-center gap-4 bg-crema-50 p-6">
              <AvatarMascota nombre={m.nombre} foto={m.foto} className="h-20 w-20" />
              <div className="min-w-0">
                <h3 className="font-display text-2xl font-semibold text-petroleo-900">
                  {m.nombre}
                </h3>
                <p className="text-sm text-grafito">
                  {m.especie} · {m.raza}
                </p>
                <p className="text-xs text-grafito">
                  Nació el {fechaCorta(m.nacimiento)}
                </p>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-crema-50 p-4">
                  <span className="text-[0.68rem] font-bold uppercase tracking-wide text-grafito">
                    Edad
                  </span>
                  <p className="font-display text-lg font-semibold text-petroleo-900">
                    {edadDesde(m.nacimiento)}
                  </p>
                </div>
                <div className="rounded-2xl bg-crema-50 p-4">
                  <span className="flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-wide text-grafito">
                    <Weight className="h-3 w-3" />
                    Peso
                  </span>
                  <p className="font-display text-lg font-semibold text-petroleo-900">
                    {m.pesoKg} kg
                  </p>
                </div>
              </div>

              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Alergias
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.alergias.length === 0 ? (
                    <Pastilla tono="suaveHoja">Ninguna registrada</Pastilla>
                  ) : (
                    m.alergias.map((a) => (
                      <Pastilla key={a} tono="suaveCoral">
                        {a}
                      </Pastilla>
                    ))
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800">
                  Preferencias
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.preferencias.map((p) => (
                    <Pastilla key={p} tono="contorno">
                      {p}
                    </Pastilla>
                  ))}
                </div>
              </div>

              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800">
                  <Heart className="h-3.5 w-3.5 text-naranja-500" />
                  Productos favoritos
                </span>
                <ul className="mt-2 space-y-1.5">
                  {m.favoritos.map((slug) => {
                    const producto = obtenerProducto(slug);
                    if (!producto) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/productos/${slug}`}
                          className="text-sm font-medium text-petroleo-800 transition-colors hover:text-naranja-600"
                        >
                          {producto.nombre}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <Boton variante="contorno" medida="sm" className="w-full">
                Editar perfil de {m.nombre}
              </Boton>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
