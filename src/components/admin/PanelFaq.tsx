"use client";

import { useActionState, useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, X } from "lucide-react";
import type { PreguntaFrecuente } from "@/lib/tipos";
import {
  eliminarPregunta,
  guardarPregunta,
  reordenarPreguntas,
} from "@/server/acciones/contenido";
import { categoriasFaq } from "@/data/contenido";
import { AreaTexto, Campo, Casilla, Select } from "@/components/ui/Campos";
import {
  Aviso,
  BotonEnviar,
  ErrorCampo,
  ESTADO_INICIAL,
} from "@/components/ui/Formulario";
import { Panel } from "@/components/admin/Piezas";
import { BotonAccion } from "@/components/admin/Controles";
import { Boton } from "@/components/ui/Boton";
import { Pastilla } from "@/components/ui/Elementos";

type Pregunta = PreguntaFrecuente & { visible: boolean };

const CATEGORIAS = categoriasFaq.filter((c) => c.id !== "todas");

export function PanelFaq({ preguntas }: { preguntas: Pregunta[] }) {
  const [estado, accion] = useActionState(guardarPregunta, ESTADO_INICIAL);
  const [editando, setEditando] = useState<Pregunta | null>(null);
  const [creando, setCreando] = useState(false);
  const [orden, setOrden] = useState(preguntas);
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
        await reordenarPreguntas(copia.map((p) => p.id));
      } catch {
        setOrden(orden);
      }
    });
  };

  return (
    <Panel
      titulo={`${preguntas.length} preguntas`}
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
            Nueva pregunta
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
              {editando ? "Editar pregunta" : "Nueva pregunta"}
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

          <Select
            etiqueta="Categoría"
            name="categoria"
            defaultValue={editando?.categoria ?? "productos"}
          >
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </Select>

          <div>
            <Campo
              etiqueta="Pregunta"
              name="pregunta"
              required
              defaultValue={editando?.pregunta}
            />
            <ErrorCampo estado={estado} campo="pregunta" />
          </div>

          <div>
            <AreaTexto
              etiqueta="Respuesta"
              name="respuesta"
              rows={5}
              required
              defaultValue={editando?.respuesta}
            />
            <ErrorCampo estado={estado} campo="respuesta" />
          </div>

          <Casilla
            name="visible"
            defaultChecked={editando?.visible ?? true}
            etiqueta="Visible en la web"
          />

          <BotonEnviar medida="md">
            {editando ? "Guardar pregunta" : "Crear pregunta"}
          </BotonEnviar>
        </form>
      ) : null}

      <ul className="divide-y divide-petroleo-700/8">
        {orden.map((p, i) => (
          <li key={p.id} className="flex gap-4 px-6 py-4">
            <div className="flex flex-col pt-1">
              <button
                type="button"
                onClick={() => mover(i, -1)}
                disabled={i === 0}
                aria-label="Subir"
                className="grid h-5 w-5 place-items-center rounded text-grafito hover:bg-crema-100 disabled:opacity-30"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => mover(i, 1)}
                disabled={i === orden.length - 1}
                aria-label="Bajar"
                className="grid h-5 w-5 place-items-center rounded text-grafito hover:bg-crema-100 disabled:opacity-30"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-petroleo-900">{p.pregunta}</h3>
                <Pastilla tono="contorno">
                  {CATEGORIAS.find((c) => c.id === p.categoria)?.nombre ?? p.categoria}
                </Pastilla>
                {!p.visible ? <Pastilla tono="crema">Oculta</Pastilla> : null}
              </div>
              <p className="mt-1.5 line-clamp-2 text-sm text-grafito">{p.respuesta}</p>
            </div>

            <div className="flex shrink-0 items-start gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setCreando(false);
                  setEditando(p);
                }}
                className="text-xs font-semibold text-naranja-600 hover:underline"
              >
                Editar
              </button>
              <BotonAccion
                etiqueta="Eliminar pregunta"
                confirmar={`¿Eliminar «${p.pregunta}»?`}
                accion={() => eliminarPregunta(p.id)}
                className="grid h-7 w-7 place-items-center rounded-lg text-grafito transition-colors hover:bg-coral-100 hover:text-coral-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </BotonAccion>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
