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
    seHaCaido: false,
    calificacion: 'Bueno',
    intermitencia: false,
    novedad: ''
  })
  const [errorMsg, setErrorMsg] = useState('')
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)

  const handleEmailBlur = () => {
    if (formData.correo.length > 0 && !privacyAccepted) {
      setShowPrivacy(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    
    if (!privacyAccepted) {
      setErrorMsg('Debes aceptar el tratamiento de datos personales para continuar.')
      setShowPrivacy(true)
      return
    }

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
          seHaCaido: false,
          calificacion: 'Bueno',
          intermitencia: false,
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
                  onBlur={handleEmailBlur}
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
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">Estado de la conexión</h3>
              
              {/* Question 1 */}
              <div className="space-y-4">
                <p className="text-white font-medium text-lg">1. ¿Se ha caído la conexión a Internet el día de hoy?</p>
                <div className="flex flex-col gap-3 pl-5">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input 
                        type="radio" 
                        name="seHaCaido"
                        className="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-400 checked:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition-all cursor-pointer"
                        checked={formData.seHaCaido === true}
                        onChange={() => setFormData({...formData, seHaCaido: true})}
                      />
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">Sí</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input 
                        type="radio" 
                        name="seHaCaido"
                        className="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-400 checked:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition-all cursor-pointer"
                        checked={formData.seHaCaido === false}
                        onChange={() => setFormData({...formData, seHaCaido: false})}
                      />
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">No</span>
                  </label>
                </div>
              </div>

              {/* Question 2 */}
              <div className="space-y-4">
                <p className="text-white font-medium text-lg">2. ¿La conexión a Internet ha presentado intermitencias el día de hoy?</p>
                <div className="flex flex-col gap-3 pl-5">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input 
                        type="radio" 
                        name="intermitencia"
                        className="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-400 checked:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition-all cursor-pointer"
                        checked={formData.intermitencia === true}
                        onChange={() => setFormData({...formData, intermitencia: true})}
                      />
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">Sí</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input 
                        type="radio" 
                        name="intermitencia"
                        className="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-400 checked:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition-all cursor-pointer"
                        checked={formData.intermitencia === false}
                        onChange={() => setFormData({...formData, intermitencia: false})}
                      />
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">No</span>
                  </label>
                </div>
              </div>

              {/* Question 3 */}
              <div className="space-y-4">
                <p className="text-white font-medium text-lg">3. ¿Cómo ha sido la conexión a Internet el día de hoy?</p>
                <div className="flex flex-col gap-3 pl-5">
                  {['Excelente', 'Buena', 'Regular', 'Mala', 'Muy mala'].map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-5 h-5">
                        <input 
                          type="radio" 
                          name="calificacion"
                          className="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-400 checked:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition-all cursor-pointer"
                          checked={formData.calificacion === option}
                          onChange={() => setFormData({...formData, calificacion: option})}
                        />
                        <div className="absolute w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                      </div>
                      <span className="text-gray-300 group-hover:text-white transition-colors">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
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

      {/* Modal de Privacidad */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-white/10 p-6 sm:p-8 rounded-2xl max-w-md w-full shadow-2xl relative">
            <h2 className="text-xl font-bold text-white mb-4">Autorización de tratamiento de datos personales</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 text-justify">
              Autorizo a FUNDACION UNIVERSITARIA HORIZONTE para recolectar y tratar mi dirección de correo electrónico, exclusivamente para efectos de identificación, seguimiento y gestión de la presente encuesta relacionada con la prestación del servicio de Internet en Horizonte, de conformidad con la Ley 1581 de 2012.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => {
                  setShowPrivacy(false)
                  if (!privacyAccepted) {
                    setFormData({...formData, correo: ''}) // Clear email if they cancel
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  setPrivacyAccepted(true)
                  setShowPrivacy(false)
                  setErrorMsg('')
                }}
                className="px-6 py-2 text-sm font-bold bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg transition-colors shadow-lg shadow-yellow-500/20"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 text-gray-500 text-sm pb-8 z-10">
        Para ver los resultados, ingresa como <Link href="/login" className="text-blue-400 hover:underline">Administrador</Link>
      </div>
    </div>
  )
}
