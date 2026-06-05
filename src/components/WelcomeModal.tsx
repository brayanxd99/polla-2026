"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Gift, Target, Info, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user has seen the welcome modal
    const checkWelcomeStatus = async () => {
      try {
        const res = await fetch("/api/user/welcome")
        if (res.ok) {
          const data = await res.json()
          if (!data.hasSeenWelcome) {
            setIsOpen(true)
          }
        }
      } catch (error) {
        console.error("Failed to fetch welcome status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkWelcomeStatus()
  }, [])

  const handleDismiss = async () => {
    setIsOpen(false)
    try {
      await fetch("/api/user/welcome", { method: "POST" })
    } catch (error) {
      console.error("Failed to update welcome status:", error)
    }
  }

  if (loading) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-gray-900 border border-white/10 shadow-2xl rounded-2xl overflow-hidden z-50 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 text-center border-b border-white/10 bg-polla-blue/10">
              <div className="w-16 h-16 rounded-full bg-polla-blue/20 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-polla-neon" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">¡Bienvenido a la Polla Mundialista!</h2>
              <p className="text-gray-300">Sigue estas instrucciones para empezar a ganar.</p>
            </div>

            {/* Content Scrollable */}
            <div className="p-6 overflow-y-auto flex-1 space-y-8">
              
              {/* Instructions */}
              <section>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-polla-neon" />
                  Instrucciones del Juego
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-polla-blue shrink-0 mt-0.5" />
                    <span><strong>Fase de Grupos:</strong> Predice el marcador exacto de cada partido. Ganas 3 puntos por acierto exacto y 1 punto si solo aciertas al ganador/empate.</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-polla-blue shrink-0 mt-0.5" />
                    <span><strong>Octavos de Final:</strong> En la sección de predicciones encontrarás la cuadrícula de banderas. Selecciona qué equipos clasificarán a octavos para ganar 5 puntos extra por cada uno.</span>
                  </li>
                </ul>
              </section>

              {/* Basic Usage */}
              <section>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-polla-neon" />
                  Uso de la Plataforma
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="font-medium text-white mb-1">📅 Partidos</p>
                    <p className="text-sm text-gray-400">Revisa el calendario oficial y guarda tus pronósticos antes de que empiece cada juego.</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="font-medium text-white mb-1">🏆 Ranking</p>
                    <p className="text-sm text-gray-400">Compara tus puntos en tiempo real con otros jugadores en la tabla de posiciones.</p>
                  </div>
                </div>
              </section>

              {/* Prizes */}
              <section>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-polla-neon" />
                  Categorías de Premios
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-transparent border border-yellow-500/30">
                    <span className="text-2xl">🥇</span>
                    <div>
                      <p className="font-bold text-yellow-500">1er Lugar</p>
                      <p className="text-sm text-gray-300">Gran Premio Mayor (Por definir)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-gray-400/20 to-transparent border border-gray-400/30">
                    <span className="text-2xl">🥈</span>
                    <div>
                      <p className="font-bold text-gray-400">2do Lugar</p>
                      <p className="text-sm text-gray-300">Premio Especial (Por definir)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-amber-700/20 to-transparent border border-amber-700/30">
                    <span className="text-2xl">🥉</span>
                    <div>
                      <p className="font-bold text-amber-600">3er Lugar</p>
                      <p className="text-sm text-gray-300">Premio Sorpresa (Por definir)</p>
                    </div>
                  </div>
                </div>
              </section>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-black/20 text-center">
              <Button 
                onClick={handleDismiss}
                className="w-full md:w-auto bg-polla-neon text-black hover:bg-polla-neon/90 font-bold px-8 h-12 text-lg"
              >
                ¡Entendido, a jugar!
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
