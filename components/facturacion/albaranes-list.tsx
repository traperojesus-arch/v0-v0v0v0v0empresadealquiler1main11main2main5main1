"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Download, Edit, Trash2, Search, Ligature as Signature } from "lucide-react"
import { getAlbaranes, type Albaran } from "@/app/actions/albaranes-actions"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SignatureModal } from "./signature-modal"

// *** TIPADO Y DATOS DE EJEMPLO para reserva (fallback) ***
// interface Albaran {
//   id: string
//   numero_albaran: string
//   pedido_id: string | null
//   fecha_emision: string
//   fecha_entrega: string | null
//   estado: string
//   direccion_entrega: string
//   observaciones: string | null
//   responsable_entrega: string | null
//   firma_cliente: string | null
//   created_at: string
//   updated_at: string
//   // Campos calculados o de JOIN
//   cliente?: string
//   empresa?: string
//   pedido?: string
// }

// const albaranesData: Albaran[] = [
//   {
//     id: "1",
//     numero_albaran: "ALB-2025-001",
//     pedido_id: "1",
//     pedido: "PED-2025-001",
//     cliente: "María García R.",
//     empresa: "Eventos Elegantes SL",
//     fecha_emision: "2025-01-10",
//     fecha_entrega: "2025-01-15",
//     direccion_entrega: "Hotel Majestic...",
//     estado: "entregado",
//     observaciones: null,
//     responsable_entrega: null,
//     firma_cliente: null,
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//   },
// ]

// Mapping de colores y etiquetas
const statusColors: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  entregado: "default",
  pendiente: "secondary",
  cancelado: "destructive",
  borrador: "outline",
}

const statusLabels: { [key: string]: string } = {
  entregado: "Entregado",
  pendiente: "Pendiente",
  cancelado: "Cancelado",
  borrador: "Borrador",
}

export function AlbaranesList() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [albaranes, setAlbaranes] = useState<Albaran[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [selectedAlbaran, setSelectedAlbaran] = useState<Albaran | null>(null)

  // Función para manejar la firma
  const handleSign = (albaran: Albaran) => {
    setSelectedAlbaran(albaran)
    setShowSignatureModal(true)
  }

  // Función para manejar la edición (navegación)
  const handleEdit = (albaranId: string) => {
    // RUTA CORREGIDA: Apunta a /app/facturacion/albaran/editar/[albaranId]/page.tsx
    router.push(`/facturacion/albaran/editar/${albaranId}`)
  }

  useEffect(() => {
    const fetchAlbaranes = async () => {
      try {
        const data = await getAlbaranes()
        setAlbaranes(data)
      } catch (error) {
        console.error("[v0] Error cargando albaranes:", error)
        setAlbaranes([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlbaranes()
  }, [])

  const filteredAlbaranes = albaranes.filter(
    (albaran) =>
      albaran.numero_albaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
      albaran.cliente?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      albaran.cliente?.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return <div className="text-center p-8 text-lg font-medium">Cargando albaranes...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, Cliente o Email..."
            className="pl-9 w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => router.push("/facturacion/albaran/nuevo")}>Crear Nuevo Albarán</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Cliente/Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Fecha Entrega
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Firma
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredAlbaranes.length > 0 ? (
                  filteredAlbaranes.map((albaran) => (
                    <tr key={albaran.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground">
                        {albaran.numero_albaran}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-card-foreground">{albaran.cliente?.nombre}</div>
                        <div className="text-xs text-muted-foreground">{albaran.cliente?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {albaran.fecha_entrega || "Sin fecha"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={statusColors[albaran.estado] || "outline"}>
                          {statusLabels[albaran.estado] || albaran.estado}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge
                          variant={albaran.firma_cliente ? "default" : "secondary"}
                          className={
                            albaran.firma_cliente ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                          }
                        >
                          {albaran.firma_cliente ? "Firmado" : "Pendiente"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/facturacion/albaran/detalle/${albaran.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(albaran.id)} disabled={!!albaran.firma_cliente}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar {!albaran.firma_cliente ? "" : "(Bloqueado)"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Descargar PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSign(albaran)} disabled={!!albaran.firma_cliente}>
                              <Signature className="mr-2 h-4 w-4" />
                              Firmar {!albaran.firma_cliente ? "" : "(Firmado)"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No se encontraron albaranes o la tabla de Supabase está vacía.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Firma */}
      {selectedAlbaran && (
        <SignatureModal
          isOpen={showSignatureModal}
          onClose={() => setShowSignatureModal(false)}
          albaranId={selectedAlbaran.id}
          onSignatureSave={() => {
            setShowSignatureModal(false)
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}
