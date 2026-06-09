"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Trophy, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        setError("Credenciales inválidas. Por favor intenta de nuevo.")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Ocurrió un error inesperado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-polla-blue/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-polla-neon/10 rounded-full blur-[100px] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass rounded-3xl p-8 border border-white/10 relative z-10"
      >
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Trophy className="w-12 h-12 text-polla-neon" />
          </Link>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2 text-glow">Bienvenido de vuelta</h2>
        <p className="text-muted-foreground text-center mb-8">Ingresa tus credenciales para continuar</p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/20 border border-destructive text-destructive text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block text-white/80">Correo Electrónico</label>
            <input 
              name="email"
              type="email" 
              required
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-polla-blue focus:border-transparent transition-all"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block text-white/80">Contraseña</label>
            <input 
              name="password"
              type="password" 
              required
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-polla-blue focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <div className="pb-2"></div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-polla-blue hover:bg-polla-blue/90 text-white font-bold rounded-xl text-lg relative overflow-hidden group"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                Iniciar Sesión
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="text-polla-neon hover:text-white font-medium transition-colors">
            Regístrate aquí
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
