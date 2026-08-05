import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { hero } from "@/data/sitio";
import { consultaGeneral } from "@/lib/whatsapp";
import { Boton } from "@/components/ui/Boton";
import { SelloCircular } from "@/components/ui/Elementos";
import { Huella, Onda, iconosPorNombre, type NombreIcono } from "@/components/ui/Iconos";

/** Snacks que flotan alrededor de la mascota. */
const FLOTANTES = [
  {
    src: "/productos/patitas-de-pollo.png",
    alto: "top-[6%]",
    lado: "left-[2%]",
    medida: "w-24 md:w-32",
    retraso: "0.5s",
    duracion: "7s",
  },
  {
    src: "/productos/traquea-de-res.png",
    alto: "top-[30%]",
    lado: "right-[1%]",
    medida: "w-24 md:w-32",
    retraso: "1.4s",
    duracion: "6s",
  },
  {
    src: "/productos/pejerrey.png",
    alto: "bottom-[16%]",
    lado: "left-[0%]",
    medida: "w-16 md:w-20",
    retraso: "0.9s",
    duracion: "8s",
  },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-crema-50">
      {/* Fondo */}
      <div className="absolute inset-0 patron-huellas opacity-70" aria-hidden="true" />
      <div
        className="absolute -left-40 top-[-20%] h-[34rem] w-[34rem] rounded-full bg-naranja-100/35 blur-3xl"
        aria-hidden="true"
      />

      <div className="contenedor relative grid items-center gap-12 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28 lg:pt-16">
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

          <p
            className="mt-6 max-w-lg animate-aparecer text-[1.02rem] leading-relaxed text-grafito"
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
            <Boton href={consultaGeneral()} externo variante="contorno" medida="lg">
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              Hacer pedido por WhatsApp
            </Boton>
          </div>

          {/* Beneficios */}
          <ul
            className="mt-11 grid animate-aparecer gap-x-6 gap-y-5 sm:grid-cols-2"
            style={{ animationDelay: "0.36s" }}
          >
            {hero.beneficios.map((b) => {
              const Icono = iconosPorNombre[b.icono as NombreIcono];
              return (
                <li key={b.titulo} className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-petroleo-700 shadow-suave">
                    <Icono className="h-5 w-5" />
                  </span>
                  <span className="pt-0.5">
                    <span className="block text-sm font-bold text-petroleo-900">
                      {b.titulo}
                    </span>
                    <span className="block text-xs text-grafito">{b.detalle}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Imagen */}
        <div
          className="relative mx-auto w-full max-w-lg animate-aparecer lg:max-w-none"
          style={{ animationDelay: "0.18s" }}
        >
          <div className="relative aspect-[4/4.4] w-full">
            {/* Formas curvas en verde petróleo */}
            <div
              className="absolute inset-x-[6%] bottom-0 top-[10%] rounded-[46%_54%_42%_58%/40%_38%_62%_60%] bg-petroleo-700"
              aria-hidden="true"
            />
            <div
              className="absolute inset-x-[13%] bottom-[6%] top-[18%] rounded-[54%_46%_58%_42%/48%_52%_48%_52%] border border-white/15"
              aria-hidden="true"
            />
            <div
              className="absolute inset-x-[6%] bottom-0 top-[10%] rounded-[46%_54%_42%_58%/40%_38%_62%_60%] patron-huellas-claro"
              aria-hidden="true"
            />

            {/* Mascota */}
            <Image
              src="/mascota/saltando.png"
              alt="Perro de La Cocina Canina saltando por sus snacks"
              width={733}
              height={1100}
              priority
              className="absolute bottom-0 left-1/2 h-[94%] w-auto -translate-x-1/2 object-contain drop-shadow-[0_30px_36px_rgba(2,34,38,0.35)]"
            />

            {/* Snacks flotando */}
            {FLOTANTES.map((f) => (
              <span
                key={f.src}
                className={`absolute ${f.alto} ${f.lado} ${f.medida} animate-flotar`}
                style={{ animationDelay: f.retraso, animationDuration: f.duracion }}
                aria-hidden="true"
              >
                <span className="block rounded-full bg-white/90 p-3 shadow-tarjeta backdrop-blur">
                  <Image
                    src={f.src}
                    alt=""
                    width={220}
                    height={220}
                    className="h-full w-full object-contain"
                  />
                </span>
              </span>
            ))}

            {/* Sello */}
            <SelloCircular
              texto="Perfecto para perros de todas las edades"
              className="absolute -bottom-3 -right-1 w-32 md:w-36 lg:-right-4"
            />
          </div>
        </div>
      </div>

      <Onda className="block h-8 w-full text-white md:h-12" />
    </section>
  );
}
