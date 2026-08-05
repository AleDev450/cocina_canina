import type { Metadata } from "next";
import { Checkout } from "@/components/checkout/Checkout";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";

export const metadata: Metadata = {
  title: "Finalizar compra",
  description: "Completa tus datos, elige entrega y método de pago.",
};

export default function PaginaCheckout() {
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
      <Checkout />
    </>
  );
}
