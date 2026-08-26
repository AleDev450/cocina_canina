import { Hero } from "@/components/inicio/Hero";
import { FranjaBeneficios } from "@/components/inicio/FranjaBeneficios";
import { QuienesSomos } from "@/components/inicio/QuienesSomos";
import { Texturas } from "@/components/inicio/Texturas";
import { Categorias } from "@/components/inicio/Categorias";
import { Destacados } from "@/components/inicio/Destacados";
import { BarfInicio } from "@/components/inicio/BarfInicio";
import { PorMayorBanner } from "@/components/inicio/PorMayorBanner";
import { ClubPuntos } from "@/components/inicio/ClubPuntos";
import { PedidoWhatsapp } from "@/components/inicio/PedidoWhatsapp";
import { FaqInicio } from "@/components/inicio/FaqInicio";
import { obtenerBarf, obtenerCategorias, obtenerProductos } from "@/server/catalogo";
import {
  obtenerBloqueWhatsapp,
  obtenerConfiguracion,
  obtenerHero,
  obtenerNosotros,
  obtenerPreguntas,
  obtenerSecciones,
} from "@/server/contenido";
import { obtenerRecompensas, obtenerRegla } from "@/server/recompensas";
import { perfilActual } from "@/server/sesion";
import { hayConexion } from "@/lib/supabase/entorno";
import { SinConexion } from "@/components/layout/SinConexion";

export const dynamic = "force-dynamic";

export default async function Inicio() {
  if (!hayConexion) return <SinConexion />;

  const [
    hero,
    nosotros,
    categorias,
    productos,
    barf,
    bloqueWhatsapp,
    preguntas,
    regla,
    recompensas,
    config,
    secciones,
    perfil,
  ] = await Promise.all([
    obtenerHero(),
    obtenerNosotros(),
    obtenerCategorias(),
    obtenerProductos(),
    obtenerBarf(),
    obtenerBloqueWhatsapp(),
    obtenerPreguntas(),
    obtenerRegla(),
    obtenerRecompensas(),
    obtenerConfiguracion(),
    obtenerSecciones(),
    perfilActual(),
  ]);

  const visible = (clave: string) =>
    secciones.find((s) => s.clave === clave)?.visible ?? true;

  const conteos = productos.reduce<Record<string, number>>((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] ?? 0) + 1;
    return acc;
  }, {});
  conteos.barf = barf.length;

  const destacados = productos.filter((p) => p.destacado);
  const whatsapp = config.contacto.whatsapp;

  return (
    <>
      {visible("hero") ? (
        <>
          <Hero hero={hero} whatsapp={whatsapp} />
          <FranjaBeneficios beneficios={hero.beneficios} />
        </>
      ) : null}
      {visible("nosotros") ? <QuienesSomos quienesSomos={nosotros} /> : null}
      {visible("categorias") ? (
        <>
          <Texturas />
          <Categorias categorias={categorias} conteos={conteos} />
        </>
      ) : null}
      {visible("destacados") && destacados.length > 0 ? (
        <Destacados productos={destacados} />
      ) : null}
      {visible("barf") && barf.length > 0 ? <BarfInicio productosBarf={barf} /> : null}
      {visible("club") ? (
        <ClubPuntos
          regla={regla}
          recompensas={recompensas}
          puntos={perfil?.puntos ?? 0}
          nombre={perfil?.nombres ?? "amigo"}
        />
      ) : null}
      {visible("mayor") ? <PorMayorBanner /> : null}
      {visible("whatsapp") ? (
        <PedidoWhatsapp bloque={bloqueWhatsapp} contacto={config.contacto} />
      ) : null}
      {visible("faq") && preguntas.length > 0 ? (
        <FaqInicio preguntas={preguntas} whatsapp={whatsapp} />
      ) : null}
    </>
  );
}
