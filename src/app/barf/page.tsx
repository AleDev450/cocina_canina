import type { Metadata } from "next";
import { Droplets, HeartPulse, Snowflake, Sparkles } from "lucide-react";
import { productosBarf } from "@/data/barf";
import { preguntas } from "@/data/contenido";
import { SelectorBarf } from "@/components/barf/SelectorBarf";
import { CalculadorBarf } from "@/components/barf/CalculadorBarf";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { CabeceraSeccion } from "@/components/ui/Elementos";
import { Acordeon } from "@/components/ui/Acordeon";

export const metadata: Metadata = {
  title: "Alimentación BARF",
  description:
    "Dieta BARF fresca y balanceada para perros: recetas Pollo–Equino, Res–Pollo y Pavo–Cordero con precio por kilogramo y descuento por volumen.",
};

const BENEFICIOS = [
  {
    icono: HeartPulse,
    titulo: "Digestión y energía",
    texto:
      "Al ser alimento fresco, se absorbe mejor: heces más pequeñas, menos gases y más vitalidad.",
  },
  {
    icono: Sparkles,
    titulo: "Piel y pelaje",
    texto:
      "Las grasas naturales y el omega de las vísceras se notan en el brillo del pelo en pocas semanas.",
  },
  {
    icono: Droplets,
    titulo: "Hidratación real",
    texto:
      "Cerca del 70% de la ración es agua propia del alimento, algo que el concentrado seco no aporta.",
  },
  {
    icono: Snowflake,
    titulo: "Sin conservantes",
    texto:
      "Se congela apenas se prepara. Nada de aditivos para alargar la vida del producto.",
  },
];

export default function PaginaBarf() {
  const faqBarf = preguntas
    .filter((p) => p.categoria === "barf")
    .map((p) => ({ id: p.id, pregunta: p.pregunta, respuesta: p.respuesta }));

  return (
    <>
      <CabeceraPagina
        antetitulo="Alimentación BARF"
        titulo="Alimentación natural diseñada para ellos"
        texto="Una dieta fresca y balanceada que respeta las necesidades biológicas de tu mascota y contribuye a mejorar su bienestar y calidad de vida."
        migajas={[{ nombre: "Inicio", href: "/" }, { nombre: "Alimentación BARF" }]}
        pose="saltando"
      />

      {/* Por qué BARF */}
      <section className="py-16 md:py-20">
        <div className="contenedor">
          <CabeceraSeccion
            centrado
            antetitulo="¿Por qué elegir BARF?"
            titulo="Lo que la naturaleza pensó para ellos"
            texto="Porque alimentarlos con BARF es ofrecerles una dieta rica, fresca y balanceada que respeta sus necesidades biológicas, mejorando su bienestar y calidad de vida cada día."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFICIOS.map((b) => (
              <article
                key={b.titulo}
                className="rounded-3xl border border-petroleo-700/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-tarjeta"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-petroleo-100 text-petroleo-700">
                  <b.icono className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-petroleo-900">
                  {b.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-grafito">{b.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Recetas */}
      <section id="recetas" className="bg-white py-16 md:py-20">
        <div className="contenedor">
          <CabeceraSeccion
            antetitulo="Nuestras recetas"
            titulo="Elige la mezcla y los kilos"
            texto="El precio por kilogramo baja automáticamente al aumentar la cantidad. Puedes pedir una sola vez o programar entregas periódicas."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {productosBarf.map((p) => (
              <SelectorBarf key={p.slug} producto={p} />
            ))}
          </div>
        </div>
      </section>

      <CalculadorBarf />

      {/* Preguntas */}
      <section className="bg-white py-16 md:py-20">
        <div className="contenedor max-w-3xl">
          <CabeceraSeccion
            centrado
            antetitulo="Dudas frecuentes"
            titulo="Antes de empezar con BARF"
          />
          <div className="mt-10">
            <Acordeon items={faqBarf} abiertoInicial={faqBarf[0]?.id} />
          </div>
        </div>
      </section>
    </>
  );
}
