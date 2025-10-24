// <<< AÑADIDO: "use client" para hacerlo un componente interactivo
"use client"

// <<< AÑADIDO: Importar 'useState' y 'useEffect'
import { useState, useEffect } from "react"
// <<< MODIFICADO: Revertido a la ruta de alias original
import { createClient } from "@/utils/supabase/client"

// <<< MODIFICADO: Revertido a la ruta de alias original
import { Sidebar } from "@/components/sidebar"
// <<< MODIFICADO: Revertido a la ruta de alias original
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

// <<< AÑADIDO: Definir un tipo para los clientes
type Cliente = {
  id: string
  nombre: string
}

export default function NuevoPedidoPage() {
  const supabase = createClient()
  const router = useRouter()

  // <<< AÑADIDO: Estado para guardar la lista de clientes
  const [clientes, setClientes] = useState<Cliente[]>([])
  
  const [formData, setFormData] = useState({
    clienteId: "",
    fechaEvento: "",
    horaInicio: "",
    horaFin: "",
    direccion: "",
    notas: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // <<< AÑADIDO: useEffect para cargar clientes al montar el componente
  useEffect(() => {
    const fetchClientes = async () => {
      // Asumiendo que tu tabla de clientes se llama "usuarios" y tiene "id" y "nombre"
      const { data, error } = await supabase
        .from("usuarios")
        .select("id, nombre") // Solo trae las columnas que necesitas
        .order("nombre", { ascending: true }) // Opcional: ordenar alfabéticamente

      if (error) {
        console.error("Error cargando clientes:", error.message)
      } else {
        setClientes(data || [])
      }
    }

    fetchClientes()
  }, [supabase]) // Se ejecuta una vez

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      clienteId: value,
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Validar que los campos no estén vacíos
    if (!formData.clienteId || !formData.fechaEvento || !formData.horaInicio || !formData.horaFin || !formData.direccion) {
      // <<< CORREGIDO: Reemplazado alert() con console.error()
      console.error("Faltan campos obligatorios")
      // Aquí deberías mostrar un mensaje de error al usuario (Toast, Sonner, etc.)
      setIsSubmitting(false)
      return
    }

    // Combinar fecha y hora para crear timestamps ISO
    const fechaEntregaISO = new Date(`${formData.fechaEvento}T${formData.horaInicio}`).toISOString()
    const fechaRecogidaISO = new Date(`${formData.fechaEvento}T${formData.horaFin}`).toISOString()

    const { data, error } = await supabase
      .from("pedidos")
      .insert([
        {
          cliente_id: formData.clienteId,
          fecha_pedido: new Date().toISOString(),
          fecha_entrega: fechaEntregaISO,
          fecha_fin: fechaRecogidaISO, // Asegúrate de que tu tabla tenga esta columna
          ubicacion_entrega: formData.direccion,
          notas: formData.notas,
          estado: "confirmado", 
          // ...Añade aquí otros campos obligatorios (total, subtotal, etc.)
          total: 0,
          subtotal: 0,
        },
      ])
      .select()

    if (error) {
      // <<< CORREGIDO: Reemplazado alert() con console.error()
      console.error("Error al crear el pedido:", error.message)
      setIsSubmitting(false)
    } else {
      // <<< CORREGIDO: Reemplazado alert() con console.log()
      console.log("¡Pedido creado con éxito!", data)
      router.push("/dashboard/pedidos") // Redirigir a la lista de pedidos
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Nuevo Pedido</h1>
              <p className="text-muted-foreground">Crear un nuevo pedido de alquiler</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información del Pedido</CardTitle>
              <CardDescription>Complete los datos del nuevo pedido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente *</Label>
                  <Select onValueChange={handleSelectChange} value={formData.clienteId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.length === 0 && (
                        <SelectItem value="loading" disabled>Cargando clientes...</SelectItem>
                      )}
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaEvento">Fecha del Evento *</Label>
                  <Input 
                    type="date" 
                    id="fechaEvento"
                    value={formData.fechaEvento}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horaInicio">Hora de Inicio *</Label>
                  <Input 
                    type="time" 
                    id="horaInicio"
                    value={formData.horaInicio}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horaFin">Hora de Fin *</Label>
                  <Input 
                    type="time" 
                    id="horaFin"
                    value={formData.horaFin}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección del Evento *</Label>
                <Input 
                  id="direccion"
                  placeholder="Dirección completa del evento" 
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </div>

<div>
  <Label htmlFor="notas">Notas Adicionales</Label>
  <Textarea 
    id="notas"
    placeholder="Notas o instrucciones especiales" 
    value={formData.notas}
    onChange={handleChange}
  />
</div>

              <div className="flex gap-4">
                <Button onClick={handleSubmit} disabled={isSubmitting || clientes.length === 0}>
                  {isSubmitting ? "Guardando..." : "Crear Pedido"}
                </Button>
                <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
