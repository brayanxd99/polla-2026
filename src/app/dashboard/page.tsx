import { Trophy, Activity, Target, Flame } from "lucide-react"
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  // Busca los próximos 4 partidos
const upcomingMatches = await prisma.match.findMany({
  where: {
    startTime: {
      gte: new Date(), // Solo partidos desde hoy en adelante
    },
  },
  orderBy: {
    startTime: 'asc', // El más próximo primero
  },
  take: 4, // Solo traemos 4 para que quepan en la tarjeta
  include: {
    homeTeam: true,
    awayTeam: true,
  },
});
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Mi Resumen</h1>
        <p className="text-muted-foreground">Bienvenido a tu panel de control. Aquí puedes ver tu rendimiento.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Puntos Totales", value: "0", icon: Trophy, color: "text-polla-gold" },
          { label: "Aciertos Exactos", value: "0", icon: Target, color: "text-polla-neon" },
          { label: "Posición Global", value: "#--", icon: Activity, color: "text-polla-blue" },
          { label: "Racha Actual", value: "0", icon: Flame, color: "text-orange-500" },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity ${stat.color}`}>
              <stat.icon className="w-12 h-12" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-2">{stat.label}</p>
            <p className="text-4xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Next Matches */}
        <div className="lg:col-span-2 glass rounded-2xl border border-white/5 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-polla-blue" />
            Próximos Partidos
          </h2>
          {upcomingMatches.length === 0 ? (
  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
    Aún no hay partidos programados. El fixture se actualizará pronto.
  </div>
) : (
  <div className="flex flex-col gap-3 mt-4">
    {upcomingMatches.map((match) => (
      <div key={match.id} className="flex justify-between items-center bg-neutral-800 p-3 rounded-lg border border-neutral-700">
        
        {/* Equipos */}
        <div className="flex items-center gap-3 font-medium text-white">
          <span className="truncate">{match.homeTeam.name}</span>
          <span className="text-neutral-500 text-xs">VS</span>
          <span className="truncate">{match.awayTeam.name}</span>
        </div>

        {/* Fecha y Hora formateada para Colombia */}
        <div className="text-xs text-yellow-500 font-semibold bg-yellow-500/10 px-2 py-1 rounded-md">
          {new Date(match.startTime).toLocaleString('es-CO', {
            timeZone: 'America/Bogota',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>

      </div>
    ))}
  </div>
)}
          <div className="flex flex-col gap-4">
          </div>
        </div>

        {/* Mini Ranking */}
        <div className="glass rounded-2xl border border-white/5 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-polla-gold" />
            Top 5 Global
          </h2>
          
          <div className="space-y-4">
             <div className="text-center py-8 text-muted-foreground bg-white/5 rounded-xl border border-dashed border-white/10">
              <p className="text-sm">Ranking en construcción</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Calendar } from "lucide-react"
