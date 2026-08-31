import type { Metadata } from "next";
import Image from "next/image";
import { CalendarClock, Package, Percent } from "lucide-react";
import { ANTICIPACION_MAYOR } from "@/data/mayoreo";
import { obtenerLotesMayor } from "@/server/catalogo";
import { obtenerConfiguracion } from "@/server/contenido";
import { FormularioCotizacion } from "@/components/mayoreo/FormularioCotizacion";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { CabeceraSeccion, Pastilla } from "@/components/ui/Elementos";
import { precio } from "@/lib/formato";
import { hayConexion } from "@/lib/supabase/entorno";
import { SinConexion } from "@/components/layout/SinConexion";

export const metadata: Metadata = {
  title: "Compra por mayor",
  description:
    "Precios especiales para tiendas, veterinarias y distribuidores. Presentaciones por kilogramo, docena o ciento con cotización a medida.",
};

export const dynamic = "force-dynamic";

export default async function PaginaPorMayor() {
  if (!hayConexion) return <SinConexion />;

  const [lotesMayor, config] = await Promise.all([
    obtenerLotesMayor(),
    obtenerConfiguracion(),
  ]);

  return (
    <>
      <CabeceraPagina
        antetitulo="Ventas por mayor"
        titulo="Compra por mayor"
        texto="Precios especiales para tiendas, distribuidores y clientes frecuentes."
        migajas={[{ nombre: "Inicio", href: "/" }, { nombre: "Compra por mayor" }]}
        imagen={{ src: "/images/dante/alimentamos_felicidad.png", ancho: 1085, alto: 1282 }}
      />

      {/* Condiciones */}
      <section className="py-14">
        <div className="contenedor grid gap-5 sm:grid-cols-3">
          {[
            {
              icono: Package,
              titulo: "Presentaciones a granel",
              texto: "Por kilogramo, docena o ciento según el producto.",
            },
            {
              icono: Percent,
              titulo: "Precio por volumen",
              texto: "El costo unitario baja conforme sube la cantidad.",
            },
            {
              icono: CalendarClock,
              titulo: "3 días de anticipación",
              texto: "Producimos por lote para que llegue siempre fresco.",
            },
          ].map((c) => (
            <article
              key={c.titulo}
              className="flex gap-4 rounded-3xl border border-petroleo-700/10 bg-white p-6"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-naranja-50 text-naranja-600">
                <c.icono className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-base font-semibold text-petroleo-900">
                  {c.titulo}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-grafito">{c.texto}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Lista de precios */}
      <section className="bg-white py-16 md:py-20">
        <div className="contenedor">
          <CabeceraSeccion
            antetitulo="Lista de precios"
            titulo="Productos disponibles por mayor"
            texto="Estos son los lotes que producimos de forma regular. Si necesitas otro producto del catálogo en cantidad, pídelo en el formulario y lo cotizamos."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {lotesMayor.map((lote) => (
              <article
                key={lote.slug}
                className="flex flex-col overflow-hidden rounded-3xl border border-petroleo-700/10 bg-crema-50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-tarjeta"
              >
                <div className="flex items-start gap-4 border-b border-petroleo-700/10 bg-white p-5">
                  <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-crema-50">
                    <Image
                      src={lote.imagen}
                      alt=""
                      width={200}
                      height={200}
                      className="h-16 w-16 object-contain"
                    />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold leading-tight text-petroleo-900">
                      {lote.nombre}
                    </h3>
                    <p className="mt-1 text-xs text-grafito">
                      Mínimo: {lote.minimo} · {lote.unidad}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <ul className="space-y-2">
                    {lote.presentaciones.map((p) => {
                      const referencia = lote.presentaciones[0];
                      const unidadesRef = parseFloat(referencia.etiqueta) || 1;
                      const unidades = parseFloat(p.etiqueta) || 1;
                      const unitario = p.precio / unidades;
                      const unitarioRef = referencia.precio / unidadesRef;
                      const ahorro = Math.round(
                        ((unitarioRef - unitario) / unitarioRef) * 100,
                      );

                      return (
                        <li
                          key={p.etiqueta}
                          className="flex items-center justify-between gap-3 rounded-xl bg-white px-3.5 py-2.5"
                        >
                          <span className="text-sm font-medium text-petroleo-800">
                            {p.etiqueta}
                          </span>
                          <span className="flex items-center gap-2">
                            {ahorro >= 3 ? (
                              <Pastilla tono="suaveHoja">−{ahorro}%</Pastilla>
                            ) : null}
                            <span className="font-display text-base font-semibold tabular-nums text-petroleo-900">
                              {precio(p.precio)}
                            </span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  {lote.nota ? (
                    <p className="mt-4 text-xs leading-relaxed text-grafito">
                      {lote.nota}
                    </p>
                  ) : null}

                  {lote.productos.length > 1 ? (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {lote.productos.map((p) => (
                        <Pastilla key={p} tono="contorno">
                          {p}
                        </Pastilla>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          <p className="mt-8 rounded-2xl border border-naranja-500/25 bg-naranja-50 px-5 py-4 text-center text-sm font-medium text-naranja-800">
            {ANTICIPACION_MAYOR}
          </p>
        </div>
      </section>

      {/* Formulario */}
      <section className="py-16 md:py-20">
        <div className="contenedor max-w-4xl">
          <FormularioCotizacion whatsapp={config.contacto.whatsapp} />
        </div>
      </section>
    </>
  );
}
