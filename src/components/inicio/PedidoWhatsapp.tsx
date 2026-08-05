import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { pedidoWhatsapp as porDefecto, sitio as sitioPorDefecto } from "@/data/sitio";
import { consultaGeneral } from "@/lib/whatsapp";
import { clasesBoton } from "@/components/ui/Boton";
import { Antetitulo } from "@/components/ui/Elementos";

const PASOS = [
  { n: "1", texto: "Elige tus snacks o tu plan BARF" },
  { n: "2", texto: "Envíanos la lista por WhatsApp" },
  { n: "3", texto: "Confirmamos stock, envío y horario" },
];

export function PedidoWhatsapp({
  bloque = porDefecto,
  contacto = sitioPorDefecto,
}: {
  bloque?: typeof porDefecto;
  contacto?: typeof sitioPorDefecto;
}) {
  const pedidoWhatsapp = bloque;
  const sitio = contacto;
  return (
    <section className="bg-crema-50 py-16 md:py-24">
      <div className="contenedor">
        <div className="relative overflow-hidden rounded-blob bg-petroleo-700 text-white shadow-elevada">
          <div className="absolute inset-0 patron-huellas-claro" aria-hidden="true" />
          <div
            className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#25D366]/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative grid items-center gap-10 p-8 md:grid-cols-[1.25fr_0.75fr] md:p-14">
            <div>
              <Antetitulo>Pedido rápido</Antetitulo>
              <h2 className="mt-4 titulo-seccion text-white">{pedidoWhatsapp.titulo}</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-petroleo-100">
                {pedidoWhatsapp.texto}
              </p>

              <ol className="mt-8 grid gap-4 sm:grid-cols-3">
                {PASOS.map((p) => (
                  <li key={p.n} className="flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-naranja-500 font-display text-sm font-bold text-white">
                      {p.n}
                    </span>
                    <span className="pt-1 text-sm leading-snug text-petroleo-100">
                      {p.texto}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <a
                  href={consultaGeneral(contacto.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clasesBoton("whatsapp", "lg")}
                >
                  <MessageCircle className="h-[1.125rem] w-[1.125rem]" />
                  {pedidoWhatsapp.boton}
                </a>
                <span className="font-display text-xl font-semibold text-white">
                  {sitio.telefono}
                </span>
              </div>
            </div>

            <div className="relative hidden justify-self-center md:block">
              <Image
                src="/mascota/mirada.png"
                alt=""
                width={716}
                height={1100}
                className="h-64 w-auto object-contain drop-shadow-[0_24px_28px_rgba(2,34,38,0.4)] lg:h-72"
              />
              <span className="absolute -left-10 top-6 max-w-[9rem] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm font-medium text-petroleo-900 shadow-tarjeta">
                ¿Ya pediste mis snacks? 🐾
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
