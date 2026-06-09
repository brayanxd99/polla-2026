"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1014]/80 backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png.jpg" alt="Asturias Logo" className="h-10 w-auto object-contain" />
            <span className="text-xl font-bold tracking-tight hidden sm:block text-white">
              Polla<span className="text-polla-neon">26</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-gray-300 hover:text-polla-neon transition-colors">
              Características
            </Link>
            <Link href="#ranking" className="text-sm font-medium text-gray-300 hover:text-polla-neon transition-colors">
              Ranking Global
            </Link>
            <div className="flex items-center gap-4 border-l border-white/20 pl-8">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-300 hover:bg-white/10 hover:text-polla-neon">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>

          {/* Animated Mobile Menu Button */}
          <button 
            className="md:hidden relative z-50 p-2 text-white hover:text-polla-neon focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-7 h-7" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-7 h-7" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Animated Mobile Nav Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-[#0f1014] border-l border-white/10 shadow-2xl z-40 flex flex-col pt-24 px-6 gap-6"
            >
              <div className="flex flex-col gap-4">
                <Link 
                  href="#features" 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-semibold text-gray-200 hover:text-polla-neon py-2 border-b border-white/10 transition-colors"
                >
                  Características
                </Link>
                <Link 
                  href="#ranking" 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-semibold text-gray-200 hover:text-polla-neon py-2 border-b border-white/10 transition-colors"
                >
                  Ranking Global
                </Link>
              </div>
              
              <div className="flex flex-col gap-3 mt-auto mb-8">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full h-12 text-white border-white/20 hover:bg-white/10 hover:text-polla-neon text-base glass">
                    Iniciar Sesión
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
