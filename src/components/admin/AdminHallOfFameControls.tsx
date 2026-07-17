'use client'

import { useState } from 'react'
import { Trophy, Mail } from 'lucide-react'
import { HallOfFame } from '@/components/dashboard/HallOfFame'

type Winner = {
  id: string
  name: string
  points: number
  image?: string | null
}

export function AdminHallOfFameControls({ topUsers }: { topUsers: Winner[] }) {
  const [showPreview, setShowPreview] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<{success?: boolean, message?: string} | null>(null)

  const handleSendEmails = async () => {
    if (!confirm('¿Estás seguro de que quieres enviar los correos a los 3 ganadores?')) return
    
    setIsSending(true)
    setSendResult(null)
    
    try {
      const res = await fetch('/api/admin/send-winner-emails', {
        method: 'POST',
      })
      const data = await res.json()
      
      if (res.ok) {
        setSendResult({ success: true, message: '¡Correos enviados con éxito!' })
      } else {
        setSendResult({ success: false, message: data.error || 'Error al enviar correos' })
      }
    } catch (error) {
      setSendResult({ success: false, message: 'Error de red' })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="glass rounded-2xl border border-yellow-500/30 p-6 bg-gradient-to-br from-yellow-500/10 to-transparent">
      <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2 mb-2">
        <Trophy className="w-6 h-6" />
        Cierre del Mundial - Cuadro de Honor
      </h2>
      <p className="text-sm text-gray-300 mb-6">
        Administra la finalización del torneo. Previsualiza el Cuadro de Honor y notifica a los ganadores por correo electrónico.
      </p>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setShowPreview(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <Trophy className="w-5 h-5" />
          Previsualizar Cuadro de Honor
        </button>

        <button
          onClick={handleSendEmails}
          disabled={isSending}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-yellow-500 hover:bg-yellow-400 text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Mail className="w-5 h-5" />
          {isSending ? 'Enviando...' : 'Enviar Correos a Ganadores'}
        </button>
      </div>

      {sendResult && (
        <div className={`mt-4 p-4 rounded-xl text-sm font-bold ${sendResult.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {sendResult.message}
        </div>
      )}

      {showPreview && (
        <HallOfFame winners={topUsers} /> // Removed onClose because HallOfFame handles its own close internally
      )}
    </div>
  )
}
