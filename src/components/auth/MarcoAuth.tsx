import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { Logo } from "@/components/ui/Elementos";
import { Huella } from "@/components/ui/Iconos";

/** Marco de dos columnas para iniciar sesión y registrarse. */
export function MarcoAuth({
  titulo,
  texto,
  ventajas,
  pose = "sentado",
  children,
  pie,
}: {
  titulo: string;
  texto: string;
  ventajas: string[];
  pose?: "sentado" | "mirada" | "saltando";
  children: ReactNode;
  pie: ReactNode;
}) {
  return (
    <div className="contenedor py-12 md:py-16">
      <div className="grid overflow-hidden rounded-blob border border-petroleo-700/10 bg-white lg:grid-cols-[0.9fr_1.1fr]">
        {/* Panel de bienvenida */}
        <div className="relative flex flex-col justify-between bg-petroleo-800 p-8 text-white md:p-10">
          <div className="absolute inset-0 patron-huellas-claro" aria-hidden="true" />
          <div
            className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-naranja-500/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative">
            <Link href="/" aria-label="Ir al inicio">
              <Logo variante="blanco" className="h-10 w-auto" />
            </Link>

            <h1 className="mt-10 font-display text-3xl font-semibold leading-tight md:text-4xl">
              {titulo}
            </h1>
            <p className="mt-4 max-w-sm leading-relaxed text-petroleo-100">{texto}</p>

            <ul className="mt-8 space-y-3">
              {ventajas.map((v) => (
                <li key={v} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-naranja-500">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-petroleo-100">{v}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mt-10 flex items-end justify-between gap-4">
            <p className="flex items-center gap-2 text-xs text-petroleo-100">
              <Huella className="h-4 w-4 text-naranja-400" />
              Club Cocina Canina
            </p>
            <Image
              src={`/mascota/${pose}.png`}
              alt=""
              width={1029}
              height={1100}
              className="h-36 w-auto object-contain drop-shadow-[0_20px_24px_rgba(2,34,38,0.4)] md:h-44"
            />
          </div>
        </div>

        {/* Formulario */}
        <div className="p-8 md:p-12">
          {children}
          <div className="mt-8 border-t border-petroleo-700/10 pt-6 text-center text-sm text-grafito">
            {pie}
          </div>
        </div>
      </div>
    </div>
  );
}
