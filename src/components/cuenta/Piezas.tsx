"use client";

import { Check, RotateCcw, Truck } from "lucide-react";
import type { EstadoPedido } from "@/lib/tipos";
import type { PedidoAdmin } from "@/server/pedidos";
import { flujoEstados, nombreEstadoPedido } from "@/data/cuenta";

import { useTienda } from "@/context/Tienda";
import { cx, fechaLarga, precio } from "@/lib/formato";
import { Boton } from "@/components/ui/Boton";
import { Pastilla, type Tono } from "@/components/ui/Elementos";

const TONO_ESTADO: Record<EstadoPedido, Tono> = {
  pendiente: "suaveAmbar",
  confirmado: "suavePetroleo",
  preparando: "suaveAmbar",
  listo: "suavePetroleo",
  "en-camino": "suaveNaranja",
  entregado: "suaveHoja",
  cancelado: "suaveCoral",
};

export function EtiquetaEstado({ estado }: { estado: EstadoPedido }) {
  return <Pastilla tono={TONO_ESTADO[estado]}>{nombreEstadoPedido[estado]}</Pastilla>;
}

/** Línea de tiempo del pedido. */
export function Seguimiento({ estado }: { estado: EstadoPedido }) {
  if (estado === "cancelado") {
    return (
      <p className="rounded-2xl bg-coral-100 px-4 py-3 text-sm text-coral-500">
        Este pedido fue cancelado. Si crees que es un error, escríbenos por WhatsApp.
      </p>
    );
  }

  const actual = flujoEstados.indexOf(estado as (typeof flujoEstados)[number]);

  return (
    <ol className="flex items-center">
      {flujoEstados.map((e, i) => {
        const hecho = i <= actual;
        return (
          <li key={e} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cx(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.65rem] transition-colors",
                  hecho ? "bg-hoja-500 text-white" : "bg-crema-200 text-grafito",
                )}
              >
                {hecho ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cx(
                  "hidden whitespace-nowrap text-[0.62rem] font-semibold uppercase tracking-wide sm:block",
                  i === actual ? "text-petroleo-900" : "text-grafito",
                )}
              >
                {nombreEstadoPedido[e]}
              </span>
            </div>
            {i < flujoEstados.length - 1 ? (
              <span
                className={cx(
                  "mx-1 h-0.5 flex-1 self-start rounded-full",
                  i < actual ? "bg-hoja-500" : "bg-crema-200",
                )}
                style={{ marginTop: "0.85rem" }}
                aria-hidden="true"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function TarjetaPedido({ pedido }: { pedido: PedidoAdmin }) {
  const { agregar, abrirCarrito } = useTienda();

  const repetir = () => {
    pedido.lineas.forEach((l) => {
      const linea = l as typeof l & { slug?: string; imagen?: string };
      agregar({
        id: `${linea.slug || l.nombre}:${l.presentacion}`,
        slug: linea.slug ?? "",
        nombre: l.nombre,
        presentacion: l.presentacion,
        precio: l.precio,
        cantidad: l.cantidad,
        imagen: linea.imagen ?? "/productos/barf.png",
        tipo: l.nombre.startsWith("BARF") ? "barf" : "snack",
      });
    });
    abrirCarrito();
  };

  return (
    <article className="rounded-3xl border border-petroleo-700/10 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-display text-lg font-semibold text-petroleo-900">
              {pedido.numero}
            </h3>
            <EtiquetaEstado estado={pedido.estado} />
          </div>
          <p className="mt-1 text-xs text-grafito">
            {fechaLarga(pedido.fecha)} · {pedido.entrega === "delivery" ? "Delivery" : "Recojo"} ·{" "}
            {pedido.pago}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-semibold text-petroleo-900">
            {precio(pedido.total)}
          </p>
          <p className="text-xs text-naranja-600">+{pedido.puntos} puntos</p>
        </div>
      </div>

      <ul className="mt-5 space-y-1.5 border-y border-petroleo-700/10 py-4 text-sm">
        {pedido.lineas.map((l) => (
          <li key={`${l.nombre}-${l.presentacion}`} className="flex justify-between gap-3">
            <span className="min-w-0 text-grafito">
              {l.cantidad} × {l.nombre}{" "}
              <span className="text-xs">({l.presentacion})</span>
            </span>
            <span className="shrink-0 font-medium tabular-nums">
              {precio(l.precio * l.cantidad)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <Seguimiento estado={pedido.estado} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5">
        <Boton variante="contorno" medida="sm" onClick={repetir}>
          <RotateCcw className="h-3.5 w-3.5" />
          Repetir pedido
        </Boton>
        {pedido.estado === "en-camino" ? (
          <Boton variante="primario" medida="sm">
            <Truck className="h-3.5 w-3.5" />
            Seguir mi pedido
          </Boton>
        ) : null}
      </div>
    </article>
  );
}
