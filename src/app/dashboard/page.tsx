export const dynamic = 'force-dynamic'

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Trophy, Activity, Target, Flame } from "lucide-react"
import { prisma } from "@/lib/prisma";
import { HallOfFame } from "@/components/dashboard/HallOfFame";

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

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

  const topUsers = await prisma.user.findMany({
    where: {
      role: { not: 'ADMIN' }
    },
    orderBy: [
      { totalPoints: "desc" },
      { exactMatches: "desc" },
    ],
    select: {
      id: true,
      name: true,
      image: true,
      totalPoints: true,
      exactMatches: true,
    }
  });

  // Unique users logic
  const uniqueTopUsers = [];
  const seenNames = new Set();
  
  for (const user of topUsers) {
    const key = user.name || user.id;
    if (!seenNames.has(key)) {
      seenNames.add(key);
      uniqueTopUsers.push(user);
    }
  }

  // Current user's stats
  const currentUserIndex = uniqueTopUsers.findIndex(u => u.id === session.user.id);
  const currentUser = currentUserIndex !== -1 ? uniqueTopUsers[currentUserIndex] : null;
  
  const userTotalPoints = currentUser?.totalPoints || 0;
  const userExactMatches = currentUser?.exactMatches || 0;
  const userPosition = currentUserIndex !== -1 ? `#${currentUserIndex + 1}` : "#--";
  
  // Top 5 only for the mini ranking
  const top5Users = uniqueTopUsers.slice(0, 5);

  // Check if tournament is over (Final match is FINISHED)
  const finalMatch = await prisma.match.findFirst({
    where: { round: 'Final' }
  });
  const isTournamentOver = finalMatch?.status === 'FINISHED';

  const mappedTopUsers = uniqueTopUsers.slice(0, 3).map(u => ({
    id: u.id,
    name: u.name || "Usuario Anónimo",
    points: u.totalPoints,
    image: u.image
  }))

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {isTournamentOver && (
        <HallOfFame winners={mappedTopUsers} />
      )}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Mi Resumen</h1>
        <p className="text-muted-foreground">Bienvenido a tu panel de control. Aquí puedes ver tu rendimiento.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Puntos Totales", value: userTotalPoints.toString(), icon: Trophy, color: "text-polla-gold" },
          { label: "Aciertos Exactos", value: userExactMatches.toString(), icon: Target, color: "text-polla-neon" },
          { label: "Posición Global", value: userPosition, icon: Activity, color: "text-polla-blue" },
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
            {top5Users.map((user, idx) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                    ${idx === 0 ? "bg-yellow-500/20 text-yellow-500" : 
                      idx === 1 ? "bg-gray-300/20 text-gray-300" : 
                      idx === 2 ? "bg-amber-600/20 text-amber-600" : 
                      "bg-white/10 text-white/50"}`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{user.name || "Usuario Anónimo"}</span>
                    <span className="text-xs text-white/50">{user.exactMatches} aciertos</span>
                  </div>
                </div>
                <div className="font-bold text-polla-neon">
                  {user.totalPoints} pts
                </div>
              </div>
            ))}
            
            {top5Users.length === 0 && (
              <div className="text-center py-8 text-muted-foreground bg-white/5 rounded-xl border border-dashed border-white/10">
                <p className="text-sm">No hay usuarios en el ranking aún.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { Calendar } from "lucide-react"
