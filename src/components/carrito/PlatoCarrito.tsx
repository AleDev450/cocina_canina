"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTienda } from "@/context/Tienda";
import { cx } from "@/lib/formato";

/**
 * El carrito de la cabecera, contado con el plato de Dante.
 *
 * Vacío -> plato vacío y sin insignia. Con productos -> plato servido y la
 * cantidad en naranja. Al pulsar abre el mismo panel lateral de siempre.
 *
 * La insignia y el cambio de plato esperan a `hidratado` porque el carrito vive
 * en localStorage: pintarlos en el servidor provocaría un salto visible.
 */
export function PlatoCarrito({ className }: { className?: string }) {
  const { cantidadTotal, abrirCarrito, hidratado } = useTienda();
  const lleno = hidratado && cantidadTotal > 0;

  // Anuncio para lector de pantalla, solo cuando la cantidad cambia de verdad.
  const [anuncio, setAnuncio] = useState("");
  const anterior = useRef<number | null>(null);
  useEffect(() => {
    if (!hidratado) return;
    if (anterior.current !== null && anterior.current !== cantidadTotal) {
      setAnuncio(
        cantidadTotal === 0
          ? "Carrito vacío"
          : `Carrito con ${cantidadTotal} ${cantidadTotal === 1 ? "producto" : "productos"}`,
      );
    }
    anterior.current = cantidadTotal;
  }, [cantidadTotal, hidratado]);

  return (
    <>
      <button
        type="button"
        onClick={abrirCarrito}
        aria-label={`Carrito, ${hidratado ? cantidadTotal : 0} productos`}
        className={cx(
          "relative grid h-12 w-12 shrink-0 place-items-center rounded-full transition-colors hover:bg-crema-100",
          className,
        )}
      >
        {/* Las dos composiciones se superponen y se cruzan en opacidad, así el
            cambio no reserva espacio distinto ni descoloca la cabecera. */}
        <span className="relative block h-11 w-11">
          <Image
            src="/images/dante/icono_vacio.png"
            alt=""
            width={320}
            height={320}
            aria-hidden="true"
            className={cx(
              "absolute inset-0 h-full w-full object-contain transition-[opacity,transform] duration-200 motion-reduce:transition-none",
              lleno ? "scale-95 opacity-0" : "scale-100 opacity-100",
            )}
          />
          <Image
            src="/images/dante/icono_lleno.png"
            alt=""
            width={320}
            height={320}
            aria-hidden="true"
            className={cx(
              "absolute inset-0 h-full w-full object-contain transition-[opacity,transform] duration-200 motion-reduce:transition-none",
              lleno ? "scale-100 opacity-100" : "scale-95 opacity-0",
            )}
          />
        </span>

        {lleno ? (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-naranja-500 px-1 text-[0.62rem] font-bold text-white ring-2 ring-crema-100">
            {cantidadTotal}
          </span>
        ) : null}
      </button>

      <span aria-live="polite" className="sr-only">
        {anuncio}
      </span>
    </>
  );
}
