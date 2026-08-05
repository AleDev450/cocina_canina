"use client";

import Image from "next/image";
import { useActionState, useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, X } from "lucide-react";
import type { Categoria } from "@/lib/tipos";
import {
  alternarCategoriaVisible,
  eliminarCategoria,
  guardarCategoria,
  reordenarCategorias,
} from "@/server/acciones/catalogo";
import { AreaTexto, Campo, Casilla, Select } from "@/components/ui/Campos";
import {
  Aviso,
  BotonEnviar,
  ErrorCampo,
  ESTADO_INICIAL,
} from "@/components/ui/Formulario";
import { Panel } from "@/components/admin/Piezas";
import { BotonAccion, Interruptor } from "@/components/admin/Controles";
import { Boton } from "@/components/ui/Boton";
import { Pastilla } from "@/components/ui/Elementos";
import { SubirImagen } from "@/components/admin/SubirImagen";

type Fila = Categoria & { id: string; visible: boolean; total: number };

const ICONOS = [
  { id: "suave", nombre: "Hoja (dureza suave)" },
  { id: "media", nombre: "Huella (dureza media)" },
  { id: "larga", nombre: "Hueso (larga duración)" },
  { id: "barf", nombre: "Olla (BARF)" },
  { id: "mayor", nombre: "Plato (por mayor)" },
];

const ACENTOS = [
  { id: "petroleo", nombre: "Verde petróleo" },
  { id: "naranja", nombre: "Naranja" },
  { id: "hoja", nombre: "Verde hoja" },
  { id: "coral", nombre: "Coral" },
  { id: "ambar", nombre: "Ámbar" },
];

export function PanelCategorias({ categorias }: { categorias: Fila[] }) {
  const [estado, accion] = useActionState(guardarCategoria, ESTADO_INICIAL);
  const [editando, setEditando] = useState<Fila | null>(null);
  const [creando, setCreando] = useState(false);
  const [orden, setOrden] = useState(categorias);
  const [, iniciar] = useTransition();

  const abierto = creando || editando !== null;

  const mover = (indice: number, direccion: -1 | 1) => {
    const destino = indice + direccion;
    if (destino < 0 || destino >= orden.length) return;

    const copia = [...orden];
    [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
    setOrden(copia);
    iniciar(async () => {
      try {
        await reordenarCategorias(copia.map((c) => c.id));
      } catch {
        setOrden(orden);
      }
    });
  };

  return (
    <Panel
      titulo="Categorías"
      descripcion="El orden de esta lista es el que se ve en el inicio y en el catálogo"
      acciones={
        !abierto ? (
          <Boton
            variante="primario"
            medida="sm"
            onClick={() => {
              setEditando(null);
              setCreando(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            Nueva categoría
          </Boton>
        ) : null
      }
    >
      {abierto ? (
        <form
          action={accion}
          key={editando?.id ?? "nueva"}
          className="space-y-5 border-b border-petroleo-700/10 bg-crema-50 p-6"
        >
          {editando ? <input type="hidden" name="id" value={editando.id} /> : null}

          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-petroleo-900">
              {editando ? `Editar «${editando.nombre}»` : "Nueva categoría"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditando(null);
                setCreando(false);
              }}
              aria-label="Cancelar"
              className="grid h-8 w-8 place-items-center rounded-full text-grafito hover:bg-crema-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <Aviso estado={estado} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Campo
                etiqueta="Nombre"
                name="nombre"
                required
                defaultValue={editando?.nombre}
                placeholder="Snacks de dureza media"
              />
              <ErrorCampo estado={estado} campo="nombre" />
            </div>
            <Campo
              etiqueta="Slug"
              name="slug"
              opcional
              defaultValue={editando?.slug}
              placeholder="dureza-media"
            />
            <Campo
              etiqueta="Descripción corta"
              name="descripcionCorta"
              contenedor="sm:col-span-2"
              defaultValue={editando?.descripcionCorta}
              placeholder="Masticación con beneficio articular."
            />
            <AreaTexto
              etiqueta="Descripción"
              name="descripcion"
              rows={3}
              contenedor="sm:col-span-2"
              defaultValue={editando?.descripcion}
            />
            <Select etiqueta="Icono" name="icono" defaultValue={editando?.icono ?? "media"}>
              {ICONOS.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nombre}
                </option>
              ))}
            </Select>
            <Select
              etiqueta="Color de acento"
              name="acento"
              defaultValue={editando?.acento ?? "petroleo"}
            >
              {ACENTOS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </Select>
            <div className="sm:col-span-2">
              <SubirImagen
                nombre="imagen"
                etiqueta="Imagen de la categoría"
                carpeta="categorias"
                valorInicial={editando?.imagen ?? ""}
              />
            </div>
          </div>

          <Casilla
            name="visible"
            defaultChecked={editando?.visible ?? true}
            etiqueta="Visible en la tienda"
          />

          <BotonEnviar medida="md">
            {editando ? "Guardar categoría" : "Crear categoría"}
          </BotonEnviar>
        </form>
      ) : null}

      <ul className="divide-y divide-petroleo-700/8">
        {orden.map((c, i) => (
          <li key={c.id} className="flex items-center gap-4 px-6 py-4">
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => mover(i, -1)}
                disabled={i === 0}
                aria-label={`Subir ${c.nombre}`}
                className="grid h-5 w-5 place-items-center rounded text-grafito transition-colors hover:bg-crema-100 hover:text-petroleo-800 disabled:opacity-30"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => mover(i, 1)}
                disabled={i === orden.length - 1}
                aria-label={`Bajar ${c.nombre}`}
                className="grid h-5 w-5 place-items-center rounded text-grafito transition-colors hover:bg-crema-100 hover:text-petroleo-800 disabled:opacity-30"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-crema-50">
              <Image
                src={c.imagen}
                alt=""
                width={100}
                height={100}
                className="h-11 w-11 object-contain"
                unoptimized={c.imagen.startsWith("http")}
              />
            </span>

            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-petroleo-900">{c.nombre}</h3>
              <p className="truncate text-xs text-grafito">{c.descripcionCorta}</p>
            </div>

            <Pastilla tono="contorno">{c.total} productos</Pastilla>

            <Interruptor
              activo={c.visible}
              etiqueta={`Mostrar u ocultar ${c.nombre}`}
              alCambiar={(valor) => alternarCategoriaVisible(c.id, valor)}
              tamano="sm"
            />

            <button
              type="button"
              onClick={() => {
                setCreando(false);
                setEditando(c);
              }}
              aria-label={`Editar ${c.nombre}`}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-grafito transition-colors hover:bg-petroleo-100 hover:text-petroleo-800"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>

            <BotonAccion
              etiqueta={`Eliminar ${c.nombre}`}
              confirmar={
                c.total > 0
                  ? `«${c.nombre}» tiene ${c.total} productos. Muévelos a otra categoría antes de eliminarla.`
                  : `¿Eliminar la categoría «${c.nombre}»?`
              }
              accion={() => eliminarCategoria(c.id)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-grafito transition-colors hover:bg-coral-100 hover:text-coral-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </BotonAccion>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
