'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'

type Winner = {
  id: string
  name: string
  points: number
  image?: string | null
}

export function HallOfFame({ winners, onClose }: { winners: Winner[], onClose?: () => void }) {
  const [isOpen, setIsOpen] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Start confetti after podium finishes revealing (approx 2s)
    const t = setTimeout(() => setShowConfetti(true), 2000)
    return () => clearTimeout(t)
  }, [])

  if (!isOpen || !winners || winners.length === 0) return null

  const handleClose = () => {
    setIsOpen(false)
    if (onClose) onClose()
  }

  // Ensure we have 3 places, padded with empty if needed
  const firstPlace = winners[0]
  const secondPlace = winners[1]
  const thirdPlace = winners[2]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 overflow-hidden bg-black/95 backdrop-blur-xl"
      >
        {/* Confetti Background */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -50, x: Math.random() * window.innerWidth, opacity: 1, rotate: 0 }}
                animate={{
                  y: window.innerHeight + 50,
                  x: Math.random() * window.innerWidth,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 2,
                }}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ['#CCFF00', '#FF0055', '#00DDFF', '#FFFFFF', '#FFB800'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        )}

        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-[110]"
        >
          ✕
        </button>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-4xl text-center">
          
          {/* Animated Cartoon Trophy */}
          <motion.div
            initial={{ scale: 0, y: -100, rotate: -20 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.6, duration: 1, delay: 0.2 }}
            className="relative mb-6"
          >
            {/* Glow effect */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-yellow-400/30 blur-[50px] rounded-full"
            />
            {/* Cartoon Trophy SVG */}
            <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]">
              {/* Base */}
              <path d="M60 180H140C145.523 180 150 175.523 150 170V160C150 154.477 145.523 150 140 150H60C54.4772 150 50 154.477 50 160V170C50 175.523 54.4772 180 60 180Z" fill="#B8860B"/>
              <path d="M70 150H130L120 120H80L70 150Z" fill="#DAA520"/>
              {/* Handles */}
              <path d="M55 70C35.67 70 20 85.67 20 105C20 124.33 35.67 140 55 140C60 140 65 139 70 137V117C67 119 63 120 55 120C46.7157 120 40 113.284 40 105C40 96.7157 46.7157 90 55 90V70Z" fill="#FFD700"/>
              <path d="M145 70C164.33 70 180 85.67 180 105C180 124.33 164.33 140 145 140C140 140 135 139 130 137V117C133 119 137 120 145 120C153.284 120 160 113.284 160 105C160 96.7157 153.284 90 145 90V70Z" fill="#FFD700"/>
              {/* Cup */}
              <path d="M45 40H155C155 40 155 120 100 120C45 120 45 40 45 40Z" fill="#FFD700"/>
              <path d="M60 40H140V50H60V40Z" fill="#FFF8DC" opacity="0.5"/>
              {/* Star / Sparkle */}
              <path d="M100 60L105 75H120L108 85L112 100L100 90L88 100L92 85L80 75H95L100 60Z" fill="#FFFFFF" opacity="0.8"/>
            </svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 mb-2 drop-shadow-sm uppercase tracking-wider"
          >
            ¡Cuadro de Honor!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            La <strong className="text-white">Corporación Universitaria Asturias</strong> los felicita por su excelente desempeño, análisis y pasión durante el Mundial 2026. ¡Ustedes son los mejores estrategas de esta copa!
          </motion.p>

          {/* Podium */}
          <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-6 w-full max-w-3xl px-4 mt-8 h-[350px]">
            
            {/* 2nd Place */}
            {secondPlace && (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.4, duration: 1, delay: 1.8 }}
                className="flex flex-col items-center flex-1 order-2 md:order-1"
              >
                <div className="flex flex-col items-center mb-4 relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-gray-300 bg-gray-800 flex items-center justify-center overflow-hidden z-10 shadow-[0_0_15px_rgba(209,213,219,0.5)]">
                    {secondPlace.image ? (
                      <img src={secondPlace.image} alt={secondPlace.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">2</span>
                    )}
                  </div>
                  <div className="bg-gray-300 text-black text-xs font-bold px-2 py-0.5 rounded-full absolute -bottom-2 z-20">2º Lugar</div>
                </div>
                <div className="w-full bg-gradient-to-t from-gray-700 to-gray-400 rounded-t-lg h-[120px] md:h-[160px] flex flex-col items-center pt-4 border-t-2 border-x-2 border-gray-300/30 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 opacity-50 mix-blend-overlay"></div>
                  <span className="font-bold text-white text-lg px-2 text-center truncate w-full drop-shadow-md z-10">{secondPlace.name}</span>
                  <span className="text-polla-neon font-black text-xl mt-1 drop-shadow-md z-10">{secondPlace.points} pts</span>
                </div>
              </motion.div>
            )}

            {/* 1st Place */}
            {firstPlace && (
              <motion.div
                initial={{ opacity: 0, y: 150 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.5, duration: 1, delay: 2.2 }}
                className="flex flex-col items-center flex-1 order-1 md:order-2 z-20"
              >
                <div className="flex flex-col items-center mb-4 relative">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-yellow-400 bg-gray-800 flex items-center justify-center overflow-hidden z-10 shadow-[0_0_30px_rgba(250,204,21,0.6)]"
                  >
                    {firstPlace.image ? (
                      <img src={firstPlace.image} alt={firstPlace.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-yellow-400">1</span>
                    )}
                  </motion.div>
                  <div className="bg-yellow-400 text-black text-sm font-black px-4 py-1 rounded-full absolute -bottom-3 z-20 uppercase tracking-widest shadow-lg">Campeón</div>
                </div>
                <div className="w-full bg-gradient-to-t from-yellow-700 via-yellow-500 to-yellow-400 rounded-t-lg h-[160px] md:h-[220px] flex flex-col items-center pt-6 border-t-2 border-x-2 border-yellow-200/50 shadow-2xl relative overflow-hidden">
                   <div className="absolute inset-0 bg-white/10 opacity-60 mix-blend-overlay"></div>
                  <span className="font-black text-black text-xl md:text-2xl px-2 text-center truncate w-full drop-shadow-sm z-10">{firstPlace.name}</span>
                  <span className="text-black font-black text-3xl mt-1 drop-shadow-sm z-10">{firstPlace.points} pts</span>
                  
                  {/* Star overlay */}
                  <div className="absolute bottom-4 opacity-30 pointer-events-none">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3rd Place */}
            {thirdPlace && (
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.3, duration: 1, delay: 1.5 }}
                className="flex flex-col items-center flex-1 order-3"
              >
                <div className="flex flex-col items-center mb-4 relative">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-amber-700 bg-gray-800 flex items-center justify-center overflow-hidden z-10 shadow-[0_0_15px_rgba(180,83,9,0.5)]">
                    {thirdPlace.image ? (
                      <img src={thirdPlace.image} alt={thirdPlace.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-amber-700">3</span>
                    )}
                  </div>
                  <div className="bg-amber-700 text-white text-xs font-bold px-2 py-0.5 rounded-full absolute -bottom-2 z-20">3º Lugar</div>
                </div>
                <div className="w-full bg-gradient-to-t from-amber-900 to-amber-700 rounded-t-lg h-[100px] md:h-[130px] flex flex-col items-center pt-3 border-t-2 border-x-2 border-amber-500/30 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 opacity-40 mix-blend-overlay"></div>
                  <span className="font-bold text-white text-base px-2 text-center truncate w-full drop-shadow-md z-10">{thirdPlace.name}</span>
                  <span className="text-polla-neon font-bold text-lg mt-1 drop-shadow-md z-10">{thirdPlace.points} pts</span>
                </div>
              </motion.div>
            )}

          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  )
}
