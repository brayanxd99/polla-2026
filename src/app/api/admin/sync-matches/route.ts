import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { calculatePoints } from "@/lib/scoring"

export async function POST() {
  try {
    const session = await auth()
    
    // Solo ADMIN
    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id }
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const API_KEY = process.env.API_FOOTBALL_KEY

    if (!API_KEY) {
      return NextResponse.json({ 
        error: "Falta la API_FOOTBALL_KEY en las variables de entorno. Por favor agrégala para sincronizar con internet." 
      }, { status: 400 })
    }

    // Configuración para el Mundial 2026 en API-Football (El ID de liga para la World Cup suele ser 1, pero puede variar para 2026)
    // El año será 2026.
    const LEAGUE_ID = 1; // ID estándar de la World Cup
    const SEASON = 2026;

    console.log("Sincronizando con API-Football...")
    
    // Hacemos la petición a API-Football para traer los partidos terminados del Mundial 2026
    const response = await fetch(`https://v3.football.api-sports.io/fixtures?league=${LEAGUE_ID}&season=${SEASON}&status=FT`, {
      method: 'GET',
      headers: {
        'x-apisports-key': API_KEY
      }
    })

    if (!response.ok) {
      console.error("Error contactando a API-Football", await response.text())
      return NextResponse.json({ error: "Error contactando a API-Football" }, { status: 502 })
    }

    const data = await response.json()
    const fixtures = data.response || []

    if (fixtures.length === 0) {
      // Como el Mundial es en 2026, si la API responde correctamente pero está vacía, enviamos éxito simulado.
      return NextResponse.json({ 
        success: true, 
        message: "API contactada correctamente. Aún no hay partidos finalizados del Mundial 2026 para sincronizar." 
      })
    }

    let updatedCount = 0;

    // Recorremos los partidos devueltos por la API
    for (const fixture of fixtures) {
      const homeTeamCode = fixture.teams.home.name // (Dependiendo de cómo API-Football retorne el nombre/código)
      const awayTeamCode = fixture.teams.away.name
      const homeScore = fixture.goals.home
      const awayScore = fixture.goals.away

      // Buscamos el partido en nuestra base de datos (Idealmente mapeando por un campo API ID, pero aquí buscaremos por nombre de equipo como ejemplo robusto)
      // Como no tenemos el fixture ID mapeado, buscaremos el partido pendiente entre esos dos equipos.
      const localMatch = await prisma.match.findFirst({
        where: {
          status: "PENDING",
          homeTeam: { name: homeTeamCode },
          awayTeam: { name: awayTeamCode }
        },
        include: { predictions: true }
      })

      if (localMatch && homeScore !== null && awayScore !== null) {
        // Marcamos como finalizado y actualizamos el marcador
        await prisma.match.update({
          where: { id: localMatch.id },
          data: {
            status: "FINISHED",
            homeScore,
            awayScore
          }
        })

        // Repartimos los puntos a todos los usuarios
        for (const prediction of localMatch.predictions) {
          const { points, isExact } = calculatePoints(
            prediction.homeScore,
            prediction.awayScore,
            homeScore,
            awayScore
          )

          await prisma.prediction.update({
            where: { id: prediction.id },
            data: { pointsEarned: points }
          })

          await prisma.user.update({
            where: { id: prediction.userId },
            data: {
              totalPoints: { increment: points },
              exactMatches: isExact ? { increment: 1 } : undefined,
            }
          })
        }
        
        updatedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Sincronización exitosa. Se actualizaron ${updatedCount} partidos finalizados y se repartieron los puntos.` 
    })
  } catch (error) {
    console.error("Error sincronizando partidos:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic';
