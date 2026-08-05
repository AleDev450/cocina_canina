import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { quienesSomos as porDefecto } from "@/data/sitio";
import { Boton } from "@/components/ui/Boton";
import { Antetitulo } from "@/components/ui/Elementos";
import { iconosPorNombre, type NombreIcono } from "@/components/ui/Iconos";

const ESTANTE = [
  "/empaques/snacks-bolsa-res.png",
  "/empaques/patitas-bolsa.png",
  "/empaques/pejerrey-bolsa.png",
];

export function QuienesSomos({
  quienesSomos = porDefecto,
}: {
  quienesSomos?: typeof porDefecto;
}) {
  return (
    <section id="nosotros" className="bg-white py-16 md:py-24">
      <div className="contenedor grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        {/* Texto */}
        <div className="order-2 lg:order-1">
          <Antetitulo>{quienesSomos.antetitulo}</Antetitulo>
          <h2 className="mt-4 titulo-seccion text-petroleo-900">
            {quienesSomos.titulo}
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-grafito">
            {quienesSomos.texto}
          </p>

          <ul className="mt-9 space-y-5">
            {quienesSomos.valores.map((v) => {
              const Icono = iconosPorNombre[v.icono as NombreIcono];
              return (
                <li key={v.titulo} className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-crema-100 text-petroleo-700">
                    <Icono className="h-[1.375rem] w-[1.375rem]" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-petroleo-900">
                      {v.titulo}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-grafito">{v.texto}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <Boton href="/nosotros" variante="petroleo" medida="lg" className="mt-9">
            Conoce nuestra historia
            <ArrowRight className="h-4 w-4" />
          </Boton>
        </div>

        {/* Escena de tienda */}
        <div className="order-1 lg:order-2">
          <div className="relative mx-auto aspect-[4/4.2] w-full max-w-lg">
            {/* Panel de fondo */}
            <div className="absolute inset-0 overflow-hidden rounded-blob bg-petroleo-700 patron-huellas-claro">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/8 to-transparent" />
            </div>

            {/* Perro detrás del mostrador */}
            <Image
              src="/mascota/sentado.png"
              alt="La mascota de La Cocina Canina en el mostrador de la tienda"
              width={1029}
              height={1100}
              className="absolute bottom-[24%] left-1/2 h-[58%] w-auto -translate-x-1/2 object-contain drop-shadow-[0_24px_28px_rgba(2,34,38,0.4)]"
            />

            {/* Mostrador */}
            <div className="absolute inset-x-[6%] bottom-[9%] h-[26%] rounded-[1.75rem] bg-crema-100 shadow-elevada">
              <div className="absolute inset-x-4 top-3 h-px bg-petroleo-700/10" />
              <div className="flex h-full items-end justify-center gap-3 px-5 pb-4">
                {ESTANTE.map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    width={300}
                    height={400}
                    className="h-[78%] w-auto object-contain drop-shadow-[0_10px_12px_rgba(8,54,59,0.18)]"
                    style={{ transform: `translateY(${i === 1 ? "-8%" : "0"})` }}
                  />
                ))}
              </div>
            </div>

            {/* Frascos con snacks sueltos */}
            <div className="absolute left-[4%] top-[14%] w-24 rounded-3xl bg-white/95 p-3 shadow-tarjeta backdrop-blur">
              <Image
                src="/productos/colita-de-res.png"
                alt=""
                width={200}
                height={300}
                className="mx-auto h-16 w-auto object-contain"
              />
              <p className="mt-1.5 text-center text-[0.6rem] font-bold uppercase tracking-wide text-petroleo-700">
                Lote del día
              </p>
            </div>

            <div className="absolute right-[3%] top-[8%] w-28 rounded-3xl bg-naranja-500 p-3.5 text-white shadow-tarjeta">
              <p className="font-display text-2xl font-semibold leading-none">24</p>
              <p className="mt-1 text-[0.65rem] font-semibold uppercase leading-tight tracking-wide">
                snacks de ingrediente único
              </p>
            </div>

            <div className="absolute right-[6%] top-[42%] w-24 rounded-3xl bg-white/95 p-3 shadow-tarjeta backdrop-blur">
              <Image
                src="/productos/cuerno-de-cabra.png"
                alt=""
                width={200}
                height={300}
                className="mx-auto h-16 w-auto object-contain"
              />
              <p className="mt-1.5 text-center text-[0.6rem] font-bold uppercase tracking-wide text-petroleo-700">
                Sin aditivos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
