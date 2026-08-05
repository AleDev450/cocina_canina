import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bell } from "lucide-react";
import { NavAdmin } from "@/components/admin/NavAdmin";
import { MenuUsuario } from "@/components/admin/MenuUsuario";
import { exigirMiembro, gruposDelMiembro } from "@/server/sesion";
import { obtenerPedidos } from "@/server/pedidos";

export const metadata: Metadata = {
  title: { default: "CMS", template: "%s · CMS La Cocina Canina" },
  robots: { index: false, follow: false },
};

/** El CMS siempre lee datos frescos: nada de páginas cacheadas. */
export const dynamic = "force-dynamic";

const NOMBRE_ROL: Record<string, string> = {
  administrador: "Administrador",
  produccion: "Producción",
  reparto: "Reparto",
  contenido: "Contenido",
  atencion: "Atención al cliente",
};

export default async function LayoutPanel({ children }: { children: ReactNode }) {
  const miembro = await exigirMiembro();
  const grupos = await gruposDelMiembro();

  let pendientes = 0;
  try {
    const pedidos = await obtenerPedidos();
    pendientes = pedidos.filter(
      (p) => p.estado === "pendiente" || p.estado === "confirmado",
    ).length;
  } catch {
    // Si la consulta falla, la campana simplemente no muestra contador.
  }

  return (
    <div className="flex min-h-screen bg-crema-50">
      <NavAdmin
        grupos={miembro.rol === "administrador" ? null : grupos}
        rol={NOMBRE_ROL[miembro.rol] ?? miembro.rol}
      />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 border-b border-petroleo-700/10 bg-white/90 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-4 px-5 lg:px-8">
            <p className="hidden text-sm text-grafito md:block">
              Hola, <strong className="text-petroleo-900">{miembro.nombre}</strong>
            </p>

            <div className="ml-auto flex items-center gap-3">
              <span
                className="relative grid h-10 w-10 place-items-center rounded-full text-petroleo-800"
                title={`${pendientes} pedidos por atender`}
              >
                <Bell className="h-[1.1rem] w-[1.1rem]" />
                {pendientes > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-naranja-500 px-1 text-[0.62rem] font-bold text-white ring-2 ring-white">
                    {pendientes}
                  </span>
                ) : null}
              </span>

              <MenuUsuario
                nombre={miembro.nombre}
                correo={miembro.correo}
                rol={NOMBRE_ROL[miembro.rol] ?? miembro.rol}
              />
            </div>
          </div>
        </header>

        <main className="px-5 py-7 pb-24 lg:px-8 lg:pb-10">{children}</main>
      </div>
    </div>
  );
}
