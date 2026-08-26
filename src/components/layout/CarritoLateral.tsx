"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Sparkles, Tag, Trash2, X } from "lucide-react";
import { useTienda } from "@/context/Tienda";
import { cx, precio } from "@/lib/formato";

import { enlacePedido } from "@/lib/whatsapp";
import { Boton, clasesBoton } from "@/components/ui/Boton";
import { EstadoVacio } from "@/components/ui/Elementos";

export function CarritoLateral() {
  const {
    carrito,
    carritoAbierto,
    cerrarCarrito,
    cambiarCantidad,
    quitar,
    subtotal,
    puntosDelCarrito,
    cupon,
    aplicarCupon,
    quitarCupon,
    descuento,
    sesion,
  } = useTienda();

  const [codigo, setCodigo] = useState("");
  const [aviso, setAviso] = useState<{ ok: boolean; mensaje: string } | null>(null);
  const [validando, setValidando] = useState(false);

  const enviarCupon = async () => {
    setValidando(true);
    const resultado = await aplicarCupon(codigo);
    setAviso(resultado);
    if (resultado.ok) setCodigo("");
    setValidando(false);
  };

  return (
    <div
      className={cx(
        "fixed inset-0 z-[80]",
        carritoAbierto ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!carritoAbierto}
    >
      <button
        type="button"
        tabIndex={carritoAbierto ? 0 : -1}
        aria-label="Cerrar carrito"
        onClick={cerrarCarrito}
        className={cx(
          "absolute inset-0 bg-petroleo-950/45 backdrop-blur-sm transition-opacity duration-300",
          carritoAbierto ? "opacity-100" : "opacity-0",
        )}
      />

      <aside
        aria-label="Carrito de compras"
        className={cx(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-crema-50 shadow-elevada transition-transform duration-350 ease-out",
          carritoAbierto ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-petroleo-700/10 bg-white px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-petroleo-900">
              Tu pedido
            </h2>
            <p className="text-xs text-grafito">
              {carrito.length === 0
                ? "Todavía no hay productos"
                : `${carrito.length} ${carrito.length === 1 ? "producto" : "productos"}`}
            </p>
          </div>
          <button
            type="button"
            onClick={cerrarCarrito}
            aria-label="Cerrar"
            className="grid h-10 w-10 place-items-center rounded-full text-petroleo-700 transition-colors hover:bg-crema-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido */}
        {carrito.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-6">
            <EstadoVacio
              imagen={{
                src: "/images/dante/plato_vacio.png",
                ancho: 1106,
                alto: 1073,
              }}
              titulo="El plato está vacío"
              texto="Tu carrito espera. Elige un snack y empecemos a preparar el pedido para tu peludo."
              accion={
                <Boton href="/productos" variante="primario" medida="md">
                  Ver productos
                </Boton>
              }
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-3">
                {carrito.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-3 rounded-2xl border border-petroleo-700/10 bg-white p-3"
                  >
                    <Link
                      href={
                        item.tipo === "barf" ? "/barf" : `/productos/${item.slug}`
                      }
                      onClick={cerrarCarrito}
                      className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-crema-50"
                    >
                      <Image
                        src={item.imagen}
                        alt={item.nombre}
                        width={140}
                        height={140}
                        className="h-16 w-16 object-contain"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-petroleo-900">
                            {item.nombre}
                          </h3>
                          <p className="text-xs text-grafito">{item.presentacion}</p>
                          {item.frecuencia && item.frecuencia !== "unica" ? (
                            <p className="mt-0.5 text-[0.68rem] font-semibold uppercase tracking-wide text-naranja-600">
                              Entrega {item.frecuencia}
                            </p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => quitar(item.id)}
                          aria-label={`Quitar ${item.nombre}`}
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-grafito transition-colors hover:bg-coral-100 hover:text-coral-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                        <div className="flex items-center gap-1 rounded-full border border-petroleo-700/15 p-0.5">
                          <button
                            type="button"
                            onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                            aria-label="Quitar uno"
                            className="grid h-7 w-7 place-items-center rounded-full text-petroleo-700 transition-colors hover:bg-crema-100"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold tabular-nums">
                            {item.cantidad}
                          </span>
                          <button
                            type="button"
                            onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                            aria-label="Agregar uno"
                            className="grid h-7 w-7 place-items-center rounded-full text-petroleo-700 transition-colors hover:bg-crema-100"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="font-display text-base font-semibold text-petroleo-900">
                          {precio(item.precio * item.cantidad)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Cupón */}
              <div className="mt-5 rounded-2xl border border-dashed border-petroleo-700/25 bg-white p-4">
                {cupon ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="h-4 w-4 text-hoja-500" />
                      <span className="font-semibold text-petroleo-900">
                        {cupon.codigo}
                      </span>
                      <span className="text-xs text-grafito">{cupon.descripcion}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        quitarCupon();
                        setAviso(null);
                      }}
                      className="text-xs font-semibold text-coral-500 hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <>
                    <label
                      htmlFor="cupon-carrito"
                      className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800"
                    >
                      ¿Tienes un cupón?
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="cupon-carrito"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        placeholder="CLUB10"
                        className="h-10 min-w-0 flex-1 rounded-full border border-petroleo-700/15 bg-crema-50 px-4 text-sm uppercase placeholder:normal-case placeholder:text-grafito/50 focus:border-naranja-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={enviarCupon}
                        disabled={validando}
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
            </div>

            {/* Resumen */}
            <div className="space-y-4 border-t border-petroleo-700/10 bg-white px-5 py-5">
              <div className="flex items-center gap-2.5 rounded-2xl bg-naranja-50 px-4 py-3">
                <Sparkles className="h-4 w-4 shrink-0 text-naranja-500" />
                <p className="text-xs text-naranja-800">
                  Ganarás{" "}
                  <strong className="font-bold">{puntosDelCarrito} puntos</strong> con
                  esta compra · se acreditan al entregarse
                </p>
              </div>

              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between text-grafito">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-tinta">{precio(subtotal)}</dd>
                </div>
                {descuento > 0 ? (
                  <div className="flex justify-between text-hoja-600">
                    <dt>Descuento</dt>
                    <dd className="font-medium">−{precio(descuento)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between text-grafito">
                  <dt>Envío</dt>
                  <dd className="text-xs">Se calcula al finalizar</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-petroleo-700/10 pt-2.5">
                  <dt className="font-display text-base font-semibold text-petroleo-900">
                    Total
                  </dt>
                  <dd className="font-display text-2xl font-semibold text-petroleo-900">
                    {precio(subtotal - descuento)}
                  </dd>
                </div>
              </dl>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={cerrarCarrito}
                  className={clasesBoton("primario", "lg", "w-full")}
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
                  className={clasesBoton("whatsapp", "md", "w-full")}
                >
                  Enviar pedido por WhatsApp
                </a>
                <button
                  type="button"
                  onClick={cerrarCarrito}
                  className="w-full pt-1 text-xs font-semibold text-grafito transition-colors hover:text-naranja-600"
                >
                  Seguir comprando
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
