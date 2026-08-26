import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hoja, Hueso, HuesoContorno } from "@/components/ui/Iconos";
import { Boton } from "@/components/ui/Boton";

/**
 * Elige por textura, no por moda.
 *
 * Cada tarjeta enlaza a la categoría de dureza que ya existe en el catálogo
 * (`/productos?categoria=…`), así que no hace falta ninguna ruta nueva.
 * Las tres fotos son de Dante con el producto correspondiente en la boca.
 */
const TEXTURAS = [
  {
    slug: "dureza-suave",
    nombre: "Suave",
    texto: "Ideal para premiar a perros pequeños.",
    imagen: "/images/dante/saboreando.png",
    ancho: 808,
    alto: 1300,
    Icono: Hoja,
  },
  {
    slug: "dureza-media",
    nombre: "Media",
    texto: "Masticación balanceada y beneficios funcionales.",
    imagen: "/images/dante/dureza_producto.png",
    ancho: 809,
    alto: 1300,
    Icono: HuesoContorno,
  },
  {
    slug: "larga-duracion",
    nombre: "Larga duración",
    texto: "Para masticadores activos y exigentes.",
    imagen: "/images/dante/masticando_producto.png",
    ancho: 1128,
    alto: 909,
    Icono: Hueso,
  },
];

export function Texturas() {
  return (
    <section className="bg-crema-50 py-16 md:py-20">
      <div className="contenedor">
        <h2 className="titulo-seccion text-center text-petroleo-900">
          Elige por <span className="text-naranja-500">textura</span>, no por moda
        </h2>

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {TEXTURAS.map(({ slug, nombre, texto, imagen, ancho, alto, Icono }) => (
            <li key={slug}>
              <Link
                href={`/productos?categoria=${slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[24px] bg-durazno-claro transition-shadow hover:shadow-tarjeta"
              >
                {/* object-contain a altura completa: Dante entra entero, sin
                    que el recorte le corte la cabeza ni las orejas. */}
                <span className="relative block h-60 overflow-hidden bg-durazno/50">
                  <Image
                    src={imagen}
                    alt={`Dante con un snack de dureza ${nombre.toLowerCase()}`}
                    width={ancho}
                    height={alto}
                    loading="lazy"
                    sizes="(max-width: 767px) 92vw, 30vw"
                    className="absolute inset-x-0 bottom-0 mx-auto h-[96%] w-auto object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </span>
                <span className="flex flex-1 flex-col gap-1.5 px-5 py-5">
                  <span className="flex items-center gap-2 font-display text-xl font-semibold text-petroleo-900">
                    <Icono className="h-5 w-5 text-naranja-500" />
                    {nombre}
                  </span>
                  <span className="text-sm leading-relaxed text-grafito">{texto}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <Boton href="/productos" variante="contorno" medida="md">
            Ver todos los productos
            <ArrowRight className="h-4 w-4" />
          </Boton>
        </div>
      </div>
    </section>
  );
}
