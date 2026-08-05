import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bell, Search } from "lucide-react";
import { NavAdmin } from "@/components/admin/NavAdmin";
import { AvatarMascota } from "@/components/ui/Elementos";

export const metadata: Metadata = {
  title: { default: "CMS", template: "%s · CMS La Cocina Canina" },
  robots: { index: false, follow: false },
};

export default function LayoutAdmin({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-crema-50">
      <NavAdmin />

      <div className="min-w-0 flex-1">
        {/* Barra superior */}
        <header className="sticky top-0 z-40 border-b border-petroleo-700/10 bg-white/90 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-4 px-5 lg:px-8">
            <div className="relative hidden min-w-0 flex-1 md:block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-grafito" />
              <input
                placeholder="Buscar pedidos, productos o clientes…"
                aria-label="Buscar en el CMS"
                className="h-10 w-full max-w-md rounded-full border border-petroleo-700/12 bg-crema-50 pl-11 pr-4 text-sm placeholder:text-grafito/60 focus:border-naranja-500 focus:outline-none"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                aria-label="Notificaciones"
                className="relative grid h-10 w-10 place-items-center rounded-full text-petroleo-800 transition-colors hover:bg-crema-100"
              >
                <Bell className="h-[1.1rem] w-[1.1rem]" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-naranja-500 ring-2 ring-white" />
              </button>

              <div className="flex items-center gap-2.5 border-l border-petroleo-700/10 pl-3">
                <AvatarMascota nombre="Equipo" className="h-9 w-9" />
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold leading-tight text-petroleo-900">
                    Equipo Cocina Canina
                  </p>
                  <p className="text-[0.68rem] text-grafito">Administrador</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-5 py-7 pb-24 lg:px-8 lg:pb-10">{children}</main>
      </div>
    </div>
  );
}
