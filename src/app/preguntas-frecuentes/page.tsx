import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { consultaGeneral } from "@/lib/whatsapp";
import { ListaFaq } from "@/components/faq/ListaFaq";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { Boton } from "@/components/ui/Boton";
import { obtenerConfiguracion, obtenerPreguntas } from "@/server/contenido";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Conservación, niveles de dureza, delivery, programa de puntos, compras por mayor y alimentación BARF: todo lo que suelen preguntarnos.",
};

export default async function PaginaFaq() {
  const [preguntas, config] = await Promise.all([
    obtenerPreguntas(),
    obtenerConfiguracion(),
  ]);

  return (
    <>
      <CabeceraPagina
        antetitulo="Ayuda"
        titulo="Preguntas frecuentes"
        texto="Conservación, dureza, delivery, puntos y BARF. Si algo no está acá, escríbenos y lo resolvemos al toque."
        migajas={[{ nombre: "Inicio", href: "/" }, { nombre: "Preguntas frecuentes" }]}
        pose="mirada"
      />

      <section className="py-14 md:py-16">
        <div className="contenedor max-w-3xl">
          <ListaFaq preguntas={preguntas} />
        </div>
      </section>

      <section className="pb-20">
        <div className="contenedor">
          <div className="relative overflow-hidden rounded-blob bg-petroleo-700 p-8 text-center text-white md:p-12">
            <div className="absolute inset-0 patron-huellas-claro" aria-hidden="true" />
            <div className="relative mx-auto max-w-xl">
              <h2 className="font-display text-3xl font-semibold">
                ¿Sigues con dudas?
              </h2>
              <p className="mt-3 text-petroleo-100">
                Escríbenos al {config.contacto.telefono}. Te ayudamos a elegir el snack
                correcto según el tamaño, la edad y la forma de masticar de tu perro.
              </p>
              <Boton
                href={consultaGeneral(config.contacto.whatsapp)}
                externo
                variante="whatsapp"
                medida="lg"
                className="mt-7"
              >
                <MessageCircle className="h-4 w-4" />
                Escribir por WhatsApp
              </Boton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
