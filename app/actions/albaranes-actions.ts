"use server"

import { createClient } from "@/lib/supabase/server"

export interface Albaran {
  id: string
  numero_albaran: string
  pedido_id: string
  fecha_emision: string
  fecha_entrega: string | null
  estado: string
  observaciones: string | null
  firma_cliente: string | null
  cliente: {
    id: string
    nombre: string
    email: string
  }
}

export async function getAlbaranes(): Promise<Albaran[]> {
  const supabase = await createClient()

  const { data: albaranesData, error: albaranesError } = await supabase
    .from("albaranes")
    .select("*")
    .order("fecha_emision", { ascending: false })

  if (albaranesError) {
    console.error("[v0] Error al obtener albaranes:", albaranesError)
    throw new Error(`Error al obtener albaranes: ${albaranesError.message}`)
  }

  if (!albaranesData || albaranesData.length === 0) {
    return []
  }

  // Obtener los pedidos relacionados
  const pedidoIds = albaranesData.map((a: any) => a.pedido_id).filter(Boolean)

  if (pedidoIds.length === 0) {
    return albaranesData.map((albaran: any) => ({
      ...albaran,
      cliente: {
        id: "",
        nombre: "Sin cliente",
        email: "",
      },
    }))
  }

  const { data: pedidosData, error: pedidosError } = await supabase
    .from("pedidos")
    .select("id, cliente_id")
    .in("id", pedidoIds)

  if (pedidosError) {
    console.error("[v0] Error al obtener pedidos:", pedidosError)
  }

  // Obtener los clientes relacionados
  const clienteIds = (pedidosData || []).map((p: any) => p.cliente_id).filter(Boolean)

  let clientesData: any[] = []
  if (clienteIds.length > 0) {
    const { data, error: clientesError } = await supabase
      .from("usuarios")
      .select("id, nombre, email")
      .in("id", clienteIds)

    if (clientesError) {
      console.error("[v0] Error al obtener clientes:", clientesError)
    } else {
      clientesData = data || []
    }
  }

  // Combinar los datos manualmente
  const albaranes: Albaran[] = albaranesData.map((albaran: any) => {
    const pedido = pedidosData?.find((p: any) => p.id === albaran.pedido_id)
    const cliente = clientesData.find((c: any) => c.id === pedido?.cliente_id)

    return {
      id: albaran.id,
      numero_albaran: albaran.numero_albaran,
      pedido_id: albaran.pedido_id,
      fecha_emision: albaran.fecha_emision,
      fecha_entrega: albaran.fecha_entrega,
      estado: albaran.estado,
      observaciones: albaran.observaciones,
      firma_cliente: albaran.firma_cliente,
      cliente: {
        id: cliente?.id || "",
        nombre: cliente?.nombre || "Cliente desconocido",
        email: cliente?.email || "",
      },
    }
  })

  return albaranes
}

export async function updateAlbaranFirma(albaranId: string, firma: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("albaranes")
    .update({
      firma_cliente: firma,
      estado: "entregado",
      fecha_entrega: new Date().toISOString().split("T")[0], // Solo la fecha, no timestamp
    })
    .eq("id", albaranId)

  if (error) {
    console.error("[v0] Error al actualizar firma:", error)
    throw new Error(`Error al actualizar firma: ${error.message}`)
  }
}
