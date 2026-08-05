"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { useTienda } from "@/context/Tienda";
import { clienteDemo } from "@/data/cuenta";
import { MarcoAuth } from "@/components/auth/MarcoAuth";
import { Boton } from "@/components/ui/Boton";
import { Campo, CampoClave, Casilla, Select } from "@/components/ui/Campos";

function BotonGoogle() {
  return (
    <button
      type="button"
      className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-petroleo-700/15 bg-white text-sm font-semibold text-petroleo-800 transition-colors hover:border-petroleo-700/35"
    >
      <svg viewBox="0 0 24 24" className="h-[1.125rem] w-[1.125rem]" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z"
        />
        <path
          fill="#FBBC05"
          d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1Z"
        />
        <path
          fill="#EA4335"
          d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z"
        />
      </svg>
      Continuar con Google
    </button>
  );
}

function Separador() {
  return (
    <div className="my-6 flex items-center gap-4">
      <span className="h-px flex-1 bg-petroleo-700/12" />
      <span className="text-xs font-semibold uppercase tracking-wider text-grafito">
        o con tu correo
      </span>
      <span className="h-px flex-1 bg-petroleo-700/12" />
    </div>
  );
}

/* ------------------------------ Iniciar sesión ---------------------------- */

export function FormularioIngreso() {
  const router = useRouter();
  const { iniciarSesion } = useTienda();
  const [correo, setCorreo] = useState(clienteDemo.correo);

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    iniciarSesion(clienteDemo.nombres, correo);
    router.push("/cuenta");
  };

  return (
    <MarcoAuth
      pose="mirada"
      titulo="Qué bueno verte de nuevo"
      texto="Entra a tu cuenta para revisar tus puntos, repetir pedidos y guardar el perfil de tus mascotas."
      ventajas={[
        "Tus puntos del Club siempre a la mano",
        "Repite un pedido anterior en un clic",
        "Direcciones y mascotas guardadas",
      ]}
      pie={
        <>
          ¿Aún no tienes cuenta?{" "}
          <Link href="/registro" className="font-semibold text-naranja-600 hover:underline">
            Regístrate gratis
          </Link>
        </>
      }
    >
      <h2 className="font-display text-2xl font-semibold text-petroleo-900">
        Iniciar sesión
      </h2>
      <p className="mt-2 text-sm text-grafito">
        Este es un prototipo: con cualquier dato entrarás a la cuenta de demostración.
      </p>

      <div className="mt-7">
        <BotonGoogle />
        <Separador />

        <form onSubmit={enviar} className="space-y-5">
          <Campo
            etiqueta="Correo electrónico"
            type="email"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="tucorreo@ejemplo.pe"
          />
          <CampoClave
            etiqueta="Contraseña"
            required
            defaultValue="demo1234"
            placeholder="••••••••"
          />

          <div className="flex items-center justify-between gap-3">
            <Casilla etiqueta="Recordarme" defaultChecked />
            <Link
              href="/ingresar"
              className="text-xs font-semibold text-naranja-600 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Boton type="submit" variante="primario" medida="lg" className="w-full">
            <LogIn className="h-4 w-4" />
            Entrar a mi cuenta
          </Boton>
        </form>
      </div>
    </MarcoAuth>
  );
}

/* -------------------------------- Registro -------------------------------- */

