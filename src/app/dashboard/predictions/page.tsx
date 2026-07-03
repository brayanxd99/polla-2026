import { prisma } from "@/lib/prisma"
import { MatchCard } from "@/components/predictions/MatchCard"
import { Round16Selector } from "@/components/predictions/Round16Selector"
import { QFSelector } from "@/components/predictions/QFSelector"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Info } from "lucide-react"
import Link from "next/link"

export default async function PredictionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const filter = params.filter || 'round16'

  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  // Fetch all matches ordered by start time
  let matches = await prisma.match.findMany({
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

  // Fetch user's QF predictions
  const qfPredictions = await prisma.quarterFinalPrediction.findMany({
    where: { userId: session.user.id }
  })
  const initialQFIds = qfPredictions.map(p => p.teamId)

  if (filter === 'round16') {
    matches = matches.filter(m => m.round === 'Octavos de Final')
  } else if (filter === 'round32') {
    matches = matches.filter(m => m.round === '16avos de Final')
  } else if (filter === 'groups') {
    matches = matches.filter(m => m.round !== '16avos de Final' && m.round !== 'Octavos de Final')
  }

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
        <p className="text-muted-foreground mb-6">Ingresa tus resultados antes de que comience cada partido y elige los 16 clasificados.</p>
        
        {/* Recordatorio de Reglas */}
        <div className="bg-polla-blue/10 border border-polla-blue/30 rounded-xl p-4 flex gap-3 text-sm">
          <Info className="w-5 h-5 shrink-0 text-polla-neon mt-0.5" />
          <div>
            <p className="font-bold text-white mb-2">Recordatorio Rápido:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li><strong>Partidos:</strong> 3 Puntos si aciertas marcador exacto. 1 Punto si solo aciertas ganador o empate.</li>
              <li><strong>Octavos de Final:</strong> 5 Puntos por cada equipo de la cuadrícula que clasifique oficialmente.</li>
              <li><strong>Cuartos de Final:</strong> 5 Puntos por cada equipo de la cuadrícula que clasifique a cuartos oficialmente.</li>
              <li><strong>Cierre Definitivo:</strong> Al darle "Guardar Pronóstico", tu decisión queda <strong className="text-polla-neon">bloqueada para siempre</strong> y no se podrá modificar.</li>
              <li><strong>Tiempo Límite:</strong> Todo partido se cierra automáticamente 1 hora antes de iniciar.</li>
            </ul>
          </div>
        </div>
      </div>

      <Round16Selector teams={teams} initialSelectedIds={initialR16Ids} />
      
      <QFSelector 
        teams={teams.filter(t => ['Alemania', 'Estados Unidos', 'España', 'Croacia', 'Francia', 'Nigeria', 'Senegal', 'Uruguay', 'Brasil', 'Inglaterra', 'Argentina', 'Cabo Verde', 'Colombia', 'Ghana', 'Egipto', 'Suiza'].includes(t.name))} 
        initialSelectedIds={initialQFIds} 
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <Link 
          href="/dashboard/predictions?filter=round16"
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'round16' ? 'bg-polla-neon text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          Octavos de Final
        </Link>
        <Link 
          href="/dashboard/predictions?filter=round32"
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'round32' ? 'bg-polla-neon text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          16avos de Final
        </Link>
        <Link 
          href="/dashboard/predictions?filter=groups"
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'groups' ? 'bg-polla-neon text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          Fase de Grupos
        </Link>
        <Link 
          href="/dashboard/predictions?filter=all"
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'all' ? 'bg-polla-neon text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          Todos los Partidos
        </Link>
      </div>

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
