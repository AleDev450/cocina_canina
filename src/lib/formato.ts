const soles = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

/** S/ 24.00 */
export function precio(valor: number): string {
  return soles.format(valor).replace(/ /g, " ");
}

/** 28 de julio de 2026 */
export function fechaLarga(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** 28 jul 2026 */
export function fechaCorta(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** "2 años y 3 meses" a partir de una fecha de nacimiento. */
export function edadDesde(iso: string): string {
  const nacimiento = new Date(`${iso}T12:00:00`);
  const hoy = new Date();
  let meses =
    (hoy.getFullYear() - nacimiento.getFullYear()) * 12 +
    (hoy.getMonth() - nacimiento.getMonth());
  if (hoy.getDate() < nacimiento.getDate()) meses -= 1;
  meses = Math.max(0, meses);

  const anios = Math.floor(meses / 12);
  const resto = meses % 12;
  if (anios === 0) return `${resto} ${resto === 1 ? "mes" : "meses"}`;
  const parteAnios = `${anios} ${anios === 1 ? "año" : "años"}`;
  if (resto === 0) return parteAnios;
  return `${parteAnios} y ${resto} ${resto === 1 ? "mes" : "meses"}`;
}

export function mesesDesde(iso: string): number {
  const nacimiento = new Date(`${iso}T12:00:00`);
  const hoy = new Date();
  return Math.max(
    0,
    (hoy.getFullYear() - nacimiento.getFullYear()) * 12 +
      (hoy.getMonth() - nacimiento.getMonth()),
  );
}

/** Minúsculas y sin tildes, para comparar texto de búsqueda. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

/** Une clases condicionales sin dependencias externas. */
export function cx(...clases: unknown[]): string {
  return clases.filter((c): c is string => typeof c === "string" && c.length > 0).join(" ");
}
