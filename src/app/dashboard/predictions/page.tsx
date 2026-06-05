import { prisma } from "@/lib/prisma"
import { MatchCard } from "@/components/predictions/MatchCard"
import { Round16Selector } from "@/components/predictions/Round16Selector"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function PredictionsPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  // Fetch all matches ordered by start time
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: {
      startTime: "asc",
    },
  })

  // Fetch user's existing predictions
  const userPredictions = await prisma.prediction.findMany({
    where: {
      userId: session.user.id,
    },
  })

  // Fetch all teams for Round of 16 prediction
  const teams = await prisma.team.findMany({
    orderBy: { name: 'asc' }
  })

  // Fetch user's R16 predictions
  const r16Predictions = await prisma.round16Prediction.findMany({
    where: { userId: session.user.id }
  })
  const initialR16Ids = r16Predictions.map(p => p.teamId)

  // Group matches by date
  const groupedMatches = matches.reduce((acc, match) => {
    const dateStr = match.startTime.toLocaleDateString("es-ES", {
      timeZone: "America/Bogota",
      weekday: "long",
      day: "numeric",
      month: "long"
    })
    if (!acc[dateStr]) acc[dateStr] = []
    acc[dateStr].push(match)
    return acc
  }, {} as Record<string, typeof matches>)

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Pronósticos</h1>
        <p className="text-muted-foreground">Ingresa tus resultados antes de que comience cada partido y elige los 16 clasificados.</p>
      </div>

      <Round16Selector teams={teams} initialSelectedIds={initialR16Ids} />

      {Object.entries(groupedMatches).map(([date, dayMatches]) => (
        <div key={date} className="space-y-4">
          <h2 className="text-xl font-bold text-polla-neon capitalize sticky top-0 bg-background/80 backdrop-blur-md py-4 z-10 border-b border-white/5">
            {date}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dayMatches.map(match => {
              const prediction = userPredictions.find(p => p.matchId === match.id)
              const plainMatch = {
                ...match,
                startTime: match.startTime.toISOString(),
              }
              return (
                <MatchCard 
                  key={match.id} 
                  match={plainMatch as any} 
                  initialPrediction={prediction ? { homeScore: prediction.homeScore, awayScore: prediction.awayScore } : undefined}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
