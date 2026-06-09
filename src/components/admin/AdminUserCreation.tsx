"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserPlus, Loader2, Check, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminUserCreation() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (res.ok) {
        setSuccess(true)
        e.currentTarget.reset()
        setTimeout(() => setSuccess(false), 3000)
      } else {
        const data = await res.json()
        setError(data.error || "Error al crear usuario")
      }
    } catch (err) {
      setError("Error de conexión al crear usuario")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass rounded-2xl p-6 border border-white/5">
      <h2 className="text-xl font-bold text-polla-neon flex items-center gap-2 mb-6">
        <UserPlus className="w-5 h-5" />
        Crear Nuevo Usuario
      </h2>
      
      <p className="text-sm text-muted-foreground mb-6">
        Genera cuentas para tus participantes. Deberás entregarles el correo y contraseña manualmente para que puedan iniciar sesión.
      </p>

      {error && (
        <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          Usuario creado exitosamente
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block text-white/80">Nombre del Participante</label>
          <input 
            name="name"
            type="text" 
            required
            className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-polla-blue focus:border-transparent transition-all"
            placeholder="Ej. Juan Pérez"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block text-white/80">Correo Electrónico</label>
          <input 
            name="email"
            type="email" 
            required
            className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-polla-blue focus:border-transparent transition-all"
            placeholder="juan@email.com"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block text-white/80">Contraseña Predeterminada</label>
          <input 
            name="password"
            type="text" 
            required
            className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-polla-blue focus:border-transparent transition-all"
            placeholder="Ej. clave123"
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full mt-2 bg-polla-neon hover:bg-polla-neon/90 text-black font-bold h-11 rounded-xl"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Registrar Usuario"}
        </Button>
      </form>
    </div>
  )
}
