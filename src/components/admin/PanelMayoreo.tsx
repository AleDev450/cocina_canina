"use client";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import type { LoteMayor } from "@/lib/tipos";
import type { Cotizacion } from "@/server/pedidos";
import { guardarLoteMayor } from "@/server/acciones/catalogo";
import { cambiarEstadoCotizacion } from "@/server/acciones/pedidos";
import { fechaCorta, precio } from "@/lib/formato";
import { AreaTexto, Campo, Casilla } from "@/components/ui/Campos";
import {
  Aviso,
  BotonEnviar,
  ErrorCampo,
  ESTADO_INICIAL,
} from "@/components/ui/Formulario";
import { Panel, Tabla } from "@/components/admin/Piezas";
import { SelectAccion } from "@/components/admin/Controles";
import { Boton } from "@/components/ui/Boton";
import { Pastilla, type Tono } from "@/components/ui/Elementos";

type Lote = LoteMayor & { id: string; activo: boolean };

const ESTADOS = [
  { id: "pendiente", nombre: "Pendiente" },
  { id: "cotizado", nombre: "Cotizado" },
  { id: "aprobado", nombre: "Aprobado" },
  { id: "rechazado", nombre: "Rechazado" },
];

const TONO: Record<string, Tono> = {
  pendiente: "suaveAmbar",
  cotizado: "suavePetroleo",
  aprobado: "suaveHoja",
  rechazado: "suaveCoral",
};

export function PanelMayoreo({
  cotizaciones,
  lotes,
}: {
  cotizaciones: Cotizacion[];
  lotes: Lote[];
}) {
  const [estado, accion] = useActionState(guardarLoteMayor, ESTADO_INICIAL);
  const [editando, setEditando] = useState<Lote | null>(null);
  const [creando, setCreando] = useState(false);

  const abierto = creando || editando !== null;

  return (
    <>
      <Panel titulo="Solicitudes de cotización" className="mb-6">
        {cotizaciones.length === 0 ? (
          <p className="p-8 text-center text-sm text-grafito">
            No hay solicitudes todavía. Llegan del formulario de la página «Compra por
            mayor».
          </p>
        ) : (
          <Tabla
            columnas={[
              "N.º",
              "Negocio",
              "Contacto",
              "Productos",
              "Cantidad",
              "Fecha requerida",
              "Estado",
            ]}
          >
            {cotizaciones.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-crema-50">
                <td className="px-5 py-3.5 font-semibold text-petroleo-900">
                  {c.codigo}
                </td>
                <td className="px-5 py-3.5">
                  <span className="block text-petroleo-900">{c.negocio}</span>
                  <span className="block text-xs text-grafito">
                    {c.tipoNegocio}
                    {c.ruc ? ` · RUC ${c.ruc}` : ""}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs text-grafito">
                  <span className="block">{c.correo}</span>
                  <span className="block">{c.telefono}</span>
                </td>
                <td className="max-w-xs px-5 py-3.5 text-grafito">{c.productos}</td>
                <td className="px-5 py-3.5 text-grafito">{c.cantidad}</td>
                <td className="px-5 py-3.5 text-grafito">
                  {fechaCorta(c.fechaRequerida)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <Pastilla tono={TONO[c.estado] ?? "crema"}>{c.estado}</Pastilla>
                    <SelectAccion
                      valor={c.estado}
                      opciones={ESTADOS}
                      etiqueta={`Estado de ${c.codigo}`}
                      alCambiar={(valor) => cambiarEstadoCotizacion(c.id, valor)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </Tabla>
        )}
      </Panel>

      <Panel
        titulo="Lista de precios por mayor"
        descripcion="Lo que se muestra en la página pública"
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
              Nuevo lote
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
                {editando ? `Editar «${editando.nombre}»` : "Nuevo lote"}
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
                  placeholder="Orejas de cerdo"
                />
                <ErrorCampo estado={estado} campo="nombre" />
              </div>
              <Campo
                etiqueta="Slug"
                name="slug"
                opcional
                defaultValue={editando?.slug}
              />
              <Campo
                etiqueta="Unidad"
                name="unidad"
                required
                defaultValue={editando?.unidad}
                placeholder="docenas"
              />
              <Campo
                etiqueta="Cantidad mínima"
                name="minimo"
                required
                defaultValue={editando?.minimo}
                placeholder="1 docena"
              />
              <Campo
                etiqueta="Productos incluidos"
                name="productos"
                contenedor="sm:col-span-2"
                defaultValue={editando?.productos.join(", ")}
                placeholder="Bofe de res, Corazón de cerdo"
                ayuda="Separados por comas"
              />
              <Campo
                etiqueta="Imagen"
                name="imagen"
                contenedor="sm:col-span-2"
                defaultValue={editando?.imagen}
                placeholder="/empaques/orejas-bolsa.png"
              />
              <div className="sm:col-span-2">
                <AreaTexto
                  etiqueta="Presentaciones y precios"
                  name="precios"
                  rows={4}
                  required
                  defaultValue={editando?.presentaciones
                    .map((p) => `${p.etiqueta}:${p.precio}`)
                    .join("\n")}
                  placeholder={"1 docena:57.50\n5 docenas:285\n10 docenas:560"}
                  ayuda="Una por línea, con el formato etiqueta:precio"
                />
                <ErrorCampo estado={estado} campo="precios" />
              </div>
              <AreaTexto
                etiqueta="Nota"
                name="nota"
                rows={2}
                contenedor="sm:col-span-2"
                defaultValue={editando?.nota ?? ""}
              />
            </div>

            <Casilla
              name="activo"
              defaultChecked={editando?.activo ?? true}
              etiqueta="Visible en la página de compra por mayor"
            />

            <BotonEnviar medida="md">
              {editando ? "Guardar lote" : "Crear lote"}
            </BotonEnviar>
          </form>
        ) : null}

        <Tabla columnas={["Lote", "Unidad", "Mínimo", "Presentaciones", ""]}>
          {lotes.map((l) => (
            <tr key={l.id} className="transition-colors hover:bg-crema-50">
              <td className="px-5 py-3.5 font-semibold text-petroleo-900">{l.nombre}</td>
              <td className="px-5 py-3.5 text-grafito">{l.unidad}</td>
              <td className="px-5 py-3.5 text-grafito">{l.minimo}</td>
              <td className="px-5 py-3.5">
                <div className="flex flex-wrap gap-1.5">
                  {l.presentaciones.map((p) => (
                    <Pastilla key={p.etiqueta} tono="contorno">
                      {p.etiqueta}: {precio(p.precio)}
                    </Pastilla>
                  ))}
                </div>
              </td>
              <td className="px-5 py-3.5 text-right">
                <button
                  type="button"
                  onClick={() => {
                    setCreando(false);
                    setEditando(l);
                  }}
                  className="text-xs font-semibold text-naranja-600 hover:underline"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </Tabla>
      </Panel>
    </>
  );
}
