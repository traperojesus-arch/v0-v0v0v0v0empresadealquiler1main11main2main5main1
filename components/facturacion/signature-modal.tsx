"use client"

import { useState, useRef } from "react"
import SignatureCanvas from "react-signature-canvas"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Eraser, Check } from "lucide-react"
import { updateAlbaranFirma } from "@/app/actions/albaranes-actions"

export function SignatureModal({
  albaranId,
  onClose,
  onSignatureSave,
  isOpen,
}: {
  albaranId: string
  onClose: () => void
  onSignatureSave: () => void
  isOpen: boolean
}) {
  const [nombre, setNombre] = useState("")
  const [dni, setDni] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const sigCanvas = useRef<any>(null)

  const clearSignature = () => sigCanvas.current?.clear()

  const handleSave = async () => {
    if (!nombre || !dni) {
      alert("Por favor, rellena tu nombre y DNI.")
      return
    }

    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      alert("Por favor, firma el albarán con el ratón o el dedo.")
      return
    }

    setIsSaving(true)

    try {
      const signatureImageBase64 = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")

      await updateAlbaranFirma(albaranId, signatureImageBase64)

      alert(`Albarán ${albaranId} firmado y bloqueado con éxito.`)
      onSignatureSave()
    } catch (error) {
      console.error("[v0] Error al guardar firma:", error)
      alert("Error al guardar la firma. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0">
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl">Firmar Albarán: {albaranId}</CardTitle>
            <CardDescription>
              Introduce tus datos y firma. Una vez aceptado, este documento quedará bloqueado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input
              placeholder="Nombre Completo del Receptor"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <Input placeholder="DNI / NIF" value={dni} onChange={(e) => setDni(e.target.value)} required />

            <div className="border border-input rounded-lg overflow-hidden">
              <div className="p-2 bg-gray-50 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Área de Firma</span>
                <Button variant="ghost" size="sm" onClick={clearSignature} type="button">
                  <Eraser className="w-4 h-4 mr-1" /> Borrar
                </Button>
              </div>
              <SignatureCanvas
                ref={sigCanvas}
                canvasProps={{
                  width: 448,
                  height: 200,
                  className: "sigCanvas w-full cursor-crosshair",
                }}
                penColor="black"
                minWidth={1}
                maxWidth={2}
              />
            </div>

            <Button onClick={handleSave} disabled={!nombre || !dni || isSaving} className="w-full">
              <Check className="w-4 h-4 mr-2" />
              {isSaving ? "Guardando..." : "Aceptar y Firmar Albarán"}
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
