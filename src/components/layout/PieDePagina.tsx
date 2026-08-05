import Link from "next/link";
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { navegacion, politicas, sitio } from "@/data/sitio";
import { consultaGeneral } from "@/lib/whatsapp";
import { Logo } from "@/components/ui/Elementos";
import { Huella, Onda } from "@/components/ui/Iconos";

function IconoTikTok({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .76-5.07v-3.1a5.66 5.66 0 0 0-.76-.05A5.66 5.66 0 1 0 15.54 15.4V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.24-1.48Z" />
    </svg>
  );
}

const cuenta = [
  { nombre: "Iniciar sesión", href: "/ingresar" },
  { nombre: "Crear cuenta", href: "/registro" },
  { nombre: "Mis pedidos", href: "/cuenta/pedidos" },
  { nombre: "Mis puntos", href: "/cuenta/recompensas" },
  { nombre: "Mis mascotas", href: "/cuenta/mascotas" },
  { nombre: "Favoritos", href: "/cuenta/favoritos" },
];

export function PieDePagina() {
  return (
    <footer className="relative mt-auto bg-petroleo-800 text-petroleo-100">
      <Onda className="absolute -top-[1px] left-0 h-10 w-full text-crema-50" invertida />

      <div className="patron-huellas-claro">
        <div className="contenedor pb-10 pt-24">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
            {/* Marca */}
            <div className="space-y-5">
              <Logo variante="blanco" className="h-12 w-auto" />
              <p className="max-w-xs text-sm leading-relaxed text-petroleo-100/80">
                Snacks deshidratados de ingrediente único y alimentación BARF, hechos
                de forma artesanal para cuidar la salud y felicidad de tu mascota.
              </p>
              <div className="flex gap-2.5">
                <a
                  href={`https://instagram.com/${sitio.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-naranja-500"
                >
                  <Instagram className="h-[1.1rem] w-[1.1rem]" />
                </a>
                <a
                  href={`https://tiktok.com/@${sitio.tiktok}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-naranja-500"
                >
                  <IconoTikTok className="h-[1.1rem] w-[1.1rem]" />
                </a>
                <a
                  href={consultaGeneral()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#25D366] hover:text-[#053f22]"
                >
                  <MessageCircle className="h-[1.1rem] w-[1.1rem]" />
                </a>
              </div>
            </div>

            {/* Navegación */}
            <nav aria-label="Navegación del sitio">
              <h2 className="mb-4 font-display text-base font-semibold text-white">
                Navegación
              </h2>
              <ul className="space-y-2.5 text-sm">
                {navegacion.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-petroleo-100/80 transition-colors hover:text-naranja-300"
                    >
                      {item.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mi cuenta */}
            <nav aria-label="Mi cuenta">
              <h2 className="mb-4 font-display text-base font-semibold text-white">
                Mi cuenta
              </h2>
              <ul className="space-y-2.5 text-sm">
                {cuenta.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-petroleo-100/80 transition-colors hover:text-naranja-300"
                    >
                      {item.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contacto */}
            <div>
              <h2 className="mb-4 font-display text-base font-semibold text-white">
                Contacto
              </h2>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-naranja-400" />
                  <span className="text-petroleo-100/80">{sitio.telefono}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-naranja-400" />
                  <a
                    href={consultaGeneral()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-petroleo-100/80 transition-colors hover:text-naranja-300"
                  >
                    Escríbenos por WhatsApp
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-naranja-400" />
                  <span className="text-petroleo-100/80">{sitio.correo}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-naranja-400" />
                  <span className="text-petroleo-100/80">
                    {sitio.ciudad}
                    <br />
                    {sitio.horario}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal */}
          <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-7 text-xs text-petroleo-100/70 md:flex-row md:items-center md:justify-between">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {politicas.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="transition-colors hover:text-naranja-300">
                    {p.nombre}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/preguntas-frecuentes"
                  className="transition-colors hover:text-naranja-300"
                >
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
            <p className="flex items-center gap-1.5">
              <Huella className="h-3.5 w-3.5 text-naranja-400" />
              © {new Date().getFullYear()} {sitio.nombre}. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
