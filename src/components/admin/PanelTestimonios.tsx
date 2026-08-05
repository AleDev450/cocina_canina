"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { Testimonio } from "@/lib/tipos";
import {
  alternarTestimonio,
  eliminarTestimonio,
  guardarTestimonio,
} from "@/server/acciones/contenido";
import { AreaTexto, Campo, Casilla, Select } from "@/components/ui/Campos";
import {
  Aviso,
  BotonEnviar,
  ErrorCampo,
  ESTADO_INICIAL,
} from "@/components/ui/Formulario";
import { Panel, Tabla } from "@/components/admin/Piezas";
import { BotonAccion, Interruptor } from "@/components/admin/Controles";
import { Boton } from "@/components/ui/Boton";
import { AvatarMascota, Estrellas } from "@/components/ui/Elementos";
import { SubirImagen } from "@/components/admin/SubirImagen";

type Fila = Testimonio & { publicado: boolean };

export function PanelTestimonios({ testimonios }: { testimonios: Fila[] }) {
  const [estado, accion] = useActionState(guardarTestimonio, ESTADO_INICIAL);
  const [editando, setEditando] = useState<Fila | null>(null);
  const [creando, setCreando] = useState(false);

  const abierto = creando || editando !== null;

  return (
    <Panel
      titulo={`${testimonios.length} testimonios`}
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
            Nuevo testimonio
          </Boton>
        ) : null
      }
    >
      {abierto ? (
        <form
          action={accion}
          key={editando?.id ?? "nuevo"}
          className="space-y-5 border-b border-petroleo-700/10 bg-crema-50 p-6"
        >
          {editando ? <input type="hidden" name="id" value={editando.id} /> : null}

          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-petroleo-900">
              {editando ? `Editar testimonio de ${editando.mascota}` : "Nuevo testimonio"}
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
                etiqueta="Nombre de la mascota"
                name="mascota"
                required
                defaultValue={editando?.mascota}
              />
              <ErrorCampo estado={estado} campo="mascota" />
            </div>
            <div>
              <Campo
                etiqueta="Nombre del dueño"
                name="dueno"
                required
                defaultValue={editando?.dueno}
              />
              <ErrorCampo estado={estado} campo="dueno" />
            </div>
            <Campo
              etiqueta="Producto comprado"
              name="producto"
              defaultValue={editando?.producto}
            />
            <Select
              etiqueta="Calificación"
              name="calificacion"
              defaultValue={String(editando?.calificacion ?? 5)}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "estrella" : "estrellas"}
                </option>
              ))}
            </Select>
            <div className="sm:col-span-2">
              <AreaTexto
                etiqueta="Comentario"
                name="comentario"
                rows={4}
                required
                defaultValue={editando?.comentario}
              />
              <ErrorCampo estado={estado} campo="comentario" />
            </div>
            <div className="sm:col-span-2">
              <SubirImagen
                nombre="foto"
                etiqueta="Foto de la mascota"
                carpeta="testimonios"
                valorInicial={editando?.foto ?? ""}
                ayuda="Si no hay foto se muestra la inicial sobre color de marca"
              />
            </div>
          </div>

          <Casilla
            name="publicado"
            defaultChecked={editando?.publicado ?? false}
            etiqueta="Publicado en la web"
          />

          <BotonEnviar medida="md">
            {editando ? "Guardar testimonio" : "Crear testimonio"}
          </BotonEnviar>
        </form>
      ) : null}

      {testimonios.length === 0 ? (
        <p className="p-8 text-center text-sm text-grafito">
          Todavía no hay testimonios cargados.
        </p>
      ) : (
        <Tabla
          columnas={[
            "Mascota",
            "Dueño",
            "Producto",
            "Calificación",
            "Comentario",
            "Publicado",
            "",
          ]}
        >
          {testimonios.map((t) => (
            <tr key={t.id} className="transition-colors hover:bg-crema-50">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <AvatarMascota
                    nombre={t.mascota}
                    foto={t.foto || undefined}
                    className="h-10 w-10"
                  />
                  <div>
                    <span className="block font-semibold text-petroleo-900">
                      {t.mascota}
                    </span>
                    {!t.foto ? (
                      <span className="text-[0.68rem] text-ambar-500">Falta foto</span>
                    ) : null}
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 text-grafito">{t.dueno}</td>
              <td className="px-5 py-3 text-grafito">{t.producto || "—"}</td>
              <td className="px-5 py-3">
                <Estrellas valor={t.calificacion} />
              </td>
              <td className="max-w-sm px-5 py-3">
                <p className="line-clamp-2 text-xs text-grafito">{t.comentario}</p>
              </td>
              <td className="px-5 py-3">
                <Interruptor
                  activo={t.publicado}
                  etiqueta={`Publicar u ocultar el testimonio de ${t.mascota}`}
                  alCambiar={(valor) => alternarTestimonio(t.id, valor)}
                  tamano="sm"
                />
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCreando(false);
                      setEditando(t);
                    }}
                    className="text-xs font-semibold text-naranja-600 hover:underline"
                  >
                    Editar
                  </button>
                  <BotonAccion
                    etiqueta={`Eliminar testimonio de ${t.mascota}`}
                    confirmar={`¿Eliminar el testimonio de ${t.mascota}?`}
                    accion={() => eliminarTestimonio(t.id)}
                    className="grid h-7 w-7 place-items-center rounded-lg text-grafito transition-colors hover:bg-coral-100 hover:text-coral-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </BotonAccion>
                </div>
              </td>
            </tr>
          ))}
        </Tabla>
      )}
    </Panel>
  );
}
