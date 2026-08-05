import type { Metadata } from "next";
import Image from "next/image";
import { GripVertical, Pencil, Plus } from "lucide-react";
import { categorias } from "@/data/categorias";
import { productos } from "@/data/productos";
import { CabeceraModulo, Panel } from "@/components/admin/Piezas";
import { Boton } from "@/components/ui/Boton";
import { Pastilla } from "@/components/ui/Elementos";

export const metadata: Metadata = { title: "Categorías" };

export default function AdminCategorias() {
  return (
    <>
      <CabeceraModulo
        titulo="Categorías"
        texto="Ordénalas arrastrando: ese orden es el que se muestra en el inicio y en el catálogo."
        acciones={
          <Boton variante="primario" medida="sm">
            <Plus className="h-3.5 w-3.5" />
            Nueva categoría
          </Boton>
        }
      />

      <Panel>
        <ul className="divide-y divide-petroleo-700/8">
          {categorias.map((c) => {
            const total =
              c.slug === "barf" ? 3 : productos.filter((p) => p.categoria === c.slug).length;
            return (
              <li key={c.slug} className="flex items-center gap-4 px-6 py-4">
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-grafito" />
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-crema-50">
                  <Image
                    src={c.imagen}
                    alt=""
                    width={100}
                    height={100}
                    className="h-11 w-11 object-contain"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-petroleo-900">{c.nombre}</h3>
                  <p className="truncate text-xs text-grafito">{c.descripcionCorta}</p>
                </div>
                <Pastilla tono="contorno">{total} productos</Pastilla>
                <Pastilla tono="suaveHoja">Visible</Pastilla>
                <button
                  type="button"
                  aria-label={`Editar ${c.nombre}`}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-grafito transition-colors hover:bg-petroleo-100 hover:text-petroleo-800"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      </Panel>
    </>
  );
}