export function FormularioRegistro() {
  const router = useRouter();
  const { iniciarSesion } = useTienda();
  const [datos, setDatos] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    celular: "",
    nacimiento: "",
    mascota: "",
    tipo: "Perro",
    raza: "",
    peso: "",
    nacimientoMascota: "",
  });
  const [acepta, setAcepta] = useState(false);

  const actualizar = (campo: keyof typeof datos, valor: string) =>
    setDatos((d) => ({ ...d, [campo]: valor }));

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (!acepta) return;
    iniciarSesion(datos.nombres || clienteDemo.nombres, datos.correo);
    router.push("/cuenta");
  };

  return (
    <MarcoAuth
      pose="saltando"
      titulo="Únete al Club Cocina Canina"
      texto="Crear tu cuenta es gratis, toma un minuto y te damos 20 puntos de bienvenida."
      ventajas={[
        "20 puntos de regalo al registrarte",
        "1 punto por cada S/ 10 de compra",
        "Perfil de cada una de tus mascotas",
        "Historial de pedidos y repetición rápida",
      ]}
      pie={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link href="/ingresar" className="font-semibold text-naranja-600 hover:underline">
            Inicia sesión
          </Link>
        </>
      }
    >
      <h2 className="font-display text-2xl font-semibold text-petroleo-900">
        Crear cuenta
      </h2>

      <div className="mt-6">
        <BotonGoogle />
        <Separador />

        <form onSubmit={enviar} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Campo
              etiqueta="Nombres"
              required
              value={datos.nombres}
              onChange={(e) => actualizar("nombres", e.target.value)}
              placeholder="Andrea"
            />
            <Campo
              etiqueta="Apellidos"
              required
              value={datos.apellidos}
              onChange={(e) => actualizar("apellidos", e.target.value)}
              placeholder="Salazar Vega"
            />
            <Campo
              etiqueta="Correo electrónico"
              type="email"
              required
              value={datos.correo}
              onChange={(e) => actualizar("correo", e.target.value)}
              placeholder="andrea@ejemplo.pe"
            />
            <Campo
              etiqueta="Celular"
              type="tel"
              required
              value={datos.celular}
              onChange={(e) => actualizar("celular", e.target.value)}
              placeholder="987 654 321"
            />
            <CampoClave etiqueta="Contraseña" required placeholder="Mínimo 8 caracteres" />
            <CampoClave etiqueta="Repite la contraseña" required placeholder="••••••••" />
            <Campo
              etiqueta="Fecha de nacimiento"
              opcional
              type="date"
              contenedor="sm:col-span-2"
              value={datos.nacimiento}
              onChange={(e) => actualizar("nacimiento", e.target.value)}
              ayuda="La usamos para enviarte un cupón de cumpleaños"
            />
          </div>

          {/* Mascota */}
          <fieldset className="rounded-3xl border border-petroleo-700/10 bg-crema-50 p-5">
            <legend className="px-2 text-xs font-bold uppercase tracking-[0.1em] text-petroleo-800">
              Tu mascota
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Campo
                etiqueta="Nombre de tu mascota"
                required
                value={datos.mascota}
                onChange={(e) => actualizar("mascota", e.target.value)}
                placeholder="Rocco"
              />
              <Select
                etiqueta="Tipo de mascota"
                value={datos.tipo}
                onChange={(e) => actualizar("tipo", e.target.value)}
              >
                <option>Perro</option>
                <option>Gato</option>
                <option>Otro</option>
              </Select>
              <Campo
                etiqueta="Raza"
                opcional
                value={datos.raza}
                onChange={(e) => actualizar("raza", e.target.value)}
                placeholder="Mestizo"
              />
              <Campo
                etiqueta="Peso"
                opcional
                type="number"
                min={0}
                step="0.5"
                value={datos.peso}
                onChange={(e) => actualizar("peso", e.target.value)}
                placeholder="18"
                ayuda="En kilogramos"
              />
              <Campo
                etiqueta="Fecha de nacimiento de tu mascota"
                opcional
                type="date"
                contenedor="sm:col-span-2"
                value={datos.nacimientoMascota}
                onChange={(e) => actualizar("nacimientoMascota", e.target.value)}
              />
            </div>
            <p className="mt-4 text-xs text-grafito">
              Podrás registrar más mascotas después desde tu panel.
            </p>
          </fieldset>

          <Casilla
            checked={acepta}
            onChange={(e) => setAcepta(e.target.checked)}
            etiqueta={
              <>
                Acepto los{" "}
                <Link
                  href="/legal/terminos"
                  className="font-semibold text-naranja-600 hover:underline"
                >
                  términos y condiciones
                </Link>{" "}
                y la{" "}
                <Link
                  href="/legal/privacidad"
                  className="font-semibold text-naranja-600 hover:underline"
                >
                  política de privacidad
                </Link>
                .
              </>
            }
          />

          <Boton
            type="submit"
            variante="primario"
            medida="lg"
            className="w-full"
            disabled={!acepta}
          >
            <UserPlus className="h-4 w-4" />
            Crear mi cuenta
          </Boton>
        </form>
      </div>
    </MarcoAuth>
  );
}
