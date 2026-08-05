import type { Metadata } from "next";
import { PaginaCarrito } from "@/components/carrito/PaginaCarrito";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Revisa tu pedido antes de finalizar la compra.",
};

export default function Carrito() {
  return (
    <>
      <CabeceraPagina
        antetitulo="Tu pedido"
        titulo="Carrito de compras"
        migajas={[{ nombre: "Inicio", href: "/" }, { nombre: "Carrito" }]}
      />
      <PaginaCarrito />
    </>
  );
}
