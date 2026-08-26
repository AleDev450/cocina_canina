import { ArrowRight, MessageCircle } from "lucide-react";
import type { PreguntaFrecuente } from "@/lib/tipos";
import { consultaGeneral } from "@/lib/whatsapp";
import { Acordeon } from "@/components/ui/Acordeon";
import { Boton } from "@/components/ui/Boton";
import { Antetitulo } from "@/components/ui/Elementos";

export function FaqInicio({
  preguntas,
  whatsapp,
}: {
  preguntas: PreguntaFrecuente[];
  whatsapp?: string;
}) {
  const items = preguntas
    .slice(0, 6)
    .map((p) => ({ id: p.id, pregunta: p.pregunta, respuesta: p.respuesta }));

  return (
    <section className="bg-crema-50 py-16 md:py-24">
      <div className="contenedor grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Antetitulo>Preguntas frecuentes</Antetitulo>
          <h2 className="mt-4 titulo-seccion text-petroleo-900">
            Resolvemos las dudas de siempre
          </h2>
          <p className="mt-4 leading-relaxed text-grafito">
            Y si queda alguna en el aire, escríbenos: respondemos rápido y te ayudamos a
            elegir el snack correcto según el tamaño, la edad y la mordida de tu perro.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Boton href="/preguntas-frecuentes" variante="petroleo" medida="md">
              Ver todas
              <ArrowRight className="h-4 w-4" />
            </Boton>
            <Boton href={consultaGeneral(whatsapp)} externo variante="contorno" medida="md">
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              Preguntar por WhatsApp
            </Boton>
          </div>
        </div>

        <Acordeon items={items} abiertoInicial="f1" />
      </div>
    </section>
  );
}
