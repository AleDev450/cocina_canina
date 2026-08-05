import type { Metadata } from "next";
import { obtenerPreguntas } from "@/server/contenido";
import { exigirGrupo } from "@/server/sesion";
import { categoriasFaq } from "@/data/contenido";
import { PanelFaq } from "@/components/admin/PanelFaq";
import { CabeceraModulo } from "@/components/admin/Piezas";

export const metadata: Metadata = { title: "Preguntas frecuentes" };

export default async function AdminFaq() {
  await exigirGrupo("Contenido");
  const preguntas = await obtenerPreguntas(false);

  return (
    <>
      <CabeceraModulo
        titulo="Preguntas frecuentes"
        texto="Ordena, edita o agrega preguntas. Se publican al instante en la web."
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

      <PanelFaq preguntas={preguntas} />
    </>
  );
}
