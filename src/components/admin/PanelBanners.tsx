"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { Banner } from "@/server/contenido";
import {
  alternarBanner,
  eliminarBanner,
  guardarBanner,
} from "@/server/acciones/contenido";
import { AreaTexto, Campo, Casilla } from "@/components/ui/Campos";
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

export function PanelBanners({ banners }: { banners: Banner[] }) {
  const [estado, accion] = useActionState(guardarBanner, ESTADO_INICIAL);
  const [editando, setEditando] = useState<Banner | null>(null);
  const [creando, setCreando] = useState(false);

  const abierto = creando || editando !== null;

  return (
    <>
      {abierto ? (
        <Panel
          titulo={editando ? `Editar «${editando.nombre}»` : "Nuevo banner"}
          className="mb-6"
          acciones={
            <button
              type="button"
              onClick={() => {
                setEditando(null);
                setCreando(false);
              }}
              aria-label="Cancelar"
              className="grid h-8 w-8 place-items-center rounded-full text-grafito hover:bg-crema-100"
            >
              <X className="h-4 w-4" />
            </button>
          }
        >
          <form action={accion} key={editando?.id ?? "nuevo"} className="space-y-5 p-6">
            {editando ? <input type="hidden" name="id" value={editando.id} /> : null}

            <Aviso estado={estado} />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Campo
                  etiqueta="Nombre interno"
                  name="nombre"
                  required
                  defaultValue={editando?.nombre}
                  placeholder="Campaña Fiestas Patrias"
                />
                <ErrorCampo estado={estado} campo="nombre" />
              </div>
              <div>
                <Campo
                  etiqueta="Ubicación"
                  name="ubicacion"
                  required
                  defaultValue={editando?.ubicacion}
                  placeholder="Inicio · barra superior"
                />
                <ErrorCampo estado={estado} campo="ubicacion" />
              </div>
              <Campo
                etiqueta="Título"
                name="titulo"
                contenedor="sm:col-span-2"
                defaultValue={editando?.titulo}
              />
              <AreaTexto
                etiqueta="Texto"
                name="texto"
                rows={2}
                contenedor="sm:col-span-2"
                defaultValue={editando?.texto}
              />
              <Campo etiqueta="Texto del botón" name="boton" defaultValue={editando?.boton} />
              <Campo
                etiqueta="Enlace"
                name="enlace"
                defaultValue={editando?.enlace}
                placeholder="/productos"
              />
              <Campo
                etiqueta="Desde"
                name="desde"
                type="date"
                defaultValue={editando?.desde ?? ""}
              />
              <Campo
                etiqueta="Hasta"
                name="hasta"
                type="date"
                defaultValue={editando?.hasta ?? ""}
              />
              <div className="sm:col-span-2">
                <SubirImagen
                  nombre="imagen"
                  etiqueta="Imagen del banner"
                  carpeta="banners"
                  valorInicial={editando?.imagen ?? ""}
                />
              </div>
            </div>

            <Casilla
              name="activo"
              defaultChecked={editando?.activo ?? true}
              etiqueta="Activo"
            />

            <BotonEnviar medida="md">
              {editando ? "Guardar banner" : "Crear banner"}
            </BotonEnviar>
          </form>
        </Panel>
      ) : (
        <div className="mb-6 flex justify-end">
          <Boton variante="primario" medida="sm" onClick={() => setCreando(true)}>
            <Plus className="h-3.5 w-3.5" />
            Nuevo banner
          </Boton>
        </div>
      )}

      {banners.length === 0 ? (
        <Panel>
          <p className="p-8 text-center text-sm text-grafito">
            Todavía no hay banners configurados.
          </p>
        </Panel>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {banners.map((b) => (
            <Panel key={b.id}>
              <div className="relative h-40 bg-petroleo-800 patron-huellas-claro">
                {b.imagen ? (
                  <Image
                    src={b.imagen}
                    alt=""
                    width={400}
                    height={400}
                    className="absolute right-6 top-1/2 h-32 w-auto -translate-y-1/2 object-contain drop-shadow-[0_16px_18px_rgba(2,34,38,0.4)]"
                    unoptimized={b.imagen.startsWith("http")}
                  />
                ) : null}
                <div className="absolute inset-y-0 left-0 flex w-1/2 flex-col justify-center gap-2 p-6">
                  <p className="font-display text-lg font-semibold leading-tight text-white">
                    {b.titulo}
                  </p>
                  {b.boton ? (
                    <span className="w-fit rounded-full bg-naranja-500 px-3 py-1 text-[0.68rem] font-bold text-white">
                      {b.boton}
                    </span>
                  ) : null}
                </div>
                <span className="absolute left-4 top-4">
                  <Pastilla tono={b.activo ? "hoja" : "crema"}>
                    {b.activo ? "Activo" : "Inactivo"}
                  </Pastilla>
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 p-5">
                <div className="min-w-0">
                  <h3 className="font-semibold text-petroleo-900">{b.nombre}</h3>
                  <p className="text-xs text-grafito">{b.ubicacion}</p>
                  {b.desde || b.hasta ? (
                    <p className="mt-1 text-xs text-grafito">
                      Vigencia: {b.desde ?? "—"} → {b.hasta ?? "—"}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Interruptor
                    activo={b.activo}
                    etiqueta={`Activar o desactivar ${b.nombre}`}
                    alCambiar={(valor) => alternarBanner(b.id, valor)}
                    tamano="sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCreando(false);
                      setEditando(b);
                    }}
                    className="text-xs font-semibold text-naranja-600 hover:underline"
                  >
                    Editar
                  </button>
                  <BotonAccion
                    etiqueta={`Eliminar ${b.nombre}`}
                    confirmar={`¿Eliminar el banner «${b.nombre}»?`}
                    accion={() => eliminarBanner(b.id)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-grafito transition-colors hover:bg-coral-100 hover:text-coral-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </BotonAccion>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}
