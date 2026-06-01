import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Trophy, Users, Hash, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function LeagueDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }
  
  const { id } = await params

  // Fetch league and members
  const league = await prisma.league.findUnique({
    where: { id },
    include: {
      owner: true,
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              totalPoints: true,
              exactMatches: true,
            }
          }
        }
      }
    }
  })

  if (!league) {
    redirect("/dashboard/leagues")
  }

  // Ensure user is member of this league
  const isMember = league.members.some(m => m.userId === session.user?.id)
  if (!isMember) {
    redirect("/dashboard/leagues")
  }

  const isOwner = league.ownerId === session.user.id

  // Sort members by points
  const sortedMembers = [...league.members].sort((a, b) => {
    if (b.user.totalPoints !== a.user.totalPoints) {
      return b.user.totalPoints - a.user.totalPoints
    }
    return b.user.exactMatches - a.user.exactMatches
  })

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="mb-6">
        <Link href="/dashboard/leagues" className="text-polla-blue hover:text-polla-neon flex items-center gap-2 w-fit transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a Ligas
        </Link>
      </div>

      <div className="glass rounded-3xl p-8 border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Trophy className="w-40 h-40" />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-glow">{league.name}</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            Creada por {isOwner ? "ti" : league.owner.name} • {league.members.length} Participantes
          </p>
        </div>

        {isOwner && (
          <div className="relative z-10 bg-white/5 p-4 rounded-2xl border border-polla-neon/30 text-center min-w-[200px]">
            <p className="text-xs text-polla-neon font-bold uppercase mb-1 flex items-center justify-center gap-1">
              <Hash className="w-3 h-3" /> Código de Invitación
            </p>
            <p className="text-2xl font-mono font-bold tracking-widest select-all">{league.inviteCode}</p>
            <p className="text-xs text-muted-foreground mt-2">Compártelo con tus amigos</p>
          </div>
        )}
      </div>

      <div className="glass rounded-3xl border border-white/5 overflow-hidden mt-8">
        <div className="bg-white/5 p-4 border-b border-white/10 flex items-center gap-2">
          <Users className="w-5 h-5 text-polla-blue" />
          <h2 className="font-bold">Tabla de Posiciones</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5/50">
                <th className="p-4 font-semibold text-white/70 w-16 text-center">Pos</th>
                <th className="p-4 font-semibold text-white/70">Usuario</th>
                <th className="p-4 font-semibold text-white/70 text-center">Aciertos Exactos</th>
                <th className="p-4 font-semibold text-polla-neon text-right">Puntos</th>
              </tr>
            </thead>
            <tbody>
              {sortedMembers.map((member, index) => {
                const user = member.user
                const isCurrentUser = user.id === session.user?.id

                return (
                  <tr 
                    key={user.id} 
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${isCurrentUser ? "bg-polla-blue/10" : ""}`}
                  >
                    <td className="p-4 text-center font-bold text-white/70">
                      {index + 1}
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
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
