import Link from "next/link";
import { Database } from "lucide-react";
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
import { obtenerBarf, obtenerCategorias, obtenerProductos } from "@/server/catalogo";
import {
  obtenerBloqueWhatsapp,
  obtenerConfiguracion,
  obtenerHero,
  obtenerNosotros,
  obtenerPreguntas,
  obtenerSecciones,
  obtenerTestimonios,
} from "@/server/contenido";
import { obtenerRecompensas, obtenerRegla } from "@/server/recompensas";
import { perfilActual } from "@/server/sesion";
import { hayConexion } from "@/lib/supabase/entorno";

export const dynamic = "force-dynamic";

/** Aviso que se ve mientras el `.env.local` no esté configurado. */
function SinConexion() {
  return (
    <div className="contenedor flex min-h-[70vh] items-center justify-center py-20">
      <div className="max-w-lg rounded-blob border border-petroleo-700/10 bg-white p-10 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-naranja-50 text-naranja-600">
          <Database className="h-6 w-6" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-semibold text-petroleo-900">
          Falta conectar Supabase
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-grafito">
          Copia <code className="rounded bg-crema-100 px-1.5 py-0.5">.env.example</code>{" "}
          como <code className="rounded bg-crema-100 px-1.5 py-0.5">.env.local</code>,
          completa las claves del proyecto y ejecuta los archivos de{" "}
          <code className="rounded bg-crema-100 px-1.5 py-0.5">supabase/</code> en el SQL
          Editor. Los pasos completos están en el README.
        </p>
        <Link
          href="/admin/ingresar"
          className="mt-6 inline-flex text-sm font-semibold text-naranja-600 hover:underline"
        >
          Ir al panel de administración
        </Link>
      </div>
    </div>
  );
}

export default async function Inicio() {
  if (!hayConexion) return <SinConexion />;

  const [
    hero,
    nosotros,
    categorias,
    productos,
    barf,
    bloqueWhatsapp,
    testimonios,
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
    obtenerTestimonios(),
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
      {visible("hero") ? <Hero hero={hero} whatsapp={whatsapp} /> : null}
      {visible("nosotros") ? <QuienesSomos quienesSomos={nosotros} /> : null}
      {visible("categorias") ? (
        <Categorias categorias={categorias} conteos={conteos} />
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
      {visible("testimonios") && testimonios.length > 0 ? (
        <Testimonios testimonios={testimonios} />
      ) : null}
      {visible("faq") && preguntas.length > 0 ? (
        <FaqInicio preguntas={preguntas} whatsapp={whatsapp} />
      ) : null}
    </>
  );
}
