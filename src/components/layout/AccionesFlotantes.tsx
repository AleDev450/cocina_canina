"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { consultaGeneral } from "@/lib/whatsapp";
import { useTienda } from "@/context/Tienda";
import { cx, precio } from "@/lib/formato";

/**
 * Móvil: botón flotante de WhatsApp y barra inferior fija con el pedido.
 * En escritorio solo queda el botón de WhatsApp.
 */
export function AccionesFlotantes({ whatsapp }: { whatsapp?: string }) {
  const ruta = usePathname();
  const { cantidadTotal, subtotal, abrirCarrito, hidratado } = useTienda();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alDesplazar = () => setVisible(window.scrollY > 400);
    alDesplazar();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => window.removeEventListener("scroll", alDesplazar);
  }, []);

  // En el checkout y el CMS estas acciones estorban.
  const oculto = ruta.startsWith("/checkout") || ruta.startsWith("/admin");
  if (oculto) return null;

  const conCarrito = hidratado && cantidadTotal > 0;

  return (
    <>
      {/* WhatsApp */}
      <a
        href={consultaGeneral(whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className={cx(
          "group fixed right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#053f22] shadow-elevada transition-all duration-300 hover:scale-110 md:right-7",
          conCarrito ? "bottom-24 md:bottom-7" : "bottom-6 md:bottom-7",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        <span className="absolute inset-0 animate-latir rounded-full bg-[#25D366]/40" />
        <MessageCircle className="relative h-6 w-6" strokeWidth={2.2} />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-petroleo-800 px-3.5 py-2 text-xs font-semibold text-white opacity-0 shadow-suave transition-opacity duration-200 group-hover:opacity-100 md:block">
          Haz tu pedido por WhatsApp
        </span>
      </a>

      {/* Barra inferior móvil */}
      <div
        className={cx(
          "fixed inset-x-0 bottom-0 z-[55] border-t border-petroleo-700/10 bg-white/95 px-4 py-3 backdrop-blur-lg transition-transform duration-300 md:hidden",
          conCarrito ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-grafito">
              {cantidadTotal} {cantidadTotal === 1 ? "producto" : "productos"}
            </p>
            <p className="font-display text-lg font-semibold leading-tight text-petroleo-900">
              {precio(subtotal)}
            </p>
          </div>
          <button
            type="button"
            onClick={abrirCarrito}
            className="grid h-12 w-12 place-items-center rounded-full border border-petroleo-700/15 text-petroleo-800"
            aria-label="Ver carrito"
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
          <Link
            href="/checkout"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-naranja-500 px-5 text-sm font-semibold text-white shadow-suave"
          >
            Hacer pedido
          </Link>
        </div>
      </div>
    </>
  );
}
