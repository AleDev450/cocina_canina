"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { clienteServidor } from "@/lib/supabase/servidor";
import { exigirCliente, exigirGrupo } from "@/server/sesion";
import {
  casilla,
  exito,
  fallo,
  mensajeDeError,
  textoObligatorio,
  validar,
  type Resultado,
} from "@/server/acciones/comunes";


/* --------------------------- Regla de acumulación ------------------------- */

const esquemaRegla = z.object({
  id: z.string().optional(),
  montoPorPunto: z.coerce.number().min(0.5, "Debe ser al menos S/ 0.50"),
  puntosOtorgados: z.coerce.number().int().min(1, "Debe entregar al menos 1 punto"),
  vigenciaDesde: textoObligatorio("La fecha de inicio"),
  vigenciaHasta: textoObligatorio("La fecha de fin"),
  compraMinima: z.coerce.number().min(0),
  multiplicador: z.coerce.number().int().min(1).max(10),
  campana: z.string().trim().optional(),
  todosLosProductos: casilla,
  acreditarTrasEntrega: casilla,
  venceEnMeses: z.coerce.number().int().min(1).max(60),
});

export async function guardarRegla(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Clientes");

  const analisis = validar(esquemaRegla, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  if (v.vigenciaHasta < v.vigenciaDesde) {
    return fallo("La vigencia termina antes de empezar.", {
      vigenciaHasta: "Debe ser posterior al inicio",
    });
  }

  const supabase = await clienteServidor();
  const fila = {
    monto_por_punto: v.montoPorPunto,
    puntos_otorgados: v.puntosOtorgados,
    vigencia_desde: v.vigenciaDesde,
    vigencia_hasta: v.vigenciaHasta,
    compra_minima: v.compraMinima,
    multiplicador: v.multiplicador,
    campana: v.campana || null,
    todos_los_productos: v.todosLosProductos,
    acreditar_tras_entrega: v.acreditarTrasEntrega,
    vence_en_meses: v.venceEnMeses,
    activa: true,
  };

  const { error } = v.id
    ? await supabase.from("reglas_puntos").update(fila).eq("id", v.id)
    : await supabase.from("reglas_puntos").insert(fila);

  if (error) return fallo(mensajeDeError(error));

  revalidatePath("/recompensas");
  revalidatePath("/admin/recompensas");
  revalidatePath("/", "layout");
  return exito("Regla de puntos actualizada.");
}

/* ------------------------- Catálogo de recompensas ------------------------ */

const esquemaRecompensa = z.object({
  id: z.string().optional(),
  nombre: textoObligatorio("El nombre", 2),
  descripcion: z.string().trim().optional(),
  puntos: z.coerce.number().int().min(1, "Debe costar al menos 1 punto"),
  tipo: z.enum([
    "descuento-fijo",
    "descuento-porcentual",
    "producto-gratis",
    "envio-gratis",
    "cupon",
    "regalo",
  ]),
  valor: z.coerce.number().min(0),
  icono: z.enum(["descuento", "porcentaje", "regalo", "envio", "cupon", "sorpresa"]),
  activa: casilla,
});

export async function guardarRecompensa(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Clientes");

  const analisis = validar(esquemaRecompensa, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  const supabase = await clienteServidor();
  const fila = {
    nombre: v.nombre,
    descripcion: v.descripcion || null,
    puntos: v.puntos,
    tipo: v.tipo,
    valor: v.valor,
    icono: v.icono,
    activa: v.activa,
  };

  const { error } = v.id
    ? await supabase.from("recompensas").update(fila).eq("id", v.id)
    : await supabase.from("recompensas").insert(fila);

  if (error) return fallo(mensajeDeError(error));

  revalidatePath("/recompensas");
  revalidatePath("/admin/recompensas");
  return exito(v.id ? "Recompensa actualizada." : "Recompensa creada.");
}

export async function eliminarRecompensa(id: string) {
  await exigirGrupo("Clientes");
  const supabase = await clienteServidor();
  const { error } = await supabase.from("recompensas").delete().eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  revalidatePath("/recompensas");
  revalidatePath("/admin/recompensas");
}

/* ---------------------------------- Canje --------------------------------- */

/** Canjea una recompensa descontando los puntos del cliente en sesión. */
export async function canjearRecompensa(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  const cliente = await exigirCliente();

  const analisis = validar(
    z.object({ recompensaId: textoObligatorio("La recompensa") }),
    datos,
  );
  if (!analisis.ok) return analisis.resultado;

  const supabase = await clienteServidor();
  const { data: recompensa } = await supabase
    .from("recompensas")
    .select("id, nombre, puntos, activa")
    .eq("id", analisis.valor.recompensaId)
    .maybeSingle();

  if (!recompensa?.activa) return fallo("Esa recompensa ya no está disponible.");
  if (cliente.puntos < recompensa.puntos) {
    return fallo(
      `Te faltan ${recompensa.puntos - cliente.puntos} puntos para canjearla.`,
    );
  }

  const { error } = await supabase.from("movimientos_puntos").insert({
    perfil_id: cliente.id,
    recompensa_id: recompensa.id,
    concepto: `Canje: ${recompensa.nombre}`,
    puntos: -recompensa.puntos,
    estado: "canjeado",
  });

  if (error) return fallo(mensajeDeError(error));

  revalidatePath("/recompensas");
  revalidatePath("/cuenta", "layout");
  return exito(`¡Canjeaste ${recompensa.nombre}! Te contactaremos para aplicarla.`);
}

/* ---------------------- Validación de cupón en el carrito ----------------- */

export interface CuponValidado {
  ok: boolean;
  mensaje: string;
  cupon?: {
    codigo: string;
    descripcion: string;
    tipo: string;
    valor: number;
  };
}

/**
 * Comprueba un código contra la base de datos para poder mostrar el descuento
 * en el carrito. El importe definitivo se vuelve a calcular en el servidor al
 * confirmar el pedido, así que esto es solo la vista previa.
 */
export async function validarCupon(
  codigo: string,
  subtotal: number,
): Promise<CuponValidado> {
  const limpio = codigo.trim().toUpperCase();
  if (!limpio) return { ok: false, mensaje: "Escribe un código." };

  const supabase = await clienteServidor();
  const { data } = await supabase
    .from("cupones")
    .select("codigo, descripcion, tipo, valor, compra_minima, activo, vence_en, usos, usos_maximos")
    .eq("codigo", limpio)
    .maybeSingle();

  if (!data || !data.activo) return { ok: false, mensaje: "Ese cupón no existe." };

  if (data.vence_en && data.vence_en < new Date().toISOString().slice(0, 10)) {
    return { ok: false, mensaje: "Ese cupón ya venció." };
  }

  if (data.usos_maximos !== null && data.usos >= data.usos_maximos) {
    return { ok: false, mensaje: "Ese cupón ya alcanzó su límite de usos." };
  }

  if (subtotal < Number(data.compra_minima)) {
    return {
      ok: false,
      mensaje: `Este cupón aplica desde S/ ${Number(data.compra_minima).toFixed(2)}.`,
    };
  }

  return {
    ok: true,
    mensaje: `Cupón ${data.codigo} aplicado.`,
    cupon: {
      codigo: data.codigo,
      descripcion: data.descripcion ?? "",
      tipo: data.tipo,
      valor: Number(data.valor),
    },
  };
}

/* --------------------------------- Cupones -------------------------------- */

const esquemaCupon = z.object({
  id: z.string().optional(),
  codigo: textoObligatorio("El código", 3),
  descripcion: z.string().trim().optional(),
  tipo: z.enum([
    "descuento-fijo",
    "descuento-porcentual",
    "producto-gratis",
    "envio-gratis",
    "cupon",
    "regalo",
  ]),
  valor: z.coerce.number().min(0),
  compraMinima: z.coerce.number().min(0),
  usosMaximos: z.string().trim().optional(),
  vence: z.string().trim().optional(),
  activo: casilla,
});

export async function guardarCupon(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Clientes");

  const analisis = validar(esquemaCupon, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  const supabase = await clienteServidor();
  const fila = {
    codigo: v.codigo.toUpperCase().replace(/\s+/g, ""),
    descripcion: v.descripcion || null,
    tipo: v.tipo,
    valor: v.valor,
    compra_minima: v.compraMinima,
    usos_maximos: v.usosMaximos ? Number(v.usosMaximos) : null,
    vence_en: v.vence || null,
    activo: v.activo,
  };

  const { error } = v.id
    ? await supabase.from("cupones").update(fila).eq("id", v.id)
    : await supabase.from("cupones").insert(fila);

  if (error) return fallo(mensajeDeError(error));

  revalidatePath("/admin/cupones");
  revalidatePath("/cuenta/cupones");
  return exito(v.id ? "Cupón actualizado." : `Cupón ${fila.codigo} creado.`);
}

export async function alternarCupon(id: string, activo: boolean) {
  await exigirGrupo("Clientes");
  const supabase = await clienteServidor();
  const { error } = await supabase.from("cupones").update({ activo }).eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  revalidatePath("/admin/cupones");
}

export async function eliminarCupon(id: string) {
  await exigirGrupo("Clientes");
  const supabase = await clienteServidor();
  const { error } = await supabase.from("cupones").delete().eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  revalidatePath("/admin/cupones");
}
