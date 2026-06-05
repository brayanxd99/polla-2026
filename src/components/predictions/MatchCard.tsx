"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Check } from "lucide-react"
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
  stadium: string | null
}

type Prediction = {
  homeScore: number
  awayScore: number
} | null

interface MatchCardProps {
  match: Match
  initialPrediction?: Prediction
}

export function MatchCard({ match, initialPrediction }: MatchCardProps) {
  const [homeScore, setHomeScore] = useState(initialPrediction?.homeScore?.toString() || "")
  const [awayScore, setAwayScore] = useState(initialPrediction?.awayScore?.toString() || "")
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = async () => {
    if (homeScore === "" || awayScore === "") return

    setIsSaving(true)
    setIsSaved(false)
    
    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.id,
          homeScore: parseInt(homeScore),
          awayScore: parseInt(awayScore),
        }),
      })
      
      if (res.ok) {
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 2000)
      }
    } catch (error) {
      console.error("Error saving prediction", error)
    } finally {
      setIsSaving(false)
    }
  }

  const matchDate = new Date(match.startTime)
  const oneHourBeforeMatch = new Date(matchDate.getTime() - 60 * 60 * 1000)
  const isMatchLocked = new Date() > oneHourBeforeMatch || match.status !== "PENDING"

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border border-white/5 relative overflow-hidden"
    >
      {/* Date & Status Badge */}
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
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 bg-white/5 flex items-center justify-center">
            {match.homeTeam.flagUrl ? (
              <img src={match.homeTeam.flagUrl} alt={match.homeTeam.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold">{match.homeTeam.code}</span>
            )}
          </div>
          <span className="font-bold text-sm text-center">{match.homeTeam.name}</span>
        </div>

        {/* Score Inputs */}
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="0"
            max="20"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            disabled={isMatchLocked}
            className="w-14 h-16 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-polla-blue disabled:opacity-50"
            placeholder="-"
          />
          <span className="text-white/50 font-bold">-</span>
          <input
            type="number"
            min="0"
            max="20"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            disabled={isMatchLocked}
            className="w-14 h-16 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-polla-blue disabled:opacity-50"
            placeholder="-"
          />
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 bg-white/5 flex items-center justify-center">
            {match.awayTeam.flagUrl ? (
              <img src={match.awayTeam.flagUrl} alt={match.awayTeam.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold">{match.awayTeam.code}</span>
            )}
          </div>
          <span className="font-bold text-sm text-center">{match.awayTeam.name}</span>
        </div>
      </div>

      <div className="flex justify-center mt-4 border-t border-white/5 pt-4">
        {isMatchLocked ? (
          <span className="text-sm text-orange-500 font-medium">Pronóstico Cerrado</span>
        ) : (
          <Button 
            onClick={handleSave} 
            disabled={isSaving || homeScore === "" || awayScore === ""}
            className="w-full max-w-[200px] h-10 bg-white/5 hover:bg-polla-blue text-white rounded-xl transition-all"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSaved ? (
              <span className="flex items-center gap-2 text-polla-neon"><Check className="w-4 h-4" /> Guardado</span>
            ) : (
              "Guardar Pronóstico"
            )}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
