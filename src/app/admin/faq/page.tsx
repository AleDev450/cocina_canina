import type { Metadata } from "next";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { categoriasFaq, preguntas } from "@/data/contenido";
import { CabeceraModulo, Panel } from "@/components/admin/Piezas";
import { Boton } from "@/components/ui/Boton";
import { Pastilla } from "@/components/ui/Elementos";

export const metadata: Metadata = { title: "Preguntas frecuentes" };

export default function AdminFaq() {
  return (
    <>
      <CabeceraModulo
        titulo="Preguntas frecuentes"
        texto="Ordena, edita o agrega preguntas. Se publican al instante en la web."
        acciones={
          <Boton variante="primario" medida="sm">
            <Plus className="h-3.5 w-3.5" />
            Nueva pregunta
          </Boton>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {categoriasFaq.map((c) => {
          const total =
            c.id === "todas"
              ? preguntas.length
              : preguntas.filter((p) => p.categoria === c.id).length;
          return (
            <span
              key={c.id}
              className="rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-grafito ring-1 ring-petroleo-700/10"
            >
              {c.nombre} <span className="ml-1 opacity-60">{total}</span>
            </span>
          );
        })}
      </div>

      <Panel titulo={`${preguntas.length} preguntas publicadas`}>
        <ul className="divide-y divide-petroleo-700/8">
          {preguntas.map((p) => (
            <li key={p.id} className="flex gap-4 px-6 py-4">
              <GripVertical className="mt-1 h-4 w-4 shrink-0 cursor-grab text-grafito" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-petroleo-900">{p.pregunta}</h3>
                  <Pastilla tono="contorno">
                    {categoriasFaq.find((c) => c.id === p.categoria)?.nombre ??
                      p.categoria}
                  </Pastilla>
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm text-grafito">{p.respuesta}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  aria-label={`Editar: ${p.pregunta}`}
                  className="grid h-8 w-8 place-items-center rounded-lg text-grafito transition-colors hover:bg-petroleo-100 hover:text-petroleo-800"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label={`Eliminar: ${p.pregunta}`}
                  className="grid h-8 w-8 place-items-center rounded-lg text-grafito transition-colors hover:bg-coral-100 hover:text-coral-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
