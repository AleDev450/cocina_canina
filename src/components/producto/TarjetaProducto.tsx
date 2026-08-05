"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Plus } from "lucide-react";
import type { Producto } from "@/lib/tipos";
import { precioDesde } from "@/data/productos";
import { nombreDureza, nombreEtiqueta, obtenerCategoria } from "@/data/categorias";
import { useTienda } from "@/context/Tienda";
import { cx, precio } from "@/lib/formato";
import { Etiqueta, type Tono } from "@/components/ui/Elementos";
import { Huella } from "@/components/ui/Iconos";

const TONO_ETIQUETA: Record<string, Tono> = {
  "mas-vendido": "naranja",
  nuevo: "hoja",
  recomendado: "petroleo",
  "stock-limitado": "coral",
};

const TONO_DUREZA: Record<string, string> = {
  suave: "bg-hoja-100 text-hoja-600",
  media: "bg-ambar-100 text-ambar-500",
  "larga-duracion": "bg-coral-100 text-coral-500",
};

export function TarjetaProducto({
  producto,
  compacta,
}: {
  producto: Producto;
  compacta?: boolean;
}) {
  const { agregar, alternarFavorito, esFavorito, hidratado } = useTienda();
  const [presentacion, setPresentacion] = useState(producto.presentaciones[0]);

  const categoria = obtenerCategoria(producto.categoria);
  const agotado = producto.presentaciones.every((p) => p.stock === 0);
  const pocoStock = !agotado && producto.presentaciones.every((p) => p.stock <= 6);
  const favorito = hidratado && esFavorito(producto.slug);

  return (
    <article
      className={cx(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-petroleo-700/10 bg-white",
        "transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-petroleo-700/20 hover:shadow-tarjeta",
      )}
    >
      {/* Foto */}
      <div className="relative">
        <Link
          href={`/productos/${producto.slug}`}
          className="block aspect-[5/4] overflow-hidden bg-crema-50 patron-huellas"
        >
          <span className="absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_35%,rgba(250,244,234,0)_72%)]" />
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            width={600}
            height={480}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
            className={cx(
              "relative h-full w-full object-contain p-6 drop-shadow-[0_18px_20px_rgba(8,54,59,0.16)]",
              "transition-transform duration-500 ease-out group-hover:scale-[1.07] group-hover:-rotate-2",
              agotado && "opacity-45 saturate-50",
            )}
          />
        </Link>

        {/* Etiquetas */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {agotado ? (
            <Etiqueta tono="petroleo">Agotado</Etiqueta>
          ) : (
            producto.etiquetas.slice(0, 2).map((e) => (
              <Etiqueta key={e} tono={TONO_ETIQUETA[e] ?? "crema"}>
                {nombreEtiqueta[e]}
              </Etiqueta>
            ))
          )}
        </div>

        {/* Favorito */}
        <button
          type="button"
          onClick={() => alternarFavorito(producto.slug)}
          aria-pressed={favorito}
          aria-label={favorito ? "Quitar de favoritos" : "Guardar en favoritos"}
          className={cx(
            "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur-sm transition-all duration-200",
            favorito
              ? "bg-naranja-500 text-white shadow-suave"
              : "bg-white/80 text-petroleo-700 hover:bg-white hover:text-naranja-500",
          )}
        >
          <Heart className={cx("h-4 w-4", favorito && "fill-current")} />
        </button>
      </div>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[0.66rem] font-bold uppercase tracking-[0.12em] text-grafito">
            {categoria?.nombre.replace("Snacks de ", "") ?? producto.categoria}
          </span>
          <span
            className={cx(
              "rounded-full px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wide",
              TONO_DUREZA[producto.dureza],
            )}
          >
            {nombreDureza[producto.dureza]}
          </span>
        </div>

        <h3 className="font-display text-lg leading-tight font-semibold text-petroleo-900">
          <Link
            href={`/productos/${producto.slug}`}
            className="transition-colors after:absolute after:inset-0 after:content-[''] hover:text-naranja-600"
          >
            {producto.nombre}
          </Link>
        </h3>

        <p className="flex items-start gap-1.5 text-sm leading-snug text-grafito">
          <Huella className="mt-0.5 h-3.5 w-3.5 shrink-0 text-naranja-500" />
          {producto.beneficioPrincipal}
        </p>

        {/* Presentaciones */}
        {!compacta ? (
          <div className="relative z-10 mt-auto flex flex-wrap gap-1.5 pt-1">
            {producto.presentaciones.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPresentacion(p)}
                disabled={p.stock === 0}
                className={cx(
                  "rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold transition-all duration-150",
                  p.id === presentacion.id
                    ? "border-petroleo-700 bg-petroleo-700 text-white"
                    : "border-petroleo-700/15 text-grafito hover:border-petroleo-700/40 hover:text-petroleo-800",
                  p.stock === 0 && "cursor-not-allowed line-through opacity-40",
                )}
              >
                {p.etiqueta}
              </button>
            ))}
          </div>
        ) : null}

        {/* Precio + acción */}
        <div className="relative z-10 mt-auto flex items-end justify-between gap-3 border-t border-petroleo-700/10 pt-4">
          <div>
            <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-grafito">
              {compacta ? "Desde" : "Precio"}
            </span>
            <span className="font-display text-xl font-semibold text-petroleo-900">
              {precio(compacta ? precioDesde(producto) : presentacion.precio)}
            </span>
            {pocoStock ? (
              <span className="mt-0.5 block text-[0.68rem] font-semibold text-coral-500">
                Últimas unidades
              </span>
            ) : null}
          </div>

          <button
            type="button"
            disabled={agotado}
            onClick={() =>
              agregar({
                id: `${producto.slug}:${presentacion.id}`,
                slug: producto.slug,
                nombre: producto.nombre,
                presentacion: presentacion.etiqueta,
                precio: presentacion.precio,
                cantidad: 1,
                imagen: producto.imagen,
                tipo: "snack",
              })
            }
            className={cx(
              "grid h-11 w-11 shrink-0 place-items-center rounded-full transition-all duration-200",
              agotado
                ? "cursor-not-allowed bg-crema-200 text-grafito/50"
                : "bg-naranja-500 text-white shadow-suave hover:scale-110 hover:bg-naranja-600 active:scale-95",
            )}
            aria-label={`Agregar ${producto.nombre} al carrito`}
          >
            <Plus className="h-5 w-5" strokeWidth={2.6} />
          </button>
        </div>
      </div>
    </article>
  );
}
