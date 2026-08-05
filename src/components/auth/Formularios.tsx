"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { ingresar, registrarse, recuperarClave } from "@/server/acciones/auth";
import { MarcoAuth } from "@/components/auth/MarcoAuth";
import { Campo, CampoClave, Casilla, Select } from "@/components/ui/Campos";
import {
  Aviso,
  BotonEnviar,
  ErrorCampo,
  ESTADO_INICIAL,
} from "@/components/ui/Formulario";

/* ------------------------------ Iniciar sesión ---------------------------- */

export function FormularioIngreso({ siguiente }: { siguiente?: string }) {
  const [estado, accion] = useActionState(ingresar, ESTADO_INICIAL);
  const [recuperando, setRecuperando] = useState(false);

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
        {recuperando ? "Recuperar contraseña" : "Iniciar sesión"}
      </h2>

      {recuperando ? (
        <FormularioRecuperar alVolver={() => setRecuperando(false)} />
      ) : (
        <form action={accion} className="mt-7 space-y-5">
          {siguiente ? (
            <input type="hidden" name="siguiente" value={siguiente} />
          ) : null}

          <Aviso estado={estado} />

          <div>
            <Campo
              etiqueta="Correo electrónico"
              name="correo"
              type="email"
              required
              autoComplete="email"
              placeholder="tucorreo@ejemplo.pe"
            />
            <ErrorCampo estado={estado} campo="correo" />
          </div>

          <div>
            <CampoClave
              etiqueta="Contraseña"
              name="clave"
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
            <ErrorCampo estado={estado} campo="clave" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Casilla etiqueta="Recordarme" name="recordar" defaultChecked />
            <button
              type="button"
              onClick={() => setRecuperando(true)}
              className="text-xs font-semibold text-naranja-600 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <BotonEnviar medida="lg" className="w-full" enviando="Entrando…">
            <LogIn className="h-4 w-4" />
            Entrar a mi cuenta
          </BotonEnviar>
        </form>
      )}
    </MarcoAuth>
  );
}

function FormularioRecuperar({ alVolver }: { alVolver: () => void }) {
  const [estado, accion] = useActionState(recuperarClave, ESTADO_INICIAL);

  return (
    <form action={accion} className="mt-7 space-y-5">
      <p className="text-sm text-grafito">
        Escribe tu correo y te enviamos un enlace para crear una contraseña nueva.
      </p>

      <Aviso estado={estado} />

      <div>
        <Campo
          etiqueta="Correo electrónico"
          name="correo"
          type="email"
          required
          placeholder="tucorreo@ejemplo.pe"
        />
        <ErrorCampo estado={estado} campo="correo" />
      </div>

      <BotonEnviar medida="lg" className="w-full" enviando="Enviando…">
        Enviar enlace
      </BotonEnviar>

      <button
        type="button"
        onClick={alVolver}
        className="w-full text-xs font-semibold text-grafito transition-colors hover:text-naranja-600"
      >
        ← Volver a iniciar sesión
      </button>
    </form>
  );
}

/* -------------------------------- Registro -------------------------------- */

export function FormularioRegistro() {
  const [estado, accion] = useActionState(registrarse, ESTADO_INICIAL);

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

      <form action={accion} className="mt-6 space-y-6">
        <Aviso estado={estado} />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Campo etiqueta="Nombres" name="nombres" required placeholder="Andrea" />
            <ErrorCampo estado={estado} campo="nombres" />
          </div>
          <div>
            <Campo
              etiqueta="Apellidos"
              name="apellidos"
              required
              placeholder="Salazar Vega"
            />
            <ErrorCampo estado={estado} campo="apellidos" />
          </div>
          <div>
            <Campo
              etiqueta="Correo electrónico"
              name="correo"
              type="email"
              required
              autoComplete="email"
              placeholder="andrea@ejemplo.pe"
            />
            <ErrorCampo estado={estado} campo="correo" />
          </div>
          <div>
            <Campo
              etiqueta="Celular"
              name="celular"
              type="tel"
              required
              placeholder="987 654 321"
            />
            <ErrorCampo estado={estado} campo="celular" />
          </div>
          <div>
            <CampoClave
              etiqueta="Contraseña"
              name="clave"
              required
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
            />
            <ErrorCampo estado={estado} campo="clave" />
          </div>
          <div>
            <CampoClave
              etiqueta="Repite la contraseña"
              name="repetir"
              required
              autoComplete="new-password"
              placeholder="••••••••"
            />
            <ErrorCampo estado={estado} campo="repetir" />
          </div>
          <Campo
            etiqueta="Fecha de nacimiento"
            name="nacimiento"
            opcional
            type="date"
            contenedor="sm:col-span-2"
            ayuda="La usamos para enviarte un cupón de cumpleaños"
          />
        </div>

        <fieldset className="rounded-3xl border border-petroleo-700/10 bg-crema-50 p-5">
          <legend className="px-2 text-xs font-bold uppercase tracking-[0.1em] text-petroleo-800">
            Tu mascota
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Campo
              etiqueta="Nombre de tu mascota"
              name="mascota"
              opcional
              placeholder="Rocco"
            />
            <Select etiqueta="Tipo de mascota" name="especie" defaultValue="Perro">
              <option>Perro</option>
              <option>Gato</option>
              <option>Otro</option>
            </Select>
            <Campo etiqueta="Raza" name="raza" opcional placeholder="Mestizo" />
            <Campo
              etiqueta="Peso"
              name="peso"
              opcional
              type="number"
              min={0}
              step="0.5"
              placeholder="18"
              ayuda="En kilogramos"
            />
            <Campo
              etiqueta="Fecha de nacimiento de tu mascota"
              name="nacimientoMascota"
              opcional
              type="date"
              contenedor="sm:col-span-2"
            />
          </div>
          <p className="mt-4 text-xs text-grafito">
            Podrás registrar más mascotas después desde tu panel.
          </p>
        </fieldset>

        <div>
          <Casilla
            name="terminos"
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
          <ErrorCampo estado={estado} campo="terminos" />
        </div>

        <BotonEnviar medida="lg" className="w-full" enviando="Creando cuenta…">
          <UserPlus className="h-4 w-4" />
          Crear mi cuenta
        </BotonEnviar>
      </form>
    </MarcoAuth>
  );
}
