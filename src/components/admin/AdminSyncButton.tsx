"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminSyncButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSync = async () => {
    setLoading(true)
    setMessage("Sincronizando con API...")
    try {
      const res = await fetch("/api/admin/sync-matches", { method: "POST" })
      const data = await res.json()
      
      if (res.ok) {
        setMessage(data.message)
      } else {
        setMessage(data.error || "Ocurrió un error al sincronizar.")
      }
    } catch (error) {
      console.error(error)
      setMessage("Error de conexión al sincronizar.")
    } finally {
      setLoading(false)
      // Recargar la página después de 2 segundos para actualizar los datos
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button 
        onClick={handleSync} 
        disabled={loading}
        className="bg-polla-neon text-black hover:bg-polla-neon/90 font-bold"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
        Sincronizar Resultados de Internet
      </Button>
      {message && (
        <p className={`text-sm ${message.includes("Error") || message.includes("Falta") ? "text-red-400" : "text-green-400"}`}>
          {message}
        </p>
      )}
    </div>
  )
}
