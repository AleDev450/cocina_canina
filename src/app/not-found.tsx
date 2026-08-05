import { Boton } from "@/components/ui/Boton";
import { EstadoVacio } from "@/components/ui/Elementos";

export default function NoEncontrado() {
  return (
    <div className="contenedor flex min-h-[62vh] items-center justify-center py-16">
      <div className="w-full max-w-lg rounded-blob border border-petroleo-700/10 bg-white patron-huellas">
        <EstadoVacio
          pose="mirada"
          titulo="Aquí no hay nada que masticar"
          texto="La página que buscas no existe o cambió de dirección. Volvamos a un lugar conocido."
          accion={
            <div className="flex flex-wrap justify-center gap-3">
              <Boton href="/" variante="primario" medida="md">
                Ir al inicio
              </Boton>
              <Boton href="/productos" variante="contorno" medida="md">
                Ver productos
              </Boton>
            </div>
          }
        />
      </div>
    </div>
  );
}
