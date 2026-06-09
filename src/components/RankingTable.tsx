"use client"

import { useState } from "react"
import { Search, Medal } from "lucide-react"
import { MotionTbody, MotionTr, staggerContainer, fadeUpVariant } from "@/components/ui/motion-wrapper"

interface UserRanking {
  id: string
  name: string | null
  image: string | null
  totalPoints: number
  exactMatches: number
}

interface RankingTableProps {
  users: UserRanking[]
  currentUserId?: string
}

export function RankingTable({ users, currentUserId }: RankingTableProps) {
  const [search, setSearch] = useState("")

  const filteredUsers = users.filter(user => 
    (user.name || "Usuario Anónimo").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="relative max-w-md mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-polla-neon focus:border-transparent transition-all"
          placeholder="Buscar participante por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div className="glass rounded-3xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 font-semibold text-white/70 w-16 text-center">Pos</th>
                <th className="p-4 font-semibold text-white/70">Usuario</th>
                <th className="p-4 font-semibold text-white/70 text-center">Aciertos Exactos</th>
                <th className="p-4 font-semibold text-polla-neon text-right">Puntos</th>
              </tr>
            </thead>
            <MotionTbody 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {filteredUsers.map((user) => {
                const isCurrentUser = user.id === currentUserId
                // Mantenemos la posición original usando el índice del arreglo original 'users'
                const originalIndex = users.findIndex(u => u.id === user.id)
                
                const isTop1 = originalIndex === 0
                const isTop2 = originalIndex === 1
                const isTop3 = originalIndex === 2

                return (
                  <MotionTr 
                    variants={fadeUpVariant}
                    key={user.id} 
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${isCurrentUser ? "bg-polla-blue/10" : ""}`}
                  >
                    <td className="p-4 text-center font-bold">
                      {isTop1 ? <Medal className="w-6 h-6 text-yellow-400 mx-auto" /> :
                       isTop2 ? <Medal className="w-6 h-6 text-gray-300 mx-auto" /> :
                       isTop3 ? <Medal className="w-6 h-6 text-amber-600 mx-auto" /> :
                       <span className="text-white/50">{originalIndex + 1}</span>}
                    </td>
                    <td className="p-4 font-medium flex items-center gap-3">
                      {user.image ? (
                        <img src={user.image} alt={user.name || "User"} className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                      <span>
                        {user.name || "Usuario Anónimo"}
                        {isCurrentUser && <span className="ml-2 text-xs bg-polla-blue text-white px-2 py-0.5 rounded-full">Tú</span>}
                      </span>
                    </td>
                    <td className="p-4 text-center text-white/70">
                      {user.exactMatches}
                    </td>
                    <td className="p-4 text-right font-bold text-lg text-polla-neon">
                      {user.totalPoints}
                    </td>
                  </MotionTr>
                )
              })}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    No se encontraron participantes con ese nombre.
                  </td>
                </tr>
              )}
            </MotionTbody>
          </table>
        </div>
      </div>
    </div>
  )
}
