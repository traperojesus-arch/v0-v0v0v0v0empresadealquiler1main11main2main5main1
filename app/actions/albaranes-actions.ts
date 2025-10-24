"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getAlbaranes() {
  console.log("[v0] Iniciando carga de albaranes...")
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("albaranes")
    .select(
      `
      *,
      pedidos:pedido_id (
        id,
        cliente_id,
        usuarios:cliente_id (
          id,
          nombre,
          email
        )
      )
    `,
    )
    .order("fecha_emision", { ascending: false })

  if (error) {
    console.error("[v0] Error cargando albaranes:", error)
    return { success: false, error: error.message, data: [] }
  }

  console.log("[v0] Albaranes cargados desde Supabase:", data?.length || 0)

  const albaranes = (data || []).map((a: any) => {
    const clienteNombre = a.pedidos?.usuarios?.nombre || "Cliente desconocido"
    const clienteEmail = a.pedidos?.usuarios?.email || ""

    return {
      id: a.id,
      pedido: a.pedido_id || "",
      cliente: clienteNombre,
      empresa: clienteEmail, // Usando email como empresa temporalmente
      fechaEmision: a.fecha_emision || "",
      fechaEntrega: a.fecha_entrega || "",
      direccion: a.direccion_entrega || "",
      articulos: 0, // TODO: Contar items del pedido
      estado: a.estado || "pendiente",
      facturado: a.estado === "facturado",
      numeroFactura: null, // TODO: Obtener de la tabla facturas
      signed: !!a.firma_cliente,
      firmaNombre: a.firma_nombre || "",
      firmaDNI: a.firma_dni || "",
    }
  })

  console.log("[v0] Albaranes mapeados:", albaranes.length)
  return { success: true, data: albaranes }
}

export async function updateAlbaranFirma(
  albaranId: string,
  firmaData: {
    firma: string
    nombre: string
    dni: string
    observaciones?: string
  },
) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from("albaranes")
    .update({
      firma_cliente: firmaData.firma,
      firma_nombre: firmaData.nombre,
      firma_dni: firmaData.dni,
      firma_observaciones: firmaData.observaciones || "",
      signed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", albaranId)

  if (error) {
    console.error("[v0] Error actualizando firma:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/facturacion")
  return { success: true }
}

export async function deleteAlbaran(albaranId: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("albaranes").delete().eq("id", albaranId)

  if (error) {
    console.error("[v0] Error eliminando albarán:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/facturacion")
  return { success: true }
}
