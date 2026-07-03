'use client'

import { useState } from 'react'
import { Check, ShieldAlert } from 'lucide-react'

type Team = {
  id: string
  name: string
  code: string
  flagUrl: string | null
  advancedToQF: boolean
}

export function AdminQFTeamCard({ team }: { team: Team }) {
  const [isAdvanced, setIsAdvanced] = useState(team.advancedToQF)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    if (isAdvanced) {
      if (!confirm("Este equipo ya está clasificado a Cuartos y los puntos ya se repartieron. ¿Deseas revocar la clasificación?")) return
    } else {
      if (!confirm(`¿Confirmas que ${team.name} clasificó a Cuartos de Final? Se repartirán 5 puntos a los ganadores inmediatamente.`)) return
    }

    try {
      setIsLoading(true)
      const res = await fetch(`/api/admin/qf/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: team.id, advanced: !isAdvanced })
      })

      if (!res.ok) throw new Error("Failed to toggle")
      
      setIsAdvanced(!isAdvanced)
    } catch (error) {
      console.error(error)
      alert("Error al actualizar estado")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
        isAdvanced 
          ? 'bg-blue-500/20 border-blue-500/50' 
          : 'bg-white/5 border-white/10 hover:border-white/20'
      } ${isLoading ? 'opacity-50' : ''}`}
    >
      <div className={`w-12 h-12 rounded-full overflow-hidden mb-2 border-2 transition-all ${isAdvanced ? 'border-blue-500' : 'border-transparent'}`}>
        {team.flagUrl ? (
          <img src={team.flagUrl} alt={team.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-white/10 flex items-center justify-center text-[10px] font-bold">{team.code}</div>
        )}
      </div>
      <span className={`text-sm font-bold text-center line-clamp-1 ${isAdvanced ? 'text-blue-400' : 'text-white'}`}>
        {team.name}
      </span>
      {isAdvanced && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </button>
  )
}
