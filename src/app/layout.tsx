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
import { sitio } from "@/data/sitio";

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
    default: `${sitio.nombre} — Snacks naturales y alimentación BARF para perros`,
    template: `%s · ${sitio.nombre}`,
  },
  description: sitio.descripcion,
  keywords: [
    "snacks para perros",
    "BARF Perú",
    "snacks deshidratados",
    "alimentación natural para perros",
    "La Cocina Canina",
  ],
  openGraph: {
    title: `${sitio.nombre} — Lo mejor para tu mejor amigo`,
    description: sitio.descripcion,
    type: "website",
    locale: "es_PE",
  },
  icons: { icon: "/marca/logo-cuadrado.png" },
};

export const viewport: Viewport = {
  themeColor: "#005159",
};

export default function LayoutRaiz({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <ProveedorTienda>
          <Cascaron
            encabezado={<Encabezado />}
            pie={<PieDePagina />}
            paneles={
              <>
                <CarritoLateral />
                <Buscador />
                <AccionesFlotantes />
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
