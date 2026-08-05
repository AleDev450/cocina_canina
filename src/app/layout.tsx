import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ProveedorTienda } from "@/context/Tienda";
import { Encabezado } from "@/components/layout/Encabezado";
import { PieDePagina } from "@/components/layout/PieDePagina";
import { CarritoLateral } from "@/components/layout/CarritoLateral";
import { Buscador } from "@/components/layout/Buscador";
import { AccionesFlotantes } from "@/components/layout/AccionesFlotantes";
import { Cascaron } from "@/components/layout/Cascaron";
import { sitio as sitioPorDefecto } from "@/data/sitio";
import { obtenerProductos } from "@/server/catalogo";
import { obtenerConfiguracion } from "@/server/contenido";
import { perfilActual } from "@/server/sesion";
import { obtenerRegla } from "@/server/recompensas";
import { reglaPuntos as REGLA_POR_DEFECTO } from "@/data/recompensas";
import { hayConexion } from "@/lib/supabase/entorno";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--fuente-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--fuente-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lacocinacanina.pe"),
  title: {
    default: `${sitioPorDefecto.nombre} — Snacks naturales y alimentación BARF para perros`,
    template: `%s · ${sitioPorDefecto.nombre}`,
  },
  description: sitioPorDefecto.descripcion,
  keywords: [
    "snacks para perros",
    "BARF Perú",
    "snacks deshidratados",
    "alimentación natural para perros",
    "La Cocina Canina",
  ],
  openGraph: {
    title: `${sitioPorDefecto.nombre} — Lo mejor para tu mejor amigo`,
    description: sitioPorDefecto.descripcion,
    type: "website",
    locale: "es_PE",
  },
  icons: { icon: "/marca/logo-cuadrado.png" },
};

export const viewport: Viewport = {
  themeColor: "#005159",
};

export default async function LayoutRaiz({
  children,
}: {
  children: React.ReactNode;
}) {
  // La cabecera y el buscador se alimentan del catálogo y de la configuración.
  // Si Supabase todavía no está conectado, la web sigue funcionando con los
  // valores por defecto en lugar de reventar.
  let productos: Awaited<ReturnType<typeof obtenerProductos>> = [];
  let contacto = sitioPorDefecto;
  let sesionActiva = false;
  let regla = REGLA_POR_DEFECTO;

  if (hayConexion) {
    const [listado, config, perfil, reglaActual] = await Promise.all([
      obtenerProductos().catch(() => []),
      obtenerConfiguracion().catch(() => null),
      perfilActual().catch(() => null),
      obtenerRegla().catch(() => null),
    ]);
    productos = listado;
    if (config) contacto = config.contacto;
    if (reglaActual) regla = reglaActual;
    sesionActiva = Boolean(perfil);
  }

  const buscables = productos.map((p) => ({
    slug: p.slug,
    nombre: p.nombre,
    dureza: p.dureza,
    beneficioPrincipal: p.beneficioPrincipal,
    descripcion: p.descripcion,
    proteinas: p.proteinas,
    imagen: p.imagen,
    precioDesde: p.presentaciones.length
      ? Math.min(...p.presentaciones.map((v) => v.precio))
      : 0,
  }));

  return (
    <html lang="es-PE" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <ProveedorTienda regla={regla}>
          <Cascaron
            encabezado={<Encabezado contacto={contacto} sesionActiva={sesionActiva} />}
            pie={<PieDePagina contacto={contacto} />}
            paneles={
              <>
                <CarritoLateral />
                <Buscador productos={buscables} />
                <AccionesFlotantes whatsapp={contacto.whatsapp} />
              </>
            }
          >
            {children}
          </Cascaron>
        </ProveedorTienda>
      </body>
    </html>
  );
}
