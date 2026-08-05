"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  User,
  X,
} from "lucide-react";
import { navegacion, sitio as sitioPorDefecto } from "@/data/sitio";
import { useTienda } from "@/context/Tienda";
import { cx } from "@/lib/formato";
import { Logo } from "@/components/ui/Elementos";
import { Huella } from "@/components/ui/Iconos";
import { clasesBoton } from "@/components/ui/Boton";

type Contacto = typeof sitioPorDefecto;

export function Encabezado({
  contacto = sitioPorDefecto,
  sesionActiva = false,
}: {
  contacto?: Contacto;
  sesionActiva?: boolean;
}) {
  const ruta = usePathname();
  const { cantidadTotal, abrirCarrito, setBuscadorAbierto, hidratado } = useTienda();
  const sitio = contacto;
  const sesion = { activa: sesionActiva };
  const [desplazado, setDesplazado] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const alDesplazar = () => setDesplazado(window.scrollY > 12);
    alDesplazar();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => window.removeEventListener("scroll", alDesplazar);
  }, []);

  useEffect(() => {
    setMenuAbierto(false);
  }, [ruta]);

  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAbierto]);

  const esActivo = (href: string) =>
    href === "/" ? ruta === "/" : ruta.startsWith(href);

  return (
    <>
      {/* Barra superior */}
      <div className="hidden bg-petroleo-800 text-petroleo-100 lg:block">
        <div className="contenedor flex h-9 items-center justify-between text-[0.72rem]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-naranja-400" />
              Delivery en Lima Metropolitana
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-naranja-400" />
              Ingrediente único, sin conservantes
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href={`https://instagram.com/${sitio.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              @{sitio.instagram}
            </a>
            <span className="text-petroleo-100/40">·</span>
            <span className="font-semibold text-white">{sitio.telefono}</span>
          </div>
        </div>
      </div>

      <header
        className={cx(
          "sticky top-0 z-50 transition-all duration-300",
          desplazado
            ? "border-b border-petroleo-700/10 bg-white/90 shadow-[0_6px_24px_-18px_rgba(8,54,59,0.5)] backdrop-blur-xl"
            : "bg-crema-50/80 backdrop-blur-sm",
        )}
      >
        <div className="contenedor flex h-18 items-center justify-between gap-4">
          <Link href="/" aria-label="La Cocina Canina — inicio" className="shrink-0">
            <Logo className="h-9 w-auto md:h-11" prioridad />
          </Link>

          {/* Navegación central */}
          <nav className="hidden items-center gap-1 xl:flex">
            {navegacion.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  "relative rounded-full px-3.5 py-2 text-[0.83rem] font-semibold transition-colors",
                  esActivo(item.href)
                    ? "text-naranja-600"
                    : "text-petroleo-800 hover:text-naranja-600",
                )}
              >
                {item.nombre}
                {esActivo(item.href) ? (
                  <span className="absolute inset-x-3.5 -bottom-0.5 h-[2.5px] rounded-full bg-naranja-500" />
                ) : null}
              </Link>
            ))}
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-1 md:gap-1.5">
            <button
              type="button"
              onClick={() => setBuscadorAbierto(true)}
              aria-label="Buscar productos"
              className="grid h-10 w-10 place-items-center rounded-full text-petroleo-800 transition-colors hover:bg-crema-100 hover:text-naranja-600"
            >
              <Search className="h-[1.15rem] w-[1.15rem]" />
            </button>

            <Link
              href={sesion.activa ? "/cuenta" : "/ingresar"}
              aria-label={sesion.activa ? "Mi cuenta" : "Iniciar sesión"}
              className="relative grid h-10 w-10 place-items-center rounded-full text-petroleo-800 transition-colors hover:bg-crema-100 hover:text-naranja-600"
            >
              <User className="h-[1.15rem] w-[1.15rem]" />
              {hidratado && sesion.activa ? (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-hoja-500 ring-2 ring-crema-50" />
              ) : null}
            </Link>

            <button
              type="button"
              onClick={abrirCarrito}
              aria-label={`Carrito, ${cantidadTotal} productos`}
              className="relative grid h-10 w-10 place-items-center rounded-full text-petroleo-800 transition-colors hover:bg-crema-100 hover:text-naranja-600"
            >
              <ShoppingBag className="h-[1.15rem] w-[1.15rem]" />
              {hidratado && cantidadTotal > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-naranja-500 px-1 text-[0.62rem] font-bold text-white ring-2 ring-crema-50">
                  {cantidadTotal}
                </span>
              ) : null}
            </button>

            <Link
              href="/productos"
              className={clasesBoton("primario", "sm", "ml-1.5 hidden lg:inline-flex")}
            >
              Hacer pedido
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setMenuAbierto(true)}
              aria-label="Abrir menú"
              className="ml-0.5 grid h-10 w-10 place-items-center rounded-full text-petroleo-800 transition-colors hover:bg-crema-100 xl:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      <div
        className={cx(
          "fixed inset-0 z-[70] xl:hidden",
          menuAbierto ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!menuAbierto}
      >
        <button
          type="button"
          tabIndex={menuAbierto ? 0 : -1}
          aria-label="Cerrar menú"
          onClick={() => setMenuAbierto(false)}
          className={cx(
            "absolute inset-0 bg-petroleo-950/45 backdrop-blur-sm transition-opacity duration-300",
            menuAbierto ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cx(
            "absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-petroleo-800 patron-huellas-claro transition-transform duration-350 ease-out",
            menuAbierto ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between px-6 py-5">
            <Logo variante="blanco" className="h-9 w-auto" />
            <button
              type="button"
              onClick={() => setMenuAbierto(false)}
              aria-label="Cerrar menú"
              className="grid h-10 w-10 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-2">
            {navegacion.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  "flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-lg transition-colors",
                  esActivo(item.href)
                    ? "bg-white/10 text-naranja-300"
                    : "text-white hover:bg-white/5",
                )}
              >
                {item.nombre}
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>
            ))}
          </nav>

          <div className="space-y-2.5 border-t border-white/10 px-5 py-5">
            <Link
              href={sesion.activa ? "/cuenta" : "/ingresar"}
              className={clasesBoton("contornoClaro", "md", "w-full")}
            >
              <User className="h-4 w-4" />
              {sesion.activa ? "Mi cuenta" : "Iniciar sesión"}
            </Link>
            <Link href="/productos" className={clasesBoton("primario", "md", "w-full")}>
              Hacer pedido
            </Link>
            <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-petroleo-100">
              <Huella className="h-3.5 w-3.5 text-naranja-400" />
              {sitio.telefono} · {sitio.horario}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
