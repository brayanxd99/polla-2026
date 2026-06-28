"use client"

import { useState } from "react"
import { CalendarPlus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminSeedRound32Button() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSeed = async () => {
    if (!confirm("¿Estás seguro de crear los partidos de 16avos de Final? Esto no borrará ningún dato existente.")) {
      return
    }

    setLoading(true)
    setMessage("Creando partidos...")
    try {
      const res = await fetch("/api/admin/seed-round32", { method: "POST" })
      const data = await res.json()
      
      if (res.ok) {
        setMessage(data.message || "Partidos creados exitosamente.")
      } else {
        setMessage(data.error || "Ocurrió un error al crear los partidos.")
      }
    } catch (error) {
      console.error(error)
      setMessage("Error de conexión.")
    } finally {
      setLoading(false)
      // Recargar la página después de 2 segundos para actualizar la vista
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button 
        onClick={handleSeed} 
        disabled={loading}
        className="bg-polla-blue hover:bg-polla-blue/90 text-white font-bold"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <CalendarPlus className="w-4 h-4 mr-2" />
        )}
        Crear Partidos 16avos (Round of 32)
      </Button>
      {message && (
        <p className={`text-sm ${message.includes("Error") || message.includes("error") || message.includes("No autorizado") ? "text-red-400" : "text-green-400"}`}>
          {message}
        </p>
      )}
    </div>
  )
}
