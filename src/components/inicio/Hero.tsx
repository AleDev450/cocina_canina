import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { hero as heroPorDefecto } from "@/data/sitio";
import { consultaGeneral } from "@/lib/whatsapp";
import { Boton } from "@/components/ui/Boton";
import { Huella, Onda } from "@/components/ui/Iconos";

export function Hero({
  hero = heroPorDefecto,
  whatsapp,
}: {
  hero?: typeof heroPorDefecto;
  whatsapp?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-crema-100">
      <div className="absolute inset-0 patron-huellas opacity-70" aria-hidden="true" />
      <div
        className="absolute -left-40 top-[-20%] h-[34rem] w-[34rem] rounded-full bg-durazno/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="contenedor relative grid items-center gap-10 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-20 lg:pt-16">
        {/* Texto */}
        <div className="max-w-xl">
          <span
            className="antetitulo animate-aparecer"
            style={{ animationDelay: "0.05s" }}
          >
            <Huella className="h-3.5 w-3.5" />
            Snacks naturales y BARF · Perú
          </span>

          <h1
            className="mt-5 animate-aparecer font-display text-[clamp(2.6rem,1.6rem+4.2vw,4.6rem)] font-semibold leading-[1.02] text-petroleo-900"
            style={{ animationDelay: "0.12s" }}
          >
            {hero.titulo}{" "}
            <span className="relative inline-block text-naranja-500">
              {hero.tituloResaltado}
              <svg
                viewBox="0 0 240 22"
                preserveAspectRatio="none"
                className="absolute -bottom-1.5 left-0 h-3 w-full text-naranja-300/70"
                aria-hidden="true"
              >
                <path
                  d="M3 15C60 6 128 3 237 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* max-w-[34ch] mantiene el texto en tres líneas como mucho */}
          <p
            className="mt-6 max-w-[34ch] animate-aparecer text-[1.02rem] leading-relaxed text-grafito"
            style={{ animationDelay: "0.2s" }}
          >
            {hero.subtitulo}
          </p>

          <div
            className="mt-8 flex animate-aparecer flex-wrap gap-3"
            style={{ animationDelay: "0.28s" }}
          >
            <Boton href="/productos" variante="primario" medida="lg">
              Ver productos
              <ArrowRight className="h-4 w-4" />
            </Boton>
            <Boton href={consultaGeneral(whatsapp)} externo variante="contorno" medida="lg">
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              Pedir por WhatsApp
            </Boton>
          </div>
        </div>

        {/* Dante sobre la forma orgánica */}
        <div
          className="relative mx-auto w-full max-w-lg animate-aparecer lg:max-w-none"
          style={{ animationDelay: "0.18s" }}
        >
          <div className="relative aspect-[4/4.2] w-full">
            <div
              className="absolute inset-x-[6%] bottom-0 top-[8%] rounded-[46%_54%_42%_58%/40%_38%_62%_60%] bg-petroleo-700"
              aria-hidden="true"
            />
            <div
              className="absolute inset-x-[13%] bottom-[6%] top-[16%] rounded-[54%_46%_58%_42%/48%_52%_48%_52%] border border-white/15"
              aria-hidden="true"
            />
            <div
              className="absolute inset-x-[6%] bottom-0 top-[8%] rounded-[46%_54%_42%_58%/40%_38%_62%_60%] patron-huellas-claro"
              aria-hidden="true"
            />

            <Image
              src="/images/dante/sonriendo.png"
              alt="Dante, la mascota de La Cocina Canina, mirando hacia arriba"
              width={975}
              height={1300}
              priority
              sizes="(max-width: 1023px) 90vw, 46vw"
              className="absolute bottom-0 left-1/2 h-[98%] w-auto -translate-x-1/2 object-contain drop-shadow-[0_30px_36px_rgba(2,34,38,0.35)]"
            />

            {/* Acentos de marca: trazos y corazón, puramente decorativos */}
            <svg
              viewBox="0 0 60 60"
              className="absolute right-[4%] top-[16%] w-10 text-naranja-500 md:w-14"
              aria-hidden="true"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              >
                <path d="M8 30h14" />
                <path d="M14 14l10 9" />
                <path d="M14 46l10-9" />
              </g>
            </svg>
            <svg
              viewBox="0 0 32 30"
              className="absolute left-[2%] top-[52%] w-6 text-naranja-500 md:w-8"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M16 29S1 20 1 10.5A8.5 8.5 0 0 1 16 5a8.5 8.5 0 0 1 15 5.5C31 20 16 29 16 29z"
              />
            </svg>
          </div>
        </div>
      </div>

      <Onda className="block h-8 w-full text-crema-50 md:h-12" />
    </section>
  );
}
