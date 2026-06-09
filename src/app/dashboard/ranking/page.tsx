import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Trophy } from "lucide-react"
import { RankingTable } from "@/components/RankingTable"

export default async function GlobalRankingPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  // Fetch top 50 users globally
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
  })

  // Eliminar duplicados por nombre (para evitar que un mismo usuario con dos métodos de login salga dos veces)
  const uniqueUsers = []
  const seenNames = new Set()
  for (const user of topUsers) {
    const key = user.name || user.id
    if (!seenNames.has(key)) {
      seenNames.add(key)
      uniqueUsers.push(user)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="text-center mb-12">
        <Trophy className="w-16 h-16 text-polla-gold mx-auto mb-4" />
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-glow">Ranking Global</h1>
        <p className="text-muted-foreground">Los mejores pronosticadores del torneo.</p>
      </div>

      <RankingTable users={uniqueUsers} currentUserId={session.user?.id} />
    </div>
  )
}
