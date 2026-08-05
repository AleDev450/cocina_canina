import type { Metadata } from "next";
import { MessageCircle, Pencil } from "lucide-react";
import { pedidosDemo, nombreEstadoPedido, flujoEstados } from "@/data/cuenta";
import { CabeceraModulo, Panel, Tabla } from "@/components/admin/Piezas";
import { EtiquetaEstado } from "@/components/cuenta/Piezas";
import { Boton } from "@/components/ui/Boton";
import { fechaCorta, precio } from "@/lib/formato";

export const metadata: Metadata = { title: "Pedidos" };

const HISTORIAL = [
  { hora: "28/07 · 09:14", texto: "Pedido creado desde la web", autor: "Sistema" },
  { hora: "28/07 · 09:31", texto: "Pago verificado por Yape", autor: "Andrea (admin)" },
  { hora: "28/07 · 11:02", texto: "Estado cambiado a Preparando", autor: "Cocina" },
  { hora: "28/07 · 15:40", texto: "Estado cambiado a En camino", autor: "Reparto" },
];

export default function AdminPedidos() {
  return (
    <>
      <CabeceraModulo
        titulo="Pedidos"
        texto="Gestiona el estado de cada pedido y comunícate con el cliente."
      />

      {/* Resumen por estado */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {[...flujoEstados, "cancelado" as const].map((estado) => (
          <div
            key={estado}
            className="rounded-2xl border border-petroleo-700/10 bg-white p-4 text-center"
          >
            <p className="font-display text-2xl font-semibold text-petroleo-900">
              {pedidosDemo.filter((p) => p.estado === estado).length}
            </p>
            <p className="mt-0.5 text-[0.66rem] font-semibold uppercase leading-tight tracking-wide text-grafito">
              {nombreEstadoPedido[estado]}
            </p>
          </div>
        ))}
      </div>

      <Panel titulo="Todos los pedidos">
        <Tabla
          columnas={[
            "Pedido",
            "Cliente",
            "Fecha",
            "Entrega",
            "Pago",
            "Productos",
            "Estado",
            "Total",
            "",
          ]}
        >
          {pedidosDemo.map((p) => (
            <tr key={p.numero} className="transition-colors hover:bg-crema-50">
              <td className="px-5 py-3.5 font-semibold text-petroleo-900">{p.numero}</td>
              <td className="px-5 py-3.5 text-grafito">Andrea Salazar</td>
              <td className="px-5 py-3.5 text-grafito">{fechaCorta(p.fecha)}</td>
              <td className="px-5 py-3.5 text-grafito">
                {p.entrega === "delivery" ? "Delivery" : "Recojo"}
              </td>
              <td className="px-5 py-3.5 text-grafito">{p.pago}</td>
              <td className="px-5 py-3.5 tabular-nums text-grafito">
                {p.lineas.reduce((t, l) => t + l.cantidad, 0)}
              </td>
              <td className="px-5 py-3.5">
                <EtiquetaEstado estado={p.estado} />
              </td>
              <td className="px-5 py-3.5 font-semibold tabular-nums text-petroleo-900">
                {precio(p.total)}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    aria-label={`Editar ${p.numero}`}
                    className="grid h-8 w-8 place-items-center rounded-lg text-grafito transition-colors hover:bg-petroleo-100 hover:text-petroleo-800"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Escribir al cliente de ${p.numero}`}
                    className="grid h-8 w-8 place-items-center rounded-lg text-grafito transition-colors hover:bg-hoja-100 hover:text-hoja-600"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Tabla>
      </Panel>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel
          titulo={`Historial de cambios · ${pedidosDemo[0].numero}`}
          descripcion="Cada cambio de estado queda registrado con su autor"
        >
          <ol className="space-y-0 p-6">
            {HISTORIAL.map((h, i) => (
              <li key={h.hora} className="flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-petroleo-100 text-xs font-bold text-petroleo-700">
                    {i + 1}
                  </span>
                  {i < HISTORIAL.length - 1 ? (
                    <span className="mt-1 w-px flex-1 bg-petroleo-700/15" />
                  ) : null}
                </div>
                <div className="pb-1">
                  <p className="text-sm font-semibold text-petroleo-900">{h.texto}</p>
                  <p className="text-xs text-grafito">
                    {h.hora} · {h.autor}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel
          titulo="Mensaje al cliente"
          descripcion="Se envía por WhatsApp al número del pedido"
        >
          <div className="p-6">
            <div className="space-y-2.5">
              {[
                "Tu pedido fue confirmado y ya está en preparación 🐾",
                "Tu pedido salió a reparto, llega hoy entre 3 y 6 p. m.",
                "¡Entregado! Cuéntanos qué le pareció a tu peludo 🧡",
              ].map((m) => (
                <button
                  key={m}
                  type="button"
                  className="w-full rounded-2xl border border-petroleo-700/12 px-4 py-3 text-left text-sm text-petroleo-800 transition-colors hover:border-naranja-500 hover:bg-naranja-50"
                >
                  {m}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="O escribe un mensaje personalizado…"
              className="mt-4 w-full rounded-2xl border border-petroleo-700/12 bg-crema-50 px-4 py-3 text-sm placeholder:text-grafito/60 focus:border-naranja-500 focus:outline-none"
            />

            <Boton variante="primario" medida="md" className="mt-4">
              <MessageCircle className="h-4 w-4" />
              Enviar mensaje
            </Boton>
          </div>
        </Panel>
      </div>
    </>
  );
}
