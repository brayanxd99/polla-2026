import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminMatchCard } from "@/components/admin/AdminMatchCard"
import { AdminTeamCard } from "@/components/admin/AdminTeamCard"
import { AdminSyncButton } from "@/components/admin/AdminSyncButton"
import { ShieldAlert, Trophy } from "lucide-react"

export default async function AdminDashboard() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: {
      startTime: "asc",
    },
  })

  const pendingMatches = matches.filter((m: any) => m.status !== "FINISHED")
  const finishedMatches = matches.filter((m: any) => m.status === "FINISHED")

  const teams = await prisma.team.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Panel de Administración</h1>
            <p className="text-muted-foreground mt-1">
              Zona de peligro. Cierra partidos para calcular puntos.
            </p>
          </div>
        </div>
        
        {/* Sync Button */}
        <AdminSyncButton />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          Partidos Pendientes ({pendingMatches.length})
        </h2>
        
        {pendingMatches.length === 0 ? (
          <div className="glass p-8 text-center rounded-2xl text-white/50 border border-white/5">
            No hay partidos pendientes.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingMatches.map((match) => {
              const plainMatch = {
                ...match,
                startTime: match.startTime.toISOString(),
              }
              return <AdminMatchCard key={match.id} match={plainMatch as any} />
            })}
          </div>
        )}
      </div>

      <div className="space-y-6 pt-8">
        <h2 className="text-xl font-bold text-white/50 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Partidos Finalizados ({finishedMatches.length})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-70">
          {finishedMatches.map((match) => {
            const plainMatch = {
              ...match,
              startTime: match.startTime.toISOString(),
            }
            return <AdminMatchCard key={match.id} match={plainMatch as any} />
          })}
        </div>
      </div>

      <div className="space-y-6 pt-8 border-t border-white/10">
        <h2 className="text-xl font-bold text-polla-neon flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Clasificados a Octavos de Final
        </h2>
        <p className="text-sm text-muted-foreground">
          Marca los equipos que oficialmente clasificaron a octavos. Se otorgarán 5 puntos a los usuarios que hayan acertado.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {teams.map((team) => (
            <AdminTeamCard key={team.id} team={team} />
          ))}
        </div>
      </div>
    </div>
  )
}
