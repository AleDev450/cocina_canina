import { Hero } from "@/components/inicio/Hero";
import { QuienesSomos } from "@/components/inicio/QuienesSomos";
import { Categorias } from "@/components/inicio/Categorias";
import { Destacados } from "@/components/inicio/Destacados";
import { BarfInicio } from "@/components/inicio/BarfInicio";
import { PorMayorBanner } from "@/components/inicio/PorMayorBanner";
import { ClubPuntos } from "@/components/inicio/ClubPuntos";
import { PedidoWhatsapp } from "@/components/inicio/PedidoWhatsapp";
import { Testimonios } from "@/components/inicio/Testimonios";
import { FaqInicio } from "@/components/inicio/FaqInicio";

export default function Inicio() {
  return (
    <>
      <Hero />
      <QuienesSomos />
      <Categorias />
      <Destacados />
      <BarfInicio />
      <ClubPuntos />
      <PorMayorBanner />
      <PedidoWhatsapp />
      <Testimonios />
      <FaqInicio />
    </>
  );
}
