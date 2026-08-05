"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Sparkles, Tag, Trash2 } from "lucide-react";
import { useTienda } from "@/context/Tienda";

import { enlacePedido } from "@/lib/whatsapp";
import { cx, precio } from "@/lib/formato";
import { Boton, clasesBoton } from "@/components/ui/Boton";
import { EstadoVacio } from "@/components/ui/Elementos";

export function PaginaCarrito() {
  const {
    carrito,
    cambiarCantidad,
    quitar,
    vaciar,
    subtotal,
    puntosDelCarrito,
    cupon,
    aplicarCupon,
    quitarCupon,
    descuento,
    sesion,
    hidratado,
  } = useTienda();

  const [codigo, setCodigo] = useState("");
  const [aviso, setAviso] = useState<{ ok: boolean; mensaje: string } | null>(null);
  const [validando, setValidando] = useState(false);

  if (!hidratado) {
    return <div className="contenedor py-24" aria-busy="true" />;
  }

  if (carrito.length === 0) {
    return (
      <div className="contenedor py-16">
        <div className="rounded-blob border border-petroleo-700/10 bg-white">
          <EstadoVacio
            pose="sentado"
            titulo="Todavía no hay nada en el carrito"
            texto="Elige los snacks favoritos de tu peludo y aparecerán aquí, listos para el pedido."
            accion={
              <div className="flex flex-wrap justify-center gap-3">
                <Boton href="/productos" variante="primario" medida="md">
                  Ver productos
                </Boton>
                <Boton href="/barf" variante="contorno" medida="md">
                  Conocer BARF
                </Boton>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="contenedor grid gap-8 py-14 lg:grid-cols-[1fr_22rem] lg:items-start">
      {/* Productos */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-petroleo-900">
            {carrito.length} {carrito.length === 1 ? "producto" : "productos"}
          </h2>
          <button
            type="button"
            onClick={vaciar}
            className="text-xs font-semibold text-grafito transition-colors hover:text-coral-500"
          >
            Vaciar carrito
          </button>
        </div>

        <ul className="space-y-3">
          {carrito.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-4 rounded-3xl border border-petroleo-700/10 bg-white p-4 sm:flex-row sm:items-center"
            >
              <Link
                href={item.tipo === "barf" ? "/barf" : `/productos/${item.slug}`}
                className="grid h-24 w-24 shrink-0 place-items-center self-start rounded-2xl bg-crema-50 sm:self-center"
              >
                <Image
                  src={item.imagen}
                  alt={item.nombre}
                  width={180}
                  height={180}
                  className="h-20 w-20 object-contain"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg font-semibold text-petroleo-900">
                  <Link
                    href={item.tipo === "barf" ? "/barf" : `/productos/${item.slug}`}
                    className="transition-colors hover:text-naranja-600"
                  >
                    {item.nombre}
                  </Link>
                </h3>
                <p className="text-sm text-grafito">{item.presentacion}</p>
                {item.frecuencia && item.frecuencia !== "unica" ? (
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-naranja-600">
                    Entrega {item.frecuencia}
                  </p>
                ) : null}
                <p className="mt-1 text-xs text-grafito">
                  {precio(item.precio)} c/u
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-3">
                <div className="flex items-center gap-1 rounded-full border border-petroleo-700/15 p-0.5">
                  <button
                    type="button"
                    onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                    aria-label="Quitar uno"
                    className="grid h-8 w-8 place-items-center rounded-full text-petroleo-700 transition-colors hover:bg-crema-100"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-7 text-center text-sm font-semibold tabular-nums">
                    {item.cantidad}
                  </span>
                  <button
                    type="button"
                    onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                    aria-label="Agregar uno"
                    className="grid h-8 w-8 place-items-center rounded-full text-petroleo-700 transition-colors hover:bg-crema-100"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-display text-lg font-semibold text-petroleo-900">
                    {precio(item.precio * item.cantidad)}
                  </span>
                  <button
                    type="button"
                    onClick={() => quitar(item.id)}
                    aria-label={`Quitar ${item.nombre}`}
                    className="grid h-8 w-8 place-items-center rounded-full text-grafito transition-colors hover:bg-coral-100 hover:text-coral-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/productos"
          className="mt-6 inline-flex text-sm font-semibold text-naranja-600 transition-colors hover:text-naranja-700"
        >
          ← Seguir comprando
        </Link>
      </div>

      {/* Resumen */}
      <aside className="lg:sticky lg:top-28">
        <div className="rounded-3xl border border-petroleo-700/10 bg-white p-6">
          <h2 className="font-display text-xl font-semibold text-petroleo-900">
            Resumen del pedido
          </h2>

          {/* Cupón */}
          <div className="mt-5 rounded-2xl border border-dashed border-petroleo-700/25 p-4">
            {cupon ? (
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 shrink-0 text-hoja-500" />
                  <span className="truncate font-semibold text-petroleo-900">
                    {cupon.codigo}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    quitarCupon();
                    setAviso(null);
                  }}
                  className="shrink-0 text-xs font-semibold text-coral-500 hover:underline"
                >
                  Quitar
                </button>
              </div>
            ) : (
              <>
                <label
                  htmlFor="cupon-pagina"
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800"
                >
                  Cupón de descuento
                </label>
                <div className="flex gap-2">
                  <input
                    id="cupon-pagina"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="CLUB10"
                    className="h-10 min-w-0 flex-1 rounded-full border border-petroleo-700/15 bg-crema-50 px-4 text-sm uppercase placeholder:normal-case placeholder:text-grafito/50 focus:border-naranja-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={validando}
                    onClick={async () => {
                      setValidando(true);
                      const r = await aplicarCupon(codigo);
                      setAviso(r);
                      if (r.ok) setCodigo("");
                      setValidando(false);
                    }}
                    className={clasesBoton("petroleo", "sm")}
                  >
                    {validando ? "Validando…" : "Aplicar"}
                  </button>
                </div>
                {aviso ? (
                  <p
                    className={cx(
                      "mt-2 text-xs font-medium",
                      aviso.ok ? "text-hoja-600" : "text-coral-500",
                    )}
                  >
                    {aviso.mensaje}
                  </p>
                ) : null}
              </>
            )}
          </div>

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between text-grafito">
              <dt>Subtotal</dt>
              <dd className="font-medium text-tinta">{precio(subtotal)}</dd>
            </div>
            {descuento > 0 ? (
              <div className="flex justify-between text-hoja-600">
                <dt>Descuento ({cupon?.codigo})</dt>
                <dd className="font-medium">−{precio(descuento)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between text-grafito">
              <dt>Envío</dt>
              <dd className="text-xs">Se calcula al finalizar</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-petroleo-700/10 pt-3">
              <dt className="font-display text-lg font-semibold text-petroleo-900">
                Total
              </dt>
              <dd className="font-display text-2xl font-semibold text-petroleo-900">
                {precio(subtotal - descuento)}
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex items-center gap-2.5 rounded-2xl bg-naranja-50 px-4 py-3">
            <Sparkles className="h-4 w-4 shrink-0 text-naranja-500" />
            <p className="text-xs text-naranja-800">
              Ganarás <strong className="font-bold">{puntosDelCarrito} puntos</strong> ·
              se acreditan al entregarse
            </p>
          </div>

          <Link
            href="/checkout"
            className={clasesBoton("primario", "lg", "mt-5 w-full")}
          >
            Finalizar compra
          </Link>
          <a
            href={enlacePedido({
              cliente: sesion.activa ? sesion.nombre : undefined,
              items: carrito,
              total: subtotal - descuento,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className={clasesBoton("whatsapp", "md", "mt-2.5 w-full")}
          >
            Enviar pedido por WhatsApp
          </a>
        </div>
      </aside>
    </div>
  );
}
