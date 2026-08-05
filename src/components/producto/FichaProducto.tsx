"use client";

import Image from "next/image";
import { useState } from "react";
import {
  AlertTriangle,
  Check,
  Heart,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Snowflake,
  Sparkles,
} from "lucide-react";
import type { Producto } from "@/lib/tipos";
import { nombreDureza, nombreEdad, nombreProteina, nombreTamano } from "@/data/categorias";
import type { ReglaPuntos } from "@/lib/tipos";

import { useTienda } from "@/context/Tienda";
import { consultaProducto } from "@/lib/whatsapp";
import { cx, precio } from "@/lib/formato";
import { Boton, clasesBoton } from "@/components/ui/Boton";
import { Etiqueta, Pastilla } from "@/components/ui/Elementos";
import { Huella } from "@/components/ui/Iconos";

const TONO_DUREZA: Record<string, string> = {
  suave: "bg-hoja-100 text-hoja-600",
  media: "bg-ambar-100 text-ambar-500",
  "larga-duracion": "bg-coral-100 text-coral-500",
};

export function FichaProducto({
  producto,
  whatsapp,
  regla,
}: {
  producto: Producto;
  whatsapp?: string;
  regla: ReglaPuntos;
}) {
  const puntosPorMonto = (monto: number) =>
    monto < regla.compraMinima
      ? 0
      : Math.floor(monto / regla.montoPorPunto) *
        regla.puntosOtorgados *
        regla.multiplicador;
  const { agregar, alternarFavorito, esFavorito, hidratado } = useTienda();
  const disponibles = producto.presentaciones.filter((p) => p.stock > 0);
  const [presentacion, setPresentacion] = useState(
    disponibles[0] ?? producto.presentaciones[0],
  );
  const [cantidad, setCantidad] = useState(1);
  const [imagen, setImagen] = useState(0);

  const agotado = disponibles.length === 0;
  const favorito = hidratado && esFavorito(producto.slug);
  const total = presentacion.precio * cantidad;

  return (
    <div className="contenedor py-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        {/* Galería */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-blob border border-petroleo-700/10 bg-crema-50 patron-huellas">
            <span className="absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.98)_38%,rgba(250,244,234,0)_72%)]" />
            <Image
              key={producto.galeria[imagen]}
              src={producto.galeria[imagen]}
              alt={producto.nombre}
              width={900}
              height={900}
              priority
              className="relative h-full w-full animate-aparecer object-contain p-10 drop-shadow-[0_28px_28px_rgba(8,54,59,0.2)]"
            />

            <div className="pointer-events-none absolute left-5 top-5 flex flex-col gap-2">
              {producto.etiquetas.map((e) => (
                <Etiqueta
                  key={e}
                  tono={
                    e === "mas-vendido"
                      ? "naranja"
                      : e === "nuevo"
                        ? "hoja"
                        : e === "recomendado"
                          ? "petroleo"
                          : "coral"
                  }
                >
                  {e === "mas-vendido"
                    ? "Más vendido"
                    : e === "nuevo"
                      ? "Nuevo"
                      : e === "recomendado"
                        ? "Recomendado"
                        : "Stock limitado"}
                </Etiqueta>
              ))}
            </div>

            <button
              type="button"
              onClick={() => alternarFavorito(producto.slug)}
              aria-pressed={favorito}
              aria-label={favorito ? "Quitar de favoritos" : "Guardar en favoritos"}
              className={cx(
                "absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full transition-all duration-200",
                favorito
                  ? "bg-naranja-500 text-white shadow-suave"
                  : "bg-white text-petroleo-700 shadow-suave hover:text-naranja-500",
              )}
            >
              <Heart className={cx("h-5 w-5", favorito && "fill-current")} />
            </button>
          </div>

          {producto.galeria.length > 1 ? (
            <div className="mt-4 flex gap-3">
              {producto.galeria.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImagen(i)}
                  aria-label={`Ver imagen ${i + 1}`}
                  className={cx(
                    "grid h-20 w-20 place-items-center rounded-2xl border-2 bg-crema-50 p-2 transition-all duration-200",
                    i === imagen
                      ? "border-naranja-500"
                      : "border-transparent hover:border-petroleo-700/20",
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    width={160}
                    height={160}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Información */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cx(
                "rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide",
                TONO_DUREZA[producto.dureza],
              )}
            >
              {nombreDureza[producto.dureza]}
            </span>
            {producto.proteinas.map((p) => (
              <Pastilla key={p} tono="contorno">
                {nombreProteina[p]}
              </Pastilla>
            ))}
          </div>

          <h1 className="mt-4 font-display text-[clamp(2rem,1.5rem+2vw,3rem)] font-semibold leading-[1.05] text-petroleo-900">
            {producto.nombre}
          </h1>

          <p className="mt-2 flex items-center gap-2 text-[0.95rem] font-medium text-naranja-600">
            <Huella className="h-4 w-4" />
            {producto.beneficioPrincipal}
          </p>

          <p className="mt-5 leading-relaxed text-grafito">{producto.descripcion}</p>

          {/* Precio */}
          <div className="mt-8 rounded-3xl border border-petroleo-700/10 bg-white p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-grafito">
                  Precio
                </span>
                <p className="font-display text-4xl font-semibold leading-none text-petroleo-900">
                  {precio(presentacion.precio)}
                </p>
              </div>
              <div className="text-right">
                {agotado ? (
                  <Pastilla tono="suaveCoral">Sin stock</Pastilla>
                ) : presentacion.stock <= 6 ? (
                  <Pastilla tono="suaveCoral">
                    Quedan {presentacion.stock} unidades
                  </Pastilla>
                ) : (
                  <Pastilla tono="suaveHoja">
                    <Check className="h-3.5 w-3.5" />
                    En stock
                  </Pastilla>
                )}
              </div>
            </div>

            {/* Presentaciones */}
            <div className="mt-6">
              <span className="text-xs font-bold uppercase tracking-[0.1em] text-petroleo-800">
                Presentaciones
              </span>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {producto.presentaciones.map((p) => {
                  const activa = p.id === presentacion.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      disabled={p.stock === 0}
                      onClick={() => setPresentacion(p)}
                      className={cx(
                        "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200",
                        activa
                          ? "border-naranja-500 bg-naranja-50"
                          : "border-petroleo-700/15 hover:border-petroleo-700/40",
                        p.stock === 0 && "cursor-not-allowed opacity-40",
                      )}
                    >
                      <span
                        className={cx(
                          "text-sm font-semibold",
                          activa ? "text-naranja-700" : "text-petroleo-800",
                        )}
                      >
                        {p.etiqueta}
                      </span>
                      <span className="shrink-0 text-sm font-bold text-petroleo-900">
                        {precio(p.precio)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cantidad y acciones */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-full border border-petroleo-700/15 p-1">
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  aria-label="Menos"
                  className="grid h-10 w-10 place-items-center rounded-full text-petroleo-700 transition-colors hover:bg-crema-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-9 text-center font-display text-lg font-semibold tabular-nums">
                  {cantidad}
                </span>
                <button
                  type="button"
                  onClick={() => setCantidad((c) => c + 1)}
                  aria-label="Más"
                  className="grid h-10 w-10 place-items-center rounded-full text-petroleo-700 transition-colors hover:bg-crema-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Boton
                variante="primario"
                medida="lg"
                disabled={agotado}
                className="flex-1"
                onClick={() =>
                  agregar({
                    id: `${producto.slug}:${presentacion.id}`,
                    slug: producto.slug,
                    nombre: producto.nombre,
                    presentacion: presentacion.etiqueta,
                    precio: presentacion.precio,
                    cantidad,
                    imagen: producto.imagen,
                    tipo: "snack",
                  })
                }
              >
                <ShoppingBag className="h-4 w-4" />
                Agregar al carrito · {precio(total)}
              </Boton>
            </div>

            <a
              href={consultaProducto(producto.nombre, presentacion.etiqueta, whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className={clasesBoton("whatsapp", "md", "mt-3 w-full")}
            >
              Comprar por WhatsApp
            </a>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-grafito">
              <Sparkles className="h-3.5 w-3.5 text-naranja-500" />
              Suma {puntosPorMonto(total)} puntos del Club Cocina Canina
            </p>
          </div>

          {/* Recomendación */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-petroleo-700/10 bg-white p-4">
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-grafito">
                Recomendado para
              </span>
              <p className="mt-1.5 text-sm font-medium text-petroleo-900">
                {producto.tamanos.map((t) => nombreTamano[t].replace("Perro ", "")).join(", ")}
              </p>
            </div>
            <div className="rounded-2xl border border-petroleo-700/10 bg-white p-4">
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-grafito">
                Etapa de vida
              </span>
              <p className="mt-1.5 text-sm font-medium text-petroleo-900">
                {producto.edades.map((e) => nombreEdad[e]).join(", ")}
              </p>
            </div>
          </div>

          {/* Advertencia */}
          <div className="mt-6 flex gap-3 rounded-2xl border border-coral-500/25 bg-coral-100/60 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-coral-500" />
            <p className="text-sm leading-relaxed text-petroleo-900">
              {producto.advertencia}
            </p>
          </div>
        </div>
      </div>

      {/* Detalle ampliado */}
      <div className="mt-16 grid gap-5 lg:grid-cols-3">
        <section className="rounded-3xl border border-petroleo-700/10 bg-white p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-petroleo-900">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-hoja-100 text-hoja-600">
              <Check className="h-4 w-4" />
            </span>
            Beneficios
          </h2>
          <ul className="mt-4 space-y-2.5">
            {producto.beneficios.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-grafito">
                <Huella className="mt-0.5 h-3.5 w-3.5 shrink-0 text-naranja-500" />
                {b}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-petroleo-700/10 bg-white p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-petroleo-900">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-ambar-100 text-ambar-500">
              <Package className="h-4 w-4" />
            </span>
            Ingredientes
          </h2>
          <ul className="mt-4 space-y-2.5">
            {producto.ingredientes.map((i) => (
              <li key={i} className="text-sm text-grafito">
                {i}
              </li>
            ))}
          </ul>
          <h3 className="mt-6 text-xs font-bold uppercase tracking-[0.1em] text-petroleo-800">
            Minerales y nutrientes
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-grafito">{producto.minerales}</p>
        </section>

        <section className="rounded-3xl border border-petroleo-700/10 bg-white p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-petroleo-900">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-petroleo-100 text-petroleo-700">
              <Snowflake className="h-4 w-4" />
            </span>
            Conservación
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-grafito">
            {producto.conservacion}
          </p>

          <h3 className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-petroleo-800">
            <ShieldCheck className="h-3.5 w-3.5" />
            Nuestro compromiso
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm text-grafito">
            <li>Ingrediente único, sin harinas ni rellenos.</li>
            <li>Sin conservantes ni colorantes artificiales.</li>
            <li>Deshidratado lento a baja temperatura.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
