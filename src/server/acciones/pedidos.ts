"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { clienteServidor, clienteAdministrador } from "@/lib/supabase/servidor";
import { exigirGrupo, usuarioActual } from "@/server/sesion";
import { obtenerRegla, calcularPuntos } from "@/server/recompensas";
import {
  INICIAL,
  exito,
  fallo,
  mensajeDeError,
  textoObligatorio,
  validar,
  type Resultado,
} from "@/server/acciones/comunes";

export { INICIAL };

/* ============================ Crear pedido =============================== */

const lineaEnviada = z.object({
  slug: z.string(),
  nombre: z.string(),
  presentacion: z.string(),
  precio: z.number(),
  cantidad: z.number().int().positive(),
  tipo: z.enum(["snack", "barf"]),
  kilos: z.number().optional(),
  frecuencia: z.string().optional(),
});

const esquemaPedido = z.object({
  nombres: textoObligatorio("El nombre"),
  apellidos: z.string().trim().optional(),
  correo: z.string().trim().optional(),
  celular: textoObligatorio("El celular"),
  entrega: z.enum(["delivery", "recojo"]),
  direccion: z.string().trim().optional(),
  distrito: z.string().trim().optional(),
  referencia: z.string().trim().optional(),
  metodoPago: textoObligatorio("El método de pago"),
  notas: z.string().trim().optional(),
  cupon: z.string().trim().optional(),
  items: z.string().min(2, "El carrito está vacío"),
});

export interface ResultadoPedido extends Resultado {
  numero?: string;
}

/**
 * Registra el pedido. Si hay sesión, queda ligado al perfil y genera puntos;
 * si es un invitado, se inserta con la clave de servicio (no hay `auth.uid()`
 * al que asociarlo, así que RLS no puede autorizarlo).
 */
