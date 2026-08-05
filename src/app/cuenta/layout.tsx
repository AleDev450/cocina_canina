import type { ReactNode } from "react";
import { NavCuenta } from "@/components/cuenta/NavCuenta";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";

export default function LayoutCuenta({ children }: { children: ReactNode }) {
  return (
    <>
      <CabeceraPagina
        antetitulo="Mi cuenta"
        titulo="Tu panel personal"
        texto="Pedidos, puntos, cupones y el perfil de cada una de tus mascotas en un solo lugar."
        migajas={[{ nombre: "Inicio", href: "/" }, { nombre: "Mi cuenta" }]}
        pose="mirada"
      />

      <div className="contenedor grid gap-8 py-12 lg:grid-cols-[16rem_1fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <NavCuenta />
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </>
  );
}
