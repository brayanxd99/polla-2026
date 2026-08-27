'use client'

import { useState } from 'react'
import { Wifi, WifiOff, AlertTriangle, Send, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    ficha: '',
    instructor: '',
    aprendiz: '',
    correo: '',
    salon: '',
    network: 'SENA', // Default network
    hasDropped: false,
    isSlow: false,
    novedad: ''
  })
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    
    if (!formData.correo.toLowerCase().endsWith('@sena.edu.co')) {
      setErrorMsg('El correo debe tener el dominio @sena.edu.co')
      return
    }

    setIsSubmitting(true)
    
    try {
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        setIsSuccess(true)
        setFormData({
          ficha: '',
          instructor: '',
          aprendiz: '',
          correo: '',
          salon: '',
          network: 'SENA',
          hasDropped: false,
          isSlow: false,
          novedad: ''
        })
        setTimeout(() => setIsSuccess(false), 5000)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1014] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background elegant accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-blue-600 to-red-600" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-400/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl glass rounded-3xl p-8 relative z-10 border border-white/10 mt-8"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/30">
            <Wifi className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Reporte de Internet</h1>
          <p className="text-gray-400 mt-2 text-sm">Ayúdanos a monitorear la calidad de la red en tu ambiente de formación.</p>
        </div>

        {isSuccess ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-center py-12"
          >
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4 border border-green-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Reporte Enviado!</h2>
            <p className="text-gray-400">Gracias por tu aporte. Esta información nos ayuda a mejorar el servicio.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Número de Ficha</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="Ej. 2561234"
                  value={formData.ficha}
                  onChange={e => setFormData({...formData, ficha: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Instructor</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="Nombre del instructor"
                  value={formData.instructor}
                  onChange={e => setFormData({...formData, instructor: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Nombre del Aprendiz</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="Tu nombre completo"
                  value={formData.aprendiz}
                  onChange={e => setFormData({...formData, aprendiz: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Correo SENA (@sena.edu.co)</label>
                <input 
                  required
                  type="email" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="ejemplo@sena.edu.co"
                  value={formData.correo}
                  onChange={e => setFormData({...formData, correo: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Número de Salón / Ambiente</label>
              <input 
                required
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="Ej. Salón 201"
                value={formData.salon}
                onChange={e => setFormData({...formData, salon: e.target.value})}
              />
            </div>

            <hr className="border-white/10" />

            {/* Questions */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">Estado de la Conexión</h3>
              
              <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${formData.hasDropped ? 'bg-red-500/20 text-red-500' : 'bg-gray-800 text-gray-400'}`}>
                    <WifiOff className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-medium">¿Se ha caído el internet?</div>
                    <div className="text-xs text-gray-400">Pérdida total de conexión</div>
                  </div>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out" checked={formData.hasDropped} onChange={e => setFormData({...formData, hasDropped: e.target.checked})} style={{ transform: formData.hasDropped ? 'translateX(100%)' : 'translateX(0)', borderColor: formData.hasDropped ? '#EF4444' : '#374151' }}/>
                  <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${formData.hasDropped ? 'bg-red-500' : 'bg-gray-700'}`}></label>
                </div>
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${formData.isSlow ? 'bg-yellow-500/20 text-yellow-500' : 'bg-gray-800 text-gray-400'}`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-medium">¿Está muy lento?</div>
                    <div className="text-xs text-gray-400">Tarda mucho en cargar las páginas</div>
                  </div>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out" checked={formData.isSlow} onChange={e => setFormData({...formData, isSlow: e.target.checked})} style={{ transform: formData.isSlow ? 'translateX(100%)' : 'translateX(0)', borderColor: formData.isSlow ? '#EAB308' : '#374151' }}/>
                  <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${formData.isSlow ? 'bg-yellow-500' : 'bg-gray-700'}`}></label>
                </div>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Red a la que estás conectado</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                value={formData.network}
                onChange={e => setFormData({...formData, network: e.target.value})}
              >
                <option value="SENA" className="bg-gray-800">SENA</option>
                <option value="FUH" className="bg-gray-800">FUH</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Novedad / Comentarios Adicionales (Opcional)</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none h-24"
                placeholder="Ej. No carga la plataforma Territorium..."
                value={formData.novedad}
                onChange={e => setFormData({...formData, novedad: e.target.value})}
              />
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
                {errorMsg}
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black font-bold text-lg py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? 'Enviando...' : 'Enviar Reporte Diario'}
            </button>

          </form>
        )}
      </motion.div>
      
      <div className="mt-8 text-gray-500 text-sm pb-8 z-10">
        Para ver los resultados, ingresa como <Link href="/login" className="text-blue-400 hover:underline">Administrador</Link>
      </div>
    </div>
  )
}
