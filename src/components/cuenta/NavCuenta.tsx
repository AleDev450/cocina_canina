"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dog,
  Gift,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Ticket,
  UserCog,
} from "lucide-react";
import { salir } from "@/server/acciones/auth";
import { useTienda } from "@/context/Tienda";

import { cx } from "@/lib/formato";
import { AvatarMascota } from "@/components/ui/Elementos";

const ENLACES = [
  { href: "/cuenta", nombre: "Resumen", icono: LayoutDashboard },
  { href: "/cuenta/pedidos", nombre: "Mis pedidos", icono: Package },
  { href: "/cuenta/recompensas", nombre: "Mis puntos", icono: Gift },
  { href: "/cuenta/cupones", nombre: "Cupones", icono: Ticket },
  { href: "/cuenta/mascotas", nombre: "Mis mascotas", icono: Dog },
  { href: "/cuenta/favoritos", nombre: "Favoritos", icono: Heart },
  { href: "/cuenta/direcciones", nombre: "Direcciones", icono: MapPin },
  { href: "/cuenta/datos", nombre: "Mis datos", icono: UserCog },
];

export function NavCuenta({ nombre, puntos }: { nombre: string; puntos: number }) {
  const ruta = usePathname();
  const { favoritos, hidratado } = useTienda();

  return (
    <nav aria-label="Menú de mi cuenta">
      {/* Identidad */}
      <div className="mb-4 flex items-center gap-3 rounded-3xl border border-petroleo-700/10 bg-white p-4">
        <AvatarMascota
          nombre={nombre}
          className="h-12 w-12"
        />
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold text-petroleo-900">
            {nombre}
          </p>
          <p className="truncate text-xs text-grafito">
            {puntos} puntos acumulados
          </p>
        </div>
      </div>

      <ul className="sin-scrollbar flex gap-2 overflow-x-auto rounded-3xl border border-petroleo-700/10 bg-white p-2 lg:flex-col lg:gap-1 lg:overflow-visible">
        {ENLACES.map((e) => {
          const activo =
            e.href === "/cuenta" ? ruta === "/cuenta" : ruta.startsWith(e.href);
          const contador =
            e.href === "/cuenta/favoritos" && hidratado && favoritos.length > 0
              ? favoritos.length
              : null;

          return (
            <li key={e.href} className="shrink-0 lg:shrink">
              <Link
                href={e.href}
                className={cx(
                  "flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                  activo
                    ? "bg-petroleo-700 text-white"
                    : "text-grafito hover:bg-crema-100 hover:text-petroleo-800",
                )}
              >
                <e.icono className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{e.nombre}</span>
                {contador ? (
                  <span
                    className={cx(
                      "ml-auto grid h-5 min-w-5 place-items-center rounded-full px-1 text-[0.65rem]",
                      activo ? "bg-white/20" : "bg-crema-200 text-petroleo-800",
                    )}
                  >
                    {contador}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}

        <li className="shrink-0 lg:mt-2 lg:shrink lg:border-t lg:border-petroleo-700/10 lg:pt-2">
          <form action={salir}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-grafito transition-colors hover:bg-coral-100 hover:text-coral-500"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">Cerrar sesión</span>
          </button>
          </form>
        </li>
      </ul>
    </nav>
  );
}
