import Image from "next/image";
import { ArrowRight, CalendarClock, Package, Store } from "lucide-react";
import { ANTICIPACION_MAYOR } from "@/data/mayoreo";
import { Boton } from "@/components/ui/Boton";
import { Antetitulo } from "@/components/ui/Elementos";

const VENTAJAS = [
  {
    icono: Store,
    titulo: "Para tiendas y veterinarias",
    texto: "Precio diferenciado y reposición constante.",
  },
  {
    icono: Package,
    titulo: "Kilo, docena o ciento",
    texto: "Presentaciones pensadas para reventa.",
  },
  {
    icono: CalendarClock,
    titulo: "Producción por lote",
    texto: "Solicita con 3 días de anticipación.",
  },
];

export function PorMayorBanner() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="contenedor">
        <div className="relative overflow-hidden rounded-blob border border-petroleo-700/10 bg-crema-100">
          <div className="absolute inset-0 patron-huellas opacity-60" aria-hidden="true" />
          <div
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-naranja-100/60 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative grid items-center gap-10 p-8 md:p-12 lg:grid-cols-[1.2fr_1fr] lg:p-16">
            <div>
              <Antetitulo>Ventas por mayor</Antetitulo>
              <h2 className="mt-4 titulo-seccion text-petroleo-900">Compra por mayor</h2>
              <p className="mt-4 max-w-lg leading-relaxed text-grafito">
                Precios especiales para tiendas, distribuidores y clientes frecuentes.
                Elige las presentaciones que necesitas y te enviamos una cotización
                formal con disponibilidad y fecha de entrega.
              </p>

              <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                {VENTAJAS.map((v) => (
                  <li key={v.titulo} className="flex flex-col gap-2">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-naranja-600 shadow-suave">
                      <v.icono className="h-[1.125rem] w-[1.125rem]" />
                    </span>
                    <span className="text-sm font-bold text-petroleo-900">{v.titulo}</span>
                    <span className="text-xs leading-relaxed text-grafito">{v.texto}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Boton href="/por-mayor" variante="primario" medida="lg">
                  Solicitar cotización
                  <ArrowRight className="h-4 w-4" />
                </Boton>
                <p className="max-w-[15rem] text-xs leading-snug text-grafito">
                  {ANTICIPACION_MAYOR}
                </p>
              </div>
            </div>

            {/* Bodegón de empaques */}
            <div className="relative mx-auto grid w-full max-w-sm grid-cols-2 gap-4">
              {[
                "/empaques/snacks-bolsa-oscura.png",
                "/empaques/orejas-bolsa.png",
                "/empaques/power-stick-bolsa.png",
                "/empaques/traqueas-bolsa.png",
              ].map((src, i) => (
                <div
                  key={src}
                  className="grid aspect-square place-items-center rounded-3xl bg-white p-4 shadow-suave transition-transform duration-500 hover:-translate-y-1.5"
                  style={{ transform: `translateY(${i % 2 === 0 ? "0" : "1.25rem"})` }}
                >
                  <Image
                    src={src}
                    alt=""
                    width={320}
                    height={400}
                    className="h-full w-auto object-contain drop-shadow-[0_12px_14px_rgba(8,54,59,0.18)]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
