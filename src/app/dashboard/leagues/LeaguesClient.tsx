"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Hash, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LeaguesClient() {
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  
  const [newLeagueName, setNewLeagueName] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleCreate = async () => {
    if (!newLeagueName) return
    setLoading(true)
    setError("")
    
    try {
      const res = await fetch("/api/leagues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newLeagueName }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || "Error creando liga")
      } else {
        setIsCreating(false)
        setNewLeagueName("")
        router.refresh()
      }
    } catch (err) {
      setError("Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!inviteCode) return
    setLoading(true)
    setError("")
    
    try {
      const res = await fetch("/api/leagues/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: inviteCode.toUpperCase() }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || "Código inválido o ya eres miembro")
      } else {
        setIsJoining(false)
        setInviteCode("")
        router.refresh()
      }
    } catch (err) {
      setError("Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {/* Join League */}
      {isJoining ? (
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <input 
            type="text" 
            placeholder="Código (Ej: A1B2C3)" 
            maxLength={6}
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            className="bg-transparent border-none text-sm px-3 focus:outline-none w-36 uppercase font-mono"
          />
          <Button size="sm" onClick={handleJoin} disabled={loading} className="bg-polla-blue hover:bg-polla-blue/80 text-white rounded-lg">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Unirse"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setIsJoining(false); setError(""); }} className="hover:bg-white/10">
            Cancelar
          </Button>
        </div>
      ) : (
        <Button 
          onClick={() => { setIsJoining(true); setIsCreating(false); setError(""); }} 
          className="bg-white/5 hover:bg-white/10 text-white border border-white/10 gap-2 rounded-xl"
        >
          <Hash className="w-4 h-4" />
          Unirse con Código
        </Button>
      )}

      {/* Create League */}
      {isCreating ? (
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <input 
            type="text" 
            placeholder="Nombre de la Liga" 
            value={newLeagueName}
            onChange={(e) => setNewLeagueName(e.target.value)}
            className="bg-transparent border-none text-sm px-3 focus:outline-none w-40"
          />
          <Button size="sm" onClick={handleCreate} disabled={loading} className="bg-polla-neon hover:bg-polla-neon/80 text-black font-bold rounded-lg">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setIsCreating(false); setError(""); }} className="hover:bg-white/10">
            Cancelar
          </Button>
        </div>
      ) : (
        <Button 
          onClick={() => { setIsCreating(true); setIsJoining(false); setError(""); }} 
          className="bg-polla-neon hover:bg-polla-neon/90 text-black font-bold gap-2 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Crear Liga
        </Button>
      )}

      {error && (
        <div className="w-full text-sm text-red-400 mt-2 text-right">
          {error}
        </div>
      )}
    </div>
  )
}
