"use client"

import { useState } from "react"
import { Loader2, CheckCircle2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

type Team = {
  id: string
  name: string
  code: string
  flagUrl: string | null
}

type Match = {
  id: string
  homeTeam: Team
  awayTeam: Team
  startTime: Date
  round: string
  status: string
  homeScore: number | null
  awayScore: number | null
  stadium: string | null
}

export function AdminMatchCard({ match }: { match: Match }) {
  const [homeScore, setHomeScore] = useState(match.homeScore?.toString() || "")
  const [awayScore, setAwayScore] = useState(match.awayScore?.toString() || "")
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(match.status === "FINISHED")
  const [error, setError] = useState("")

  const handleFinish = async () => {
    if (homeScore === "" || awayScore === "") return
    if (!confirm("¿Estás seguro de finalizar este partido? Esto calculará los puntos de todos los usuarios de forma irreversible.")) {
      return
    }

    setIsSaving(true)
    setError("")
    
    try {
      const res = await fetch("/api/admin/matches/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.id,
          homeScore: parseInt(homeScore),
          awayScore: parseInt(awayScore),
        }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setIsSaved(true)
      } else {
        setError(data.error || "Ocurrió un error")
      }
    } catch (error) {
      setError("Error de red")
    } finally {
      setIsSaving(false)
    }
  }

  const matchDate = new Date(match.startTime)

  return (
    <div className={`glass rounded-2xl p-6 border ${isSaved ? 'border-green-500/30 bg-green-900/10' : 'border-white/5'} relative overflow-hidden`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 w-fit">
            {match.round}
          </span>
          {match.stadium && (
            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              📍 {match.stadium}
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {matchDate.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        {/* Home Team */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <span className="font-bold text-sm text-center">{match.homeTeam.name}</span>
        </div>

        {/* Score Inputs */}
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="0"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            disabled={isSaved}
            className="w-16 h-12 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            placeholder="-"
          />
          <span className="text-white/50 font-bold">-</span>
          <input
            type="number"
            min="0"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            disabled={isSaved}
            className="w-16 h-12 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            placeholder="-"
          />
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <span className="font-bold text-sm text-center">{match.awayTeam.name}</span>
        </div>
      </div>

      {error && <p className="text-red-400 text-xs text-center mb-4">{error}</p>}

      <div className="flex justify-center mt-4 border-t border-white/5 pt-4">
        {isSaved ? (
          <div className="flex items-center gap-2 text-green-400 font-bold">
            <CheckCircle2 className="w-5 h-5" /> Partido Finalizado
          </div>
        ) : (
          <Button 
            onClick={handleFinish} 
            disabled={isSaving || homeScore === "" || awayScore === ""}
            className="w-full h-10 bg-red-600 hover:bg-red-700 text-white font-bold gap-2 rounded-xl"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
            Cerrar Partido y Repartir Puntos
          </Button>
        )}
      </div>
    </div>
  )
}
