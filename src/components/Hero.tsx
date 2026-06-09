"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Trophy, ChevronRight, Users, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <div className="relative overflow-hidden pt-[120px] pb-[100px] md:pt-[150px] md:pb-[120px] flex items-center justify-center min-h-[90vh]">
      {/* Background Decorators */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-polla-blue/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-polla-neon/10 rounded-full blur-[100px] -z-10" />

      <div className="container px-4 md:px-6 mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-polla-blue/30 bg-polla-blue/10 text-polla-blue text-sm font-medium mb-8"
        >
          <Trophy className="w-4 h-4" />
          <span>La plataforma #1 de pronósticos para el Mundial 2026</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-glow"
        >
          Vive la Emoción del <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-polla-neon to-polla-blue">
            Fútbol Mundial
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Únete a ligas privadas, haz tus pronósticos, compite con amigos y demuestra quién es el verdadero experto en fútbol.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto bg-polla-neon text-black hover:bg-polla-neon/90 h-14 px-8 text-lg font-bold shadow-[0_0_20px_rgba(235,227,1,0.4)]">
              Iniciar Sesión en Asturias
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-20 max-w-4xl mx-auto"
        >
          <div className="glass rounded-2xl p-8 text-center flex flex-col items-center border border-white/5 justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Trophy className="w-8 h-8 text-polla-neon" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Prueba suerte y gana premios</h3>
            <p className="text-muted-foreground">Demuestra tu conocimiento futbolístico y compite por increíbles recompensas.</p>
          </div>
          
          <div className="glass rounded-2xl p-8 text-center flex flex-col items-center border border-white/5 justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-polla-neon" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">La Universidad te acompaña en el mundial 2026</h3>
            <p className="text-muted-foreground">Únete a la comunidad de Asturias y vive la pasión del Mundial en conjunto.</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
