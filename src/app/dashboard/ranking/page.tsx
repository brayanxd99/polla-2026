import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Trophy, Medal, Star } from "lucide-react"
import { MotionTbody, MotionTr, staggerContainer, fadeUpVariant } from "@/components/ui/motion-wrapper"

export default async function GlobalRankingPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  // Fetch top 50 users globally
  const topUsers = await prisma.user.findMany({
    orderBy: [
      { totalPoints: "desc" },
      { exactMatches: "desc" },
    ],
    take: 50,
    select: {
      id: true,
      name: true,
      image: true,
      totalPoints: true,
      exactMatches: true,
    }
  })

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="text-center mb-12">
        <Trophy className="w-16 h-16 text-polla-gold mx-auto mb-4" />
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-glow">Ranking Global</h1>
        <p className="text-muted-foreground">Los mejores pronosticadores del torneo.</p>
      </div>

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
              {topUsers.map((user, index) => {
                const isCurrentUser = user.id === session.user?.id
                const isTop1 = index === 0
                const isTop2 = index === 1
                const isTop3 = index === 2

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
                       <span className="text-white/50">{index + 1}</span>}
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
              
              {topUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    Aún no hay puntos registrados en el torneo.
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
