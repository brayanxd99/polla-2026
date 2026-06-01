"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Check, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

type Team = {
  id: string
  name: string
  code: string
  flagUrl: string | null
  group: string | null
}

interface Round16SelectorProps {
  teams: Team[]
  initialSelectedIds: string[]
}

export function Round16Selector({ teams, initialSelectedIds }: Round16SelectorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleTeam = (teamId: string) => {
    if (selectedIds.includes(teamId)) {
      setSelectedIds(selectedIds.filter(id => id !== teamId))
    } else {
      if (selectedIds.length >= 16) {
        setError("Solo puedes seleccionar un máximo de 16 equipos.")
        setTimeout(() => setError(null), 3000)
        return
      }
      setSelectedIds([...selectedIds, teamId])
    }
  }

  const handleSave = async () => {
    if (selectedIds.length !== 16) {
      setError("Debes seleccionar exactamente 16 equipos para guardar.")
      setTimeout(() => setError(null), 3000)
      return
    }

    setIsSaving(true)
    setIsSaved(false)
    setError(null)
    
    try {
      const res = await fetch("/api/predictions/round16", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamIds: selectedIds }),
      })
      
      if (res.ok) {
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 3000)
      } else {
        const data = await res.json()
        setError(data.error || "Error al guardar")
      }
    } catch (err) {
      setError("Error de conexión al guardar")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="glass rounded-2xl p-6 border border-white/5 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-polla-neon flex items-center gap-2">
            <span className="w-2 h-6 rounded-full bg-polla-neon" />
            Predicción Octavos de Final
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Selecciona los 16 equipos que clasificarán. (+5 puntos por acierto)</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 font-bold">
            <span className={selectedIds.length === 16 ? "text-green-400" : "text-white"}>{selectedIds.length}</span> / 16
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || selectedIds.length !== 16}
            className="bg-polla-neon hover:bg-polla-neon/90 text-black font-bold min-w-[120px]"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSaved ? (
              <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Guardado</span>
            ) : (
              "Guardar Octavos"
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {teams.map((team) => {
          const isSelected = selectedIds.includes(team.id)
          return (
            <motion.button
              key={team.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleTeam(team.id)}
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                isSelected 
                  ? 'bg-polla-neon/20 border-polla-neon/50' 
                  : 'bg-white/5 border-white/5 hover:border-white/20'
              }`}
            >
              <div className={`w-10 h-10 rounded-full overflow-hidden mb-2 border-2 transition-all ${isSelected ? 'border-polla-neon' : 'border-transparent'}`}>
                {team.flagUrl ? (
                  <img src={team.flagUrl} alt={team.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center text-[10px] font-bold">{team.code}</div>
                )}
              </div>
              <span className={`text-xs font-medium text-center line-clamp-1 ${isSelected ? 'text-white' : 'text-white/70'}`}>
                {team.name}
              </span>
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-polla-neon flex items-center justify-center">
                  <Check className="w-3 h-3 text-black" />
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
