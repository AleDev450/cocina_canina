import type { Metadata } from "next";
import { Checkout } from "@/components/checkout/Checkout";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { obtenerConfiguracion } from "@/server/contenido";
import { obtenerRegla } from "@/server/recompensas";
import { misDirecciones } from "@/server/clientes";
import { perfilActual } from "@/server/sesion";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Finalizar compra",
  description: "Completa tus datos, elige entrega y método de pago.",
};

export default async function PaginaCheckout() {
  const [config, regla, perfil] = await Promise.all([
    obtenerConfiguracion(),
    obtenerRegla(),
    perfilActual(),
  ]);

  const direcciones = perfil ? await misDirecciones().catch(() => []) : [];

  return (
    <>
      <CabeceraPagina
        antetitulo="Último paso"
        titulo="Finalizar compra"
        migajas={[
          { nombre: "Inicio", href: "/" },
          { nombre: "Carrito", href: "/carrito" },
          { nombre: "Finalizar compra" },
        ]}
      />
      <Checkout
        config={config}
        regla={regla}
        direcciones={direcciones}
        cliente={
          perfil
            ? {
                nombres: perfil.nombres,
                apellidos: perfil.apellidos ?? "",
                correo: perfil.correo,
                celular: perfil.celular ?? "",
              }
            : null
        }
      />
    </>
  );
}
