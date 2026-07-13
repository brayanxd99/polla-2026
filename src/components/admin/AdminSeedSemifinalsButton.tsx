'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play } from 'lucide-react'

export function AdminSeedSemifinalsButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSeed = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/admin/seed-semifinals', {
        method: 'POST'
      })
      
      if (!res.ok) {
        throw new Error('Failed to seed semifinal matches')
      }

      const data = await res.json()
      alert(data.message)
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Error creating matches')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSeed}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-all disabled:opacity-50 text-sm font-medium shadow-[0_0_15px_rgba(202,138,4,0.3)]"
    >
      <Play className="w-4 h-4" />
      {isLoading ? "Creando..." : "Crear Partidos Semifinales"}
    </button>
  )
}
