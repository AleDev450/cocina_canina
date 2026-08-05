import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { obtenerNosotros, obtenerConfiguracion } from "@/server/contenido";
import { consultaGeneral } from "@/lib/whatsapp";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { Boton } from "@/components/ui/Boton";
import { CabeceraSeccion } from "@/components/ui/Elementos";
import { iconosPorNombre, type NombreIcono } from "@/components/ui/Iconos";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "La historia de La Cocina Canina: snacks deshidratados de ingrediente único y alimentación BARF hechos de forma artesanal en Perú.",
};

const PROCESO = [
  {
    paso: "01",
    titulo: "Selección",
    texto:
      "Compramos proteína fresca a proveedores conocidos. Revisamos pieza por pieza y descartamos lo que no cumple.",
  },
  {
    paso: "02",
    titulo: "Limpieza y corte",
    texto:
      "Sin sal, sin aceite, sin marinados. Solo se retira el exceso de grasa y se corta al tamaño de cada presentación.",
  },
  {
    paso: "03",
    titulo: "Deshidratado lento",
    texto:
      "Horas a baja temperatura. Es lo que concentra el sabor, conserva los nutrientes y baja la humedad sin conservantes.",
  },
  {
    paso: "04",
    titulo: "Empaque y control",
    texto:
      "Se pesa, se sella y se etiqueta con el lote. Cada bolsa sale revisada antes de llegar a tu casa.",
  },
];

const CIFRAS = [
  { valor: "24", texto: "snacks de ingrediente único" },
  { valor: "3", texto: "recetas BARF congeladas" },
  { valor: "0", texto: "conservantes y colorantes" },
  { valor: "100%", texto: "producción artesanal" },
];

export const dynamic = "force-dynamic";

export default async function PaginaNosotros() {
  const [quienesSomos, config] = await Promise.all([
    obtenerNosotros(),
    obtenerConfiguracion(),
  ]);
  const sitio = config.contacto;

  return (
    <>
      <CabeceraPagina
        antetitulo={quienesSomos.antetitulo}
        titulo="Alimentamos su felicidad"
        texto={quienesSomos.texto}
        migajas={[{ nombre: "Inicio", href: "/" }, { nombre: "Quiénes somos" }]}
        pose="sentado"
      />

      {/* Cifras */}
      <section className="py-14">
        <div className="contenedor grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CIFRAS.map((c) => (
            <div
              key={c.texto}
              className="rounded-3xl border border-petroleo-700/10 bg-white p-6 text-center"
            >
              <p className="font-display text-4xl font-semibold text-naranja-500">
                {c.valor}
              </p>
              <p className="mt-1.5 text-sm text-grafito">{c.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Historia */}
      <section className="bg-white py-16 md:py-20">
        <div className="contenedor grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="relative overflow-hidden rounded-blob bg-petroleo-700 p-10 patron-huellas-claro">
              <Image
                src="/mascota/mirada.png"
                alt="La mascota de La Cocina Canina"
                width={716}
                height={1100}
                className="mx-auto h-72 w-auto object-contain drop-shadow-[0_26px_30px_rgba(2,34,38,0.45)] md:h-96"
              />
            </div>
            <div className="absolute -bottom-6 -right-2 max-w-[13rem] rounded-3xl bg-naranja-500 p-5 text-white shadow-elevada">
              <p className="font-display text-lg font-semibold leading-tight">
                «Cocinamos como si fuera para nuestros propios perros.»
              </p>
            </div>
          </div>

          <div>
            <CabeceraSeccion
              antetitulo="Nuestra historia"
              titulo="Empezó por un perro que no quería comer"
            />
            <div className="mt-6 space-y-4 leading-relaxed text-grafito">
              <p>
                La Cocina Canina nació en una cocina de casa, buscando un premio que no
                tuviera una lista de ingredientes imposible de pronunciar. Lo que
                encontramos en el mercado era casi siempre lo mismo: harinas, colorantes
                y azúcares disfrazados de snack saludable.
              </p>
              <p>
                Así que empezamos por lo básico: un solo ingrediente, deshidratado lento
                y nada más. Los primeros lotes fueron para nuestros perros y los de los
                amigos. Cuando el veterinario preguntó de dónde salían esas tráqueas,
                supimos que había algo.
              </p>
              <p>
                Hoy producimos {CIFRAS[0].valor} snacks distintos y tres recetas BARF,
                todo en lotes pequeños y revisados a mano. Seguimos siendo un proyecto
                artesanal, y esa es justamente la idea: que sepas exactamente qué le
                estás dando a tu perro.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Boton href="/productos" variante="primario" medida="lg">
                Ver el catálogo
                <ArrowRight className="h-4 w-4" />
              </Boton>
              <Boton href={consultaGeneral(sitio.whatsapp)} externo variante="contorno" medida="lg">
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                Conversemos
              </Boton>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 md:py-20">
        <div className="contenedor">
          <CabeceraSeccion
            centrado
            antetitulo="Nuestros valores"
            titulo="Tres cosas que no negociamos"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {quienesSomos.valores.map((v) => {
              const Icono = iconosPorNombre[v.icono as NombreIcono];
              return (
                <article
                  key={v.titulo}
                  className="rounded-3xl border border-petroleo-700/10 bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-tarjeta"
                >
                  <span className="grid h-13 w-13 place-items-center rounded-2xl bg-crema-100 text-petroleo-700">
                    <Icono className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-petroleo-900">
                    {v.titulo}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-grafito">{v.texto}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="bg-petroleo-800 py-16 text-white md:py-24">
        <div className="contenedor">
          <CabeceraSeccion
            claro
            centrado
            antetitulo="Cómo lo hacemos"
            titulo="De la selección al empaque"
            texto="Un proceso corto, sin atajos químicos. Todo lo que hace falta para que un snack dure es sacarle el agua con paciencia."
          />

          <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PROCESO.map((p) => (
              <li key={p.paso} className="relative">
                <span className="font-display text-5xl font-semibold text-naranja-500/40">
                  {p.paso}
                </span>
                <h3 className="mt-2 font-display text-xl font-semibold">{p.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-petroleo-100">
                  {p.texto}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-16 md:py-20">
        <div className="contenedor max-w-3xl text-center">
          <CabeceraSeccion
            centrado
            antetitulo="Hablemos"
            titulo="¿Dudas sobre qué le conviene a tu perro?"
            texto={`Escríbenos al ${sitio.telefono} y te ayudamos a armar el pedido según su tamaño, edad y forma de masticar. Atendemos ${sitio.horario.toLowerCase()}.`}
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Boton href={consultaGeneral(sitio.whatsapp)} externo variante="whatsapp" medida="lg">
              <MessageCircle className="h-4 w-4" />
              Escribir por WhatsApp
            </Boton>
            <Boton href="/preguntas-frecuentes" variante="contorno" medida="lg">
              Ver preguntas frecuentes
            </Boton>
          </div>
        </div>
      </section>
    </>
  );
}
