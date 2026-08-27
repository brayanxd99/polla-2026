"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Home, LogOut, Menu, X, User as UserIcon, Wifi } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const navItems = [
    { name: "Resultados", href: "/dashboard", icon: Home },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 glass border-r border-white/5 fixed top-0 left-0 bottom-0 z-40">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <Wifi className="w-8 h-8 text-yellow-400" />
            <span className="text-xl font-bold tracking-tight">
              Internet<span className="text-blue-400">Admin</span>
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{session?.user?.name || "Administrador"}</p>
              <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden glass border-b border-white/5 h-16 flex items-center justify-between px-4 sticky top-0 z-30">
          <Link href="/" className="flex items-center gap-2">
            <Wifi className="w-6 h-6 text-yellow-400" />
            <span className="font-bold">InternetAdmin</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:hidden fixed inset-0 z-20 pt-16 bg-background/95 backdrop-blur-xl"
          >
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                >
                  <item.icon className="w-6 h-6" />
                  <span className="font-medium text-lg">{item.name}</span>
                </Link>
              ))}
              <hr className="border-white/10 my-4" />
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-6 h-6" />
                <span className="font-medium text-lg">Cerrar Sesión</span>
              </button>
            </nav>
          </motion.div>
        )}

        {/* Content Wrapper */}
        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
