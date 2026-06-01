"use client"

import { useState } from "react"
import { Loader2, Check } from "lucide-react"
import { motion } from "framer-motion"

type Team = {
  id: string
  name: string
  code: string
  flagUrl: string | null
  advancedToR16: boolean
}

export function AdminTeamCard({ team }: { team: Team }) {
  const [isAdvanced, setIsAdvanced] = useState(team.advancedToR16)
  const [isSaving, setIsSaving] = useState(false)

  const toggleAdvance = async () => {
    setIsSaving(true)
    const newStatus = !isAdvanced
    
    try {
      const res = await fetch("/api/admin/teams/advance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: team.id, advanced: newStatus }),
      })
      
      if (res.ok) {
        setIsAdvanced(newStatus)
      }
    } catch (error) {
      console.error("Error updating team advancement", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleAdvance}
      disabled={isSaving}
      className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
        isAdvanced 
          ? 'bg-green-500/20 border-green-500/50' 
          : 'bg-white/5 border-white/5 hover:bg-white/10'
      }`}
    >
      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10 bg-black">
        {team.flagUrl ? (
          <img src={team.flagUrl} alt={team.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">{team.code}</div>
        )}
      </div>
      <span className={`font-medium text-sm flex-1 ${isAdvanced ? 'text-green-400' : 'text-white'}`}>
        {team.name}
      </span>
      {isSaving ? (
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground shrink-0" />
      ) : isAdvanced ? (
        <Check className="w-4 h-4 text-green-400 shrink-0" />
      ) : null}
    </motion.button>
  )
}
