import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function MatchesPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const teams = await prisma.team.findMany({
    orderBy: [{ group: 'asc' }, { name: 'asc' }]
  })

  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: {
      startTime: "asc",
    },
  })

  // Group teams
  const groupedTeams = teams.reduce((acc, team) => {
    if (!team.group) return acc
    if (!acc[team.group]) acc[team.group] = []
    acc[team.group].push(team)
    return acc
  }, {} as Record<string, typeof teams>)

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Información del Torneo</h1>
        <p className="text-muted-foreground">Grupos, equipos, fechas y sedes oficiales de la Copa Mundial 2026.</p>
      </div>

      {/* Grupos Section */}
      <div>
        <h2 className="text-2xl font-bold text-polla-neon mb-6 flex items-center gap-2">
          <span className="w-2 h-8 rounded-full bg-polla-neon" />
          Fase de Grupos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(groupedTeams).map(([group, groupTeams]) => (
            <div key={group} className="glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-4 text-center border-b border-white/10 pb-2">{group}</h3>
              <div className="space-y-3">
                {groupTeams.map((team) => (
                  <div key={team.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white/5 border border-white/10 shrink-0">
                      {team.flagUrl ? (
                        <img src={team.flagUrl} alt={team.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">{team.code}</div>
                      )}
                    </div>
                    <span className="font-medium text-sm text-white/90">{team.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendario Section */}
      <div>
        <h2 className="text-2xl font-bold text-polla-neon mb-6 flex items-center gap-2">
          <span className="w-2 h-8 rounded-full bg-polla-neon" />
          Calendario de Partidos
        </h2>
        
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 text-xs uppercase text-white/70">
                <tr>
                  <th className="px-6 py-4 font-semibold">Fecha y Hora</th>
                  <th className="px-6 py-4 font-semibold">Fase</th>
                  <th className="px-6 py-4 font-semibold text-center">Partido</th>
                  <th className="px-6 py-4 font-semibold">Estadio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {matches.map((match) => (
                  <tr key={match.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {match.startTime.toLocaleDateString("es-ES", { timeZone: "America/Bogota", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-medium">
                        {match.round}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-4">
                        <span className="font-medium text-right w-32">{match.homeTeam.name}</span>
                        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-white/10">
                           {match.homeTeam.flagUrl && <img src={match.homeTeam.flagUrl} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <span className="text-white/50 text-xs font-bold">VS</span>
                        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-white/10">
                           {match.awayTeam.flagUrl && <img src={match.awayTeam.flagUrl} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <span className="font-medium text-left w-32">{match.awayTeam.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground flex items-center gap-1">
                      📍 {match.stadium || "Por definir"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
