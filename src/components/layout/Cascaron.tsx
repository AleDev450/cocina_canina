"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * El CMS usa su propio marco (menú lateral y barra superior), así que la
 * cabecera y el pie de la tienda no deben renderizarse bajo /admin.
 */
export function Cascaron({
  encabezado,
  pie,
  paneles,
  children,
}: {
  encabezado: ReactNode;
  pie: ReactNode;
  paneles: ReactNode;
  children: ReactNode;
}) {
  const esAdmin = usePathname().startsWith("/admin");

  if (esAdmin) return <>{children}</>;

  return (
    <>
      {encabezado}
      <main className="flex-1">{children}</main>
      {pie}
      {paneles}
    </>
  );
}
