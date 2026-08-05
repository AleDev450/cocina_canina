"use client";

import { Fragment, useMemo, useState } from "react";
import { ChevronDown, MessageCircle, Search } from "lucide-react";
import type { EstadoPedido } from "@/lib/tipos";
import type { PedidoAdmin } from "@/server/pedidos";
import { cambiarEstadoPedido } from "@/server/acciones/pedidos";
import { nombreEstadoPedido, flujoEstados } from "@/data/cuenta";
import { cx, fechaCorta, normalizar, precio } from "@/lib/formato";
import { enlacePedido } from "@/lib/whatsapp";
import { Panel, Tabla } from "@/components/admin/Piezas";
import { SelectAccion } from "@/components/admin/Controles";
import { EtiquetaEstado } from "@/components/cuenta/Piezas";

const ESTADOS = [...flujoEstados, "cancelado"] as const;

const OPCIONES = ESTADOS.map((e) => ({ id: e, nombre: nombreEstadoPedido[e] }));

export function TablaPedidos({ pedidos }: { pedidos: PedidoAdmin[] }) {
  const [consulta, setConsulta] = useState("");
  const [filtro, setFiltro] = useState<EstadoPedido | "todos">("todos");
  const [abierto, setAbierto] = useState<string | null>(null);

  const lista = useMemo(() => {
    const q = normalizar(consulta.trim());
    return pedidos.filter(
      (p) =>
        (filtro === "todos" || p.estado === filtro) &&
        (q.length < 2 || normalizar(`${p.numero} ${p.cliente} ${p.celular}`).includes(q)),
    );
  }, [pedidos, consulta, filtro]);

  return (
    <Panel titulo="Todos los pedidos">
      <div className="flex flex-wrap items-center gap-3 border-b border-petroleo-700/10 p-5">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-grafito" />
          <input
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            placeholder="Buscar por número, cliente o celular…"
            aria-label="Buscar pedido"
            className="h-10 w-full rounded-full border border-petroleo-700/12 bg-crema-50 pl-11 pr-4 text-sm placeholder:text-grafito/60 focus:border-naranja-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(["todos", ...ESTADOS] as const).map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setFiltro(e)}
              className={cx(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                filtro === e
                  ? "bg-petroleo-700 text-white"
                  : "bg-crema-100 text-grafito hover:text-petroleo-800",
              )}
            >
              {e === "todos" ? "Todos" : nombreEstadoPedido[e]}
            </button>
          ))}
        </div>
      </div>

      {lista.length === 0 ? (
        <p className="p-8 text-center text-sm text-grafito">
          No hay pedidos con ese criterio.
        </p>
      ) : (
        <Tabla
          columnas={[
            "Pedido",
            "Cliente",
            "Fecha",
            "Entrega",
            "Pago",
            "Total",
            "Estado",
            "",
          ]}
        >
          {lista.map((p) => (
            <Fragment key={p.id}>
              <tr className="transition-colors hover:bg-crema-50">
                <td className="px-5 py-3.5 font-semibold text-petroleo-900">
                  {p.numero}
                </td>
                <td className="px-5 py-3.5">
                  <span className="block text-petroleo-900">{p.cliente}</span>
                  <span className="block text-xs text-grafito">{p.celular}</span>
                </td>
                <td className="px-5 py-3.5 text-grafito">{fechaCorta(p.fecha)}</td>
                <td className="px-5 py-3.5 text-grafito">
                  {p.entrega === "delivery" ? "Delivery" : "Recojo"}
                </td>
                <td className="px-5 py-3.5 text-grafito">{p.pago}</td>
                <td className="px-5 py-3.5 font-semibold tabular-nums text-petroleo-900">
                  {precio(p.total)}
                </td>
                <td className="px-5 py-3.5">
                  <SelectAccion
                    valor={p.estado}
                    opciones={OPCIONES}
                    etiqueta={`Estado del pedido ${p.numero}`}
                    alCambiar={(estado) => cambiarEstadoPedido(p.id, estado)}
                  />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <a
                      href={enlacePedido({
                        cliente: p.cliente,
                        items: p.lineas.map((l) => ({
                          id: l.nombre,
                          slug: "",
                          nombre: l.nombre,
                          presentacion: l.presentacion,
                          precio: l.precio,
                          cantidad: l.cantidad,
                          imagen: "",
                          tipo: "snack" as const,
                        })),
                        total: p.total,
                        direccion: p.direccion || undefined,
                        entrega: p.entrega === "delivery" ? "Delivery" : "Recojo",
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Escribir por WhatsApp sobre ${p.numero}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-grafito transition-colors hover:bg-hoja-100 hover:text-hoja-600"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setAbierto(abierto === p.id ? null : p.id)}
                      aria-expanded={abierto === p.id}
                      aria-label={`Ver detalle de ${p.numero}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-grafito transition-colors hover:bg-petroleo-100 hover:text-petroleo-800"
                    >
                      <ChevronDown
                        className={cx(
                          "h-4 w-4 transition-transform",
                          abierto === p.id && "rotate-180",
                        )}
                      />
                    </button>
                  </div>
                </td>
              </tr>

              {abierto === p.id ? (
                <tr className="bg-crema-50">
                  <td colSpan={8} className="px-5 py-5">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-grafito">
                          Productos
                        </h4>
                        <ul className="space-y-1.5 text-sm">
                          {p.lineas.map((l) => (
                            <li
                              key={`${l.nombre}-${l.presentacion}`}
                              className="flex justify-between gap-3"
                            >
                              <span className="text-grafito">
                                {l.cantidad} × {l.nombre}{" "}
                                <span className="text-xs">({l.presentacion})</span>
                              </span>
                              <span className="shrink-0 font-medium tabular-nums">
                                {precio(l.precio * l.cantidad)}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <dl className="mt-3 space-y-1 border-t border-petroleo-700/10 pt-3 text-sm">
                          <div className="flex justify-between text-grafito">
                            <dt>Subtotal</dt>
                            <dd>{precio(p.subtotal)}</dd>
                          </div>
                          {p.descuento > 0 ? (
                            <div className="flex justify-between text-hoja-600">
                              <dt>Descuento</dt>
                              <dd>−{precio(p.descuento)}</dd>
                            </div>
                          ) : null}
                          <div className="flex justify-between text-grafito">
                            <dt>Envío</dt>
                            <dd>{p.envioCosto === 0 ? "Gratis" : precio(p.envioCosto)}</dd>
                          </div>
                        </dl>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wide text-grafito">
                            Entrega
                          </h4>
                          <p className="text-petroleo-900">
                            {p.entrega === "delivery"
                              ? p.direccion || "Sin dirección registrada"
                              : "Recojo en tienda"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wide text-grafito">
                            Puntos generados
                          </h4>
                          <p className="text-petroleo-900">{p.puntos} puntos</p>
                        </div>
                        {p.notas ? (
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wide text-grafito">
                              Notas del cliente
                            </h4>
                            <p className="text-petroleo-900">{p.notas}</p>
                          </div>
                        ) : null}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wide text-grafito">
                            Estado actual
                          </h4>
                          <EtiquetaEstado estado={p.estado} />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : null}
            </Fragment>
          ))}
        </Tabla>
      )}

      <div className="border-t border-petroleo-700/10 px-5 py-3.5 text-xs text-grafito">
        Mostrando {lista.length} de {pedidos.length} pedidos
      </div>
    </Panel>
  );
}