export async function crearPedido(
  _estado: ResultadoPedido,
  datos: FormData,
): Promise<ResultadoPedido> {
  const analisis = validar(esquemaPedido, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  let items: z.infer<typeof lineaEnviada>[];
  try {
    items = z.array(lineaEnviada).min(1).parse(JSON.parse(v.items));
  } catch {
    return fallo("No pudimos leer tu carrito. Vuelve a intentarlo.");
  }

  if (v.entrega === "delivery" && !v.direccion) {
    return fallo("Falta la dirección de entrega.", { direccion: "Obligatoria" });
  }

  const usuario = await usuarioActual();
  const supabase = usuario ? await clienteServidor() : clienteAdministrador();

  const subtotal = items.reduce((t, i) => t + i.precio * i.cantidad, 0);

  // El descuento y el envío se recalculan en el servidor: nunca se confía en
  // lo que llega del navegador.
  let descuento = 0;
  let envioGratis = false;

  if (v.cupon) {
    const { data: cupon } = await supabase
      .from("cupones")
      .select("codigo, tipo, valor, compra_minima, activo, vence_en, usos, usos_maximos")
      .eq("codigo", v.cupon.toUpperCase())
      .maybeSingle();

    const vigente =
      cupon &&
      cupon.activo &&
      subtotal >= Number(cupon.compra_minima) &&
      (!cupon.vence_en || cupon.vence_en >= new Date().toISOString().slice(0, 10)) &&
      (cupon.usos_maximos === null || cupon.usos < cupon.usos_maximos);

    if (vigente) {
      if (cupon.tipo === "descuento-fijo") {
        descuento = Math.min(Number(cupon.valor), subtotal);
      } else if (cupon.tipo === "descuento-porcentual") {
        descuento = Math.round(subtotal * (Number(cupon.valor) / 100) * 100) / 100;
      } else if (cupon.tipo === "envio-gratis") {
        envioGratis = true;
      }
    }
  }

  const { data: config } = await supabase
    .from("configuracion")
    .select("valor")
    .eq("clave", "entrega")
    .maybeSingle();

  const entregaConfig = config?.valor as
    | { metodos: Array<{ id: string; costo: number }>; envioGratisDesde: number }
    | undefined;

  const costoBase =
    entregaConfig?.metodos.find((m) => m.id === v.entrega)?.costo ??
    (v.entrega === "recojo" ? 0 : 12);

  const superaMinimo =
    entregaConfig?.envioGratisDesde !== undefined &&
    subtotal - descuento >= entregaConfig.envioGratisDesde;

  const envio =
    v.entrega === "recojo" || envioGratis || superaMinimo ? 0 : costoBase;

  const total = subtotal - descuento + envio;

  const regla = await obtenerRegla();
  const puntos = usuario ? calcularPuntos(subtotal - descuento, regla) : 0;

  const { data: pedido, error } = await supabase
    .from("pedidos")
    .insert({
      perfil_id: usuario?.id ?? null,
      nombres: v.nombres,
      apellidos: v.apellidos || null,
      correo: v.correo || null,
      celular: v.celular,
      entrega: v.entrega,
      direccion: v.direccion || null,
      distrito: v.distrito || null,
      referencia: v.referencia || null,
      metodo_pago: v.metodoPago,
      subtotal,
      descuento,
      envio,
      total,
      cupon_codigo: descuento > 0 || envioGratis ? v.cupon?.toUpperCase() : null,
      puntos_generados: puntos,
      notas: v.notas || null,
    })
    .select("id, numero")
    .single();

  if (error) return fallo(mensajeDeError(error));

  // Resolver los productos para enlazar cada línea.
  const slugs = items.filter((i) => i.tipo === "snack").map((i) => i.slug);
  const { data: productos } = slugs.length
    ? await supabase.from("productos").select("id, slug").in("slug", slugs)
    : { data: [] };

  const slugsBarf = items.filter((i) => i.tipo === "barf").map((i) => i.slug);
  const { data: recetas } = slugsBarf.length
    ? await supabase.from("productos_barf").select("id, slug").in("slug", slugsBarf)
    : { data: [] };

  const porSlug = new Map((productos ?? []).map((p) => [p.slug, p.id]));
  const barfPorSlug = new Map((recetas ?? []).map((p) => [p.slug, p.id]));

  const { error: errorLineas } = await supabase.from("pedido_lineas").insert(
    items.map((i) => ({
      pedido_id: pedido.id,
      producto_id: i.tipo === "snack" ? (porSlug.get(i.slug) ?? null) : null,
      barf_id: i.tipo === "barf" ? (barfPorSlug.get(i.slug) ?? null) : null,
      nombre: i.nombre,
      presentacion: i.presentacion,
      precio_unitario: i.precio,
      cantidad: i.cantidad,
      kilos: i.kilos ?? null,
      frecuencia: i.frecuencia ?? null,
    })),
  );

  if (errorLineas) return fallo(mensajeDeError(errorLineas));

  if (usuario && puntos > 0) {
    await supabase.from("movimientos_puntos").insert({
      perfil_id: usuario.id,
      pedido_id: pedido.id,
      concepto: `Pedido ${pedido.numero}`,
      puntos,
      estado: "pendiente",
      vence_en: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
    });
  }

  if (v.cupon && (descuento > 0 || envioGratis)) {
    const { data: actual } = await supabase
      .from("cupones")
      .select("usos")
      .eq("codigo", v.cupon.toUpperCase())
      .maybeSingle();

    if (actual) {
      await supabase
        .from("cupones")
        .update({ usos: actual.usos + 1 })
        .eq("codigo", v.cupon.toUpperCase());
    }
  }

  revalidatePath("/cuenta/pedidos");
  revalidatePath("/admin/pedidos");

  return { ok: true, mensaje: "Pedido registrado.", numero: pedido.numero };
}

/* ========================== Gestión desde el CMS ========================== */

const ESTADOS = [
  "pendiente",
  "confirmado",
  "preparando",
  "listo",
  "en-camino",
  "entregado",
  "cancelado",
] as const;

export async function cambiarEstadoPedido(id: string, estado: string) {
  await exigirGrupo("Operación");

  if (!ESTADOS.includes(estado as (typeof ESTADOS)[number])) {
    throw new Error("Estado no válido.");
  }

  const supabase = await clienteServidor();
  const { error } = await supabase.from("pedidos").update({ estado }).eq("id", id);
  if (error) throw new Error(mensajeDeError(error));

  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
  revalidatePath("/cuenta/pedidos");
}

export async function enviarMensajePedido(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  const miembro = await exigirGrupo("Operación");

  const analisis = validar(
    z.object({
      pedidoId: textoObligatorio("El pedido"),
      mensaje: textoObligatorio("El mensaje", 3),
    }),
    datos,
  );
  if (!analisis.ok) return analisis.resultado;

  const supabase = await clienteServidor();
  const { error } = await supabase.from("pedido_mensajes").insert({
    pedido_id: analisis.valor.pedidoId,
    mensaje: analisis.valor.mensaje,
    autor_id: miembro.id,
  });

  if (error) return fallo(mensajeDeError(error));

  await supabase.from("pedido_historial").insert({
    pedido_id: analisis.valor.pedidoId,
    nota: `Mensaje enviado al cliente: «${analisis.valor.mensaje}»`,
    autor_id: miembro.id,
  });

  revalidatePath("/admin/pedidos");
  return exito("Mensaje registrado. Envíalo por WhatsApp con el botón de al lado.");
}

/* ============================== Cotizaciones ============================== */

const esquemaCotizacion = z.object({
  negocio: textoObligatorio("El nombre o razón social", 2),
  ruc: z.string().trim().optional(),
  tipoNegocio: z.string().trim().optional(),
  telefono: textoObligatorio("El teléfono"),
  correo: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v), "Correo no válido"),
  productos: textoObligatorio("Los productos de interés", 2),
  cantidad: textoObligatorio("La cantidad aproximada"),
  fecha: textoObligatorio("La fecha requerida"),
  mensaje: z.string().trim().optional(),
});

export async function solicitarCotizacion(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  const analisis = validar(esquemaCotizacion, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  // Tres días de anticipación, verificados también en el servidor.
  const minimo = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  if (v.fecha < minimo) {
    return fallo("Los pedidos por mayor necesitan 3 días de anticipación.", {
      fecha: `La fecha más cercana es ${minimo}`,
    });
  }

  const supabase = clienteAdministrador();
  const codigo = `COT-${Math.floor(Date.now() / 1000) % 100000}`;

  const { error } = await supabase.from("cotizaciones_mayor").insert({
    codigo,
    negocio: v.negocio,
    ruc: v.ruc || null,
    tipo_negocio: v.tipoNegocio || null,
    telefono: v.telefono,
    correo: v.correo,
    productos: v.productos,
    cantidad: v.cantidad,
    fecha_requerida: v.fecha,
    mensaje: v.mensaje || null,
  });

  if (error) return fallo(mensajeDeError(error));

  revalidatePath("/admin/mayoreo");
  return exito(`Solicitud ${codigo} recibida.`);
}

export async function cambiarEstadoCotizacion(
  id: string,
  estado: string,
  monto?: number,
) {
  await exigirGrupo("Operación");

  const supabase = await clienteServidor();
  const { error } = await supabase
    .from("cotizaciones_mayor")
    .update({ estado, ...(monto !== undefined ? { monto } : {}) })
    .eq("id", id);

  if (error) throw new Error(mensajeDeError(error));
  revalidatePath("/admin/mayoreo");
}
